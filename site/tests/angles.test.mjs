import test from 'node:test';
import assert from 'node:assert/strict';
import {angleFamilies,generateAngle,angleExposureKey} from '../src/math/angles.mjs';
import {geometryScene,geometryTriangle,geometryTransform} from '../src/math/angle-geometry.mjs';
import {generate} from '../src/math/registry.mjs';
import {mark} from '../src/math/exact.mjs';
import {angleLessons,angleLessonExamples,recordedAngleExamples} from '../src/lessons/angles.mjs';
import {angleHub,angleLessonView} from '../src/app/angle-views.mjs';
import {diagram} from '../src/renderers/math.mjs';
import {createSession,answer,evidenceSummary,setReason,selfReviewReason,setAnswerDraft,avoidExposedExamples,validateSession} from '../src/app/session.mjs';
import {createPaper,identity,validatePaper} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
function vectorAngle(p,v,q){const a=[p[0]-v[0],p[1]-v[1]],b=[q[0]-v[0],q[1]-v[1]];return Math.acos(Math.max(-1,Math.min(1,(a[0]*b[0]+a[1]*b[1])/(Math.hypot(...a)*Math.hypot(...b)))))*180/Math.PI;}
test('six geometry families: 1,800 deterministic cases with independent angle and parallel conditions',()=>{
 const modes=new Set(),pairs=new Set(),tests=new Set(),triangles=new Set();
 for(const f of angleFamilies)for(let i=0;i<300;i++){
  const q=generateAngle(f.id,'angle-review-'+i),m=q.model;assert.deepEqual(q,generate(q.id,q.seed,q.version));assert.equal(mark(q.contract,q.answer).status,q.id==='GE06'?'manual':'correct');assert.equal(q.version,1);assert.ok(/[\u3400-\u9fff]/.test(q.prompt.zh));
  if(q.id==='GE01'){modes.add(m.mode);const n=m.mode==='vertical'?m.a:m.mode==='point'?360-m.a-m.b:m.mode==='complementary'?90-m.a:180-m.a;assert.equal(q.answer,String(n));assert.ok(n>0&&n<360);}
  if(q.id==='GE02'){pairs.add(m.pair);assert.notEqual(m.phiA,m.phiB);if(m.pair==='corresponding')assert.equal(m.p,m.q);if(m.pair==='alternate')assert.ok((m.p===2&&m.q===0)||(m.p===3&&m.q===1));if(m.pair==='same')assert.ok((m.p===2&&m.q===1)||(m.p===3&&m.q===0));assert.equal(m.parallelGiven,false);}
  if(q.id==='GE03'){assert.equal(m.phiA,m.phiB);assert.equal(m.parallelGiven,true);const known=m.p%2?90+m.phiA:90-m.phiA,target=m.q%2?90+m.phiB:90-m.phiB;assert.equal(q.answer,String(target));if(['corresponding','alternate'].includes(m.pair))assert.equal(known,target);else assert.equal(known+target,180);}
  if(q.id==='GE04'){const a=m.p%2?90+m.phiA:90-m.phiA,b=m.q%2?90+(m.vertical?m.phiA:m.phiB):90-(m.vertical?m.phiA:m.phiB);const expected=m.vertical?'insufficient':(m.pair==='same'?a+b===180:a===b)?'yes':'no';assert.equal(q.answer,expected);tests.add(expected);assert.equal(m.parallelGiven,false);}
  if(q.id==='GE05'){assert.equal(m.A+m.B+m.C,180);assert.ok(Math.min(m.A,m.B,m.C)>=20);triangles.add(Math.max(m.A,m.B,m.C)>90?'obtuse':'non-obtuse');assert.equal(q.answer,String(m.target==='interior'?m.C:m.A+m.B));}
  if(q.id==='GE06'){assert.equal(q.contract.type,'manual');assert.equal(mark(q.contract,'180').status,'manual');assert.ok(q.manualReason);assert.match(q.reasonRubric.en,/entire proof/);}
 }
 assert.equal(modes.size,5);assert.equal(pairs.size,3);assert.deepEqual([...tests].sort(),['insufficient','no','yes']);assert.equal(triangles.size,2);
});
test('ray geometry, triangle coordinates, rotation/reflection and premise marks agree with labelled angles',()=>{
 for(const f of angleFamilies)for(let i=0;i<80;i++){
  const q=generateAngle(f.id,'geometry-vectors-'+i),m=q.model,s=geometryScene(m);assert.equal(s.parallel.length,['GE03','GE06'].includes(q.id)?2:0);
  if(['GE02','GE03','GE04'].includes(q.id)){
   const p=s.arcs.find(a=>a.label==='P'),qArc=s.arcs.find(a=>a.label==='Q');near(p.end-p.start,m.p%2?90+m.phiA:90-m.phiA);const phi=m.vertical?m.phiA:m.phiB;near(qArc.end-qArc.start,m.q%2?90+phi:90-phi);
   if(q.id==='GE02'){const textSides=[...q.prompt.en.matchAll(/on the (right|left) of directed t/g)].map(x=>x[1]);assert.equal(textSides.length,2);const t=geometryTransform([0,1],m.rotation,m.reflected);[p,qArc].forEach((a,j)=>{const mid=(a.start+a.end)/2*Math.PI/180,v=geometryTransform([Math.cos(mid),Math.sin(mid)],m.rotation,m.reflected);assert.equal(textSides[j],t[0]*v[1]-t[1]*v[0]<0?'right':'left');});}
  }
  for(const arc of s.arcs){assert.ok(arc.end>arc.start&&arc.end-arc.start<360);if(/^\d+°$/.test(arc.label))near(arc.end-arc.start,parseFloat(arc.label));}
  if(q.id==='GE01'&&m.mode==='point')near(s.arcs.reduce((n,a)=>n+a.end-a.start,0),360);
  if(['GE05','GE06'].includes(q.id)){
   const t=geometryTriangle(m.B,m.C),p=Object.fromEntries(Object.entries(t).map(([name,v])=>[name,geometryTransform(v,m.rotation,m.reflected)]));near(vectorAngle(p.B,p.A,p.C),m.A);near(vectorAngle(p.A,p.B,p.C),m.B);near(vectorAngle(p.A,p.C,p.B),m.C);
   if(q.id==='GE06'){near(s.arcs.find(a=>a.label==='p').end-s.arcs.find(a=>a.label==='p').start,m.B);near(s.arcs.find(a=>a.label==='q').end-s.arcs.find(a=>a.label==='q').start,m.C);near(s.arcs.find(a=>a.label==='E').end-s.arcs.find(a=>a.label==='E').start,m.A+m.B);}
  }
  const svg=diagram(q,'en');assert.doesNotMatch(svg,/NaN|undefined|Infinity/);assert.match(svg,/viewBox="0 0 480 340"/);for(const hit of svg.matchAll(/<text x="([\d.-]+)" y="([\d.-]+)"/g)){assert.ok(+hit[1]>=35&&+hit[1]<=445);assert.ok(+hit[2]>=35&&+hit[2]<=310);}
 }
});
test('appearance-only changes and general-proof redraws never count as fresh questions',()=>{
 for(const id of ['GE01','GE02','GE03','GE04','GE05']){const q=generateAngle(id,'appearance');assert.equal(q.exposureKey,angleExposureKey(id,{...q.model,rotation:(q.model.rotation+90)%360,reflected:!q.model.reflected}));}
 const pair=generateAngle('GE02','positions');assert.equal(pair.exposureKey,angleExposureKey(pair.id,{...pair.model,phiA:pair.model.phiA+1,phiB:pair.model.phiB+2}));
 const proofs=Array.from({length:30},(_,i)=>generateAngle('GE06','proof-shape-'+i));assert.equal(new Set(proofs.map(q=>q.exposureKey)).size,1);
 const session=createSession(['GE06'],'proof-exposure','check',1);avoidExposedExamples(session,[],recordedAngleExamples(['lesson:GE-L3:v1']));assert.equal(session.responses[0].priorExposure,true);
});
test('all three bilingual angle lessons retain fixed/generated exposure, full explanations and separate checks',()=>{
 assert.equal(angleLessons.length,3);
 for(const l of angleLessons){assert.equal(l.sections.length,3);assert.equal(angleLessonExamples(l).length,2);const recorded=recordedAngleExamples(['lesson:'+l.id+':v1']);assert.ok(recorded.length>=5);for(const q of angleLessonExamples(l))assert.ok(recorded.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh']){assert.equal(l.goals[lang].length,3);assert.ok(l.readinessAnswer[lang]);const html=angleLessonView(l.id,lang);assert.match(html,/lesson-roadmap/);assert.match(html,/angle-lesson-check/);assert.match(html,/angle-geometry/);assert.doesNotMatch(html,/NaN|undefined/);}}
 assert.match(angleHub('en'),/wholly manual proof/);assert.match(angleHub('zh'),/全題人工評閱/);
});
test('geometry answer scores exclude the proof and preserve separate manual reasoning under edits',()=>{
 const s=createSession(angleFamilies.map(f=>f.id),'angle-evidence','check',6);s.items.forEach((q,i)=>{answer(s,i,q.answer);if(q.manualReason){setReason(s,i,'I state the given premise and justify the angle relation.');s.responses[i].solution=true;selfReviewReason(s,i);}});
 const summary=evidenceSummary(s);assert.equal(summary.correct,5);assert.equal(summary.automaticTotal,5);assert.equal(summary.manualSubmitted,1);assert.equal(summary.selfReviewed,5);validateSession(s);
 setAnswerDraft(s,5,'A changed proof outline');assert.equal(s.responses[5].manualReview,null);assert.throws(()=>selfReviewReason(s,5));const bad=structuredClone(s);bad.items[3].model.phiB+=1;assert.throws(()=>validateSession(bad));
});
test('geometry versions and paper snapshots keep proof marks manual and student/key identities reproducible',async()=>{
 assert.throws(()=>generateAngle('GE99','x'));assert.throws(()=>generateAngle('GE01','x',2));assert.throws(()=>generateAngle('GE01','x'.repeat(81)));
 const spec=createPaper(angleFamilies.map(f=>f.id),'angle-paper',6,'zh'),hash=await identity(spec);validatePaper(spec);const student=renderPaper(spec,hash,false),key=renderPaper(spec,hash,true);assert.equal((student.match(/class="paper-question"/g)||[]).length,6);assert.match(student,/angle-geometry/);assert.match(key,/人工評閱/);assert.doesNotMatch(student,/NaN|undefined|\[object Object\]/);assert.notEqual(hash,await identity({...spec,lang:'en'}));const bad=structuredClone(spec);bad.items[5].question.contract={type:'number',answer:'180'};assert.throws(()=>validatePaper(bad));
});
