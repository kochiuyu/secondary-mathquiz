import test from 'node:test';
import assert from 'node:assert/strict';
import {repository,freshProfile,PREFIX} from '../src/app/storage.mjs';
import {createSession,answer,evidenceSummary,validateBackup,validateSession,workedExample,avoidExposedExamples,setReason,selfReviewReason} from '../src/app/session.mjs';
import {progressImportReview} from '../src/app/imports.mjs';
import {createPaper,identity,validatePaper,canonical,preparePaper,previewCoordinator} from '../src/papers/paper.mjs';
import {readFile} from 'node:fs/promises';
import {printableDocument,renderPaper,paginate} from '../src/papers/render.mjs';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),map};};

test('local profiles isolate work and preserve input at the exact question',()=>{
 const storage=memory(),repo=repository(storage),a=freshProfile('a','A'),b=freshProfile('b','B');a.sessions.push(createSession(['signed'],'a-seed','practice',4));
 a.sessions[0].index=2;a.sessions[0].responses[2].input='−3/2';assert.ok(repo.save(a).ok);assert.ok(repo.save(b).ok);
 const reloaded=repo.load('a');assert.equal(reloaded.sessions[0].index,2);assert.equal(reloaded.sessions[0].responses[2].input,'−3/2');assert.equal(repo.load('b').sessions.length,0);
});
test('concurrent-tab writes do not clobber a newer revision',()=>{
 const repo=repository(memory()),a=freshProfile('a','A');repo.save(a);const other=repo.load('a');a.studied.push('first');repo.save(a);other.studied.push('second');
 assert.deepEqual(repo.save(other),{ok:false,reason:'conflict'});assert.deepEqual(repo.load('a').studied,['first']);assert.deepEqual(other.studied,['second']);
});
test('interleaved learner-registry saves preserve profiles added by another tab',()=>{
 const store=memory(),first=repository(store),second=repository(store),a=first.registry(),b=second.registry();
 a.profiles.push({id:'learner-a',name:'A'});a.active='learner-a';assert.equal(first.saveRegistry(a),true);
 b.profiles.push({id:'learner-b',name:'B'});b.active='learner-b';assert.equal(second.saveRegistry(b),true);
 assert.deepEqual(first.registry().profiles.map(p=>p.id),['learner-1','learner-a','learner-b']);assert.equal(b.profiles.length,3);
 a.active='learner-1';assert.equal(first.saveRegistry(a),true);assert.equal(first.registry().profiles.length,3);
});
test('malformed and future learner registries are preserved instead of being replaced',()=>{
 for(const saved of ['{',JSON.stringify({schema:99,profiles:[{id:'future'}]}),JSON.stringify({schema:1,active:'missing',profiles:[{id:'learner-1',name:'A'}]})]){
  const store=memory();store.setItem(PREFIX+'profiles',saved);const repo=repository(store),fallback=repo.registry();assert.equal(repo.volatile,true);assert.equal(repo.saveRegistry(fallback),false);assert.equal(store.getItem(PREFIX+'profiles'),saved);
 }
 const store=memory(),repo=repository(store),reg=repo.registry();reg.profiles.push({...reg.profiles[0]});assert.equal(repo.saveRegistry(reg),false);assert.equal(store.getItem(PREFIX+'profiles'),null);
});
test('denied/quota-full storage retains in-memory work and reports the failure',()=>{
 const repo=repository({getItem:()=>null,setItem(){throw Error('QuotaExceededError');}}),p=freshProfile();p.sessions.push(createSession(['signed'],'volatile','practice',4));
 assert.deepEqual(repo.save(p),{ok:false,reason:'unavailable'});assert.equal(p.sessions.length,1);assert.equal(p.revision,0);
});
test('a revealed or retried answer is never promoted to fresh independent evidence',()=>{
 const s=createSession(['signed'],'independent','check',4);answer(s,0,'9999');answer(s,0,s.items[0].answer);
 s.responses[1].hint=true;answer(s,1,s.items[1].answer);answer(s,2,s.items[2].answer);
 assert.equal(evidenceSummary(s).independentCorrect,1);assert.equal(evidenceSummary(s).correct,3);assert.equal(evidenceSummary(s).assisted,1);
 s.responses[2].priorExposure=true;assert.equal(evidenceSummary(s).independentCorrect,0);
});
test('attempt snapshots survive later draft edits and the bounded history retains the first attempt',()=>{
 const s=createSession(['signed'],'snapshots','check',4);answer(s,0,'9999');for(let n=0;n<110;n++)answer(s,0,s.items[0].answer);
 s.responses[0].input='changed draft';assert.equal(s.responses[0].attempts.length,100);assert.equal(s.responses[0].attempts[0].input,'9999');assert.equal(s.responses[0].attempts.at(-1).input,s.items[0].answer);assert.equal(evidenceSummary(s).independentCorrect,0);
});
test('numeric angle evidence remains separate from manually reviewed reasoning',()=>{
 const s=createSession(['angle'],'angle-evidence','check',4);answer(s,0,s.items[0].answer);assert.equal(evidenceSummary(s).manualPending,1);setReason(s,0,'Adjacent angles on a straight line total 180 degrees.');s.responses[0].solution=true;selfReviewReason(s,0);
 assert.equal(evidenceSummary(s).manualPending,0);assert.equal(evidenceSummary(s).selfReviewed,1);
});
test('self-review requires written reasoning and is invalidated when the reasoning changes',()=>{
 const s=createSession(['angle'],'reason-edits','practice',1);assert.throws(()=>selfReviewReason(s,0),/Write a reason/);
 answer(s,0,s.items[0].answer);s.responses[0].solution=true;setReason(s,0,'   ');assert.throws(()=>selfReviewReason(s,0),/Write a reason/);
 setReason(s,0,'Straight-line angles total 180 degrees.');selfReviewReason(s,0);setReason(s,0,s.responses[0].reason);assert.equal(evidenceSummary(s).selfReviewed,1);
 setReason(s,0,'A revised explanation');assert.equal(s.responses[0].manualReview,null);assert.equal(evidenceSummary(s).manualPending,1);assert.equal(evidenceSummary(s).selfReviewed,0);
 const legacy=structuredClone(s);legacy.responses[0].reason='';legacy.responses[0].manualReview='self';validateSession(legacy);assert.equal(evidenceSummary(legacy).selfReviewed,0);
});
test('guided example snapshots are retained and excluded from fresh follow-up questions',()=>{
 let overlap;
 for(let i=0;i<1000;i++){const s=createSession(['signed'],'learn-overlap-'+i,'learn',12);if(s.items.some(q=>q.math===workedExample(s).math)){overlap=s;break;}}
 assert.ok(overlap,'exercise a seed with an actual worked-example overlap');const example=structuredClone(overlap.workedExample);avoidExposedExamples(overlap);
 assert.deepEqual(overlap.workedExample,example);assert.ok(overlap.items.every((q,i)=>q.math!==example.math||overlap.responses[i].priorExposure));validateSession(overlap);
 const legacy=structuredClone(overlap);delete legacy.workedExample;assert.equal(workedExample(legacy).version,legacy.items[0].version);validateSession(legacy);
 const altered=structuredClone(overlap);altered.workedExample.answer='tampered';assert.throws(()=>validateSession(altered),/worked-example snapshot/);
});
test('exhausted fresh-question variants are explicitly marked as prior exposure',()=>{
 const old={mode:'practice',items:[],responses:[]};for(let a=-12;a<=8;a++)for(let b=-9;b<=9;b++){old.items.push({id:'signed',math:`${a} + (${b})`});old.responses.push({attempts:[{status:'correct'}]});}
 const s=avoidExposedExamples(createSession(['signed'],'exhausted','check',1),[old]);assert.equal(s.responses[0].priorExposure,true);answer(s,0,s.items[0].answer);assert.equal(evidenceSummary(s).independentCorrect,0);
});
test('session identities reject markup and route delimiters before entering application templates',()=>{
 for(const seed of ['<img src=x>','a/b','a#home','a" onmouseover="x','a?lang=zh']){
  assert.throws(()=>createSession(['signed'],seed,'practice',1),/seed/);
  const s=createSession(['signed'],'safe','practice',1);s.seed=seed;s.id='session-'+seed;assert.throws(()=>validateSession(s),/Unsupported session/);
 }
});
test('backup validation rejects malformed and incompatible snapshots',()=>{
 const p=freshProfile();p.sessions.push(createSession(['signed'],'backup','practice',4));const data={kind:'secondary-mathquiz-progress',schema:1,profile:p};assert.equal(validateBackup(data).sessions.length,1);
 const tampered=structuredClone(data);tampered.profile.sessions[0].items[0].answer='malicious';assert.throws(()=>validateBackup(tampered),/snapshot/);
 const future=structuredClone(data);future.schema=99;assert.throws(()=>validateBackup(future),/version/);
});
test('failed backup review clears its confirmation and cannot replace the current learner',()=>{
 const current=freshProfile('current','Current'),source=freshProfile('source','Source'),review=progressImportReview();current.sessions.push(createSession(['signed'],'current-work','practice',1));source.sessions.push(createSession(['angle'],'incoming-work','practice',1));
 const data={kind:'secondary-mathquiz-progress',schema:1,profile:source};assert.equal(review.review(data,current.id).sessions,1);
 const broken=structuredClone(data);broken.profile.paper=createPaper(['signed'],'bad-paper',3);broken.profile.paper.items[0].question.answer='tampered';
 assert.throws(()=>review.review(broken,current.id),/snapshot/);assert.throws(()=>review.apply(current),/Review this backup/);assert.equal(current.sessions[0].seed,'current-work');
});
test('backup confirmation consumes a frozen copy, stays bound to one learner and supports cancellation',()=>{
 const current=freshProfile('current','Keep this name'),source=freshProfile('source','Imported name'),review=progressImportReview();source.sessions.push(createSession(['signed'],'incoming','practice',1));source.paper=createPaper(['angle'],'incoming-paper',3);const data={kind:'secondary-mathquiz-progress',schema:1,profile:source};
 review.review(data,current.id);source.sessions[0].responses[0].input='changed after review';const updated=review.apply(current);
 assert.equal(updated.id,current.id);assert.equal(updated.name,current.name);assert.equal(updated.sessions[0].responses[0].input,'');assert.equal(current.sessions.length,0);assert.throws(()=>review.apply(current),/Review this backup/);
 review.review(data,current.id);assert.throws(()=>review.apply(freshProfile('other','Other')),/Review this backup/);assert.throws(()=>review.apply(current),/Review this backup/);
 review.review(data,current.id);review.cancel();assert.throws(()=>review.apply(current),/Review this backup/);
});
test('paper identity includes language, title, order, marks, working space and snapshots',async()=>{
 const p=createPaper(['signed','expression','equation','angle'],'repro',6,'zh'),hash=await identity(p);
 assert.equal(hash,await identity(JSON.parse(JSON.stringify(p))));
 for(const change of [p=>p.lang='en',p=>p.title='New',p=>p.items.reverse(),p=>p.items[0].marks++,p=>p.items[0].lines++]){const copy=structuredClone(p);change(copy);assert.notEqual(hash,await identity(copy));}
 assert.equal(validatePaper(p).items.length,6);const bad=structuredClone(p);bad.items[0].question.version=99;assert.throws(()=>validatePaper(bad),/version/);
});
test('student and solution sheets retain numbering and parameters without learner responses',async()=>{
 const p=createPaper(['signed','expression','equation','angle'],'print',6,'zh'),id=await identity(p);p.title='<img src=x onerror=alert(1)>';
 const student=printableDocument(p,id,false),key=printableDocument(p,id,true);
 assert.equal((student.match(/class="paper-question"/g)||[]).length,6);assert.equal((key.match(/class="paper-question"/g)||[]).length,6);
 assert.equal((student.match(/class="paper-page"/g)||[]).length,2);assert.ok(student.includes('lang="zh-Hant"'));assert.ok(student.includes('&lt;img'));assert.ok(!student.includes('<img'));
 assert.ok(!student.includes('class="solution"'));assert.ok(key.includes('class="solution"'));assert.ok(!student.includes('responses'));
});
test('larger working areas create additional pages without losing numbering or questions',()=>{
 const p=createPaper(['angle'],'large-working-space',6,'zh');p.items.forEach(x=>x.lines=6);const pages=paginate(p);assert.ok(pages.length>2);assert.equal(pages.flatMap(x=>x.items).length,6);assert.deepEqual(pages.map(x=>x.start),pages.map((x,i)=>pages.slice(0,i).reduce((n,p)=>n+p.items.length,0)));
 const unknown=structuredClone(p);unknown.responses=['private'];assert.throws(()=>validatePaper(unknown),/Unknown paper/);
 const layout=structuredClone(p);layout.layout.responses=['private'];assert.throws(()=>validatePaper(layout),/Unknown layout/);
});
test('legacy v1 paper snapshots and sessions reopen without changing their contracts',async()=>{
 const p=JSON.parse(await readFile(new URL('./fixtures/p1-v1-paper.json',import.meta.url),'utf8'));
 const before=canonical(p);validatePaper(p);assert.equal(canonical(p),before);assert.equal(p.generatorVersion,1);
 const s=createSession(['signed'],'legacy-resume','check',p.items.length);s.items=p.items.map(x=>structuredClone(x.question));
 validateSession(s);assert.ok(s.items.every(q=>q.version===1));
 const numeric=s.items.findIndex(q=>q.id==='signed');answer(s,numeric,s.items[numeric].math);assert.equal(s.responses[numeric].attempts[0].status,'correct');
 const fresh=createSession(['signed'],'fresh-check','check',1);answer(fresh,0,fresh.items[0].math);assert.equal(evidenceSummary(fresh).independentCorrect,0);
 answer(fresh,0,fresh.items[0].answer);assert.equal(evidenceSummary(fresh).correct,1);assert.equal(evidenceSummary(fresh).independentCorrect,0);
});
test('paper snapshots keep async exports stable and discard out-of-order previews',async()=>{
 const paper=createPaper(['signed'],'async-paper',3),original=structuredClone(paper);
 const exportPromise=preparePaper(paper);paper.title='Edited while hashing';const prepared=await exportPromise;
 assert.deepEqual(prepared.spec,original);assert.equal(prepared.fingerprint,await identity(original));
 const pending=[],preview=previewCoordinator(spec=>new Promise(resolve=>pending.push({spec,resolve})));
 const first=preview(paper);paper.title='Newest';const newest=structuredClone(paper),second=preview(paper);paper.items.reverse();
 pending[1].resolve(await identity(pending[1].spec));const result=await second;
 assert.deepEqual(result.spec,newest);assert.equal(result.fingerprint,await identity(newest));
 pending[0].resolve(await identity(pending[0].spec));assert.equal(await first,null);
});
