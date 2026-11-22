import test from 'node:test';
import assert from 'node:assert/strict';
import {generateExpression,expressionFamilies,sequenceValue} from '../src/math/expressions.mjs';
import {generate} from '../src/math/registry.mjs';
import {mark,scalar,equivalent} from '../src/math/exact.mjs';
import {expressionLessons,expressionLessonExamples,recordedExpressionExamples} from '../src/lessons/expressions.mjs';
import {expressionHub,expressionLessonView} from '../src/app/expression-views.mjs';
import {createSession,answer,evidenceSummary,selfReviewReason,setAnswerDraft,setReason,validateSession,avoidExposedExamples} from '../src/app/session.mjs';
import {math,optionLabel,escape,diagram} from '../src/renderers/math.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';

test('six expression families: 1,800 generated cases with exact independent rules, distinct options and explicit manual states',()=>{
 const rules=new Set(),indices=new Set(),shapes=new Set(),modes=new Set();
 for(const f of expressionFamilies)for(let i=0;i<300;i++){
  const q=generateExpression(f.id,'expression-review-'+i),m=q.model;assert.deepEqual(q,generate(q.id,q.seed,q.version));assert.equal(q.version,1);
  assert.equal(mark(q.contract,q.answer).status,f.contract==='manual'?'manual':'correct');
  if(q.id==='EX01'){
   const expected=m.mode==='scale-sum'?`${m.a}x+${m.a*m.b}`:m.mode==='less-than'?`${m.a}x-${m.b}`:`${m.b}-${m.a}x`;
   assert.ok(equivalent(q.answer,expected));assert.equal(q.contract.form,undefined);modes.add(m.mode);
   const wrong=m.mode==='scale-sum'?`${m.a}x+${m.b}`:m.mode==='less-than'?`${m.b}-${m.a}x`:`${m.a}x-${m.b}`;assert.equal(mark(q.contract,wrong).status,'incorrect');
  }
  if(q.id==='EX02'){
   assert.equal(q.options.filter(o=>o.id===q.answer).length,1);for(const lang of ['en','zh'])assert.equal(new Set(q.options.map(o=>optionLabel(o,lang))).size,3);
   if(m.mode==='grouped'){assert.ok(!equivalent(`${m.a}*(x+${m.b})`,`${m.a}x+${m.b}`));assert.ok(!equivalent(`${m.a}*(x+${m.b})`,`${m.a}*(x-${m.b})`));}
   assert.equal(mark(q.contract,q.options.find(o=>o.id!==q.answer).id).status,'incorrect');
  }
  if(q.id==='EX03'){shapes.add(m.shape);assert.equal(q.contract.type,'manual');assert.ok(q.reasonRubric.en.includes('Manual'));assert.equal(q.answer,m.shape==='triangle'?'b*h/2':'b*h');assert.equal(mark(q.contract,'any unverified proposal').status,'manual');}
  if(q.id==='EX04'){
   const value=n=>m.rule==='odd'?2*n-1:m.rule==='even'?2*n:m.rule==='square'?n*n:n*(n+1)/2;
   assert.deepEqual(m.terms,[0,1,2,3].map(k=>value(m.start+k)));assert.equal(Number(q.answer),value(m.start+4));assert.equal(q.nonUnique,true);assert.equal(mark(q.contract,'999').status,'manual');
  }
  if(q.id==='EX05'){
   const n=m.n,value=m.rule==='odd'?2*n-1:m.rule==='even'?2*n:m.rule==='square'?n*n:n*(n+1)/2;assert.equal(Number(q.answer),value);rules.add(m.rule);indices.add(n);
   assert.equal(mark(q.contract,String(value+1)).status,'incorrect');
  }
  if(q.id==='EX06'){assert.equal(Number(q.answer),(m.rule==='affine'?m.a*m.input:m.input*m.input)+m.b);assert.equal(mark(q.contract,String(Number(q.answer)+1)).status,'incorrect');}
  for(const field of ['prompt','hint','solution'])for(const lang of ['en','zh'])assert.ok(q[field][lang].trim());
 }
 assert.equal(rules.size,4);assert.equal(indices.size,12);assert.equal(shapes.size,2);assert.equal(modes.size,3);
 assert.throws(()=>generateExpression('EX01','bad',2),/unavailable/);assert.throws(()=>sequenceValue('square',0));
});
test('a finite sequence prefix has another consistent continuation; automatic/manual contracts remain different',()=>{
 const q=generate('EX04','nonunique');const offset=q.model.start;
 const base=n=>sequenceValue(q.model.rule,offset+n-1),alternate=n=>base(n)+(n-1)*(n-2)*(n-3)*(n-4)/24;
 assert.deepEqual([1,2,3,4].map(alternate),q.model.terms);assert.equal(alternate(5),Number(q.answer)+1);
 assert.equal(mark(q.contract,String(alternate(5))).status,'manual');
 const exact=generate('EX05','specified-rule');assert.equal(mark(exact.contract,String(Number(exact.answer)+1)).status,'incorrect');
});
test('manual responses are excluded from automatic score and fresh correctness; edits invalidate review and snapshots remain valid',()=>{
 const s=createSession(['EX01','EX02','EX03','EX04','EX05','EX06'],'manual-accounting','check',6);
 s.items.forEach((q,i)=>{answer(s,i,q.answer);if(q.manualReason)setReason(s,i,'My formula or rule fits the quantities and all givens.');});
 let report=evidenceSummary(s);assert.equal(report.automaticTotal,4);assert.equal(report.correct,4);assert.equal(report.independentCorrect,4);assert.equal(report.manualSubmitted,2);assert.equal(report.manualPending,2);
 s.responses[2].solution=true;selfReviewReason(s,2);assert.equal(evidenceSummary(s).selfReviewed,1);
 setAnswerDraft(s,2,'a different formula');assert.equal(s.responses[2].manualReview,null);assert.throws(()=>selfReviewReason(s,2),/current answer/);
 answer(s,2,'a different formula');selfReviewReason(s,2);setReason(s,2,'Changed explanation');assert.equal(s.responses[2].manualReview,null);assert.equal(evidenceSummary(s).independentCorrect,4);validateSession(s);
 assert.throws(()=>setAnswerDraft(s,2,'x'.repeat(201)),/200/);
 const only=createSession(['EX03','EX04'],'manual-only','check',2);only.items.forEach((q,i)=>answer(only,i,q.answer));assert.equal(evidenceSummary(only).automaticTotal,0);assert.equal(evidenceSummary(only).correct,0);
});
test('expression lesson exposure includes static/generated models and all three bilingual lesson paths',()=>{
 const studied=expressionLessons.map(l=>'lesson:'+l.id+':v1'),exposed=recordedExpressionExamples(studied),keys=new Set(exposed.map(q=>q.exposureKey));
 assert.equal(expressionLessons.length,3);assert.ok(keys.has('EX03:'+JSON.stringify({kind:'area-formula',shape:'triangle'})));
 for(const lang of ['en','zh'])for(const l of expressionLessons){const html=expressionLessonView(l.id,lang);assert.ok(html.includes(l.title[lang]));assert.ok(html.includes(l.takeaway[lang]));assert.equal((html.match(/class="lesson-model"/g)||[]).length,expressionLessonExamples(l).length);assert.match(html,/expression-lesson-check/);assert.ok(expressionHub(lang).includes('#lesson/'+l.id));}
 const s=createSession(['EX03'],'formulas-seen','check',1);avoidExposedExamples(s,[],exposed);assert.equal(s.responses[0].priorExposure,true);validateSession(s);
});
test('MathML letters, square/subscript semantics, bilingual options and non-answer diagrams render safely',()=>{
 assert.match(math('aₙ = n²'),/<msub>/);assert.match(math('aₙ = n²'),/<msup>/);assert.match(math('bh'),/<mi>b<\/mi><mi>h<\/mi>/);assert.match(math('x^2'),/<msup>/);
 assert.ok(!math('<script>').includes('<script>'));assert.equal(optionLabel({label:'legacy'},'zh'),'legacy');
 for(const id of ['EX03','EX04','EX05','EX06'])for(const lang of ['en','zh']){const q=generate(id,'diagram-check'),html=diagram(q,lang);assert.ok(html.length>20);assert.ok(!/NaN|Infinity/.test(html));if(id==='EX04')assert.ok(!html.includes(q.answer+'</text>'));}
});
test('expression papers retain all six versioned models, translated choices and manual rubrics; no unique correctness claim for proposals',async()=>{
 for(const lang of ['en','zh']){
  const p=createPaper(expressionFamilies.map(f=>f.id),'expressions-paper',6,lang);p.items.forEach(i=>i.lines=6);validatePaper(p);const hash=await identity(p);assert.equal(hash,await identity(structuredClone(p)));
  const student=renderPaper(p,hash),key=renderPaper(p,hash,true);assert.equal((student.match(/paper-question/g)||[]).length,6);assert.equal((key.match(/paper-question/g)||[]).length,6);
  assert.ok(!student.includes('[object Object]'));assert.ok(key.includes(lang==='zh'?'全題 3 分需人工評閱':'All 3 marks require manual review'));assert.ok(!key.includes('180° straight-line'));
  for(const item of p.items){assert.ok(key.includes(escape(item.question.solution[lang])));if(item.question.options)for(const option of item.question.options)assert.ok(student.includes(escape(optionLabel(option,lang))));}
  const bad=structuredClone(p);bad.items[3].question.nonUnique=false;assert.throws(()=>validatePaper(bad),/snapshot/);
 }
});
