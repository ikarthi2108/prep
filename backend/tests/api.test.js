import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import resources from '../../src/data/resources.json' with {type:'json'};
import Employee from '../models/Employee.js';
import User from '../models/User.js';
const dbName='devprep_test_'+Date.now();
let server,base;
before(async()=>{
  process.env.JWT_SECRET=randomBytes(32).toString('hex');
  await mongoose.connect(process.env.MONGO_TEST_URI||'mongodb://127.0.0.1:27028/'+dbName,{dbName,serverSelectionTimeoutMS:5000});
  await Promise.all([Employee.init(),User.init()]);
  server=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  base='http://127.0.0.1:'+server.address().port+'/api';
});
after(async()=>{
  if(mongoose.connection.readyState===1&&mongoose.connection.name===dbName)await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if(server)await new Promise(resolve=>server.close(resolve));
});
async function request(path,method='GET',body,token){const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()}}
for(const resource of resources)test(resource.name+' CRUD, validation, search and pagination',async()=>{
  const route='/'+resource.key;
  assert.equal((await request(route,'POST',{})).status,400);
  const created=await request(route,'POST',resource.sample);
  assert.equal(created.status,201);const id=created.data._id;
  assert.equal((await request(route+'/'+id)).status,200);
  assert.equal((await request(route+'/bad-id')).status,400);
  assert.equal((await request(route+'/507f1f77bcf86cd799439099')).status,404);
  const list=await request(route+'?limit=1&page=1&sort=name&order=asc');
  assert.equal(list.data.items.length,1);assert.ok(list.data.total>=1);
  assert.equal((await request(route+'?search='+encodeURIComponent('['))).data.items.length,0);
  const changed={...resource.sample,[resource.fields[0]]:'Updated record'};
  assert.equal((await request(route+'/'+id,'PUT',changed)).data[resource.fields[0]],'Updated record');
  if(resource.numbers.length){const invalid={...changed,[resource.numbers[0]]:-1};assert.equal((await request(route+'/'+id,'PUT',invalid)).status,400)}
  if(resource.fields.includes('email'))assert.equal((await request(route,'POST',resource.sample)).status,409);
  if(resource.key==='tasks'){assert.equal((await request(route+'?status=Completed')).data.total,0);assert.equal((await request(route+'/'+id,'PUT',{...changed,status:'Wrong'})).status,400)}
  if(resource.key==='products')assert.equal((await request(route+'?category=Electronics')).data.total,1);
  assert.equal((await request(route+'/'+id,'DELETE')).status,200);
  assert.equal((await request(route+'/'+id)).status,404);
});
test('JWT registration, login, current user, expiry, and safe responses',async()=>{
  const body={name:'Test User',email:'test@example.com',password:'test-password-123'};
  assert.equal((await request('/auth/register','POST',{...body,password:'short'})).status,400);
  const registered=await request('/auth/register','POST',body);
  assert.equal(registered.status,201);assert.ok(registered.data.token);assert.equal(registered.data.user.password,undefined);
  assert.equal((await request('/auth/register','POST',body)).status,409);
  assert.equal((await request('/auth/login','POST',{...body,password:'incorrect'})).status,401);
  const signedIn=await request('/auth/login','POST',body);assert.equal(signedIn.status,200);
  const me=await request('/auth/me','GET',undefined,signedIn.data.token);
  assert.equal(me.status,200);assert.equal(me.data.email,body.email);assert.equal(me.data.password,undefined);
  assert.equal((await request('/auth/me')).status,401);
  assert.equal((await request('/auth/me','GET',undefined,'invalid')).status,401);
  const expired=jwt.sign({sub:registered.data.user.id},process.env.JWT_SECRET,{expiresIn:-1});
  assert.equal((await request('/auth/me','GET',undefined,expired)).status,401);
  const stored=await User.findOne({email:body.email}).select('+password');assert.notEqual(stored.password,body.password);
});
test('unknown routes and malformed JSON',async()=>{
  assert.equal((await request('/missing')).status,404);
  const response=await fetch(base+'/employees',{method:'POST',headers:{'Content-Type':'application/json'},body:'{broken'});
  assert.equal(response.status,400);
});
