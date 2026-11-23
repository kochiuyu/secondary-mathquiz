// Integration checks of application event wiring with a minimal DOM adapter.
// These do not replace browser rendering, accessibility or print inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PREFIX} from '../src/app/storage.mjs';
const data=fs.readFileSync(new URL('../curriculum/catalogue.json',import.meta.url),'utf8');
const memory=new Map(),root={innerHTML:'',events:{},addEventListener(k,fn){this.events[k]=fn;}};
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',focus(){document.activeElement=this;},scrollIntoView(){},classList:{toggle(){},remove(){}},setAttribute(){},removeAttribute(){}});return nodes.get(id);}
const winEvents={};let href='file:///portable/Secondary_MathQuiz_Prototype.html',hash='';
globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
globalThis.location={get href(){return href;},get hash(){return hash;},set hash(v){hash=v.startsWith('#')?v:'#'+v;href=href.split('#')[0]+hash;winEvents.hashchange?.();}};
globalThis.history={replaceState(a,b,url){href=String(url);hash=new URL(href).hash;}};
globalThis.window={addEventListener:(k,fn)=>winEvents[k]=fn,scrollTo(){}};
globalThis.document={documentElement:{lang:'en'},title:'',querySelector(selector){if(selector==='#app')return root;if(selector==='#embedded-curriculum')return {textContent:data};return node(selector);},createElement(){return {setAttribute(){},click(){},remove(){}};},body:{append(){}}};
globalThis.FormData=class{constructor(form){this.fields=form.fields;}get(k){const v=this.fields[k];return Array.isArray(v)?v[0]:v;}getAll(k){const v=this.fields[k];return Array.isArray(v)?v:[v].filter(Boolean);}};
const submit=(id,fields)=>root.events.submit({preventDefault(){},target:{id,fields}});
const click=async(action,dataset={})=>root.events.click({preventDefault(){},target:{closest(){return {dataset:{action,...dataset},type:'submit',form:null};}}});
const input=(id,name,value)=>root.events.input({target:{id,name,value}});
const profile=()=>JSON.parse(memory.get(PREFIX+'learner-1'));
async function waitForPaper(){
 const deadline=Date.now()+2000;
 while(!node('#paper-pages').innerHTML&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,5));
 assert.ok(node('#paper-pages').innerHTML,'Paper preview did not finish its asynchronous digest.');
}
await import('../src/app/app.mjs');

test('application routes, bilingual draft preservation, completion, catalogue and paper wiring',async()=>{
 assert.match(root.innerHTML,/A little clarity/);
 await click('menu');assert.match(root.innerHTML,/Close navigation/);await click('menu');
 submit('session-setup',{family:['signed','expression','equation','angle'],mode:'check',count:'4'});
 assert.match(location.hash,/#session\//);assert.match(root.innerHTML,/Check answer/);
 assert.equal((root.innerHTML.match(/aria-current="page"/g)||[]).length,1);
 const sessionId=profile().sessions[0].id;
 input('answer-input','answer','1/2');await click('language');
 assert.equal(document.documentElement.lang,'zh-Hant');assert.ok(root.innerHTML.includes('value="1/2"'));assert.equal(profile().sessions[0].responses[0].input,'1/2');
 // Leave and resume the exact draft.
 location.hash='home';assert.match(root.innerHTML,/繼續上次練習/);location.hash='session/'+sessionId;assert.ok(root.innerHTML.includes('value="1/2"'));
 const first=profile().sessions[0].items[0];submit('answer-form',{answer:first.math,reason:''});
 assert.match(root.innerHTML,/請填寫最終數值或分數/);assert.match(root.innerHTML,/請完成計算/);
 for(let i=0;i<4;i++){
  const s=profile().sessions[0];const q=s.items[i];submit('answer-form',{answer:q.answer,reason:i===3?'直線上的鄰角之和為 180°。':''});
  assert.match(root.innerHTML,/答案正確/);
  if(i===3){await click('solution');await click('self-review');assert.equal(profile().sessions[0].responses[i].manualReview,'self');input('reason-input','reason','已修改的理由');assert.equal(profile().sessions[0].responses[i].manualReview,null);assert.match(node('#reason-review-status').textContent,/仍需評閱/);}
  await click('next');
 }
 assert.ok(profile().sessions[0].completedAt);assert.match(root.innerHTML,/看看這次的收穫/);
 location.hash='catalogue';assert.match(node('#catalogue-count').textContent,/52/);assert.equal((root.innerHTML.match(/data-action="clear-filters"/g)||[]).length,1);input('catalogue-search','','JS8.1');assert.match(node('#catalogue-count').textContent,/1 個課題/);assert.match(location.href,/q=JS8.1/);
 await click('clear-filters');assert.equal(new URL(location.href).searchParams.has('q'),false);assert.match(node('#catalogue-count').textContent,/52/);
 location.hash='topic/js-8';assert.match(root.innerHTML,/一元一次方程/);
 location.hash='paper';submit('paper-setup',{family:['signed','expression','equation','angle'],count:'6'});
 await waitForPaper();assert.equal(profile().paper.items.length,6);assert.match(root.innerHTML,/列印／儲存 PDF/);assert.match(node('#paper-pages').innerHTML,/paper-page/);
 await click('paper-down',{index:'0'});assert.equal(profile().paper.items[0].question.id,'expression');
 input('paper-title','','Newest title');assert.equal(node('#paper-pages').innerHTML,'');assert.equal(node('#paper-id').textContent,'…');
 await waitForPaper();assert.match(node('#paper-pages').innerHTML,/Newest title/);
 location.hash='progress';
 const backup={kind:'secondary-mathquiz-progress',schema:1,profile:profile()};node('#progress-import').value=JSON.stringify(backup);await click('review-progress');assert.match(node('#import-review').innerHTML,/取消匯入/);
 await click('cancel-progress');assert.equal(node('#import-review').innerHTML,'');assert.equal(profile().sessions.length,1);
 await click('review-progress');node('#progress-import').value='{';await click('review-progress');assert.equal(node('#import-review').innerHTML,'');await click('confirm-progress');assert.equal(profile().sessions.length,1);assert.match(node('#action-error').textContent,/Review this backup/);
 submit('profile-form',{name:'Second learner'});const registry=JSON.parse(memory.get(PREFIX+'profiles'));assert.equal(registry.profiles.length,2);assert.equal(profile().sessions.length,1);assert.match(root.innerHTML,/0<\/strong>/);
});

test('signed lessons, exposure-aware check, bilingual resume, manual reason and curriculum paper wiring',async()=>{
 await click('language'); // Return from the retained legacy test's Chinese view to English.
 location.hash='signed';assert.match(root.innerHTML,/From a reference/);assert.match(root.innerHTML,/SN-L3/);
 location.hash='lesson/SN-L3';assert.match(root.innerHTML,/A change is not a final value/);assert.match(root.innerHTML,/lesson-check/);
 const reg=()=>JSON.parse(memory.get(PREFIX+'profiles'));
 const current=()=>JSON.parse(memory.get(PREFIX+reg().active));
 assert.ok(current().studied.includes('lesson:SN-L3:v1'));
 await click('lesson-check',{lesson:'SN-L3'});assert.match(location.hash,/#session\//);
 let s=current().sessions.at(-1);assert.deepEqual(s.items.map(q=>q.id),['SN05','SN06','SN05','SN06']);
 input('answer-input','answer','-3/2');await click('language');assert.ok(root.innerHTML.includes('value="-3/2"'));await click('language');
 for(let i=0;i<4;i++){
  s=current().sessions.at(-1);const q=s.items[i];submit('answer-form',{answer:q.answer,reason:q.manualReason?'Final minus initial; the sign indicates the direction.':''});
  if(q.manualReason){assert.match(root.innerHTML,/still needs review/);await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');}
  await click('next');
 }
 assert.match(root.innerHTML,/Carry the idea forward/);assert.ok(current().sessions.at(-1).completedAt);
 location.hash='paper';submit('paper-setup',{family:['SN01','SN02','SN03','SN04','SN05','SN06'],count:'6'});
 await waitForPaper();assert.deepEqual(current().paper.items.map(i=>i.question.id),['SN01','SN02','SN03','SN04','SN05','SN06']);assert.match(node('#paper-pages').innerHTML,/signed-numberline/);
});

test('expression routes, bilingual manual drafts, review invalidation and automatic-score denominator integrate',async()=>{
 location.hash='expressions';assert.match(root.innerHTML,/Make meaning clear/);location.hash='lesson/EX-L2';assert.match(root.innerHTML,/A pattern is a proposal/);
 const reg=()=>JSON.parse(memory.get(PREFIX+'profiles')),current=()=>JSON.parse(memory.get(PREFIX+reg().active));
 assert.ok(current().studied.includes('lesson:EX-L2:v1'));
 await click('expressions-check');assert.deepEqual(current().sessions.at(-1).items.map(q=>q.id),['EX01','EX02','EX03','EX04','EX05','EX06']);
 for(let i=0;i<6;i++){
  const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:q.manualReason?'This formula or proposed rule models every stated quantity.':''});
  if(q.contract.type==='manual'){
   assert.match(root.innerHTML,/not been automatically judged correct/);assert.equal(current().sessions.at(-1).responses[i].attempts.at(-1).status,'manual');
   await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');
   input('answer-input','answer','changed proposal');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);
   await click('language');assert.ok(root.innerHTML.includes('value="changed proposal"'));await click('language');
   await click('self-review');assert.match(node('#action-error').textContent,/current answer/);
   submit('answer-form',{answer:q.answer,reason:'A revised explanation consistent with the model.'});
  }
  await click('next');
 }
 assert.match(root.innerHTML,/4 \/ 4/);assert.match(root.innerHTML,/excluded from the automatic-score denominator/);assert.match(root.innerHTML,/Keep the meaning/);
 location.hash='expressions';await click('expressions-paper');await waitForPaper();assert.equal(current().paper.items.length,6);assert.ok(current().paper.items.every(i=>i.question.id.startsWith('EX')));assert.ok(!node('#paper-pages').innerHTML.includes('[object Object]'));
});

test('equation lesson routes, six-family checks, reviewed reasoning and paper integrate with retained app',async()=>{
 location.hash='equations';assert.match(root.innerHTML,/Preserve equality/);location.hash='lesson/EQ-L1';assert.match(root.innerHTML,/What counts as a solution/);
 const reg=()=>JSON.parse(memory.get(PREFIX+'profiles')),current=()=>JSON.parse(memory.get(PREFIX+reg().active));assert.ok(current().studied.includes('lesson:EQ-L1:v1'));
 await click('equations-check');assert.deepEqual(current().sessions.at(-1).items.map(q=>q.id),['EQ01','EQ02','EQ03','EQ04','EQ05','EQ06']);
 for(let i=0;i<6;i++){
  const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:q.manualReason?'I check the original equality and interpret the units.':''});
  if(q.manualReason){assert.match(root.innerHTML,/still needs review/);await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');input('reason-input','reason','Revised reasoning');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);}
  await click('next');
 }
 assert.match(root.innerHTML,/6 \/ 6/);assert.match(root.innerHTML,/Preserve equality and interpret/);
 location.hash='equations';await click('equations-paper');await waitForPaper();assert.ok(current().paper.items.every(i=>i.question.id.startsWith('EQ')));assert.match(node('#paper-pages').innerHTML,/equation-panels/);
});

test('angle routes, manual proof, appearance exposure and five-answer score integrate with the four-topic app',async()=>{
 location.hash='angles';assert.match(root.innerHTML,/Start with the givens/);location.hash='lesson/GE-L3';assert.match(root.innerHTML,/From a diagram to a deduction/);
 const reg=()=>JSON.parse(memory.get(PREFIX+'profiles')),current=()=>JSON.parse(memory.get(PREFIX+reg().active));assert.ok(current().studied.includes('lesson:GE-L3:v1'));await click('angles-check');assert.deepEqual(current().sessions.at(-1).items.map(q=>q.id),['GE01','GE02','GE03','GE04','GE05','GE06']);
 for(let i=0;i<6;i++){
  const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:q.manualReason?'I state the premise and justify every geometric step.':''});
  if(q.manualReason){await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');input('reason-input','reason','A revised geometric reason');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);}
  if(q.id==='GE06'){assert.equal(current().sessions.at(-1).responses[i].attempts.at(-1).status,'manual');assert.equal(current().sessions.at(-1).responses[i].priorExposure,true);assert.match(root.innerHTML,/whole proof requires manual review/);}
  await click('next');
 }
 assert.match(root.innerHTML,/5 \/ 5/);assert.match(root.innerHTML,/A conclusion needs its givens/);location.hash='angles';await click('angles-paper');await waitForPaper();assert.ok(current().paper.items.every(i=>i.question.id.startsWith('GE')));assert.match(node('#paper-pages').innerHTML,/angle-geometry/);location.hash='home';assert.match(root.innerHTML,/Nine connected topics/);
});

test('skip navigation preserves the current route, content and answer draft',async()=>{
 location.hash='setup/check';
 submit('session-setup',{family:['SN01'],mode:'check',count:'1'});
 input('answer-input','answer','-17');
 const before={hash:location.hash,html:root.innerHTML,profile:JSON.stringify(profile())};
 let prevented=false;
 winEvents.click({preventDefault(){prevented=true;},target:{closest(){return true;}}});
 assert.ok(prevented);assert.equal(document.activeElement,node('#main'));
 assert.equal(location.hash,before.hash);assert.equal(root.innerHTML,before.html);assert.equal(JSON.stringify(profile()),before.profile);
 location.hash='home';
});

test('basic learning routes, eight-family checks, bilingual draft resume and matching paper integrate',async()=>{
 const current=()=>JSON.parse(memory.get(PREFIX+JSON.parse(memory.get(PREFIX+'profiles')).active));
 if(document.documentElement.lang!=='en')await click('language');
 location.hash='basic';assert.match(root.innerHTML,/Practise all eight families/);
 for(const id of ['BC-L1','BC-L2','BC-L3']){location.hash='lesson/'+id;assert.match(root.innerHTML,/basic-lesson-check/);assert.ok(current().studied.includes('lesson:'+id+':v1'));}
 await click('basic-lesson-practice',{lesson:'BC-L3'});assert.match(location.hash,/#learn\//);assert.ok(current().sessions.at(-1).items.every(q=>['BC06','BC07','BC08'].includes(q.id)));
 location.hash='basic';await click('basic-check');const sid=current().sessions.at(-1).id;assert.equal(current().sessions.at(-1).items.length,8);
 input('answer-input','answer','1/3');await click('language');assert.equal(current().sessions.at(-1).responses[0].input,'1/3');await click('language');
 for(let i=0;i<8;i++){const s=current().sessions.at(-1);submit('answer-form',{answer:s.items[i].answer,reason:s.items[i].manualReason?'Checked method':''});await click('next');}
 assert.equal(current().sessions.at(-1).id,sid);assert.match(root.innerHTML,/8 \/ 8/);assert.ok(current().sessions.at(-1).responses.filter(r=>r.reason).every(r=>r.manualReview===null));
 location.hash='basic';await click('basic-paper');await waitForPaper();assert.equal(current().paper.items.length,8);assert.equal((node('#paper-pages').innerHTML.match(/class="paper-question"/g)||[]).length,8);
 location.hash='home';
});

test('percentage lessons, exact eight-family check, reviewed reasons, bilingual drafts and paper integrate',async()=>{
 const current=()=>JSON.parse(memory.get(PREFIX+JSON.parse(memory.get(PREFIX+'profiles')).active));
 if(document.documentElement.lang!=='en')await click('language');
 location.hash='topic/js-5';assert.match(root.innerHTML,/Learn percentages/);
 location.hash='percentages';assert.match(root.innerHTML,/Percent of what/);
 for(const id of ['PC-L1','PC-L2','PC-L3','PC-L4']){location.hash='lesson/'+id;assert.match(root.innerHTML,/percentages-lesson-check/);assert.ok(current().studied.includes('lesson:'+id+':v1'));}
 await click('percentages-lesson-practice',{lesson:'PC-L3'});assert.match(location.hash,/#learn\//);assert.ok(current().sessions.at(-1).items.every(q=>['PC06','PC07'].includes(q.id)));
 location.hash='percentages';await click('percentages-check');const id=current().sessions.at(-1).id;assert.equal(current().sessions.at(-1).items.length,8);
 input('answer-input','answer','-50/3');await click('language');assert.ok(root.innerHTML.includes('value="-50/3"'));await click('language');
 for(let i=0;i<8;i++){const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:'Reference quantity and model'});assert.equal(current().sessions.at(-1).responses[i].attempts.at(-1).status,'correct');await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');input('reason-input','reason','Revised reference');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);await click('next');}
 assert.equal(current().sessions.at(-1).id,id);assert.match(root.innerHTML,/8 \/ 8/);assert.match(root.innerHTML,/Name the base and track/);
 location.hash='percentages';await click('percentages-paper');await waitForPaper();assert.equal(current().paper.items.length,8);assert.ok(current().paper.items.every(i=>i.question.id.startsWith('PC')));
 assert.match(node('#paper-pages').innerHTML,/percentage-model/);location.hash='home';assert.match(root.innerHTML,/Nine connected topics/);
});



test('rate/ratio lessons, exact eight-family check, reviewed reasons, bilingual drafts and paper integrate',async()=>{
 const current=()=>JSON.parse(memory.get(PREFIX+JSON.parse(memory.get(PREFIX+'profiles')).active));
 if(document.documentElement.lang!=='en')await click('language');
 location.hash='topic/js-6';assert.match(root.innerHTML,/Learn rates, ratios and proportions/);
 location.hash='ratios';assert.match(root.innerHTML,/What are you comparing/);
 for(const id of ['RP-L1','RP-L2','RP-L3','RP-L4']){location.hash='lesson/'+id;assert.match(root.innerHTML,/ratios-lesson-check/);assert.ok(current().studied.includes('lesson:'+id+':v1'));}
 await click('ratios-lesson-practice',{lesson:'RP-L3'});assert.match(location.hash,/#learn\//);assert.ok(current().sessions.at(-1).items.every(q=>['RP05','RP06','RP07'].includes(q.id)));
 location.hash='ratios';await click('ratios-check');const id=current().sessions.at(-1).id;assert.equal(current().sessions.at(-1).items.length,8);
 input('answer-input','answer','simplest');await click('language');assert.match(root.innerHTML,/value="simplest" checked/);await click('language');
 for(let i=0;i<8;i++){const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:'Reference quantity and model'});assert.equal(current().sessions.at(-1).responses[i].attempts.at(-1).status,'correct');await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');input('reason-input','reason','Revised reference');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);await click('next');}
 assert.equal(current().sessions.at(-1).id,id);assert.match(root.innerHTML,/8 \/ 8/);assert.match(root.innerHTML,/Keep the units and the fixed condition/);
 location.hash='ratios';await click('ratios-paper');await waitForPaper();assert.equal(current().paper.items.length,8);assert.ok(current().paper.items.every(i=>i.question.id.startsWith('RP')));
 assert.match(node('#paper-pages').innerHTML,/ratio-model/);location.hash='home';assert.match(root.innerHTML,/Nine connected topics/);
});

test('estimation core keeps optional investigation separate, enforces report precision and retains manual evidence',async()=>{
 const current=()=>JSON.parse(memory.get(PREFIX+JSON.parse(memory.get(PREFIX+'profiles')).active));
 if(document.documentElement.lang!=='en')await click('language');
 location.hash='setup/check';assert.match(root.innerHTML,/value="AP08" (?!checked)/);
 location.hash='topic/js-3';assert.match(root.innerHTML,/Learn approximation and estimation/);
 location.hash='estimation';assert.match(root.innerHTML,/Practise seven core families/);
 for(const id of ['AP-L1','AP-L2','AP-L3','AP-L4']){location.hash='lesson/'+id;assert.match(root.innerHTML,/estimation-lesson-check/);assert.ok(current().studied.includes('lesson:'+id+':v1'));}
 location.hash='estimation';await click('estimation-check');assert.equal(current().sessions.at(-1).items.length,7);assert.ok(current().sessions.at(-1).items.every(q=>q.id!=='AP08'));
 const first=current().sessions.at(-1).items[0];submit('answer-form',{answer:first.answer,reason:'The stated report type decides.'});await click('next');
 input('answer-input','answer','1.20');await click('language');assert.ok(root.innerHTML.includes('value="1.20"'));await click('language');
 const q=current().sessions.at(-1).items[1],extra=q.answer.includes('.')?q.answer+'0':q.answer+'.0';submit('answer-form',{answer:extra,reason:'Rounding precision'});assert.equal(current().sessions.at(-1).responses[1].attempts.at(-1).status,'wrong-form');assert.match(root.innerHTML,/requested precision/);
 for(let i=1;i<7;i++){const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:'Purpose, precision and rounding direction'});assert.equal(current().sessions.at(-1).responses[i].attempts.at(-1).status,'correct');await click('next');}
 assert.match(root.innerHTML,/7 \/ 7/);assert.match(root.innerHTML,/Match the precision to the purpose/);
 location.hash='estimation';await click('estimation-paper');await waitForPaper();assert.equal(current().paper.items.length,7);assert.ok(current().paper.items.every(i=>i.question.id!=='AP08'));
 location.hash='lesson/AP-L4';await click('estimation-lesson-check',{lesson:'AP-L4'});assert.equal(current().sessions.at(-1).items.length,1);assert.equal(current().sessions.at(-1).items[0].contract.type,'manual');
 submit('answer-form',{answer:'My justified planning estimate',reason:'I state assumptions, a rough range and a limitation.'});assert.equal(current().sessions.at(-1).responses[0].attempts.at(-1).status,'manual');await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[0].manualReview,'self');input('reason-input','reason','An updated limitation');assert.equal(current().sessions.at(-1).responses[0].manualReview,null);await click('next');assert.match(root.innerHTML,/excluded from the automatic-score denominator/);
 location.hash='paper';submit('paper-setup',{family:['AP01','AP02','AP03','AP04','AP05','AP06','AP07','AP08'],count:'8'});await waitForPaper();assert.equal(current().paper.items.length,8);await click('toggle-key');await waitForPaper();assert.match(node('#paper-pages').innerHTML,/All 4 marks require manual review/);
 location.hash='home';assert.match(root.innerHTML,/Nine connected topics/);
});



test('root foundation lessons, bilingual drafts, manual review and matching paper integrate',async()=>{
 if(document.documentElement.lang==='zh-Hant')await click('language');
 location.hash='rational';assert.match(root.innerHTML,/From powers to the number line/);
 location.hash='lesson/RI-L1';assert.match(root.innerHTML,/Powers backwards/);assert.match(root.innerHTML,/<m(?:s?q)?root|<msqrt/);
 const current=()=>{const r=JSON.parse(memory.get(PREFIX+'profiles'));return JSON.parse(memory.get(PREFIX+r.active));};
 assert.ok(current().studied.includes('lesson:RI-L1:v1'));
 await click('rational-lesson-check',{lesson:'RI-L1'});assert.deepEqual(current().sessions.at(-1).items.map(q=>q.id),['RI01','RI02','RI01','RI02']);
 input('answer-input','answer','-2');await click('language');assert.ok(root.innerHTML.includes('value="-2"'));await click('language');
 location.hash='rational';await click('rational-check');
 assert.deepEqual(current().sessions.at(-1).items.map(q=>q.id),['RI01','RI02','RI03','RI04']);
 for(let i=0;i<4;i++){
  const q=current().sessions.at(-1).items[i];submit('answer-form',{answer:q.answer,reason:'Check the exact powers or integer-fraction definition.'});
  await click('solution');await click('self-review');assert.equal(current().sessions.at(-1).responses[i].manualReview,'self');
  input('reason-input','reason','Changed explanation');assert.equal(current().sessions.at(-1).responses[i].manualReview,null);await click('next');
 }
 assert.ok(current().sessions.at(-1).completedAt);assert.match(root.innerHTML,/4 \/ 4/);
 location.hash='rational';await click('rational-paper');await waitForPaper();assert.deepEqual(current().paper.items.map(i=>i.question.id),['RI01','RI02','RI03','RI04']);
 assert.match(node('#paper-pages').innerHTML,/<m(?:s?q)?root|<msqrt/);
 location.hash='home';
});
