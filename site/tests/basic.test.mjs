import test from 'node:test';
import assert from 'node:assert/strict';
import {basicFamilies,generateBasic,basicPrimePowers,basicGcd,basicExposureKey,basicFeedback} from '../src/math/basic.mjs';
import {basicLessons,basicLessonExamples,recordedBasicExamples} from '../src/lessons/basic.mjs';
import {basicHub,basicLessonView} from '../src/app/basic-views.mjs';
import {math,diagram,optionLabel} from '../src/renderers/math.mjs';
import {mark} from '../src/math/exact.mjs';
import {createSession,answer,evidenceSummary,selfReviewReason,setReason,setAnswerDraft,avoidExposedExamples} from '../src/app/session.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
// Independent tiny rational oracle; no generator arithmetic or response contract used.
const ratio=s=>{const [n,d='1']=String(s).split('/');return [BigInt(n),BigInt(d)];};
const addR=([a,b],[c,d])=>[a*d+c*b,b*d],mulR=([a,b],[c,d])=>[a*c,b*d],divR=([a,b],[c,d])=>[a*d,b*c],negR=([a,b])=>[-a,b];
function sameR(actual,[n,d]){const [a,b]=ratio(actual);assert.equal(a*d,n*b);}
const divisors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
const lcmOracle=ns=>{for(let v=Math.max(...ns);v<=216000;v++)if(ns.every(n=>v%n===0))return v;throw Error('Oracle limit');};
test('eight basic families: 2,400 deterministic cases checked independently, with bounded exact operations',()=>{
 const seen={div:new Set(),mode:new Set(),count:new Set(),den15:false};
 for(const f of basicFamilies)for(let i=0;i<300;i++){
  const q=generateBasic(f.id,'independent-'+i),m=q.model;assert.deepEqual(q,generateBasic(f.id,'independent-'+i));assert.equal(q.objective,f.objective);assert.equal(mark(q.contract,q.answer).status,'correct');
  for(const lang of ['en','zh']){assert.ok(q.prompt[lang].length>8);assert.ok(q.solution[lang].length>8);assert.ok(q.hint[lang].length>8);}
  if(q.options){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);assert.equal(new Set(q.options.map(o=>optionLabel(o))).size,q.options.length);}
  if(q.id==='BC01'){assert.equal(q.answer,m.n%m.divisor===0?'yes':'no');seen.div.add(m.divisor+':'+q.answer);}
  if(q.id==='BC02'){seen.mode.add(m.mode);if(m.mode==='value')assert.equal(Number(q.answer),Array(m.exponent).fill(m.base).reduce((a,b)=>a*b,1));else {assert.ok(m.base>1);let n=1,e=0;while(n<m.value){n*=m.base;e++;}assert.equal(n,m.value);assert.equal(Number(q.answer),e);}}
  if(q.id==='BC03'){const n=2**m.powers[0]*3**m.powers[1]*5**m.powers[2];assert.equal(q.math,String(n));assert.equal(q.answer,'prime');assert.ok(q.options.find(o=>o.id==='composite').label.startsWith('4'));assert.ok(q.options.find(o=>o.id==='unit').label.startsWith('1 ×'));}
  if(['BC04','BC05'].includes(q.id)){seen.count.add(m.numbers.length);const value=q.id==='BC04'?Math.max(...divisors(m.numbers[0]).filter(d=>m.numbers.every(n=>n%d===0))):lcmOracle(m.numbers);assert.equal(Number(q.answer),value);assert.ok(m.numbers.every(n=>n>0&&n<=120));}
  if(q.id==='BC06'){let v;if(m.mode==='nested-add')v=m.a+(m.b-(m.c-m.d));if(m.mode==='nested-product')v=((m.a-m.b)-(m.c+m.d))*m.e;if(m.mode==='nested-division'){assert.ok(m.c-(m.d-m.e)>0);v=(m.a+m.b)/(m.c-(m.d-m.e));}assert.equal(Number(q.answer),v);assert.ok(Number.isInteger(v)&&v>0);}
  if(q.id==='BC07'){const left=addR(ratio(m.a),ratio(m.b)),right=addR(ratio(m.c),negR(ratio(m.d)));sameR(q.answer,m.operation==='multiply'?mulR(left,right):divR(left,right));if([m.a,m.b,m.d].some(x=>x.endsWith('/15')))seen.den15=true;}
  if(q.id==='BC08'){const v=m.mode==='decimal'?divR(mulR(addR([BigInt(m.a),10n],[BigInt(m.b),100n]),[BigInt(m.c),10n]),ratio(m.d)):addR(addR([BigInt(m.a),10n],mulR([BigInt(m.b),4n],[BigInt(m.c),10n])),[-BigInt(m.d),10n]);sameR(q.answer,v);}
 }
 assert.equal(seen.div.size,8);assert.equal(seen.mode.size,2);assert.deepEqual([...seen.count].sort(),[2,3]);assert.equal(seen.den15,true);
});
test('prime-factor and three-input boundaries, power rendering and feedback preserve response restrictions',()=>{
 assert.deepEqual(basicPrimePowers(1),[]);assert.deepEqual(basicPrimePowers(72),[[2,3],[3,2]]);assert.equal(basicGcd(basicGcd(6,10),15),1);assert.equal(lcmOracle([6,10,15]),30);assert.equal(12%2,0);assert.equal(12%4,0);assert.notEqual(12%8,0);
 assert.match(math('3^4'),/<msup><mn>3<\/mn><mn>4<\/mn><\/msup>/);assert.match(math('3^? = 81'),/<msup><mn>3<\/mn><mo>\?<\/mo><\/msup>/);
 assert.notEqual(mark({type:'expression',answer:'x^3'},'x^3').status,'correct');
 assert.throws(()=>generateBasic('BC02','test',2));assert.throws(()=>generateBasic('BC99','test'));assert.throws(()=>generateBasic('BC01','x'.repeat(81)));
 const q={id:'BC02',model:{mode:'value',base:3,exponent:4},answer:'81'};assert.match(basicFeedback(q,'12').en,/multiplied/);assert.equal(basicFeedback(q,'81'),null);
 for(const id of ['BC04','BC05']){const q={id,model:{numbers:[12,18]},answer:id==='BC04'?'6':'36'};assert.ok(basicFeedback(q,id==='BC04'?'36':'6'));}
});
test('basic lesson exposure includes fixed and generated models, and input order never makes a fresh GCD/LCM',()=>{
 assert.equal(basicLessons.length,3);for(const l of basicLessons){const examples=recordedBasicExamples(['lesson:'+l.id+':v1']);for(const q of basicLessonExamples(l))assert.ok(examples.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh']){assert.ok(l.sections.length>=3);assert.match(basicLessonView(l.id,lang),/basic-lesson-check/);assert.ok(l.takeaway[lang].length>20);}}
 assert.match(basicHub('en'),/eight families/);assert.ok(basicLessonView('BC-L2','zh').includes('72 = 2³ × 3²'));
 for(const id of ['BC04','BC05'])assert.equal(basicExposureKey(id,{kind:id==='BC04'?'gcd':'lcm',numbers:[6,10,15]}),basicExposureKey(id,{kind:id==='BC04'?'gcd':'lcm',numbers:[15,6,10]}));
 const studied=basicLessons.map(l=>'lesson:'+l.id+':v1'),exposed=recordedBasicExamples(studied);const s=avoidExposedExamples(createSession(basicFamilies.map(f=>f.id),'fresh-basic','check',8),[],exposed);for(const q of s.items)assert.ok(!exposed.some(x=>x.exposureKey===q.exposureKey));
});
test('basic numerical/selection scores stay separate from reviewed reasoning and exact near misses',()=>{
 const s=createSession(basicFamilies.map(f=>f.id),'score-basic','check',8);for(let i=0;i<8;i++){const q=s.items[i];assert.equal(answer(s,i,q.answer).status,'correct');if(q.manualReason){setReason(s,i,'My checked explanation');s.responses[i].solution=true;selfReviewReason(s,i);setAnswerDraft(s,i,'changed');assert.equal(s.responses[i].manualReview,null);setAnswerDraft(s,i,q.answer);}}
 const summary=evidenceSummary(s);assert.equal(summary.automaticTotal,8);assert.equal(summary.correct,8);
 const q=generateBasic('BC07','near');const [n,d]=ratio(q.answer);assert.equal(mark(q.contract,String(n*1000n+1n)+'/'+String(d*1000n)).status,'incorrect');assert.equal(mark(q.contract,q.math).status,'wrong-form');
});
test('basic bilingual paper snapshots preserve eight models, non-answer diagrams and separate keys',async()=>{
 for(const lang of ['en','zh']){const p=createPaper(basicFamilies.map(f=>f.id),'basic-paper',8,lang);assert.deepEqual(validatePaper(p),p);const hash=await identity(p),student=renderPaper(p,hash),key=renderPaper(p,hash,true);assert.equal((student.match(/class="paper-question"/g)||[]).length,8);assert.ok(!student.includes('class="solution"'));assert.equal((key.match(/class="solution"/g)||[]).length,8);assert.ok(!key.includes('[object Object]'));for(const item of p.items){const d=diagram(item.question,lang);assert.ok(!d.includes('solution'));if(item.question.id==='BC02'&&item.question.model.mode==='exponent')assert.ok(!d.includes('×'));}}
});
