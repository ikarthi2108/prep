import {test,expect} from '@playwright/test';
import {topics} from '../src/data/topics.js';

test('all navigation routes, search, theme, checklist, and recent history',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Let’s get you test-ready.'})).toBeVisible();
  await page.screenshot({path:'test-results/dashboard-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Toggle dark mode'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('button',{name:'Toggle dark mode'}).click();
  await page.getByRole('checkbox').first().check();await page.reload();await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.getByRole('textbox',{name:'Search topics'}).fill('employee');
  await page.locator('.search-results').getByRole('link',{name:'Employee Management'}).click();
  await expect(page).toHaveURL(/employees/);
  for(const topic of topics){await page.locator('nav').getByRole('link',{name:topic.title,exact:false}).click();await expect(page.locator('h1')).toHaveText(topic.title);}
  await page.locator('nav').getByRole('link',{name:'Dashboard',exact:true}).click();
  await expect(page.locator('.recent')).toContainText('Machine Test Checklist');
  expect(errors).toEqual([]);
});
test('employee add, view, edit, search, delete and code copying',async({page})=>{
  await page.goto('/employees');
  await page.getByRole('button',{name:'Add employee',exact:true}).click();
  await page.getByRole('textbox',{name:'name',exact:true}).fill('Test Employee');
  await page.getByRole('textbox',{name:'email',exact:true}).fill('test@example.com');
  await page.getByRole('textbox',{name:'department',exact:true}).fill('Engineering');
  await page.getByRole('textbox',{name:'designation',exact:true}).fill('Developer');
  await page.getByRole('spinbutton',{name:'salary',exact:true}).fill('55000');
  await page.getByRole('button',{name:'Save record'}).click();
  const row=page.getByRole('row').filter({hasText:'Test Employee'});await expect(row).toBeVisible();
  await row.getByRole('button',{name:'View record'}).click();await expect(page.getByRole('dialog')).toContainText('test@example.com');await page.getByRole('button',{name:'Close dialog'}).click();
  await row.getByRole('button',{name:'Edit record'}).click();await page.getByRole('textbox',{name:'name',exact:true}).fill('Updated Employee');await page.getByRole('button',{name:'Save record'}).click();
  await page.getByPlaceholder('Search records…').fill('nothing');await expect(page.getByText('No records found. Add a record or try another search.')).toBeVisible();
  await page.getByPlaceholder('Search records…').fill('Updated');
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Delete record'}).click();await expect(page.getByText('Record deleted.',{exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'React Frontend'}).click();
  await page.getByRole('button',{name:'Copy code',exact:true}).first().click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('npm create vite');
  await page.getByRole('tab',{name:'MongoDB Model'}).click();await expect(page.locator('pre')).toContainText('mongoose.Schema');
  await page.getByRole('tab',{name:'API Reference'}).click();await expect(page.getByRole('table')).toContainText('/api/employees');
});
test('product filtering, task status and all runnable JavaScript solutions',async({page})=>{
  await page.goto('/products');await page.getByRole('combobox',{name:'Filter records'}).selectOption('Electronics');await expect(page.getByRole('table')).toContainText('Wireless keyboard');
  await page.goto('/tasks');await page.getByRole('combobox',{name:'Filter records'}).selectOption('Completed');await expect(page.getByText('No records found. Add a record or try another search.')).toBeVisible();
  await page.goto('/javascript');const questions=page.locator('.question');await expect(questions).toHaveCount(25);
  for(let i=0;i<25;i++){const question=questions.nth(i);const expected=(await question.locator('.question-output').innerText()).replace('Expected output\n','');await question.getByRole('button',{name:'Run solution'}).click();await expect(question.locator('.question-output')).toHaveText('Actual output\n'+expected);}
});
test('mobile navigation and layout',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:'test-results/dashboard-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('nav').getByRole('link',{name:'Employee Management'}).click();await expect(page.locator('h1')).toHaveText('Employee Management');
  await page.getByRole('tab',{name:'React Frontend'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
