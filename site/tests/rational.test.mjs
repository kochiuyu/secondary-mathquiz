import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {generateRational,rationalFamilies,rationalExposureKey,rationalFeedback} from '../src/math/rational.mjs';
import {rationalLessons,recordedRationalExamples} from '../src/lessons/rational.mjs';
import {mark} from '../src/math/exact.mjs';
import {math,diagram} from '../src/renderers/math.mjs';
import {generate,families} from '../src/math/registry.mjs';
import {createSession,answer,avoidExposedExamples,evidenceSummary,setAnswerDraft,setReason,selfReviewReason,validateBackup} from '../src/app/session.mjs';
import {createPaper,validatePaper,canonical,identity} from '../src/papers/paper.mjs';
import {renderPaper,printableDocument} from '../src/papers/render.mjs';

test('four foundation families: 1,200 deterministic models independently checked for roots, classification and strict intervals',()=>{
 const cases=new Set(),rootCases=new Set();
 for(const f of rationalFamilies)for(let i=0;i<300;i++){
  const q=generateRational(f.id,'root-boundary-'+i),m=q.model;
  assert.deepEqual(q,generate(f.id,q.seed));assert.equal(q.version,1);assert.equal(mark(q.contract,q.answer).status,'correct');
  for(const field of ['prompt','hint','solution','reasonRubric'])for(const lang of ['en','zh'])assert.ok(q[field][lang]);
  assert.match(q.prompt.zh,/[\u3400-\u9fff]/);assert.ok(!q.prompt.zh.includes('\ufffd'));assert.ok(q.manualReason);
  if(f.id==='RI01'){
   const v=BigInt(q.answer);let power=1n;for(let j=0;j<m.n;j++)power*=v;assert.equal(power,BigInt(m.radicand));
   if(m.n%2===0)assert.ok(v>=0n);rootCases.add(m.base===0?'zero':m.base<0?'negative':'positive');
   assert.ok(m.n>=2&&m.n<=5&&Math.abs(m.base)<=8);
  }
  if(f.id==='RI02'){
   const result=m.kind==='square'?m.base*m.base:m.kind==='negative-root'?-m.base:m.base;assert.equal(q.answer,'value:'+result);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(q.options.filter(o=>o.id===q.answer).length,1);
  }
  if(f.id==='RI03'){
   cases.add(m.kind);assert.equal(q.answer,['pi','nonsquare-root'].includes(m.kind)?'irrational':'rational');
   if(m.kind==='recurring')assert.match(q.prompt.en,/repeats forever/);
   if(m.kind==='pi-decimal')assert.match(q.prompt.en,/exact finite decimal/);
  }
  if(f.id==='RI04'){
   assert.ok(m.k*m.k<m.radicand&&(m.k+1)*(m.k+1)>m.radicand);
   assert.equal(m.lower,m.negative?-m.k-1:m.k);assert.equal(q.answer,'interval:'+m.lower);
   assert.equal(new Set(q.options.map(o=>o.id)).size,4);
   assert.ok(!diagram(q).includes('<circle'),'unrevealed line must not locate the answer');
  }
 }
 assert.equal(cases.size,8);assert.equal(rootCases.size,3);assert.equal(families.filter(f=>!f.development).length,60);
 assert.throws(()=>generateRational('RI01','seed',2),/unavailable/);assert.throws(()=>generateRational('RI05','seed'),/Unknown/);
});

test('root notation and recurring decimals use native MathML without changing legacy polynomial rendering',()=>{
 assert.match(math('root(2,25)'),/<msqrt><mn>25/);assert.match(math('root(3,-8)'),/<mroot><mn>-8/);
 assert.match(math('-root(2,25)'),/<mo>−<\/mo><msqrt>/);assert.match(math('rec(0,27)'),/<mover/);
 assert.match(math('(-5)^2'),/<msup>/);assert.match(math('x^2+2x+1'),/<msup>/);
 assert.ok(!math('root(4,81)').includes('<mi>r</mi>'));assert.ok(!math('<script>').includes('<script>'));
 const square=Array.from({length:50},(_,i)=>generate('RI01','square-'+i)).find(q=>q.diagram);
 assert.ok(square);assert.match(diagram(square,'zh'),/正方形/);assert.ok(!diagram(square).includes('side length '+square.answer));
});

test('two bilingual lessons retain authored and generated exposure; numeric renaming is not a new classification concept',()=>{
 assert.equal(rationalLessons.length,2);
 for(const l of rationalLessons){assert.ok(l.sections.length>=4);for(const lang of ['en','zh'])for(const key of ['why','before','readiness','readinessAnswer','takeaway','next'])assert.ok(l[key][lang]);}
 assert.equal(rationalExposureKey('RI03',{kind:'fraction',n:2,d:3}),rationalExposureKey('RI03',{kind:'fraction',n:4,d:7}));
 const seen=recordedRationalExamples(['lesson:RI-L1:v1','lesson:RI-L2:v1']);assert.ok(seen.some(q=>q.id==='RI01'));assert.ok(seen.some(q=>q.id==='RI04'));
 const s=avoidExposedExamples(createSession(['RI03'],'classify-after-reading','check',4),[],seen);
 assert.ok(s.responses.every(r=>r.priorExposure));
 const negativeEven=Array.from({length:50},(_,i)=>generate('RI01','sign-'+i)).find(q=>q.model.n%2===0&&q.model.base>0);
 assert.match(rationalFeedback(negativeEven,String(-negativeEven.model.base)).en,/nonnegative/);
});

test('foundation answers preserve manual reasoning, draft invalidation and backward-compatible backup validation',()=>{
 const s=createSession(rationalFamilies.map(f=>f.id),'rational-state','check',4);
 s.items.forEach((q,i)=>{answer(s,i,q.answer);setReason(s,i,'Check the exact definition or powers.');s.responses[i].solution=true;selfReviewReason(s,i);});
 assert.deepEqual(evidenceSummary(s),{correct:4,attempted:4,independentCorrect:4,assisted:4,manualPending:0,selfReviewed:4,automaticTotal:4,manualSubmitted:0});
 setAnswerDraft(s,0,'changed');assert.equal(s.responses[0].manualReview,null);setReason(s,1,'A different explanation');assert.equal(s.responses[1].manualReview,null);
 validateBackup({kind:'secondary-mathquiz-progress',schema:1,profile:{name:'Root learner',sessions:[s],studied:[]}});
 const bad=structuredClone(s);bad.items[0].answer='unverified';assert.throws(()=>validateBackup({kind:'secondary-mathquiz-progress',schema:1,profile:{name:'Root learner',sessions:[bad],studied:[]}}),/snapshot/);
});

test('bilingual foundation papers keep reproducible root models, native notation and separate review keys',async()=>{
 for(const lang of ['en','zh']){
  const p=createPaper(rationalFamilies.map(f=>f.id),'rational-paper',4,lang),before=canonical(p);validatePaper(p);assert.equal(canonical(p),before);
  const hash=await identity(p),student=renderPaper(p,hash),key=renderPaper(p,hash,true);
  assert.match(student,/<m(?:s?q)?root|<msqrt/);assert.ok(!student.includes('class="solution"'));assert.ok(key.includes('class="solution"'));
  assert.ok(printableDocument(p,hash,false).includes(lang==='zh'?'zh-Hant':'lang="en"'));
  assert.deepEqual(p.items.map(i=>i.question.id),['RI01','RI02','RI03','RI04']);
 }
});

test('Unit 4 readiness fields, edges and generated catalogue agree while classifications and all planned states remain',()=>{
 const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
 const ledger=read('../curriculum/objectives.json'),catalogue=read('../curriculum/catalogue.json'),edges=read('../curriculum/prerequisites.json').edges;
 assert.equal(ledger.records.length,237);assert.ok(ledger.records.every(r=>r.coverage_state==='planned'));
 const expected=['foundation','foundation','non-foundation','enrichment'];
 for(let n=1;n<=4;n++){
  const id='JS-4-'+n,r=ledger.records.find(r=>r.id===id),c=catalogue.records.find(r=>r.id===id);
  assert.equal(r.official_classification,expected[n-1]);assert.equal(r.suggested_route,'S3');
  assert.ok(!r.prerequisites.required.includes('JS-10-3'));assert.deepEqual(c.prerequisites.required,r.prerequisites.required);
  for(const type of ['required','helpful'])assert.deepEqual(edges.filter(e=>e.to===id&&e.type===type).map(e=>e.from),r.prerequisites[type]);
 }
});
