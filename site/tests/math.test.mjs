import test from 'node:test';
import assert from 'node:assert/strict';
import {Q,scalar,parse,equivalent,mark} from '../src/math/exact.mjs';
import {generate,families,makeItems} from '../src/math/fixtures.mjs';

test('exact rational arithmetic preserves equality beyond floating-point precision',()=>{
 assert.equal(new Q(2,4).toString(),'1/2');assert.equal(scalar('0.1 + 0.2').toString(),'3/10');
 assert.equal(scalar('−３/２').toString(),'-3/2');assert.equal(scalar('-(2+3)^2').toString(),'-25');
 assert.equal(mark({type:'number',answer:'3/2'},'1.50').status,'correct');
 assert.equal(mark({type:'number',answer:'2',unit:'degree'},'2°').status,'correct');
 assert.equal(mark({type:'number',answer:'2'},'2.00000000001').status,'incorrect');
 assert.equal(mark({type:'number',answer:'2'},'2.000000000001').status,'unsupported');
});
test('symbolic equivalence and requested form are independent',()=>{
 assert.ok(equivalent('3(x+2)+4','3*x+10'));
 assert.equal(mark({type:'expression',answer:'3x+10',form:'expanded'},'3(x+2)+4').status,'wrong-form');
 assert.equal(mark({type:'expression',answer:'3x+10',form:'expanded'},'10+3*x').status,'correct');
 assert.equal(mark({type:'expression',answer:'3x+10'},'3x+9').status,'incorrect');
 assert.ok(equivalent('(x+1)^2','x^2+2x+1'));
});
test('new numeric contracts require a final literal while preserving legacy rules',()=>{
 const c={type:'number',answer:'3/2',form:'number-literal'};
 for(const input of ['1.50','+1.5','3/2','6 / 4','-3/-2','１.５'])assert.equal(mark(c,input).status,'correct',input);
 for(const input of ['1+1/2','(3/2)','3*0.5','1.5^1'])assert.equal(mark(c,input).status,'wrong-form',input);
 assert.equal(mark(c,'1+1').status,'incorrect');
 assert.equal(mark({...c,unit:'degree'},'x = 1.5°').status,'correct');
 assert.equal(mark({type:'number',answer:'3/2'},'1+1/2').status,'correct');
 for(const id of ['signed','fraction']){
  const q=generate(id,'copied-prompt');assert.equal(q.version,2);assert.equal(mark(q.contract,q.math).status,'wrong-form');
  const legacy=generate(id,'copied-prompt',1);assert.equal(mark(legacy.contract,legacy.math).status,'correct');
 }
});
test('unsafe and unsupported syntax is rejected without evaluating it',()=>{
 for(const text of ['globalThis.process.exit()','alert(1)','<img src=x>','x/x','2^100','x^3','x^0','0^0','x-x+1','1e309','1/0','('.repeat(30)+'1'+')'.repeat(30),'9'.repeat(170)]){
  const result=mark({type:'number',answer:'1'},text);assert.ok(['invalid','unsupported'].includes(result.status),text);
 }
 assert.equal(mark({type:'number',answer:'1'},'').status,'empty');
});
test('finite solution sets require all and only valid solutions',()=>{
 const c={type:'set',answers:['-2','2']};assert.equal(mark(c,'{2,-2}').status,'correct');
 assert.equal(mark(c,'2').status,'incorrect');assert.equal(mark(c,'2,-2,3').status,'incorrect');assert.equal(mark(c,'2,2').status,'incorrect');
});
test('fixture generation is deterministic and each generated answer matches its contract',()=>{
 for(const family of families)for(let i=0;i<200;i++){
  const q=generate(family.id,'boundary-seed-'+i);assert.deepEqual(q,generate(family.id,'boundary-seed-'+i));assert.equal(mark(q.contract,q.answer).status,'correct',family.id+' '+i);
  if(q.diagram?.type==='angle')assert.equal(q.diagram.a+Number(q.answer),180);
  if(q.options)assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);
 }
 assert.throws(()=>generate('signed','x',99),/unavailable/);assert.throws(()=>makeItems([],'x',4));
});
