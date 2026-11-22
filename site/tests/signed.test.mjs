import test from 'node:test';
import assert from 'node:assert/strict';
import {generateCurriculum,curriculumFamilies,validateSigned} from '../src/math/signed.mjs';
import {generate,families} from '../src/math/registry.mjs';
import {scalar,mark} from '../src/math/exact.mjs';
import {numberLineModel,signedNumberLine} from '../src/renderers/number-line.mjs';
import {signedLessons,lessonExamples,recordedLessonExamples} from '../src/lessons/signed.mjs';
import {signedHub,signedLessonView} from '../src/app/signed-views.mjs';
import {signedFeedback} from '../src/math/signed-feedback.mjs';
import {createSession,avoidExposedExamples,validateSession,evidenceSummary,answer,selfReviewReason} from '../src/app/session.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper,printableDocument,paginate} from '../src/papers/render.mjs';
import {escape} from '../src/renderers/math.mjs';

test('six curriculum families: 1,800 deterministic variants, independent model arithmetic and negative answers',()=>{
 const seen={zero:false,negative:false,fraction:false,subtractNegative:false,divide:false};
 for(const f of curriculumFamilies)for(let i=0;i<300;i++){
  const q=generateCurriculum(f.id,'signed-review-'+i),m=q.model;
  assert.deepEqual(q,generate(f.id,'signed-review-'+i));assert.equal(q.version,1);
  assert.equal(mark(q.contract,q.answer).status,'correct');
  let numerator,denominator=1;
  if(f.id==='SN01'){numerator=m.magnitude*m.direction;seen.zero||=m.magnitude===0;}
  if(f.id==='SN02'){
   const fraction=s=>{const [a,b='1']=s.split('/');return [Number(a),Number(b)];},[a,b]=fraction(m.a),[c,d]=fraction(m.b);
   assert.notEqual(a*d,c*b);assert.equal(q.answer,a*d>c*b?'left':'right');
   assert.ok(Math.abs(a/b)<=12&&Math.abs(c/d)<=12);assert.equal(mark(q.contract,q.answer==='left'?'right':'left').status,'incorrect');
   continue;
  }
  if(f.id==='SN03'){numerator=m.a+(m.operation==='add'?m.b:-m.b);seen.subtractNegative||=m.operation==='subtract'&&m.b<0;}
  if(f.id==='SN04'){numerator=m.operation==='divide'?m.a:m.a*m.b;denominator=m.operation==='divide'?m.b:1;assert.notEqual(denominator,0);seen.divide||=m.operation==='divide';}
  if(f.id==='SN05'){numerator=m.a+m.b*m.c;denominator=m.d;assert.notEqual(denominator,0);}
  if(f.id==='SN06'){numerator=m.final-m.initial;assert.ok(m.initial>=-15&&m.initial<=15&&m.final>=-15&&m.final<=15);assert.notEqual(m.initial,m.final);assert.equal(m.initial+Number(q.answer),m.final);}
  const [a,b='1']=q.answer.split('/');assert.ok(Number(a)*denominator===numerator*Number(b));
  const wrong=scalar(q.answer).add(scalar('1')).toString();assert.equal(mark(q.contract,wrong).status,'incorrect');
  seen.negative||=Number(a)/Number(b)<0;seen.fraction||=Number(b)!==1;
  assert.equal(q.contract.form,'number-literal');for(const lang of ['en','zh'])for(const field of ['prompt','hint','solution'])assert.ok(q[field][lang].length>0);
 }
 assert.ok(Object.values(seen).every(Boolean),JSON.stringify(seen));
 assert.throws(()=>generateCurriculum('SN01','version',2),/unavailable/);assert.throws(()=>generateCurriculum('SN00','bad'),/Unknown/);
 assert.equal(families.filter(f=>f.development).length,6);
});
test('number lines preserve exact scales, valid bounds, movement direction and non-answer text alternatives',()=>{
 for(const id of ['SN01','SN02','SN03','SN06'])for(let i=0;i<80;i++){
  const q=generate(id,'line-review-'+i),m=numberLineModel(q);
  assert.ok(m.minimum<m.maximum&&m.ticks.length<=15);
  const distances=m.ticks.slice(1).map((v,i)=>m.position(v)-m.position(m.ticks[i]));assert.ok(distances.every(x=>Math.abs(x-distances[0])<1e-8));
  assert.ok(m.points.every(p=>p.x>=28&&p.x<=452));
  if(m.movement){assert.ok(m.movement.start>=28&&m.movement.start<=452&&m.movement.end>=28&&m.movement.end<=452);assert.equal(Math.sign(m.movement.end-m.movement.start)||0,Math.sign(q.diagram.movement.delta)||0);}
  for(const lang of ['en','zh']){const svg=signedNumberLine(q,lang);assert.ok(!/NaN|Infinity/.test(svg));assert.match(svg,/aria-label=/);assert.match(svg,/<figcaption>/);}
 }
});
test('lesson exposure includes generated and static models before independent checks; exhausted examples stay practice evidence',()=>{
 const studied=signedLessons.map(l=>'lesson:'+l.id+':v1'),exposed=recordedLessonExamples(studied),keys=new Set(exposed.map(q=>q.exposureKey));
 assert.equal(signedLessons.length,3);assert.equal(lessonExamples(signedLessons[0]).length,2);
 assert.ok(keys.has('SN03:'+JSON.stringify({kind:'movement',a:-4,b:-7,operation:'subtract'})));
 const s=createSession(['SN01','SN02','SN03','SN04','SN05','SN06'],'exposure-check','check',12);
 avoidExposedExamples(s,[],exposed);for(const [i,q] of s.items.entries())assert.ok(!keys.has(q.exposureKey)||s.responses[i].priorExposure);
 validateSession(s);
 const repeated=createSession(['SN01'],'repeated','check',1),all=[];
 all.push(repeated.items[0]);for(let i=1;i<=40;i++)all.push(generate('SN01',`repeated:0:retry-${i}`));
 avoidExposedExamples(repeated,[],all);assert.equal(repeated.responses[0].priorExposure,true);answer(repeated,0,repeated.items[0].answer);assert.equal(evidenceSummary(repeated).independentCorrect,0);
});
test('all three bilingual lessons have overview, readiness, explanation, models, takeaways and separate practice/check routes',()=>{
 for(const lang of ['en','zh']){
  const hub=signedHub(lang,[]);for(const l of signedLessons){assert.ok(hub.includes('#lesson/'+l.id));const html=signedLessonView(l.id,lang);assert.ok(html.includes(l.title[lang]));assert.ok(html.includes(l.takeaway[lang]));assert.match(html,/data-action="lesson-practice"/);assert.match(html,/data-action="lesson-check"/);assert.equal((html.match(/class="lesson-model"/g)||[]).length,2);assert.equal((html.match(/aria-current="step"/g)||[]).length,1);}
 }
 assert.equal(signedLessonView('unknown','en'),'');
});
test('specific feedback only describes checked answer patterns; contextual reasoning stays separate',()=>{
 let q;for(let i=0;i<500;i++){q=generate('SN06','feedback-'+i);if(q.model.initial!==0&&q.model.final!==Number(q.answer))break;}
 assert.ok(signedFeedback(q,String(q.model.final)).en.includes('final temperature'));
 assert.equal(signedFeedback(q,'alert(1)'),null);
 const s=createSession(['SN06'],'reason-evidence','check',1);answer(s,0,s.items[0].answer);assert.equal(evidenceSummary(s).manualPending,1);assert.throws(()=>selfReviewReason(s,0));
 const broken=structuredClone(q);broken.answer='999';assert.throws(()=>validateSigned(broken),/mismatch/);
});
test('curriculum paper snapshots and backups retain versioned models and matching bilingual keys',async()=>{
 for(const lang of ['en','zh']){
  const p=createPaper(curriculumFamilies.map(f=>f.id),'signed-paper',6,lang);p.items.forEach(i=>i.lines=6);validatePaper(p);
  const original=await identity(p);assert.equal(await identity(validatePaper(structuredClone(p))),original);
  const student=renderPaper(p,original),key=renderPaper(p,original,true);assert.equal((student.match(/paper-question/g)||[]).length,6);assert.equal((key.match(/paper-question/g)||[]).length,6);
  assert.equal(p.items.map(i=>i.question.id).join(','),'SN01,SN02,SN03,SN04,SN05,SN06');
  for(const item of p.items){assert.ok(key.includes(escape(item.question.solution[lang])));assert.equal(mark(item.question.contract,item.question.answer).status,'correct');if(item.question.options){const letter=String.fromCharCode(65+item.question.options.findIndex(o=>o.id===item.question.answer));assert.ok(key.includes((lang==='zh'?'正確選項':'Correct option')+': '+letter));}}
  assert.ok(!student.includes('LEFT.')&&!student.includes('RIGHT.'));
  assert.ok(paginate(p).every(page=>page.items.length<=3));assert.ok(paginate(p).length>=3);assert.match(printableDocument(p,original,false),/signed-numberline/);
  const changed=structuredClone(p);changed.items[0].question.model.magnitude=999;assert.throws(()=>validatePaper(changed),/snapshot/);
 }
});
