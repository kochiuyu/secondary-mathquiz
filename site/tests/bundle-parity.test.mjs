import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {families,generate} from '../src/math/registry.mjs';
import {canonical,createPaper,validatePaper,questionSnapshotMatches} from '../src/papers/paper.mjs';
import {createSession,validateSession,validateBackup} from '../src/app/session.mjs';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const actualScript=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
const prefix=actualScript.slice(0,actualScript.indexOf('// src/app/app.mjs'));
const bundled=await vm.runInNewContext(`(async()=>{${prefix};return {generate,validatePaper};})()`,{TextEncoder,crypto:webcrypto,structuredClone});

test('the actual published HTML generates the same snapshots as modules, including literal currency markers',()=>{
 for(const f of families)for(let seed=0;seed<12;seed++){
  const name='published-parity-'+seed;
  assert.equal(canonical(bundled.generate(f.id,name)),canonical(generate(f.id,name)),f.id+' '+seed);
 }
 for(const id of ['EQ05','EQ06'])for(let seed=0;seed<100;seed++){
  const q=bundled.generate(id,'fee-parity-'+seed);
  for(const lang of ['en','zh'])assert.equal((q.prompt[lang].match(/\$/g)||[]).length,3,id+' '+lang);
 }
 const paper=JSON.parse(fs.readFileSync(new URL('../samples/equations/en_Specification.json',import.meta.url),'utf8'));
 bundled.validatePaper(paper);
});

test('historical bundled fee snapshots reopen unchanged while altered answers, models and prompts are rejected',()=>{
 const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/bundled-currency-v1.json',import.meta.url),'utf8'));
 for(const q of fixture.questions){
  const before=canonical(q);assert.ok(questionSnapshotMatches(q));assert.equal(canonical(q),before);
  for(const field of ['answer','model','prompt']){
   const bad=structuredClone(q);
   if(field==='answer')bad.answer='unverified';
   if(field==='model')bad.model.fixed++;
   if(field==='prompt')bad.prompt.en+=' Extra claim.';
   assert.equal(questionSnapshotMatches(bad),false,field);
  }
 }
 const paper=createPaper(['EQ05','EQ06'],'legacy-fee-paper',2);paper.items.forEach((x,i)=>x.question=structuredClone(fixture.questions[i]));
 const paperBefore=canonical(paper);validatePaper(paper);bundled.validatePaper(paper);assert.equal(canonical(paper),paperBefore);
 const session=createSession(['EQ05','EQ06'],'legacy-fee-session','check',2);session.items=structuredClone(fixture.questions);const before=canonical(session);validateSession(session);assert.equal(canonical(session),before);
 const learned=createSession(['EQ05'],'legacy-fee-example','learn',1);learned.workedExample=structuredClone(fixture.workedExample);validateSession(learned);
 const badExample=structuredClone(learned);badExample.workedExample.seed='another-seed';assert.throws(()=>validateSession(badExample),/worked-example snapshot/);
 validateBackup({kind:'secondary-mathquiz-progress',schema:1,profile:{name:'Legacy fee',sessions:[session,learned],studied:[]}});
});
