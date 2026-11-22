import test from 'node:test';
import assert from 'node:assert/strict';
import {ratioFamilies,generateRatio,ratioFeedback,ratioExposureKey} from '../src/math/ratios.mjs';
import {ratioLessons,ratioLessonExamples,recordedRatioExamples} from '../src/lessons/ratios.mjs';
import {ratioHub,ratioLessonView} from '../src/app/ratio-views.mjs';
import {mark} from '../src/math/exact.mjs';
import {diagram,optionLabel} from '../src/renderers/math.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
import {createSession,avoidExposedExamples,answer,evidenceSummary,setReason,selfReviewReason,setAnswerDraft} from '../src/app/session.mjs';
const frac=s=>{const [n,d='1']=String(s).split('/');return [BigInt(n),BigInt(d)];};
function equalFrac(actual,n,d=1){const [a,b]=frac(actual);assert.equal(a*BigInt(d),BigInt(n)*b);}
function gcdOracle(a,b){for(let d=Math.min(a,b);d>=1;d--)if(a%d===0&&b%d===0)return d;}
test('eight rate/ratio families: 2,400 deterministic models independently checked with exact unit arithmetic',()=>{
 const seen={parts:new Set(),rate:new Set(),rules:new Set(),scale:new Set(),equalTime:false,unequalTime:false};
 for(const f of ratioFamilies)for(let i=0;i<300;i++){
  const q=generateRatio(f.id,'independent-'+i),m=q.model;assert.deepEqual(q,generateRatio(f.id,'independent-'+i));assert.equal(q.objective,f.objective);assert.equal(mark(q.contract,q.answer).status,'correct');assert.ok(q.manualReason);
  for(const lang of ['en','zh'])for(const field of ['prompt','hint','solution','reasonRubric'])assert.ok(q[field][lang].length>15);
  if(q.options){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);assert.equal(new Set(q.options.map(o=>optionLabel(o,'en'))).size,q.options.length);}
  if(q.id==='RP01'){
   const labels=q.options.map(o=>({id:o.id,n:o.label.split(':').map(Number)})),correct=labels.filter(o=>o.n[0]*m.gramsB===o.n[1]*m.gramsA&&gcdOracle(...o.n)===1);assert.equal(correct.length,1);assert.equal(correct[0].id,q.answer);assert.ok(m.gramsA>0&&m.gramsB>0);assert.notEqual(m.gramsA,m.gramsB);
  }else if(q.id==='RP02'){seen.parts.add(m.parts.length);equalFrac(q.answer,m.total*m.parts[m.target],m.parts.reduce((a,b)=>a+b,0));}
  else if(q.id==='RP03'){seen.rate.add(m.mode);if(m.mode==='price')equalFrac(q.answer,m.price*1000,m.grams);else if(m.mode==='kmh-to-ms')equalFrac(q.answer,m.speed*5,18);else equalFrac(q.answer,m.speed*18,5);}
  else if(q.id==='RP04'){equalFrac(q.answer,m.v1*m.t1+m.v2*m.t2,m.t1+m.t2);if(m.t1===m.t2)seen.equalTime=true;else{seen.unequalTime=true;assert.notEqual(Number(q.answer),((m.v1+m.v2)/2));}}
  else if(q.id==='RP05'){equalFrac(q.answer,m.cost1*m.mass2,m.mass1);assert.ok(m.mass1>0&&m.mass2>0);}
  else if(q.id==='RP06'){equalFrac(q.answer,m.hours1*m.workers1,m.workers2);assert.ok(m.workers1>0&&m.workers2>0);}
  else if(q.id==='RP07'){
   seen.rules.add(m.rule);const ys=[1,2,4].map(x=>m.rule==='direct'?m.k*x:m.rule==='inverse'?m.k/x:m.rule==='offset'?m.k*x+m.c:m.rule==='square'?x*x:m.c-x),isDirect=ys.every((y,i)=>y/[1,2,4][i]===ys[0]),isInverse=ys.every((y,i)=>y*[1,2,4][i]===ys[0]);assert.equal(q.answer,isDirect?'direct':isInverse?'inverse':'neither');assert.ok(ys.every(y=>y>0));
  }else if(q.id==='RP08'){seen.scale.add(m.mode);equalFrac(q.answer,m.mode==='actual'?m.planTenths*m.scale:m.planTenths,m.mode==='actual'?1000:10);assert.match(q.prompt.en,/do not measure/i);assert.ok(!diagram(q).includes(m.mode==='plan'?String(m.planTenths/10)+' cm':'ANSWER'));}
  if(!q.options){const [n,d]=frac(q.answer);assert.equal(mark(q.contract,String(n*1000n+1n)+'/'+String(d*1000n)).status,'incorrect');assert.notEqual(mark(q.contract,q.answer+' kg').status,'correct');}
 }
 assert.deepEqual([...seen.parts].sort(),[2,3]);assert.equal(seen.rate.size,3);assert.equal(seen.rules.size,5);assert.equal(seen.scale.size,2);assert.ok(seen.equalTime&&seen.unequalTime);
 assert.throws(()=>generateRatio('RP08','x',2));assert.throws(()=>generateRatio('RP99','x'));assert.throws(()=>generateRatio('RP01','x'.repeat(81)));
});
test('feedback detects unweighted speeds, wrong proportional direction and missing scale-unit conversion',()=>{
 assert.match(ratioFeedback({id:'RP04',model:{v1:60,v2:30,t1:30,t2:60},answer:'40'},'45').en,/times differ/);
 assert.match(ratioFeedback({id:'RP06',model:{workers1:4,hours1:6,workers2:8},answer:'3'},'12').en,/reciprocal/);
 assert.match(ratioFeedback({id:'RP05',model:{mass1:3,cost1:24,mass2:5},answer:'40'},'72/5').en,/same direction/);
 assert.match(ratioFeedback({id:'RP08',model:{mode:'actual',planTenths:30,scale:200},answer:'6'},'600').en,/centimetres/);
 assert.equal(ratioFeedback({id:'RP04',model:{},answer:'40'},'40'),null);
});
test('four bilingual lessons record fixed/generated models and numeric renaming cannot create fresh ratio concepts',()=>{
 assert.equal(ratioLessons.length,4);assert.match(ratioHub('en'),/eight families/);
 for(const l of ratioLessons){const exposed=recordedRatioExamples(['lesson:'+l.id+':v1']);for(const q of ratioLessonExamples(l))assert.ok(exposed.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh']){assert.match(ratioLessonView(l.id,lang),/ratios-lesson-check/);assert.ok(l.sections.length>=3);assert.ok(l.takeaway[lang].length>20);}}
 assert.equal(ratioExposureKey('RP01',{kind:'common-unit-ratio',gramsA:500,gramsB:750}),ratioExposureKey('RP01',{kind:'common-unit-ratio',gramsA:1000,gramsB:1500}));
 assert.equal(ratioExposureKey('RP07',{kind:'classification',rule:'offset',k:2,c:8}),ratioExposureKey('RP07',{kind:'classification',rule:'offset',k:6,c:15}));
 const exposed=recordedRatioExamples(ratioLessons.map(l=>'lesson:'+l.id+':v1')),s=avoidExposedExamples(createSession(ratioFamilies.map(f=>f.id),'fresh-ratios','check',8),[],exposed);
 for(let i=0;i<8;i++){const match=exposed.some(x=>x.exposureKey===s.items[i].exposureKey);assert.equal(Boolean(s.responses[i].priorExposure),match);}
 assert.equal(s.responses[6].priorExposure,true); // All five rule types were studied; not new independent evidence.
});
test('all eight rate/ratio answers keep manual reasons separate and edits clear self review',()=>{
 const s=createSession(ratioFamilies.map(f=>f.id),'ratio-score','check',8);for(let i=0;i<8;i++){answer(s,i,s.items[i].answer);setReason(s,i,'Units, ordered quantities and fixed condition');assert.equal(s.responses[i].manualReview,null);s.responses[i].solution=true;selfReviewReason(s,i);assert.equal(s.responses[i].manualReview,'self');setAnswerDraft(s,i,'edited');assert.equal(s.responses[i].manualReview,null);}
 const report=evidenceSummary(s);assert.equal(report.correct,8);assert.equal(report.automaticTotal,8);assert.equal(report.manualPending,8);
});
test('bilingual ratio papers retain snapshots, ordered choices, accessible givens and separate keys',async()=>{
 for(const lang of ['en','zh']){const p=createPaper(ratioFamilies.map(f=>f.id),'ratio-paper',8,lang);assert.deepEqual(validatePaper(p),p);const hash=await identity(p),student=renderPaper(p,hash),key=renderPaper(p,hash,true);assert.equal((student.match(/class="paper-question"/g)||[]).length,8);assert.ok(!student.includes('class="solution"'));assert.equal((key.match(/class="solution"/g)||[]).length,8);assert.ok(!key.includes('[object Object]'));assert.ok(key.includes(lang==='en'?'manual review':'人工'));assert.match(student,/ratio-model/);assert.match(student,/aria-label=/);}
});
