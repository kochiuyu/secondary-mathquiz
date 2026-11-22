import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {acceptanceApp,acceptancePrefix,acceptanceReport,automaticChecks,manualChecks,acceptanceFaultApp} from '../qa/core.mjs';

test('acceptance application isolates storage while retaining the portable application code',()=>{
 const source=readFileSync(new URL('../Secondary_MathQuiz_Prototype.html',import.meta.url),'utf8'),copy=acceptanceApp(source);
 const build=JSON.parse(readFileSync(new URL('../qa/build.json',import.meta.url),'utf8'));assert.equal(build.sourceHash,createHash('sha256').update(readFileSync(new URL('../Secondary_MathQuiz_Prototype.html',import.meta.url))).digest('hex'));
 assert.ok(source.includes("const PREFIX='secondary-mathquiz:p2:';"));assert.ok(!copy.includes("const PREFIX='secondary-mathquiz:p2:';"));assert.ok(copy.includes("const PREFIX='secondary-mathquiz:qa:'"));
 const replacement=copy.match(/const PREFIX='secondary-mathquiz:qa:'[^\r\n]+/)[0];
 assert.equal(copy.replace(replacement,"const PREFIX='secondary-mathquiz:p2:';").replaceAll('href="../planning/source-register.md"','href="planning/source-register.md"'),source);
 assert.ok(!copy.includes('<base '),'fragment navigation must remain on the isolated application URL');
 assert.throws(()=>acceptanceApp('no namespace'),/exactly one/);assert.throws(()=>acceptanceApp(source+"const PREFIX='secondary-mathquiz:p2:';"),/exactly one/);
});
test('acceptance run identifiers cannot overlap production storage or escape their namespace',()=>{
 assert.equal(acceptancePrefix('test-run-123'),'secondary-mathquiz:qa:test-run-123:');
 for(const id of ['p1:','../../foo','short','test-run-123:','<script>123</script>','x'.repeat(65),null])assert.throws(()=>acceptancePrefix(id),/Invalid/);
});
test('controlled storage-fault copies stay isolated and reject undeclared fault modes',()=>{
 const source=readFileSync(new URL('../Secondary_MathQuiz_Prototype.html',import.meta.url),'utf8');
 for(const mode of ['denied','quota']){
  const copy=acceptanceFaultApp(source,mode);assert.ok(copy.includes("const PREFIX='secondary-mathquiz:qa:'"));assert.ok(!copy.includes("const PREFIX='secondary-mathquiz:p2:';"));assert.ok(copy.includes(mode==='denied'?'SecurityError':'QuotaExceededError'));
 }
 assert.throws(()=>acceptanceFaultApp(source,'unknown'),/declared storage fault/);
});
test('automatic results alone cannot declare browser acceptance complete',()=>{
 const automatic=automaticChecks.map(([id])=>({id,status:'pass',notes:'Observed by runner.'}));
 const initial=acceptanceReport({run:'test-run-123'});assert.equal(initial.status,'pending');assert.ok(initial.automatic.every(x=>x.status==='pending'));
 const autoOnly=acceptanceReport({run:'test-run-123',automatic});assert.equal(autoOnly.status,'pending');assert.ok(autoOnly.manual.every(x=>x.status==='pending'));
 const unobserved=manualChecks.map(([id])=>({id,status:'pass',notes:'  '}));assert.equal(acceptanceReport({run:'test-run-123',automatic,manual:unobserved}).status,'pending');
 const manual=manualChecks.map(([id])=>({id,status:'pass',notes:'Inspected with recorded browser settings.'}));assert.equal(acceptanceReport({run:'test-run-123',automatic,manual}).status,'pending');
 const recorded=acceptanceReport({run:'test-run-123',automatic,manual,sourceHash:'a'.repeat(64)});
 assert.equal(recorded.status,'recorded-pass');assert.equal(recorded.independentCurriculumReview,false);assert.equal(recorded.classroomReview,false);assert.ok(recorded.manual.every(x=>x.evidence==='reviewer-recorded'));
 manual[0].status='fail';assert.equal(acceptanceReport({run:'test-run-123',automatic,manual}).status,'fail');
});
test('acceptance report omits learner payloads and ignores undeclared check results',()=>{
 const report=acceptanceReport({run:'test-run-123',profile:{name:'private learner',sessions:[{input:'private answer'}]},automatic:[{id:'unknown',status:'pass',notes:'unapproved'}]});
 assert.ok(!JSON.stringify(report).includes('private'));assert.ok(!JSON.stringify(report).includes('unapproved'));assert.equal(report.automatic.length,automaticChecks.length);assert.equal(report.manual.length,6);
});
