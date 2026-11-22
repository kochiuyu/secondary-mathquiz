import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {families,generate} from '../src/math/registry.mjs';
import {reasonGuidance,markingGuide} from '../src/renderers/review.mjs';
import {canonical,validatePaper} from '../src/papers/paper.mjs';
import {renderPaper} from '../src/papers/render.mjs';

test('area guidance reviews the actual shape in both languages without changing retained snapshots',()=>{
 const models=new Map();for(let i=0;models.size<2&&i<100;i++){const q=generate('EX03','shape-review-'+i);models.set(q.model.shape,q);}
 assert.equal(models.size,2);
 for(const lang of ['en','zh']){
  const rectangle=reasonGuidance(models.get('rectangle'),lang),triangle=reasonGuidance(models.get('triangle'),lang);
  assert.match(rectangle,/A = bh/);assert.ok(!rectangle.includes('1/2'));assert.ok(!rectangle.includes(lang==='zh'?'三角形':'triangle'));
  assert.match(triangle,/A = bh\/2/);assert.ok(triangle.includes(lang==='zh'?'垂直高度':'perpendicular height'));assert.ok(triangle.includes(lang==='zh'?'全等':'congruent'));
 }
 const p=JSON.parse(fs.readFileSync(new URL('../samples/expressions/zh_Specification.json',import.meta.url),'utf8')),before=canonical(p);
 validatePaper(p);renderPaper(p,'retained-guidance-review',true);assert.equal(canonical(p),before);validatePaper(p);
});

test('all curriculum mark allocations omit zero-mark criteria and preserve manual review at one mark',()=>{
 for(const family of families.filter(f=>!f.development))for(const m of [1,2,3,20])for(const lang of ['en','zh']){
  const q=generate(family.id,'mark-allocation-review'),item={question:q,marks:m},before=canonical(q),guide=markingGuide(item,lang);
  assert.ok(!/(^|[^\d])0\s*(?:marks?|分)/.test(guide),family.id+' '+m+' '+guide);
  if(q.contract.type==='manual')assert.ok(guide.includes(lang==='zh'?'人工評閱':'manual review'));
  else if(q.manualReason||q.reasonRubric){
   assert.ok(guide.includes(lang==='zh'?'人工評閱':'manual review'));
   if(m===1)assert.ok(guide.includes(lang==='zh'?'未另設理由分':'no separate reason mark'));
   else assert.ok(guide.includes(String(Math.ceil(m/2)))&&guide.includes(String(Math.floor(m/2))));
   if(q.options)assert.ok(guide.includes(lang==='zh'?'選項':'Selection'));
  }
  assert.equal(canonical(q),before);
 }
 assert.throws(()=>markingGuide({question:generate('SN01','bad-mark'),marks:0}),/1 to 20/);
});

test('paper keys distinguish selection, numeric methods and whole-response review at edited marks',()=>{
 const plain=generate('SN01','plain-mark'),choice=generate('EQ01','reason-mark'),proof=generate('GE06','proof-mark');
 for(const lang of ['en','zh']){
  const make=q=>({kind:'secondary-mathquiz-paper',schema:1,generatorVersion:2,lang,title:'Marking review',layout:{format:'A4',perPage:3},items:[{question:q,marks:1,lines:6}]});
  const plainKey=renderPaper(make(plain),'plain',true),choiceKey=renderPaper(make(choice),'choice',true),proofKey=renderPaper(make(proof),'proof',true);
  assert.ok(!plainKey.includes(lang==='zh'?'有效方法':'valid method'));
  assert.ok(choiceKey.includes(lang==='zh'?'選項':'Selection'));assert.ok(choiceKey.includes(lang==='zh'?'未另設理由分':'no separate reason mark'));
  assert.ok(proofKey.includes(lang==='zh'?'全題 1 分需人工評閱':'single mark requires manual review'));
  assert.ok(!renderPaper(make(proof),'proof',false).includes('class="solution"'));
 }
});
