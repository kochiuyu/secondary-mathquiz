import {automaticChecks,manualChecks,acceptancePrefix,acceptanceReport} from './core.mjs?v=b125ba479e23';
import {identity} from '../src/papers/paper.mjs';

const frame=document.querySelector('#application'),results=document.querySelector('#results'),manual=document.querySelector('#manual');
let run='',prefix='',sourceHash='',busy=false,automatic=automaticChecks.map(([id])=>({id,status:'pending',notes:''}));
const served=['http:','https:'].includes(location.protocol);
class Blocked extends Error{}
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
function appDocument(){try{return frame.contentDocument;}catch{throw new Blocked('The application frame is not accessible from this origin. Serve the extracted folder with the included server.');}}
async function waitFor(predicate,message,timeout=7000){
 const end=performance.now()+timeout;
 while(performance.now()<end){const value=predicate();if(value)return value;await new Promise(resolve=>setTimeout(resolve,40));}
 throw new Error('Timed out: '+message);
}
async function reloadApplication(){
 await new Promise((resolve,reject)=>{const done=()=>{clearTimeout(timer);resolve();},timer=setTimeout(()=>{frame.removeEventListener('load',done);reject(new Error('Timed out waiting for the application reload.'));},7000);frame.addEventListener('load',done,{once:true});frame.contentWindow.location.reload();});
}
function el(selector){const element=appDocument()?.querySelector(selector);assert(element,'Missing application control: '+selector);return element;}
function click(selector){const element=el(selector);assert(!element.disabled,'Disabled application control: '+selector);element.click();}
function input(selector,value){const element=el(selector);element.value=value;element.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));}
function change(selector,value){const element=el(selector);element.value=value;element.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));}
async function go(route,selector){frame.contentWindow.location.hash=route;await waitFor(()=>appDocument()?.querySelector(selector),'route '+route);}
function stored(key){try{return JSON.parse(localStorage.getItem(prefix+key));}catch{throw new Blocked('Browser storage is unavailable. Persistence checks need a browser origin with local saving enabled.');}}
function currentProfile(){const registry=stored('profiles'),profile=stored(registry?.active||'learner-1');if(!profile)throw new Blocked('The test profile was not saved. Inspect the application saving notice.');return profile;}
function latestSession(){return currentProfile().sessions.at(-1);}
async function startSession(ids,mode='practice',count=4){
 await go('setup/'+mode,'#session-setup');const form=el('#session-setup');
 form.querySelectorAll('[name="family"]').forEach(x=>x.checked=ids.includes(x.value));form.querySelector('[name="count"]').value=String(count);
 const previous=currentProfileSafe()?.sessions.length||0,previousId=currentProfileSafe()?.sessions.at(-1)?.id;form.requestSubmit();
 await waitFor(()=>{
  const doc=appDocument(),session=currentProfileSafe()?.sessions.at(-1),language=doc?.documentElement.lang==='zh-Hant'?'zh':'en';
  return session&&session.id!==previousId&&doc?.querySelector('#answer-form')&&doc.querySelector('.question-card h1')?.textContent===session.items[0].prompt[language];
 },'new session question');assert(currentProfile().sessions.length===previous+1,'A new session was not retained.');
}
function currentProfileSafe(){const registry=stored('profiles');return stored(registry?.active||'learner-1');}
function checkAnswer(value,reason=''){
 if(appDocument().querySelector('#answer-input'))input('#answer-input',value);else click('input[name="answer"][value="'+value+'"]');
 if(appDocument().querySelector('#reason-input'))input('#reason-input',reason);el('#answer-form').requestSubmit();
}
function drawResults(){
 results.replaceChildren();for(const [id,title] of automaticChecks){const item=automatic.find(x=>x.id===id),li=document.createElement('li'),strong=document.createElement('span'),small=document.createElement('small');li.dataset.status=item.status;strong.className='status';strong.textContent=id+' · '+title+' — '+item.status;small.textContent=item.notes;li.append(strong,small);results.append(li);}
}
function readManual(){return manualChecks.map(([id])=>({id,status:document.querySelector('#status-'+id).value,notes:document.querySelector('#notes-'+id).value}));}
function report(){return acceptanceReport({run,automatic,manual:readManual(),sourceHash,environment:{userAgent:navigator.userAgent,language:navigator.language,runnerViewport:{width:innerWidth,height:innerHeight},applicationViewport:{width:frame.clientWidth,height:frame.clientHeight},basePath:new URL('.',location.href).pathname}});}
function summary(){
 if(!run)return;const passed=automatic.filter(x=>x.status==='pass').length,failed=automatic.filter(x=>x.status==='fail').length,blocked=automatic.filter(x=>x.status==='blocked').length;
 document.querySelector('#summary').textContent=`Workflow checks: ${passed}/${automatic.length} passed; ${failed} failed; ${blocked} blocked. Acceptance record: ${report().status}. Manual observations are separate.`;
}
async function step(id,action){const result=automatic.find(x=>x.id===id);result.notes='Running…';drawResults();try{result.notes=String(await action()||'Observed expected application behaviour.');result.status='pass';}catch(error){result.status=error instanceof Blocked?'blocked':'fail';result.notes=error.message;}drawResults();summary();return result.status==='pass';}
function setBusy(value){busy=value;document.querySelectorAll('.controls button,.controls select').forEach(x=>x.disabled=value);document.querySelector('#run').disabled=value||!served;}
function clearOwnStorage(){
 if(!prefix)return;assert(prefix===acceptancePrefix(run),'Test storage prefix mismatch.');
 const keys=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(prefix))keys.push(key);}for(const key of keys)localStorage.removeItem(key);
}
for(const [id,title] of manualChecks){
 const row=document.createElement('div'),label=document.createElement('label'),select=document.createElement('select'),notes=document.createElement('textarea');row.className='manual-row';label.htmlFor='status-'+id;label.textContent=id+' · '+title;select.id='status-'+id;
 for(const state of ['pending','pass','fail','blocked']){const option=document.createElement('option');option.value=state;option.textContent=state;select.append(option);}
 notes.id='notes-'+id;notes.maxLength=4000;notes.setAttribute('aria-label',title+' observation notes');notes.placeholder='Observed result, browser/zoom/print settings, and any defects. A pass requires a note.';
 row.append(label,select,notes);manual.append(row);select.addEventListener('change',summary);notes.addEventListener('input',summary);
}
drawResults();
document.querySelector('#connection').textContent=served?'Ready. Run workflow checks to open a fresh isolated application. Re-running replaces this page’s previous test run.':'This page requires HTTP. Run node tools/serve.mjs in the extracted project, then open http://127.0.0.1:5174/qa/index.html.';
setBusy(false);
document.querySelector('#run').addEventListener('click',async()=>{
 if(busy||!served)return;setBusy(true);
 try{
  frame.src='about:blank';try{clearOwnStorage();}catch{/* The next run will report unavailable storage. */}
  run=crypto.randomUUID();prefix=acceptancePrefix(run);automatic=automaticChecks.map(([id])=>({id,status:'pending',notes:''}));
  // Manual observations belong to the current run, never carry a pass into a rerun.
  for(const [id] of manualChecks){document.querySelector('#status-'+id).value='pending';document.querySelector('#notes-'+id).value='';}
  try{sourceHash=(await (await fetch('build.json',{cache:'no-store'})).json()).sourceHash||'';}catch{sourceHash='';}
  frame.src=new URL('app.html?run='+run,location.href).href;
  const loaded=await step('A01',async()=>{await waitFor(()=>appDocument()?.querySelector('.home-hero'),'application overview');assert(appDocument().documentElement.lang==='en','Expected English on a fresh run.');assert(appDocument().querySelectorAll('nav [aria-current="page"]').length===1,'Expected exactly one current navigation item.');return 'Application overview rendered in the isolated test frame.';});
  if(!loaded)return;
  await step('A02',async()=>{await go('catalogue','#catalogue-search');assert(el('#catalogue-count').textContent.includes('52'),'Expected all 52 mapped topics.');input('#catalogue-search','JS8.1');assert(el('#catalogue-grid').querySelectorAll('.topic-card').length===1,'Official-reference search did not isolate one topic.');click('[data-action="clear-filters"]');assert(!new URL(frame.contentWindow.location.href).searchParams.has('q'),'Cleared search remains in the URL.');assert(el('#catalogue-grid').querySelectorAll('.topic-card').length===52,'Clear filters did not restore the topics.');});
  await step('A03',async()=>{
   await startSession(['signed'],'check');const id=latestSession().id;input('#answer-input','5/2');click('[data-action="language"]');assert(appDocument().documentElement.lang==='zh-Hant','Language did not switch.');assert(el('#answer-input').value==='5/2','Draft changed during language switch.');
   await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input')&&appDocument().documentElement.lang==='zh-Hant','saved Chinese session after reload');assert(latestSession().id===id&&el('#answer-input').value==='5/2','Reload did not preserve the exact draft.');click('[data-action="language"]');
   const q=latestSession().items[0];checkAnswer(q.math);assert(latestSession().responses[0].attempts.at(-1).status==='wrong-form','Copied calculation received an unexpected result.');checkAnswer(q.answer);assert(latestSession().responses[0].attempts.at(-1).status==='correct','Final numerical answer was not accepted.');assert(appDocument().activeElement?.classList.contains('feedback'),'Submitted feedback did not receive focus.');
   click('[data-action="next"]');assert(latestSession().index===1,'Next question was not retained.');return 'English/Chinese draft, reload, requested answer form and feedback focus checked.';
  });
  await step('A04',async()=>{await startSession(['angle']);const q=latestSession().items[0];checkAnswer(q.answer,'Adjacent angles on a straight line total 180 degrees.');click('[data-action="solution"]');click('[data-action="self-review"]');assert(latestSession().responses[0].manualReview==='self','Self-review was not retained.');input('#reason-input','Revised reason');assert(latestSession().responses[0].manualReview===null,'Edited reason retained its review.');assert(el('#reason-review-status').textContent.includes('needs review'),'Review feedback did not update immediately.');});
  await step('A05',async()=>{const original=currentProfile(),count=original.sessions.length;await go('progress','#profile-form');el('#profile-form [name="name"]').value='Acceptance learner';el('#profile-form').requestSubmit();await waitFor(()=>appDocument()?.querySelector('#profile-select')?.value!==original.id,'second learner');assert(currentProfile().sessions.length===0,'New learner inherited another learner’s sessions.');change('#profile-select',original.id);await waitFor(()=>appDocument()?.querySelector('.home-hero'),'original learner overview');assert(currentProfile().id===original.id&&currentProfile().sessions.length===count,'Original learner work was not restored.');});
  await step('A06',async()=>{
   await go('paper','#paper-setup');const form=el('#paper-setup');form.querySelectorAll('[name="family"]').forEach(x=>x.checked=['signed','expression','equation','angle','choice','fraction'].includes(x.value));form.querySelector('[name="count"]').value='6';form.requestSubmit();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'paper preview');const first=currentProfile().paper.items[0].question.id;click('[data-action="paper-down"][data-index="0"]');assert(currentProfile().paper.items[0].question.id!==first,'Question order did not change.');input('#paper-title','Acceptance paper');const saved=currentProfile().paper,hash=await identity(saved);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'matching edited paper ID');
   input('#paper-import',JSON.stringify(saved));click('[data-action="import-paper"]');await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'reopened paper ID');assert(await identity(currentProfile().paper)===hash,'Reopening changed the saved paper.');return 'Order, edited preview identity and specification reopen checked; PDF output remains manual.';
  });
  await step('A07',async()=>{
   await go('progress','#progress-import');const before=currentProfile(),backup={kind:'secondary-mathquiz-progress',schema:1,profile:before};input('#progress-import',JSON.stringify(backup));click('[data-action="review-progress"]');assert(appDocument().querySelector('[data-action="confirm-progress"]'),'Valid import did not offer review confirmation.');click('[data-action="cancel-progress"]');assert(!appDocument().querySelector('[data-action="confirm-progress"]'),'Cancellation left a confirmation.');
   click('[data-action="review-progress"]');input('#progress-import','{');click('[data-action="review-progress"]');assert(!appDocument().querySelector('[data-action="confirm-progress"]'),'Failed review left a confirmation.');assert(JSON.stringify(currentProfile())===JSON.stringify(before),'Cancelled/failed review changed the saved learner.');
  });
  await step('A08',async()=>{
   frame.width='390';const measurements=[];for(const [route,selector] of [['home','.home-hero'],['catalogue','#catalogue-grid'],['setup/practice','#session-setup'],['paper','#paper-setup']]){await go(route,selector);await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));const doc=appDocument(),width=doc.documentElement.clientWidth,overflow=Math.max(doc.documentElement.scrollWidth,doc.body.scrollWidth)-width;measurements.push(route+': '+overflow+'px');assert(frame.contentWindow.innerWidth===390,'Frame did not provide a 390px layout viewport.');assert(overflow<=2,'Whole-page horizontal overflow on '+route+': '+overflow+'px.');}return measurements.join('; ')+'. Visual inspection and 200% zoom remain manual.';
  });
  frame.width=document.querySelector('#width').value;
  await step('A09',async()=>{await go('paper','#paper-setup');await waitFor(()=>appDocument()?.querySelector('mfrac'),'rendered paper fraction');const fraction=el('mfrac'),top=fraction.children[0].getBoundingClientRect(),bottom=fraction.children[1].getBoundingClientRect(),box=fraction.getBoundingClientRect();assert(top.width>0&&bottom.width>0&&top.top<bottom.top&&box.height>Math.max(top.height,bottom.height),'Fraction does not have stacked numerator/denominator geometry.');return 'Native fraction stacking measured on screen; print and assistive output remain manual.';});

  await step('A10',async()=>{
   const names={en:['Where is zero?','Moves, inverses and sign patterns','A change is not a final value'],'zh-Hant':['零在哪裏？','移動、逆運算與符號規律','變化不等於最後數值']};
   for(const language of ['en','zh-Hant']){
    if(appDocument().documentElement.lang!==language)click('[data-action="language"]');
    for(let i=0;i<3;i++){
     await go('lesson/SN-L'+(i+1),'.lesson-roadmap');await waitFor(()=>appDocument()?.querySelector('h1')?.textContent===names[language][i],'correct lesson title');
     assert(appDocument().querySelectorAll('.lesson-model').length===2,'Expected two worked models.');assert(appDocument().querySelectorAll('[aria-current="step"]').length===1,'Expected one current lesson.');
     frame.width='390';await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));
     const doc=appDocument(),overflow=Math.max(doc.body.scrollWidth,doc.documentElement.scrollWidth)-doc.documentElement.clientWidth;assert(overflow<=2,'Lesson horizontal overflow '+language+' '+i+': '+overflow);
    }
   }
   assert(['SN-L1','SN-L2','SN-L3'].every(id=>currentProfile().studied.includes('lesson:'+id+':v1')),'Study exposure was not retained.');
   click('[data-action="language"]');frame.width='1120';return 'All three lesson titles/models/routes checked in both languages; 390px overflow ≤2px; study exposure retained. Spoken accessibility and content review remain manual.';
  });
  await step('A11',async()=>{
   const ids=['SN01','SN02','SN03','SN04','SN05','SN06'];await startSession(ids,'check',6);input('#answer-input','-3/2');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'curriculum draft after reload');assert(el('#answer-input').value==='-3/2','Curriculum draft changed.');click('[data-action="language"]');
   for(let i=0;i<6;i++){
    const q=latestSession().items[i];assert(q.id===ids[i]&&q.version===1,'Wrong curriculum identity/version.');
    if(q.options){el('input[name="answer"][value="'+q.answer+'"]').click();el('#answer-form').requestSubmit();}else checkAnswer(q.answer,q.manualReason?'Final minus initial, with the sign interpreted as rise or fall.':'');
    assert(latestSession().responses[i].attempts.at(-1)?.status==='correct','Curriculum answer did not check.');
    if(q.manualReason){assert(el('#reason-review-status').textContent.includes('needs review'),'Reason was automatically verified.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Changed explanation');assert(latestSession().responses[i].manualReview===null,'Edited curriculum reason retained review.');}
    click('[data-action="next"]');
   }
   assert(latestSession().completedAt,'Curriculum check not completed.');return 'All six version-1 curriculum families checked; bilingual draft/reload and independent/manual reason labels exercised.';
  });
  await step('A12',async()=>{
   await go('paper','#paper-setup');const form=el('#paper-setup');form.querySelectorAll('[name="family"]').forEach(x=>x.checked=/^SN0[1-6]$/.test(x.value));form.querySelector('[name="count"]').value='6';form.requestSubmit();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'curriculum paper');
   assert(currentProfile().paper.items.every(i=>i.question.id.startsWith('SN')),'Development fixtures entered the curriculum paper.');assert(appDocument().querySelector('.signed-numberline'),'Missing paper number line.');
   change('#paper-lang','zh');
   const spec=currentProfile().paper,hash=await identity(spec);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'Chinese curriculum paper identity');click('[data-action="toggle-key"]');await waitFor(()=>appDocument()?.querySelector('.solution'),'Chinese curriculum key');assert(el('#paper-pages').textContent.includes('最後'),'Chinese contextual solution missing.');
   return 'Six curriculum snapshots, Chinese paper hash, number line and contextual solution key rendered. Actual PDF pagination remains a manual observation.';
  });

  await step('A13',async()=>{
   const names={en:['Say it, group it, write it','A pattern is a proposal','Follow the processing rule'],'zh-Hant':['說清、分組、寫成式','規律是一個有理由的提議','依規則處理輸入']};
   for(const language of ['en','zh-Hant']){
    if(appDocument().documentElement.lang!==language)click('[data-action="language"]');
    for(let i=0;i<3;i++){
     await go('lesson/EX-L'+(i+1),'.lesson-roadmap');await waitFor(()=>appDocument()?.querySelector('h1')?.textContent===names[language][i],'expression lesson title');assert(appDocument().querySelectorAll('.lesson-model').length===(i===0?3:2),'Expression model count mismatch.');
     frame.width='390';await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));const doc=appDocument();assert(Math.max(doc.body.scrollWidth,doc.documentElement.scrollWidth)-doc.documentElement.clientWidth<=2,'Expression lesson overflow '+language+' '+i);
    }
   }
   click('[data-action="language"]');frame.width='1120';return 'All three expression lessons, model counts and 390px reflow checked in English/Traditional Chinese.';
  });
  await step('A14',async()=>{
   await startSession(['EX01','EX02','EX03','EX04','EX05','EX06'],'check',6);
   for(let i=0;i<6;i++){
    const q=latestSession().items[i];if(q.options){el('input[name="answer"][value="'+q.answer+'"]').click();el('#answer-form').requestSubmit();}else checkAnswer(q.answer,q.manualReason?'A formula or rule that fits the stated quantities.':'');
    if(q.contract.type==='manual'){
     assert(latestSession().responses[i].attempts.at(-1).status==='manual','Manual response received an automatic correctness grade.');assert(el('.feedback').textContent.includes('not been automatically judged'),'Manual feedback missing.');
     click('[data-action="solution"]');click('[data-action="self-review"]');input('#answer-input','a revised proposal');assert(latestSession().responses[i].manualReview===null,'Answer editing retained self-review.');
     click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'manual draft reload');assert(el('#answer-input').value==='a revised proposal','Manual draft lost across language/reload.');click('[data-action="language"]');
     click('[data-action="self-review"]');assert(el('#action-error').textContent.includes('current answer'),'Unrecorded edit was allowed to self-review.');checkAnswer(q.answer,'The recorded proposal is now ready for manual review.');
    }
    click('[data-action="next"]');
   }
   assert(latestSession().completedAt,'Expression check not completed.');assert(appDocument().querySelector('.result-grid .metric strong').textContent==='4 / 4','Manual responses entered the automatic denominator.');assert(appDocument().querySelector('#main').textContent.includes('excluded from the automatic-score denominator'),'Manual-score explanation missing.');
   return 'All six expression families exercised; manual responses stayed ungraded, bilingual drafts survived, edits invalidated self-review, and automatic result remained 4/4.';
  });
  await step('A15',async()=>{
   await go('expressions','[data-action="expressions-paper"]');click('[data-action="expressions-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'expression paper');assert(currentProfile().paper.items.every(i=>i.question.id.startsWith('EX')),'Wrong families in expression paper.');
   change('#paper-lang','zh');const spec=currentProfile().paper,hash=await identity(spec);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'Chinese expression paper ID');click('[data-action="toggle-key"]');await waitFor(()=>appDocument()?.querySelector('.solution'),'expression key');assert(el('#paper-pages').textContent.includes('人工評閱'),'Manual rubric missing.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Untranslated choice object printed.');assert(appDocument().querySelector('msub'),'Sequence subscript not rendered.');
   return 'Six expression snapshots, translated choices, sequence subscript and Chinese manual rubrics rendered; actual PDF remains a separate observation.';
  });

  await step('A16',async()=>{
   const names={en:['What counts as a solution?','Keep every step equal','Model, solve, interpret'],'zh-Hant':['怎樣才算是方程的解？','每一步都保持相等','建模、求解、解釋']};
   for(const language of ['en','zh-Hant']){
    if(appDocument().documentElement.lang!==language)click('[data-action="language"]');
    for(let i=0;i<3;i++){
     await go('lesson/EQ-L'+(i+1),'.lesson-roadmap');await waitFor(()=>appDocument()?.querySelector('h1')?.textContent===names[language][i],'equation lesson title '+language+' '+i);assert(el('h1').textContent===names[language][i],'Equation lesson title mismatch.');assert(appDocument().querySelectorAll('.lesson-model').length===2,'Expected two equation models.');
     frame.width='390';await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));const doc=appDocument();assert(Math.max(doc.body.scrollWidth,doc.documentElement.scrollWidth)-doc.documentElement.clientWidth<=2,'Equation lesson horizontal overflow.');
    }
   }
   assert(['EQ-L1','EQ-L2','EQ-L3'].every(id=>currentProfile().studied.includes('lesson:'+id+':v1')),'Equation study exposure missing.');
   click('[data-action="language"]');frame.width='1120';return 'Three equation lessons, two models each, English/Traditional Chinese titles and 390px reflow checked; study exposure retained.';
  });
  await step('A17',async()=>{
   const ids=['EQ01','EQ02','EQ03','EQ04','EQ05','EQ06'];await startSession(ids,'check',6);
   for(let i=0;i<6;i++){
    const q=latestSession().items[i];assert(q.id===ids[i]&&q.version===1,'Wrong equation identity/version.');
    if(i===1){input('#answer-input','-3/2');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'equation numeric draft reload');assert(el('#answer-input').value==='-3/2','Equation draft lost.');click('[data-action="language"]');}
    const reason='Substitute in the original, preserve equality and interpret the given units.';
    if(q.options){el('input[name="answer"][value="'+q.answer+'"]').click();if(q.manualReason)input('#reason-input',reason);el('#answer-form').requestSubmit();}else checkAnswer(q.answer,q.manualReason?reason:'');
    assert(latestSession().responses[i].attempts.at(-1)?.status==='correct','Equation answer did not check.');
    if(q.manualReason){assert(el('#reason-review-status').textContent.includes('needs review'),'Equation reasoning was automatically verified.');click('[data-action="solution"]');click('[data-action="self-review"]');assert(latestSession().responses[i].manualReview==='self','Equation self-review not retained.');input('#reason-input','Revised reasoning');assert(latestSession().responses[i].manualReview===null,'Edited equation reason retained self-review.');}
    click('[data-action="next"]');
   }
   assert(latestSession().completedAt,'Equation session not completed.');assert(el('.result-grid .metric strong').textContent==='6 / 6','Equation automatic score mismatch.');assert(el('#main').textContent.includes('Correct final answers do not verify written reasoning'),'Equation takeaway missing.');return 'Six equation families checked; bilingual numeric draft/reload, manual-reason labels and edit invalidation exercised; automatic answer score 6/6.';
  });
  await step('A18',async()=>{
   await go('equations','[data-action="equations-paper"]');click('[data-action="equations-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'equations paper');assert(currentProfile().paper.items.every(i=>i.question.id.startsWith('EQ')),'Non-equation family in paper.');
   change('#paper-lang','zh');const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'Chinese equation paper identity');if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');await waitFor(()=>appDocument()?.querySelector('.solution'),'equation key');assert(el('#paper-pages').textContent.includes('人工評閱'),'Equation reasoning rubric missing.');assert(appDocument().querySelector('.equation-panels'),'Equation panels absent.');assert(appDocument().querySelector('.expression-table'),'Context cost table absent.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Untranslated equation choice object.');return 'Six retained equation snapshots, Chinese paper/key hash, substitution panels, fee tables and separate reasoning rubrics rendered; actual PDF remains pending.';
  });

  await step('A19',async()=>{
   const names={en:['Name the relation before calculating','Given parallel, or proving parallel?','From a diagram to a deduction'],'zh-Hant':['先辨關係，再作計算','已知平行，還是要判定平行？','由圖形走向演繹推論']};
   for(const language of ['en','zh-Hant']){
    if(appDocument().documentElement.lang!==language)click('[data-action="language"]');
    for(let i=0;i<3;i++){
     await go('lesson/GE-L'+(i+1),'.lesson-roadmap');await waitFor(()=>appDocument()?.querySelector('h1')?.textContent===names[language][i],'angle lesson title');assert(appDocument().querySelectorAll('.lesson-model').length===2,'Expected two geometry models.');assert(appDocument().querySelectorAll('.angle-geometry').length===2,'Geometry models missing.');frame.width='390';await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));const doc=appDocument();assert(Math.max(doc.body.scrollWidth,doc.documentElement.scrollWidth)-doc.documentElement.clientWidth<=2,'Geometry lesson horizontal overflow.');
    }
   }
   assert(['GE-L1','GE-L2','GE-L3'].every(id=>currentProfile().studied.includes('lesson:'+id+':v1')),'Geometry study exposure missing.');click('[data-action="language"]');frame.width='1120';return 'Three bilingual angle lessons, two geometry models each and 390px page reflow checked; content/diagram judgement remains manual.';
  });
  await step('A20',async()=>{
   const ids=['GE01','GE02','GE03','GE04','GE05','GE06'];await startSession(ids,'check',6);
   for(let i=0;i<6;i++){
    const q=latestSession().items[i];assert(q.id===ids[i]&&q.version===1,'Geometry identity/version mismatch.');const reason='I cite the given relation and justify each equality or deduction.';
    if(q.options){el('input[name="answer"][value="'+q.answer+'"]').click();if(q.manualReason)input('#reason-input',reason);el('#answer-form').requestSubmit();}else checkAnswer(q.answer,q.manualReason?reason:'');
    assert(latestSession().responses[i].attempts.at(-1)?.status===(q.id==='GE06'?'manual':'correct'),'Proof received an automatic grade or geometry answer failed.');
    if(q.manualReason){click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Revised geometric reasoning');assert(latestSession().responses[i].manualReview===null,'Edited geometry reason retained review.');}
    if(q.id==='GE06'){
     assert(latestSession().responses[i].priorExposure,'A redrawn general proof counted as fresh.');input('#answer-input','A revised proof outline');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'proof draft reload');assert(el('#answer-input').value==='A revised proof outline','Proof draft lost.');click('[data-action="language"]');click('[data-action="self-review"]');assert(el('#action-error').textContent.includes('current answer'),'Unrecorded proof edit could be self-reviewed.');checkAnswer(q.answer,reason);
    }
    click('[data-action="next"]');
   }
   assert(el('.result-grid .metric strong').textContent==='5 / 5','Proof entered automatic score denominator.');assert(el('#main').textContent.includes('excluded from the automatic-score denominator'),'Manual proof score notice missing.');return 'Six geometry families, 5/5 automatic answer score, wholly manual proof, redraw exposure, bilingual proof draft/reload and review invalidation checked.';
  });
  await step('A21',async()=>{
   await go('angles','[data-action="angles-paper"]');click('[data-action="angles-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'geometry paper');assert(currentProfile().paper.items.every(i=>i.question.id.startsWith('GE')),'Non-geometry family in paper.');change('#paper-lang','zh');const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'Chinese geometry paper identity');if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');await waitFor(()=>appDocument()?.querySelector('.solution'),'geometry key');assert(appDocument().querySelectorAll('.angle-geometry').length===6,'Expected six paper diagrams.');assert(el('#paper-pages').textContent.includes('人工評閱'),'Proof review rubric missing.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Untranslated geometry choice.');assert(currentProfile().paper.items.at(-1).question.contract.type==='manual','Proof contract changed.');return 'Six versioned geometry snapshots, Chinese paper/key hash, diagrams and manually reviewed proof rubric rendered; actual PDF remains separate.';
  });
  await step('A22',async()=>{
   await startSession(['SN01'],'check',4);input('#answer-input','-17');
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    const route=frame.contentWindow.location.hash,form=el('#answer-form'),before=JSON.stringify(currentProfile());
    click('a.skip');assert(frame.contentWindow.location.hash===route,'Skip link changed the route.');
    assert(el('#answer-form')===form,'Skip link rebuilt the answer form.');
    assert(el('#answer-input').value==='-17'&&JSON.stringify(currentProfile())===before,'Skip link changed the answer draft.');
    assert(appDocument().activeElement===el('#main'),'Skip link did not focus the main content.');
   }
   frame.width='390';await waitFor(()=>frame.contentWindow.innerWidth===390,'mobile viewport');
   click('[data-action="menu"]');assert(el('.main-column').inert,'Background remains keyboard-active while the menu is open.');
   assert(el('.sidebar').getAttribute('aria-modal')==='true','Menu lacks modal semantics.');
   const controls=[...appDocument().querySelectorAll('.sidebar a[href], .sidebar button')].filter(x=>x.getClientRects().length&&!x.disabled);
   const first=controls[0],last=controls.at(-1),key=(value,shift=false)=>appDocument().activeElement.dispatchEvent(new frame.contentWindow.KeyboardEvent('keydown',{key:value,shiftKey:shift,bubbles:true,cancelable:true}));
   first.focus();key('Tab',true);assert(appDocument().activeElement===last,'Reverse Tab escaped the menu.');
   key('Tab');assert(appDocument().activeElement===first,'Forward Tab escaped the menu.');
   key('Escape');assert(!el('.main-column').inert&&!el('.sidebar').classList.contains('open'),'Escape did not restore the background.');
   assert(appDocument().activeElement===el('.mobile-menu'),'Escape did not return focus to the menu button.');
   click('[data-action="menu"]');frame.width='1120';await waitFor(()=>!el('.main-column').inert,'desktop resize releases the menu');
   return 'English/Chinese skip links preserved the route, answer form and draft; mobile focus boundaries, background isolation, Escape and desktop resize passed. Synthetic key events check handlers; native keyboard and spoken output remain separate.';
  });
  await step('A23',async()=>{
   if(appDocument().documentElement.lang!=='en')click('[data-action="language"]');
   await go('lesson/EX-L1','.lesson-model');
   const rectangle=el('.lesson-model:last-child h3').textContent.includes('rectangle');
   const lessonText=el('.lesson-model:last-child details').textContent;
   assert(lessonText.includes('Manual review of the whole response'),'Lesson review criteria missing.');
   const halfFactor=text=>/bh\s*\/\s*2/.test(text);
   assert(halfFactor(lessonText)===!rectangle,'Lesson review criteria do not match the area shape.');
   await startSession(['EX03'],'check',4);
   for(let i=0;i<4;i++){
    const q=latestSession().items[i],triangle=q.model.shape==='triangle';
    for(const language of ['en','zh']){
     if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
     assert(halfFactor(el('#answer-form').textContent)===triangle,'Practice rubric does not match the retained area model in '+language+'.');
    }
    checkAnswer(triangle?'A = bh/2':'A = bh',triangle?'Two congruent triangles make a parallelogram; use square units.':'Multiply the perpendicular lengths; use square units.');
    assert(latestSession().responses[i].attempts.at(-1).status==='manual','Area formula was automatically graded.');click('[data-action="next"]');
   }
   const spec=await (await fetch('../samples/expressions/en_Specification.json',{cache:'no-store'})).json();
   assert(spec.items[2].question.model.shape==='rectangle','Expected retained rectangle sample.');
   await go('paper','#paper-import');input('#paper-import',JSON.stringify(spec));click('[data-action="import-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'imported marking paper');
   if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');
   for(const language of ['en','zh']){
    change('#paper-lang',language);const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'marking key language');
    const key=el('#paper-pages').textContent,area=el('#paper-pages').querySelectorAll('.paper-question')[2].querySelector('.solution').textContent;
    assert(!/(^|[^\d])0\s*(?:marks?|分)/.test(key),'Key contains zero-mark criteria.');
    assert(!area.includes('1/2')&&!area.includes(language==='zh'?'三角形':'triangle'),'Rectangle key requests triangle reasoning.');
   }
   const equations=await (await fetch('../samples/equations/en_Specification.json',{cache:'no-store'})).json();input('#paper-import',JSON.stringify(equations));click('[data-action="import-paper"]');await waitFor(()=>appDocument()?.querySelector('#paper-pages')?.textContent.includes('Linear equations'),'imported selection paper');
   change('[data-paper-index="0"][data-field="marks"]','1');const edited=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===edited.slice(0,12),'edited-mark key');
   const guide=el('#paper-pages .paper-question .solution').textContent;assert(guide.includes('Selection: 1 mark')&&guide.includes('no separate reason mark'),'One-mark choice guidance lost manual reason review.');
   return 'Lesson and English/Chinese practice criteria follow the actual area shape; retained rectangle paper/key and edited one-mark selection keep manual review without zero-mark criteria. Version-1 question snapshots remain valid.';
  });
  await step('A24',async()=>{
   const fixture=await (await fetch('../tests/fixtures/bundled-currency-v1.json',{cache:'no-store'})).json();
   await go('paper','#paper-import');const legacy=structuredClone(currentProfile().paper);legacy.title='Retained bundled fee snapshots';legacy.items=fixture.questions.map(question=>({question,marks:question.marks,lines:6}));
   input('#paper-import',JSON.stringify(legacy));click('[data-action="import-paper"]');await waitFor(()=>currentProfile().paper.title===legacy.title,'historical fee paper import');
   const before=JSON.stringify(currentProfile().paper);await reloadApplication();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'historical fee paper reload');assert(JSON.stringify(currentProfile().paper)===before,'Historical fee snapshots were rewritten or lost.');
   await startSession(['EQ05','EQ06'],'check',6);
   for(const q of latestSession().items)for(const language of ['en','zh'])assert((q.prompt[language].match(/\$/g)||[]).length===3,'Bundled fee prompt lost a literal currency marker.');
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    assert((el('.question-card h1').textContent.match(/\$/g)||[]).length===3,'Rendered fee prompt lost currency markers.');
   }
   return 'Published HTML preserves all three currency markers in both languages; exact historical bundled fee papers import and reload without changing retained snapshots. Modular/bundled parity and tamper rejection also have Node regressions.';
  });

  await step('A25',async()=>{
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    await go('basic','[data-action="basic-check"]');assert(el('.lesson-grid').children.length===3,'Missing basic lessons.');
    frame.width='390';await waitFor(()=>frame.contentWindow.innerWidth===390,'basic mobile viewport');
    for(const id of ['BC-L1','BC-L2','BC-L3']){
     await go('lesson/'+id,'[data-action="basic-lesson-check"]');await waitFor(()=>appDocument()?.querySelector('.lesson-roadmap [aria-current="step"]')?.getAttribute('href')==='#lesson/'+id,'current basic lesson '+id);assert(el('.lesson-roadmap').querySelectorAll('a').length===3,'Missing basic roadmap.');assert(el('.lesson-explanation').textContent.length>60,'Brief basic explanation.');assert(appDocument().documentElement.scrollWidth<=frame.contentWindow.innerWidth+1,'Basic lesson overflows at 390px.');
     assert(currentProfile().studied.includes('lesson:'+id+':v1'),'Basic study exposure not retained.');
    }
   }
   frame.width='1120';return 'Three lessons in both languages, study exposure, roadmap and 390px reflow passed.';
  });
  await step('A26',async()=>{
   if(appDocument().documentElement.lang!=='en')click('[data-action="language"]');
   await go('basic','[data-action="basic-check"]');click('[data-action="basic-check"]');await waitFor(()=>appDocument()?.querySelector('#answer-form'),'eight-family basic check');
   const s=latestSession();assert(s.items.length===8&&new Set(s.items.map(q=>q.id)).size===8,'Not all eight families present.');
   click('input[name="answer"][value="yes"]');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('input[name="answer"][value="yes"]'),'basic draft reload');assert(el('input[name="answer"][value="yes"]').checked&&latestSession().responses[0].input==='yes'&&latestSession().id===s.id,'Basic draft changed on reload.');click('[data-action="language"]');
   for(let i=0;i<8;i++){
    const q=latestSession().items[i];checkAnswer(q.answer,q.manualReason?'Method and exponent choice need review.':'');assert(latestSession().responses[i].attempts.at(-1).status==='correct','Basic answer not accepted.');
    if(q.manualReason){assert(latestSession().responses[i].manualReview===null,'Reason automatically verified.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Edited method');assert(latestSession().responses[i].manualReview===null,'Reason edit retained review.');}
    click('[data-action="next"]');
   }
   assert(el('.result-grid').textContent.includes('8 / 8'),'Basic automatic denominator wrong.');return 'All eight families answered, bilingual draft reloaded, reasoning remained separate and edits invalidated review.';
  });
  await step('A27',async()=>{
   await go('basic','[data-action="basic-paper"]');click('[data-action="basic-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'basic paper');
   assert(currentProfile().paper.items.length===8,'Basic paper omitted a family.');const snapshot=JSON.stringify(currentProfile().paper);
   await reloadApplication();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'basic paper reopen');assert(JSON.stringify(currentProfile().paper)===snapshot,'Basic paper snapshots changed on reload.');
   if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');
   for(const language of ['en','zh']){
    change('#paper-lang',language);const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'basic paper identity');
    assert(el('#paper-pages').querySelectorAll('.paper-question').length===8,'Basic question numbering changed.');assert(el('#paper-pages').querySelectorAll('.solution').length===8,'Basic key incomplete.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Choice labels not translated.');assert(el('#paper-pages').querySelectorAll('msup').length>=1,'Power exponent not rendered as a superscript.');
    const reason=el('#paper-pages .paper-question .solution').textContent;assert(reason.includes(language==='en'?'manual review':'人工'),'Basic reason lost manual status.');
   }
   return 'Eight snapshots survived reload; language-sensitive identities, MathML powers, choice labels and manual criteria passed.';
  });
  await step('A28',async()=>{
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    await go('percentages','[data-action="percentages-check"]');assert(el('.lesson-grid').children.length===4,'Missing percentages lessons.');
    frame.width='390';await waitFor(()=>frame.contentWindow.innerWidth===390,'percentages mobile viewport');
    for(const id of ['PC-L1','PC-L2','PC-L3','PC-L4']){
     await go('lesson/'+id,'[data-action="percentages-lesson-check"]');await waitFor(()=>appDocument()?.querySelector('.lesson-roadmap [aria-current="step"]')?.getAttribute('href')==='#lesson/'+id,'current percentages lesson '+id);assert(el('.lesson-roadmap').querySelectorAll('a').length===4,'Missing percentages roadmap.');assert(el('.lesson-explanation').textContent.length>60,'Brief percentages explanation.');assert(appDocument().documentElement.scrollWidth<=frame.contentWindow.innerWidth+1,'Percentage lesson overflows at 390px.');
     assert(currentProfile().studied.includes('lesson:'+id+':v1'),'Percentage study exposure not retained.');
    }
   }
   frame.width='1120';return 'Four lessons in both languages, study exposure, roadmap and 390px reflow passed.';
  });
  await step('A29',async()=>{
   if(appDocument().documentElement.lang!=='en')click('[data-action="language"]');
   await go('percentages','[data-action="percentages-check"]');click('[data-action="percentages-check"]');await waitFor(()=>appDocument()?.querySelector('#answer-form'),'eight-family percentages check');
   const s=latestSession();assert(s.items.length===8&&new Set(s.items.map(q=>q.id)).size===8,'Not all eight families present.');
   input('#answer-input','-50/3');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'percentages draft reload');assert(el('#answer-input').value==='-50/3'&&latestSession().responses[0].input==='-50/3'&&latestSession().id===s.id,'Percentage draft changed on reload.');click('[data-action="language"]');
   for(let i=0;i<8;i++){
    const q=latestSession().items[i];checkAnswer(q.answer,q.manualReason?'Base quantity and interpretation need review.':'');assert(latestSession().responses[i].attempts.at(-1).status==='correct','Percentage answer not accepted.');
    if(q.manualReason){assert(latestSession().responses[i].manualReview===null,'Reason automatically verified.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Edited method');assert(latestSession().responses[i].manualReview===null,'Reason edit retained review.');}
    click('[data-action="next"]');
   }
   assert(el('.result-grid').textContent.includes('8 / 8'),'Percentage automatic denominator wrong.');return 'All eight families answered, bilingual draft reloaded, reasoning remained separate and edits invalidated review.';
  });
  await step('A30',async()=>{
   await go('percentages','[data-action="percentages-paper"]');click('[data-action="percentages-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'percentages paper');
   assert(currentProfile().paper.items.length===8,'Percentage paper omitted a family.');const snapshot=JSON.stringify(currentProfile().paper);
   await reloadApplication();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'percentages paper reopen');assert(JSON.stringify(currentProfile().paper)===snapshot,'Percentage paper snapshots changed on reload.');
   if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');
   for(const language of ['en','zh']){
    change('#paper-lang',language);const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'percentages paper identity');
    assert(el('#paper-pages').querySelectorAll('.paper-question').length===8,'Percentage question numbering changed.');assert(el('#paper-pages').querySelectorAll('.solution').length===8,'Percentage key incomplete.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Choice labels not translated.');assert(el('#paper-pages').querySelectorAll('.percentage-model').length>=1,'Percentage reference diagrams missing.');
    const reason=el('#paper-pages .paper-question .solution').textContent;assert(reason.includes(language==='en'?'manual review':'人工'),'Percentage reason lost manual status.');
   }
   return 'Eight snapshots survived reload; language-sensitive identities, MathML reference diagrams, values and manual criteria passed.';
  });
  await step('A31',async()=>{
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    await go('ratios','[data-action="ratios-check"]');assert(el('.lesson-grid').children.length===4,'Missing ratios lessons.');
    frame.width='390';await waitFor(()=>frame.contentWindow.innerWidth===390,'ratios mobile viewport');
    for(const id of ['RP-L1','RP-L2','RP-L3','RP-L4']){
     await go('lesson/'+id,'[data-action="ratios-lesson-check"]');await waitFor(()=>appDocument()?.querySelector('.lesson-roadmap [aria-current="step"]')?.getAttribute('href')==='#lesson/'+id,'current ratios lesson '+id);assert(el('.lesson-roadmap').querySelectorAll('a').length===4,'Missing ratios roadmap.');assert(el('.lesson-explanation').textContent.length>60,'Brief ratios explanation.');assert(appDocument().documentElement.scrollWidth<=frame.contentWindow.innerWidth+1,'Rate/ratio lesson overflows at 390px.');
     assert(currentProfile().studied.includes('lesson:'+id+':v1'),'Rate/ratio study exposure not retained.');
    }
   }
   frame.width='1120';return 'Four lessons in both languages, study exposure, roadmap and 390px reflow passed.';
  });
  await step('A32',async()=>{
   if(appDocument().documentElement.lang!=='en')click('[data-action="language"]');
   await go('ratios','[data-action="ratios-check"]');click('[data-action="ratios-check"]');await waitFor(()=>appDocument()?.querySelector('#answer-form'),'eight-family ratios check');
   const s=latestSession();assert(s.responses[6].priorExposure===true,'Studied ratio rule was relabelled fresh.');assert(s.items.length===8&&new Set(s.items.map(q=>q.id)).size===8,'Not all eight families present.');
   click('input[name="answer"][value="simplest"]');click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('input[name="answer"][value="simplest"]'),'ratios draft reload');assert(el('input[name="answer"][value="simplest"]').checked&&latestSession().responses[0].input==='simplest'&&latestSession().id===s.id,'Rate/ratio draft changed on reload.');click('[data-action="language"]');
   for(let i=0;i<8;i++){
    const q=latestSession().items[i];checkAnswer(q.answer,q.manualReason?'Base quantity and interpretation need review.':'');assert(latestSession().responses[i].attempts.at(-1).status==='correct','Rate/ratio answer not accepted.');
    if(q.manualReason){assert(latestSession().responses[i].manualReview===null,'Reason automatically verified.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Edited method');assert(latestSession().responses[i].manualReview===null,'Reason edit retained review.');}
    click('[data-action="next"]');
   }
   assert(el('.result-grid').textContent.includes('8 / 8'),'Rate/ratio automatic denominator wrong.');return 'All eight families answered, bilingual draft reloaded, reasoning remained separate and edits invalidated review.';
  });
  await step('A33',async()=>{
   await go('ratios','[data-action="ratios-paper"]');click('[data-action="ratios-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'ratios paper');
   assert(currentProfile().paper.items.length===8,'Rate/ratio paper omitted a family.');const snapshot=JSON.stringify(currentProfile().paper);
   await reloadApplication();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'ratios paper reopen');assert(JSON.stringify(currentProfile().paper)===snapshot,'Rate/ratio paper snapshots changed on reload.');
   if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');
   for(const language of ['en','zh']){
    change('#paper-lang',language);const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'ratios paper identity');
    assert(el('#paper-pages').querySelectorAll('.paper-question').length===8,'Rate/ratio question numbering changed.');assert(el('#paper-pages').querySelectorAll('.solution').length===8,'Rate/ratio key incomplete.');assert(!el('#paper-pages').textContent.includes('[object Object]'),'Choice labels not translated.');assert(el('#paper-pages').querySelectorAll('.ratio-model').length>=1,'Rate/ratio reference diagrams missing.');
    const reason=el('#paper-pages .paper-question .solution').textContent;assert(reason.includes(language==='en'?'manual review':'人工'),'Rate/ratio reason lost manual status.');
   }
   return 'Eight snapshots survived reload; language-sensitive identities, MathML reference diagrams, values and manual criteria passed.';
  });
  await step('A34',async()=>{
   for(const language of ['en','zh']){
    if(appDocument().documentElement.lang!==(language==='zh'?'zh-Hant':'en'))click('[data-action="language"]');
    await go('estimation','[data-action="estimation-check"]');assert(el('.lesson-grid').children.length===4,'Missing estimation lessons.');
    frame.width='390';await waitFor(()=>frame.contentWindow.innerWidth===390,'estimation mobile viewport');
    for(const id of ['AP-L1','AP-L2','AP-L3','AP-L4']){
     await go('lesson/'+id,'[data-action="estimation-lesson-check"]');await waitFor(()=>appDocument()?.querySelector('.lesson-roadmap [aria-current="step"]')?.getAttribute('href')==='#lesson/'+id,'current estimation lesson '+id);assert(el('.lesson-roadmap').querySelectorAll('a').length===4,'Missing estimation roadmap.');assert(el('.lesson-explanation').textContent.length>60,'Brief estimation explanation.');assert(appDocument().documentElement.scrollWidth<=frame.contentWindow.innerWidth+1,'Estimation lesson overflows at 390px.');
     assert(currentProfile().studied.includes('lesson:'+id+':v1'),'Estimation study exposure not retained.');
    }
   }
   frame.width='1120';return 'Four lessons in both languages, study exposure, roadmap and 390px reflow passed.';
  });

  await step('A35',async()=>{
   if(appDocument().documentElement.lang!=='en')click('[data-action="language"]');
   await go('estimation','[data-action="estimation-check"]');click('[data-action="estimation-check"]');await waitFor(()=>appDocument()?.querySelector('#answer-form'),'seven core estimation questions');
   const core=latestSession();assert(core.items.length===7&&core.items.every(q=>q.id!=='AP08'),'Optional enrichment forced into core check.');
   assert(core.responses[0].priorExposure,'Studied report type became fresh after number renaming.');
   checkAnswer(core.items[0].answer,'The report type determines exactness.');click('[data-action="next"]');
   const q=latestSession().items[1],draft=q.answer;input('#answer-input',draft);click('[data-action="language"]');await reloadApplication();await waitFor(()=>appDocument()?.querySelector('#answer-input'),'rounding draft reload');assert(el('#answer-input').value===draft&&latestSession().id===core.id,'Precision zeros lost in draft reload.');click('[data-action="language"]');
   const extraZero=draft.includes('.')?draft+'0':draft+'.0';checkAnswer(extraZero,'Report precision');assert(latestSession().responses[1].attempts.at(-1).status==='wrong-form','Extra decimal place was accepted.');assert(el('.feedback').textContent.includes('precision'),'Precision feedback missing.');
   for(let i=1;i<7;i++){const item=latestSession().items[i];checkAnswer(item.answer,'Rounding direction, purpose and units');assert(latestSession().responses[i].attempts.at(-1).status==='correct','Core estimate rejected.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','Edited interpretation');assert(latestSession().responses[i].manualReview===null,'Edited explanation stayed reviewed.');click('[data-action="next"]');}
   assert(el('.result-grid').textContent.includes('7 / 7'),'Core score denominator wrong.');
   await go('lesson/AP-L4','[data-action="estimation-lesson-check"]');click('[data-action="estimation-lesson-check"]');await waitFor(()=>appDocument()?.querySelector('#answer-form'),'manual optional investigation');assert(latestSession().items.length===1&&latestSession().items[0].contract.type==='manual','Optional task is not one manual investigation.');
   checkAnswer('I choose a justified planning estimate.','State purpose, assumptions, alternative range and limitations.');assert(latestSession().responses[0].attempts.at(-1).status==='manual','Open strategy automatically judged.');click('[data-action="solution"]');click('[data-action="self-review"]');input('#reason-input','A revised limitation');assert(latestSession().responses[0].manualReview===null,'Edited investigation stayed reviewed.');click('[data-action="next"]');
   assert(el('.result-grid').textContent.includes('excluded')||el('#main').textContent.includes('excluded from'),'Manual-score exclusion missing.');
   return 'Seven core answers, precision-specific wrong form, trailing-zero draft reload, edited reasons and wholly manual optional investigation passed.';
  });
  await step('A36',async()=>{
   await go('estimation','[data-action="estimation-paper"]');click('[data-action="estimation-paper"]');await waitFor(()=>appDocument()?.querySelector('.paper-page'),'core estimation paper');assert(currentProfile().paper.items.length===7&&currentProfile().paper.items.every(i=>i.question.id!=='AP08'),'Optional task forced into core paper.');
   const snapshot=JSON.stringify(currentProfile().paper);await reloadApplication();await waitFor(()=>appDocument()?.querySelector('.paper-page'),'estimation paper reload');assert(JSON.stringify(currentProfile().paper)===snapshot,'Rounding snapshots changed on reload.');
   const mixed=structuredClone(currentProfile().paper);mixed.title='Core and optional estimation review';mixed.items.push({question:latestSession().items[0],marks:4,lines:6});
   input('#paper-import',JSON.stringify(mixed));click('[data-action="import-paper"]');await waitFor(()=>currentProfile().paper.items.length===8,'explicit optional paper import');if(!appDocument().querySelector('.solution'))click('[data-action="toggle-key"]');
   for(const language of ['en','zh']){change('#paper-lang',language);const hash=await identity(currentProfile().paper);await waitFor(()=>appDocument()?.querySelector('#paper-id')?.textContent===hash.slice(0,12),'estimation bilingual identity');assert(el('#paper-pages').querySelectorAll('.solution').length===8,'Estimation key incomplete.');assert(el('#paper-pages').textContent.includes(language==='en'?'All 4 marks require manual review':'全題 4 分需人工評閱'),'Optional key lost wholly manual marking.');assert(el('#paper-pages').querySelector('.estimation-model'),'Rounding model missing.');}
   return 'Seven-question core paper survived reload; optional investigation added explicitly; both languages kept all eight keys and wholly manual marking.';
  });
 }catch(error){document.querySelector('#summary').textContent='Runner could not finish: '+error.message;}
 finally{setBusy(false);drawResults();summary();}
});
document.querySelector('#width').addEventListener('change',e=>{frame.width=e.target.value;});
document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>{if(run&&!busy)frame.contentWindow.location.hash=button.dataset.route;}));
document.querySelector('#language').addEventListener('click',()=>{if(run&&!busy)try{click('[data-action="language"]');}catch(error){document.querySelector('#summary').textContent=error.message;}});
document.querySelector('#reload').addEventListener('click',()=>{if(run&&!busy)frame.contentWindow.location.reload();});
document.querySelector('#clear').addEventListener('click',()=>{if(!run||busy)return;try{frame.src='about:blank';clearOwnStorage();document.querySelector('#summary').textContent='This run’s isolated test data was cleared. Recorded observations remain available for export.';}catch(error){document.querySelector('#summary').textContent='Could not clear this run’s data: '+error.message;}});
document.querySelector('#export').addEventListener('click',()=>{if(!run||busy){document.querySelector('#summary').textContent='Run the checks before exporting an evidence record.';return;}const url=URL.createObjectURL(new Blob([JSON.stringify(report(),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Secondary_MathQuiz_Acceptance_'+run+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
