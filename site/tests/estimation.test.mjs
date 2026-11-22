import test from 'node:test';
import assert from 'node:assert/strict';
import {estimationFamilies,estimationCoreFamilies,generateEstimation,estimationRound,estimationSignificant,estimationExposureKey,estimationFeedback} from '../src/math/estimation.mjs';
import {estimationLessons,estimationLessonExamples,recordedEstimationExamples} from '../src/lessons/estimation.mjs';
import {estimationHub,estimationLessonView} from '../src/app/estimation-views.mjs';
import {mark} from '../src/math/exact.mjs';
import {diagram} from '../src/renderers/math.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
import {createSession,avoidExposedExamples,answer,evidenceSummary,setReason,selfReviewReason,setAnswerDraft,validateSession} from '../src/app/session.mjs';
// Independent lattice-distance oracle: choose between neighbouring permitted values.
function nearestOracle(n,step,mode='nearest'){let low=0;while(low+step<=n)low+=step;const high=low===n?low:low+step;return mode==='down'?low:mode==='up'?high:n-low<high-n?low:high;}
const rational=s=>{if(String(s).includes('/')){const [n,d]=String(s).split('/');return [BigInt(n),BigInt(d)];}const [w,f='']=String(s).split('.');return [BigInt(w+f),10n**BigInt(f.length)];};
function sameValue(actual,n,d=1){const [a,b]=rational(actual);assert.equal(a*BigInt(d),BigInt(n)*b);}
function sigDigits(s){return s.replace('.','').replace(/^0+/,'').length;}
test('eight estimation families: 2,400 independently checked models, precise reports and manual investigations',()=>{
 const seen={report:new Set(),dp:new Set(),sf:new Set(),mode:new Set(),op:new Set(),context:new Set(),scenario:new Set(),zero:false,carry:false};
 assert.equal(estimationCoreFamilies.length,7);assert.ok(estimationFamilies.find(f=>f.id==='AP08').optional);
 for(const f of estimationFamilies)for(let i=0;i<300;i++){
  const q=generateEstimation(f.id,'independent-'+i),m=q.model;assert.deepEqual(q,generateEstimation(f.id,'independent-'+i));assert.equal(q.objective,f.objective);assert.ok(q.manualReason);
  assert.equal(mark(q.contract,q.answer).status,q.id==='AP08'?'manual':'correct');
  for(const lang of ['en','zh'])for(const field of ['prompt','hint','solution','reasonRubric'])assert.ok(q[field][lang].length>15);
  if(q.id==='AP01'){seen.report.add(m.report);assert.equal(q.answer,['count','defined'].includes(m.report)?'exact':'approximate');assert.equal(new Set(q.options.map(o=>o.id)).size,2);}
  if(q.id==='AP02'){seen.dp.add(m.dp);const expected=nearestOracle(m.n,10**(m.scale-m.dp));sameValue(q.answer,expected,10**m.scale);assert.equal((q.answer.split('.')[1]||'').length,m.dp);if(Number(q.answer)===0)seen.zero=true;}
  if(q.id==='AP03'){seen.sf.add(m.figures);const step=10**Math.max(0,String(m.n).length-m.figures),expected=nearestOracle(m.n,step);sameValue(q.answer,expected,10**m.scale);assert.equal(sigDigits(q.answer),m.figures);assert.equal(q.answer.split('.')[1].length,q.contract.decimalPlaces);if(Number(q.answer)===1)seen.carry=true;}
  if(q.id==='AP04')sameValue(q.answer,nearestOracle(m.n,m.step));
  if(q.id==='AP05'){seen.mode.add(m.mode);sameValue(q.answer,nearestOracle(m.n,m.step,m.mode));assert.match(diagram(q,'zh'),/尚未標示捨入結果/);}
  if(q.id==='AP06'){seen.op.add(m.op);const a=nearestOracle(m.a,10),b=nearestOracle(m.b,10);assert.ok(b>0);sameValue(q.answer,m.op==='add'?a+b:m.op==='multiply'?a*b:a,m.op==='divide'?b:1);}
  if(q.id==='AP07'){seen.context.add(m.mode);const n=Number(q.answer);assert.ok(Number.isInteger(n)&&n>=0);if(m.mode==='capacity'){assert.ok(n*m.capacity>=m.people);assert.ok((n-1)*m.capacity<m.people);}else{assert.ok(n*m.price<=m.budget);assert.ok((n+1)*m.price>m.budget);}}
  if(q.id==='AP08'){seen.scenario.add(m.scenario);assert.equal(q.contract.type,'manual');assert.match(q.prompt.en,/Optional enrichment.*entirely manually reviewed/);assert.equal(mark(q.contract,'A different justified plan').status,'manual');assert.match(q.reasonRubric.en,/not a unique answer/);}
  if(q.contract.type==='number'){const [n,d]=rational(q.answer);assert.equal(mark(q.contract,String(n*1000n+1n)+'/'+String(d*1000n)).status,'incorrect');}
 }
 assert.equal(seen.report.size,4);assert.equal(seen.dp.size,4);assert.equal(seen.sf.size,3);assert.equal(seen.mode.size,3);assert.equal(seen.op.size,3);assert.equal(seen.context.size,2);assert.equal(seen.scenario.size,3);assert.ok(seen.zero&&seen.carry);
});
test('decimal precision, significant carries and halfway boundaries use stated rules without changing legacy numeric contracts',()=>{
 for(const [n,step,expected] of [[1004,10,1000],[1005,10,1010],[1006,10,1010],[99995,10,100000],[0,100,0]])assert.equal(estimationRound(n,step),expected);
 for(const mode of ['nearest','up','down'])assert.equal(estimationRound(40,10,mode),40);
 assert.equal(estimationSignificant(45000,7,3).answer,'0.00450');assert.equal(estimationSignificant(99995,5,2).answer,'1.0');
 const c={type:'number',answer:'1.20',form:'number-literal',decimalPlaces:2};
 assert.equal(mark(c,'1.20').status,'correct');for(const text of ['1.2','1.200','6/5','1+0.20'])assert.equal(mark(c,text).status,'wrong-form');assert.equal(mark(c,'1.21').status,'incorrect');
 assert.equal(mark({type:'number',answer:'1.20',form:'number-literal'},'6/5').status,'correct');
 assert.equal(mark({type:'number',answer:'0.00450',form:'number-literal',decimalPlaces:5},'0.0045').status,'wrong-form');
 assert.throws(()=>estimationRound(-1,10));assert.throws(()=>estimationRound(1,0));assert.throws(()=>estimationRound(1,10,'unknown'));assert.throws(()=>estimationSignificant(0,5,2));assert.throws(()=>generateEstimation('AP01','x',2));assert.throws(()=>generateEstimation('AP99','x'));assert.throws(()=>generateEstimation('AP02','x'.repeat(81)));
 assert.match(estimationFeedback({id:'AP02',answer:'1.20',contract:c},'1.2').en,/precision/);
 assert.match(estimationFeedback({id:'AP06',answer:'80',contract:{type:'number'},model:{a:47,b:28,op:'add'}},'75').en,/exact calculation/);
});
test('four lessons preserve optional status, all model exposure and exhaustion without treating number renaming as fresh',()=>{
 assert.equal(estimationLessons.length,4);assert.ok(estimationLessons[3].optional);assert.match(estimationHub('en'),/seven core families/);
 for(const l of estimationLessons){const exposed=recordedEstimationExamples(['lesson:'+l.id+':v1']);for(const q of estimationLessonExamples(l))assert.ok(exposed.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh'])assert.match(estimationLessonView(l.id,lang),/estimation-lesson-check/);}
 assert.equal(estimationExposureKey('AP01',{kind:'report',report:'measured',n:20}),estimationExposureKey('AP01',{kind:'report',report:'measured',n:50}));
 assert.equal(estimationExposureKey('AP08',{kind:'investigation',scenario:'crowd',n:20}),estimationExposureKey('AP08',{kind:'investigation',scenario:'crowd',n:40}));
 const exposed=recordedEstimationExamples(estimationLessons.map(l=>'lesson:'+l.id+':v1')),s=avoidExposedExamples(createSession(estimationFamilies.map(f=>f.id),'ap-fresh','check',8),[],exposed);
 assert.equal(s.responses[0].priorExposure,true);assert.equal(s.responses[7].priorExposure,true);for(let i=1;i<7;i++)assert.equal(s.responses[i].priorExposure,false);
});
test('mixed checks exclude enrichment from numeric scores and keep all explanations manually reviewed',()=>{
 const s=createSession(estimationFamilies.map(f=>f.id),'ap-score','check',8);for(let i=0;i<8;i++){const q=s.items[i];answer(s,i,q.contract.type==='manual'?'My own justified strategy':q.answer);setReason(s,i,'Purpose, precision, method and limitations');s.responses[i].solution=true;selfReviewReason(s,i);assert.equal(s.responses[i].manualReview,'self');setAnswerDraft(s,i,'edited');assert.equal(s.responses[i].manualReview,null);}
 const summary=evidenceSummary(s);assert.equal(summary.automaticTotal,7);assert.equal(summary.correct,7);assert.equal(summary.manualSubmitted,1);assert.equal(summary.manualPending,8);validateSession(s);
});
test('bilingual core and enrichment paper snapshots retain precision, numbering and entirely manual investigation keys',async()=>{
 for(const lang of ['en','zh'])for(const ids of [estimationCoreFamilies.map(f=>f.id),estimationFamilies.map(f=>f.id)]){const p=createPaper(ids,'estimation-paper',ids.length,lang);assert.deepEqual(validatePaper(p),p);const hash=await identity(p),student=renderPaper(p,hash),key=renderPaper(p,hash,true);assert.equal((student.match(/class="paper-question"/g)||[]).length,ids.length);assert.ok(!student.includes('class="solution"'));assert.equal((key.match(/class="solution"/g)||[]).length,ids.length);assert.ok(!key.includes('[object Object]'));if(ids.length===8){assert.ok(key.includes(lang==='en'?'All 4 marks require manual review':'全題 4 分需人工評閱'));assert.match(key,/JS-3-4/);}}
});
