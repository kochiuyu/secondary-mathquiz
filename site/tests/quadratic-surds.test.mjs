import test from 'node:test';
import assert from 'node:assert/strict';
import {Q,mark} from '../src/math/exact.mjs';
import {QuadraticSurd,parseSurd,surdsEquivalent,markSurd} from '../src/math/quadratic-surds.mjs';

const contract=(answer,form)=>({type:'quadratic-surd',version:1,answer,...(form?{form}:{})});
// Independent reference: prime-exponent parity, with a separate fraction reducer.
function referenceFraction(n,d=1n){
 n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d;}
 let a=n<0n?-n:n,b=d;while(b)[a,b]=[b,a%b];const g=a||1n;
 return {n:n/g,d:d/g};
}
function referenceRoot(p,q){
 const reduced=referenceFraction(p,q);let value=Number(reduced.n*reduced.d),outside=1,inside=1;
 const primes=[];
 for(let candidate=2;candidate<=value;candidate++){
  if(primes.some(prime=>candidate%prime===0))continue;
  primes.push(candidate);let exponent=0;
  while(value%candidate===0){value/=candidate;exponent++;}
  if(exponent){outside*=candidate**Math.floor(exponent/2);if(exponent%2)inside*=candidate;}
 }
 const coefficient=referenceFraction(outside,reduced.d);
 return [{radicand:inside,n:String(coefficient.n),d:String(coefficient.d)}];
}

test('quadratic surds reduce 3,600 positive rational roots using independent prime-exponent checks',()=>{
 for(let p=1;p<=60;p++)for(let q=1;q<=60;q++)assert.deepEqual(parseSurd(`sqrt(${p}/${q})`).toJSON(),referenceRoot(p,q),`${p}/${q}`);
 assert.deepEqual(parseSurd('sqrt(0)').toJSON(),[]);
 assert.deepEqual(parseSurd('sqrt(1)').toJSON(),[{radicand:1,n:'1',d:'1'}]);
 assert.deepEqual(parseSurd('sqrt(10000)').toJSON(),[{radicand:1,n:'100',d:'1'}]);
 assert.deepEqual(parseSurd('sqrt(1/10000)').toJSON(),[{radicand:1,n:'1',d:'100'}]);
});

test('exact products and single-term quotients match independent squared rational values',()=>{
 for(let a=1;a<=24;a++)for(let b=1;b<=24;b++){
  const product=parseSurd(`sqrt(${a})*sqrt(${b})`),quotient=parseSurd(`sqrt(${a})/sqrt(${b})`);
  assert.deepEqual(product.toJSON(),referenceRoot(a*b,1));
  assert.deepEqual(quotient.toJSON(),referenceRoot(a,b));
  assert.equal(product.mul(product).rationalValue().toString(),String(a*b));
  const q=referenceFraction(a,b);
  assert.equal(quotient.mul(quotient).rationalValue().toString(),q.d===1n?String(q.n):`${q.n}/${q.d}`);
 }
});

test('mixed expressions preserve unlike roots, signs, rational results and exact cancellation',()=>{
 for(const [a,b] of [
  ['sqrt(12)+sqrt(3)','3*sqrt(3)'],['sqrt(2)+sqrt(3)','sqrt(3)+sqrt(2)'],
  ['-sqrt(8)+sqrt(18)','sqrt(2)'],['sqrt(2)*sqrt(8)','4'],
  ['sqrt(2)-sqrt(8)/2','0'],['8/(3*sqrt(2))','4*sqrt(2)/3'],
  ['(sqrt(2)+sqrt(3))*sqrt(2)','2+sqrt(6)'],
  ['(sqrt(2)+sqrt(3))/sqrt(2)','1+sqrt(6)/2'],
  ['(sqrt(2)+sqrt(3))*(sqrt(2)-sqrt(3))','-1'],
  ['(-2/3)*sqrt(3/4)','-sqrt(3)/3'],['sqrt(9/4)','1.5']
 ])assert.ok(surdsEquivalent(a,b),`${a} = ${b}`);
 assert.ok(!surdsEquivalent('sqrt(2)+sqrt(3)','sqrt(5)'));
 assert.ok(!surdsEquivalent('-sqrt(9)','sqrt(9)'));
 assert.equal(parseSurd('0.1+0.2').rationalValue().toString(),'3/10');
});

test('exact answers reject close finite decimals and keep precision requirements separate',()=>{
 const c=contract('sqrt(2)');
 for(const near of ['1.41421356237','141421356237/100000000000','1.41421356238'])assert.equal(markSurd(c,near).status,'incorrect',near);
 assert.equal(markSurd(c,'sqrt(8)/2').status,'correct');
 assert.equal(markSurd(contract('6'),'6.000').status,'correct');
 assert.equal(markSurd(contract('0'),'sqrt(8)-2*sqrt(2)').status,'correct');
});

test('simplest form accepts reordered unlike terms, rational coefficients and harmless parentheses',()=>{
 for(const text of ['2*sqrt(3)','2sqrt(3)','(2)*sqrt((3))','sqrt(3)*2','+2*sqrt(3)'])assert.equal(markSurd(contract('sqrt(12)','simplest'),text).status,'correct',text);
 for(const text of ['sqrt(2)/2','(1/2)*sqrt(2)','0.5*sqrt(2)'])assert.equal(markSurd(contract('sqrt(1/2)','simplest'),text).status,'correct',text);
 for(const text of ['sqrt(3)+sqrt(2)','sqrt(2)+sqrt(3)'])assert.equal(markSurd(contract('sqrt(2)+sqrt(3)','simplest'),text).status,'correct',text);
 for(const text of ['0','-0','(0.0)'])assert.equal(markSurd(contract('0','simplest'),text).status,'correct',text);
 assert.equal(markSurd(contract('-sqrt(2)/3','simplest'),'-sqrt(2)/3').status,'correct');
 assert.equal(markSurd(contract('2-sqrt(3)','simplest'),'-(sqrt(3)-2)').status,'correct');
});

test('simplest form detects unsimplified roots, duplicate terms, unevaluated products and radical denominators',()=>{
 const cases=[
  ['2*sqrt(3)','sqrt(12)'],['2*sqrt(3)','sqrt(3)+sqrt(3)'],
  ['2*sqrt(3)','(1+1)*sqrt(3)'],['2*sqrt(3)','6*sqrt(3)/3'],
  ['2*sqrt(3)','(4/2)*sqrt(3)'],['2*sqrt(3)','2*sqrt(3)+0'],
  ['sqrt(2)/2','1/sqrt(2)'],['sqrt(2)/2','sqrt(1/2)'],
  ['sqrt(2)/2','2*sqrt(2)/4'],['sqrt(2)/2','sqrt(2)/(1+1)'],
  ['4','sqrt(2)*sqrt(8)'],['2','1+1'],['0','sqrt(2)-sqrt(2)'],
  ['sqrt(2)','sqrt(2)*sqrt(1)'],['1/2','2/4']
 ];
 for(const [answer,input] of cases){assert.equal(markSurd(contract(answer),input).status,'correct',input);assert.equal(markSurd(contract(answer,'simplest'),input).status,'wrong-form',input);}
 assert.equal(markSurd(contract('sqrt(3)','simplest'),'sqrt(12)').status,'incorrect');
});

test('unsupported expressions and malformed input never fall back to numerical evaluation',()=>{
 for(const text of ['x','2^2','Math.sqrt(2)','globalThis.process.exit()','<img src=x>','sqrt(sqrt(4))','sqrt(2)^2','1/(2+sqrt(3))','sqrt(2)/(sqrt(2)+sqrt(3))','1e3'])assert.equal(markSurd(contract('1'),text).status,'unsupported',text);
 for(const text of ['1/0','1/(sqrt(2)-sqrt(2))','sqrt(-1)','sqrt(2','sqrt2','2 3','1+','()','1..2'])assert.equal(markSurd(contract('1'),text).status,'invalid',text);
 assert.equal(markSurd(contract('1'),'   ').status,'empty');
 assert.ok(surdsEquivalent('1/(sqrt(8)-sqrt(2))','sqrt(2)/2'));
});

test('length, tokens, sign depth, bracket depth and coefficient growth are bounded',()=>{
 for(const text of ['1'.repeat(161),'1+'.repeat(40)+'1','+'.repeat(13)+'1','('.repeat(13)+'1'+')'.repeat(13),'1234567890123','999999999999*'.repeat(5)+'999999999999'])assert.equal(markSurd(contract('1'),text).status,'unsupported',text);
 assert.equal(markSurd(contract('1'),'('.repeat(12)+'1'+')'.repeat(12)).status,'correct');
 assert.equal(markSurd(contract('1'),'+'.repeat(12)+'1').status,'correct');
});

test('root inputs, intermediate radicands and surviving canonical terms have explicit bounds',()=>{
 for(const text of ['sqrt(10001)','sqrt(1/10001)','sqrt(9999/10000)','sqrt(999983)*sqrt(999979)','sqrt(2)+sqrt(3)+sqrt(5)+sqrt(7)+sqrt(11)+sqrt(13)+sqrt(17)+sqrt(19)+sqrt(23)'])assert.equal(markSurd(contract('1'),text).status,'unsupported',text);
 const eight='sqrt(2)+sqrt(3)+sqrt(5)+sqrt(7)+sqrt(11)+sqrt(13)+sqrt(17)+sqrt(19)';
 assert.equal(parseSurd(eight).entries().length,8);
 assert.deepEqual(parseSurd('sqrt(10000/3)').toJSON(),[{radicand:3,n:'100',d:'3'}]);
});

test('Unicode entry is normalised without changing legacy number or expression contracts',()=>{
 assert.equal(markSurd(contract('sqrt(2)'),'√(２)').status,'correct');
 assert.equal(markSurd(contract('-sqrt(2)'),'−２×√(２)÷２').status,'correct');
 assert.equal(mark({type:'number',answer:'1/2'},'2/4').status,'correct');
 assert.equal(mark({type:'expression',answer:'x+1'},'1+x').status,'correct');
 assert.equal(mark({type:'number',answer:'2'},'sqrt(4)').status,'unsupported');
 assert.equal(mark(contract('sqrt(2)'),'sqrt(2)').status,'unsupported');
});

test('canonical snapshots round-trip with stable ordering and reject alternate or oversized encodings',()=>{
 const value=parseSurd('sqrt(3)+2*sqrt(2)-1/2'),data=value.toJSON();
 assert.deepEqual(data,[{radicand:1,n:'-1',d:'2'},{radicand:2,n:'2',d:'1'},{radicand:3,n:'1',d:'1'}]);
 assert.ok(QuadraticSurd.fromJSON(JSON.parse(JSON.stringify(value))).eq(value));
 assert.deepEqual(QuadraticSurd.fromJSON([]).toJSON(),[]);
 for(const bad of [null,{},[...data].reverse(),[data[0],data[0]],[{radicand:4,n:'1',d:'1'}],[{radicand:2,n:'0',d:'1'}],[{radicand:2,n:'2',d:'4'}],[{radicand:2,n:'01',d:'1'}],[{radicand:2,n:'1',d:'-1'}],[{radicand:2,n:'1',d:'1',extra:true}],[{radicand:2,n:'9'.repeat(61),d:'1'}],[{radicand:2,n:'1',d:'9'.repeat(61)}]])assert.throws(()=>QuadraticSurd.fromJSON(bad));
 for(const sign of ['', '-']){
  const large=[{radicand:2,n:sign+'1'+'0'.repeat(60),d:'1'}];
  assert.deepEqual(QuadraticSurd.fromJSON(large).toJSON(),large);
 }
 const largeDenominator=[{radicand:2,n:'1',d:'1'+'0'.repeat(60)}];
 assert.deepEqual(QuadraticSurd.fromJSON(largeDenominator).toJSON(),largeDenominator);
});

test('canonical coefficients cannot be mutated through caller-owned Q values or returned entries',()=>{
 const coefficient=new Q(2),value=new QuadraticSurd([[2,coefficient]]);coefficient.n=99n;
 const entries=value.entries();entries[0][1].n=88n;entries.push([3,new Q(3)]);
 const snapshot=value.toJSON();snapshot[0].n='77';
 assert.deepEqual(value.toJSON(),[{radicand:2,n:'2',d:'1'}]);
});

test('contract version, expected answer and optional canonical snapshot must agree before checking input',()=>{
 const c=contract('2*sqrt(3)');c.canonical=parseSurd(c.answer).toJSON();
 assert.equal(markSurd(c,'sqrt(12)').status,'correct');
 for(const bad of [null,{...c,version:2},{...c,version:undefined},{...c,type:'expression'},{...c,answer:'sqrt(-2)'},{...c,canonical:[]},{...c,form:'expanded'}])assert.equal(markSurd(bad,'sqrt(12)').status,'unsupported');
});

test('learner feedback distinguishes empty, invalid, unsupported and wrong form in both languages',()=>{
 for(const text of ['', 'sqrt(-1)', '1/(2+sqrt(3))', 'sqrt(12)']){
  const en=markSurd(contract('2*sqrt(3)','simplest'),text,'en'),zh=markSurd(contract('2*sqrt(3)','simplest'),text,'zh');
  assert.equal(en.status,zh.status);assert.ok(en.message);assert.ok(/[\u3400-\u9fff]/.test(zh.message));
 }
 assert.equal(markSurd(contract('1'),'1/0','zh').message,'除數不能是零。');
 assert.ok(!Object.hasOwn(markSurd(contract('sqrt(3)'),'sqrt(2)'),'message'));
});
