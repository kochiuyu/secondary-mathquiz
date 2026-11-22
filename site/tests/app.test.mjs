// Integration checks of application event wiring with a minimal DOM adapter.
// These do not replace browser rendering, accessibility or print inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PREFIX} from '../src/app/storage.mjs';
const data=fs.readFileSync(new URL('../curriculum/catalogue.json',import.meta.url),'utf8');
const memory=new Map(),root={innerHTML:'',events:{},addEventListener(k,fn){this.events[k]=fn;}};
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',focus(){},scrollIntoView(){},classList:{toggle(){},remove(){}},setAttribute(){}});return nodes.get(id);}
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
 await new Promise(resolve=>setImmediate(resolve));assert.equal(profile().paper.items.length,6);assert.match(root.innerHTML,/列印／儲存 PDF/);assert.match(node('#paper-pages').innerHTML,/paper-page/);
 await click('paper-down',{index:'0'});assert.equal(profile().paper.items[0].question.id,'expression');
 input('paper-title','','Newest title');assert.equal(node('#paper-pages').innerHTML,'');assert.equal(node('#paper-id').textContent,'…');
 await new Promise(resolve=>setImmediate(resolve));assert.match(node('#paper-pages').innerHTML,/Newest title/);
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
 await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(current().paper.items.map(i=>i.question.id),['SN01','SN02','SN03','SN04','SN05','SN06']);assert.match(node('#paper-pages').innerHTML,/signed-numberline/);
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
 location.hash='expressions';await click('expressions-paper');await new Promise(resolve=>setImmediate(resolve));assert.equal(current().paper.items.length,6);assert.ok(current().paper.items.every(i=>i.question.id.startsWith('EX')));assert.ok(!node('#paper-pages').innerHTML.includes('[object Object]'));
});
