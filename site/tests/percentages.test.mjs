import test from 'node:test';
import assert from 'node:assert/strict';
import {percentageFamilies,generatePercentage,percentageFeedback} from '../src/math/percentages.mjs';
import {percentageLessons,percentageLessonExamples,recordedPercentageExamples} from '../src/lessons/percentages.mjs';
import {percentageHub,percentageLessonView} from '../src/app/percentage-views.mjs';
import {mark} from '../src/math/exact.mjs';
import {diagram} from '../src/renderers/math.mjs';
import {createPaper,validatePaper,identity} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';
import {createSession,avoidExposedExamples,answer,evidenceSummary,setReason,selfReviewReason,setAnswerDraft} from '../src/app/session.mjs';
// Independent integer rational oracle. Does not reuse generator multipliers or Q.
const rr=s=>{const [n,d='1']=String(s).split('/');return [BigInt(n),BigInt(d)];};
const ar=([a,b],[c,d])=>[a*d+c*b,b*d],mr=([a,b],[c,d])=>[a*c,b*d],dr=([a,b],[c,d])=>[a*d,b*c];
const nr=([a,b])=>[-a,b],rate=r=>[BigInt(100+r),100n];
function equalsR(actual,[n,d]){const [a,b]=rr(actual);assert.equal(a*d,n*b);}
test('eight percentage families: 2,400 independently checked deterministic exact models and domain boundaries',()=>{
 const seen={rates:new Set(),retail:new Set(),successive:new Set(),interest:new Set(),tax:new Set(),unequal:false};
 for(const f of percentageFamilies)for(let i=0;i<300;i++){
  const q=generatePercentage(f.id,'oracle-'+i),m=q.model;assert.deepEqual(q,generatePercentage(f.id,'oracle-'+i));assert.equal(q.objective,f.objective);assert.equal(mark(q.contract,q.answer).status,'correct');assert.ok(q.manualReason);
  for(const lang of ['en','zh']){assert.ok(q.prompt[lang].length>30);assert.ok(q.hint[lang].length>20);assert.ok(q.solution[lang].length>20);assert.ok(q.reasonRubric[lang].length>20);}
  let expected;
  if(q.id==='PC01'){assert.ok(m.original>0);expected=mr(dr(ar(rr(m.next),nr(rr(m.original))),rr(m.original)),rr(100));seen.rates.add(q.answer);}
  if(q.id==='PC02'){expected=mr(rr(m.original),rate(m.rate));seen.rates.add(String(m.rate));}
  if(q.id==='PC03'){assert.notEqual(m.rate,-100);assert.ok(m.rate>-100);expected=dr(rr(m.next),rate(m.rate));}
  if(q.id==='PC04'){seen.retail.add(m.mode);const sale=mr(mr(rr(m.cost),rate(m.markup)),rate(-m.discount));expected=m.mode==='selling'?sale:mr(dr(ar(sale,nr(rr(m.cost))),rr(m.cost)),rr(100));}
  if(q.id==='PC05'){seen.successive.add(m.mode);const result=mr(mr(rr(m.original),rate(m.r1)),rate(m.r2));expected=m.mode==='new'?result:mr(ar(dr(result,rr(m.original)),rr(-1)),rr(100));}
  if(q.id==='PC06'){seen.interest.add(m.mode+':'+m.target);let interest;if(m.mode==='simple')interest=[BigInt(m.principal*m.rate*m.years),100n];else {let balance=rr(m.principal);for(let y=0;y<m.years;y++)balance=mr(balance,rate(m.rate));interest=ar(balance,nr(rr(m.principal)));}expected=m.target==='interest'?interest:ar(rr(m.principal),interest);}
  if(q.id==='PC07'){if(m.a!==m.b)seen.unequal=true;const change=ar([BigInt(m.a*m.ra),100n],[BigInt(m.b*m.rb),100n]);expected=mr(dr(change,rr(m.a+m.b)),rr(100));}
  if(q.id==='PC08'){const taxable=Math.max(0,m.income-m.allowance);seen.tax.add(m.income);let cents=0;for(let dollar=1;dollar<=taxable;dollar++)cents+=dollar<=m.band?m.r1:m.r2;expected=[BigInt(cents),100n];assert.match(q.prompt.en,/fictional.*22 November 2026.*not current Hong Kong law/);}
  equalsR(q.answer,expected);const [n,d]=rr(q.answer);assert.equal(mark(q.contract,String(n*1000n+1n)+'/'+String(d*1000n)).status,'incorrect');assert.notEqual(mark(q.contract,q.answer+'%').status,'correct');
 }
 assert.ok(seen.rates.has('-100')&&seen.rates.has('0')&&seen.rates.has('125'));assert.equal(seen.retail.size,2);assert.equal(seen.successive.size,2);assert.equal(seen.interest.size,4);assert.equal(seen.tax.size,7);assert.ok(seen.unequal);
 assert.throws(()=>generatePercentage('PC03','x',2));assert.throws(()=>generatePercentage('PC99','x'));assert.throws(()=>generatePercentage('PC01','x'.repeat(81)));
});
test('percentage feedback distinguishes wrong bases, inverse rates, component weights and successive addition',()=>{
 assert.match(percentageFeedback({id:'PC01',model:{original:100,next:'120'},answer:'20'},'50/3').en,/denominator/);
 assert.match(percentageFeedback({id:'PC03',model:{next:'160',rate:-20},answer:'200'},'192').en,/division/);
 assert.match(percentageFeedback({id:'PC05',model:{original:200,r1:20,r2:-20,mode:'overall'},answer:'-4'},'0').en,/second change/);
 assert.match(percentageFeedback({id:'PC07',model:{a:100,b:300,ra:20,rb:0},answer:'5'},'10').en,/different sizes/);
 assert.equal(percentageFeedback({id:'PC03',model:{next:'160',rate:-20},answer:'200'},'200'),null);
});
test('four bilingual lessons retain generated and fixed exposures; bounded tax exhaustion stays practice',()=>{
 assert.equal(percentageLessons.length,4);assert.match(percentageHub('en'),/eight families/);
 for(const l of percentageLessons){const exposed=recordedPercentageExamples(['lesson:'+l.id+':v1']);for(const q of percentageLessonExamples(l))assert.ok(exposed.some(x=>x.exposureKey===q.exposureKey));for(const lang of ['en','zh']){const html=percentageLessonView(l.id,lang);assert.match(html,/percentages-lesson-check/);assert.ok(l.sections.length>=3);assert.ok(l.takeaway[lang].length>20);}}
 const all=percentageLessons.map(l=>'lesson:'+l.id+':v1'),exposed=recordedPercentageExamples(all);
 assert.ok(exposed.some(q=>q.id==='PC05'&&q.exposureKey.includes('"r1":20,"r2":-20')));
 const session=avoidExposedExamples(createSession(percentageFamilies.map(f=>f.id),'pc-fresh','check',8),[],exposed);
 for(const q of session.items)assert.ok(!exposed.some(x=>x.exposureKey===q.exposureKey));
 const bank=[];for(let i=0;i<300;i++)bank.push(generatePercentage('PC08','tax-exhaust-'+i));
 const exhausted=avoidExposedExamples(createSession(['PC08'],'pc-exhaust','check',1),[],bank);assert.ok(exhausted.responses[0].priorExposure);
});
test('percentage scores do not certify written reasons; edited answers clear self review',()=>{
 const s=createSession(percentageFamilies.map(f=>f.id),'pc-score','check',8);
 for(let i=0;i<8;i++){const q=s.items[i];answer(s,i,q.answer);setReason(s,i,'My reference and method');assert.equal(s.responses[i].manualReview,null);s.responses[i].solution=true;selfReviewReason(s,i);assert.equal(s.responses[i].manualReview,'self');setAnswerDraft(s,i,'edited');assert.equal(s.responses[i].manualReview,null);}
 const summary=evidenceSummary(s);assert.equal(summary.automaticTotal,8);assert.equal(summary.correct,8);assert.equal(summary.manualPending,8);
});
test('percentage bilingual paper snapshots retain every given, separate keys and non-answer diagrams',async()=>{
 for(const lang of ['en','zh']){const p=createPaper(percentageFamilies.map(f=>f.id),'percentage-paper',8,lang);assert.deepEqual(validatePaper(p),p);const hash=await identity(p),student=renderPaper(p,hash),key=renderPaper(p,hash,true);assert.equal((student.match(/class="paper-question"/g)||[]).length,8);assert.ok(!student.includes('class="solution"'));assert.equal((key.match(/class="solution"/g)||[]).length,8);assert.ok(!key.includes('[object Object]'));assert.ok(key.includes(lang==='en'?'manual review':'人工'));for(const item of p.items){const d=diagram(item.question,lang);assert.ok(!d.includes('class="solution"'));if(item.question.id==='PC05')assert.ok(d.includes('New base')||d.includes('新基準'));}}
});
