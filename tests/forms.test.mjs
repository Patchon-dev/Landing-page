import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUserSchema, initialUserValues } from '../src/pages/components/forms/schema.ts';
const schema=createUserSchema(key=>key);
const valid={name:'Daniel Lopes',email:'daniel@example.com',password:'Password123',confirmPassword:'Password123',bio:'',accepted:true};
test('user schema accepts valid data and trims name/email',async()=>{
 const result=await schema.validate({...valid,name:' Daniel Lopes ',email:' daniel@example.com '});
 assert.equal(result.name,'Daniel Lopes');assert.equal(result.email,'daniel@example.com');
});
test('user schema reports every required field',async()=>{
 await assert.rejects(schema.validate(initialUserValues,{abortEarly:false}),error=>{
  assert.deepEqual([...new Set(error.inner.map(issue=>issue.path))].sort(),['accepted','confirmPassword','email','name','password']);return true;
 });
});
test('user schema rejects invalid fields and password rules',async()=>{
 for(const change of [{name:'a'},{name:'a'.repeat(81)},{email:'invalid'},{password:'short'},{password:'PASSWORD123'},{password:'password123'},{password:'Passwordabc'},{confirmPassword:'different'},{bio:'a'.repeat(501)},{accepted:false}]) {
  assert.equal(await schema.isValid({...valid,...change}),false,JSON.stringify(change));
 }
});
