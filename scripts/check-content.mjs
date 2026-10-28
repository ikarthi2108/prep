import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {transformWithOxc} from 'vite';
import {questions} from '../src/data/questions.js';
import {reactReference,searchExample,mongoOperations} from '../src/data/reference.js';
for(const question of questions){
  const lines=[];
  const context=vm.createContext({console:{log:(...values)=>lines.push(values.map(v=>typeof v==='string'?v:JSON.stringify(v)).join(' '))},setTimeout});
  await vm.runInContext('(async()=>{'+question.code+'\n})()',context,{timeout:1000});
  assert.equal(lines.join('\n'),question.output,'Question '+question.id+': '+question.title);
}
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='node_modules')continue;const file=dir+'/'+entry.name;if(entry.isDirectory())walk(file);else if(/\.(jsx|js)$/.test(file))files.push(file)}}
walk('examples');walk('backend');
for(const file of files)await transformWithOxc(fs.readFileSync(file,'utf8'),file);
for(const entry of reactReference)await transformWithOxc(entry.code,entry.file);
await transformWithOxc(searchExample,'src/App.jsx');
await transformWithOxc(mongoOperations,'backend/practice.js');
console.log('PASS: all 25 JavaScript outputs, '+files.length+' source files, React snippets, search demo, and MongoDB practice syntax.');
