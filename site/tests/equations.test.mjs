import test from 'node:test';
import assert from 'node:assert/strict';
import {Q,scalar,mark,parse} from '../src/math/exact.mjs';
import {equationFamilies,generateEquation} from '../src/math/equations.mjs';
import {generate} from '../src/math/registry.mjs';
import {equationLessons,equationLessonExamples,recordedEquationExamples} from '../src/lessons/equations.mjs';
import {equationHub,equationLessonView} from '../src/app/equation-views.mjs';
import {createSession,answer,evidenceSummary,setReason,selfReviewReason,validateSession,avoidExposedExamples} from '../src/app/session.mjs';
import {createPaper,identity,validatePaper} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
import {diagram,optionLabel} from '../src/renderers/math.mjs';
const nq=n=>new Q(n),minus=(a,b)=>a.add(b.neg());
function equationRoot(text){const sides=text.split('=');assert.equal(sides.length,2);const [l,r]=sides.map(parse),coefficient=minus(l[1],r[1]);assert.notEqual(coefficient.n,0n);return minus(r[0],l[0]).div(coefficient);}
test('six equation families: 1,800 deterministic cases independently checked, one solution and distinct choice meanings',()=>{
 const trueFalse=new Set(),fractions=new Set(),signs=new Set();
 for(const f of equationFamilies)for(let i=0;i<300;i++){
  const q=generateEquation(f.id,'equation-review-'+i),m=q.model;assert.deepEqual(q,generate(q.id,q.seed,q.version));assert.equal(mark(q.contract,q.answer).status,'correct');assert.equal(q.version,1);assert.ok(q.prompt.en&&/[\u3400-\u9fff]/.test(q.prompt.zh));
  if(q.id==='EQ01'){const left=nq(m.a).mul(scalar(m.candidate)).add(nq(m.b));assert.equal(q.answer,left.eq(scalar(m.c))?'yes':'no');trueFalse.add(q.answer);assert.notEqual(m.a,0);}
  if(q.id==='EQ02'){const root=minus(scalar(m.c),nq(m.b)).div(nq(m.a));assert.ok(root.eq(scalar(q.answer)));fractions.add(String(root.d));signs.add(Math.sign(m.a));assert.ok(equationRoot(q.math).eq(root));assert.equal(mark(q.contract,root.add(nq(1)).toString()).status,'incorrect');}
  if(q.id==='EQ03'){const original=nq(m.c).div(nq(m.a)).add(nq(m.b));const roots=q.options.map(o=>[o.id,equationRoot(optionLabel(o))]);assert.equal(roots.filter(([,r])=>r.eq(original)).length,1);assert.ok(roots.find(([id])=>id===q.answer)[1].eq(original));assert.ok(q.manualReason);}
  if(q.id==='EQ04'){assert.notEqual(m.a,m.d);const root=minus(scalar(m.e),nq(m.a*m.b+m.c)).div(nq(m.a-m.d));assert.ok(root.eq(scalar(q.answer)));const left=nq(m.a).mul(root.add(nq(m.b))).add(nq(m.c)),right=nq(m.d).mul(root).add(scalar(m.e));assert.ok(left.eq(right));assert.ok(equationRoot(q.math).eq(root));}
  if(q.id==='EQ05'){const root=minus(scalar(m.total),nq(m.fixed)).div(nq(m.rate));assert.equal(root.d,1n);assert.ok(root.n>=2n);assert.equal(q.options.filter(o=>equationRoot(optionLabel(o)).eq(root)).length,1);assert.ok(equationRoot(optionLabel(q.options.find(o=>o.id===q.answer))).eq(root));}
  if(q.id==='EQ06'){const root=minus(scalar(m.total),nq(m.fixed)).div(nq(m.rate));assert.ok(root.eq(scalar(q.answer)));assert.equal(root.mul(nq(2)).d,1n);assert.ok(root.n>0n);assert.ok(q.manualReason);assert.equal(q.answerUnit.en,'hours');}
  assert.ok(q.exposureKey.startsWith(q.id+':'));assert.doesNotMatch(JSON.stringify(q),/NaN|Infinity/);
 }
 assert.deepEqual([...trueFalse].sort(),['no','yes']);assert.deepEqual([...signs].sort(),[-1,1]);assert.ok(fractions.has('2')&&fractions.has('3')&&fractions.has('4'));
});
test('equation version/input guards and scalar contracts do not accept equation strings as computed reasoning',()=>{
 assert.throws(()=>generateEquation('EQ99','x'));assert.throws(()=>generateEquation('EQ02','x',2));assert.throws(()=>generateEquation('EQ02','x'.repeat(81)));
 const q=generateEquation('EQ02','scalar');assert.equal(mark(q.contract,'3x+1=7').status,'unsupported');assert.notEqual(mark(q.contract,'alert(1)').status,'correct');
});
test('three bilingual equation lessons record generated and authored examples before fresh checks',()=>{
 assert.equal(equationLessons.length,3);
 for(const l of equationLessons){assert.equal(l.sections.length,3);assert.equal(equationLessonExamples(l).length,2);const exposure=recordedEquationExamples(['lesson:'+l.id+':v1']);assert.equal(exposure.length,4);for(const q of equationLessonExamples(l))assert.ok(exposure.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh']){assert.equal(l.goals[lang].length,3);assert.ok(l.readinessAnswer[lang]);const html=equationLessonView(l.id,lang);assert.match(html,/lesson-roadmap/);assert.match(html,/equation-lesson-check/);assert.match(html,/lesson-takeaway/);assert.doesNotMatch(html,/undefined|NaN/);}}
 assert.match(equationHub('en'),/exactly one solution/);assert.match(equationHub('zh'),/恰有一個解/);
 const session=createSession(['EQ01','EQ02'],'equation-fresh','check',4);const seen=[...session.items];avoidExposedExamples(session,[],seen);assert.ok(session.items.every(q=>!seen.some(x=>x.exposureKey===q.exposureKey)));
});
test('equation selections and final values keep written reasons separate; edits invalidate self review',()=>{
 const s=createSession(equationFamilies.map(f=>f.id),'equation-evidence','check',6);
 s.items.forEach((q,i)=>{answer(s,i,q.answer);if(q.manualReason){setReason(s,i,'I substitute into the original equation and interpret the units.');s.responses[i].solution=true;selfReviewReason(s,i);}});
 const summary=evidenceSummary(s);assert.equal(summary.correct,6);assert.equal(summary.selfReviewed,4);assert.equal(summary.automaticTotal,6);validateSession(s);
 setReason(s,2,'A revised explanation');assert.equal(s.responses[2].manualReview,null);assert.equal(evidenceSummary(s).selfReviewed,3);
 const clone=structuredClone(s);clone.items[3].model.e='1000';assert.throws(()=>validateSession(clone));
});
test('equation diagrams preserve givens without pre-revealing answer judgements and paper choices retain identities',async()=>{
 const check=generateEquation('EQ01','diagrams');const html=diagram(check,'en');assert.match(html,/Original left side after substitution/);assert.match(html,/do not pre-judge equality/);assert.doesNotMatch(html,/undefined|NaN/);
 const spec=createPaper(equationFamilies.map(f=>f.id),'equation-paper',6,'zh');const hash=await identity(spec);validatePaper(spec);const student=renderPaper(spec,hash,false),key=renderPaper(spec,hash,true);
 assert.equal((student.match(/class="paper-question"/g)||[]).length,6);assert.match(key,/人工/);assert.match(student,/費用資料/);assert.doesNotMatch(key,/undefined|NaN|\[object Object\]/);assert.notEqual(await identity({...spec,lang:'en'}),hash);
 const tampered=structuredClone(spec);tampered.items[1].question.answer='999';assert.throws(()=>validatePaper(tampered));
});
