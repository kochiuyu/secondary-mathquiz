import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument,paginate} from '../src/papers/render.mjs';
const dir=new URL('../samples/expressions/',import.meta.url);fs.mkdirSync(dir,{recursive:true});
const results=[];
for(const lang of ['en','zh']){
 const spec=createPaper(['EX01','EX02','EX03','EX04','EX05','EX06'],'expressions-print-v1',6,lang);
 spec.title=lang==='en'?'Expressions and patterns - pilot draft':'代數式與數列 — 試行草稿';
 spec.items.forEach(i=>i.lines=6);const hash=await identity(spec);
 fs.writeFileSync(new URL(lang+'_Specification.json',dir),JSON.stringify(spec,null,2));
 for(const [key,label] of [[false,'Student'],[true,'Solutions']]){
  fs.writeFileSync(new URL(lang+'_'+label+'.html',dir),printableDocument(spec,hash,key));
  results.push({lang,document:label,pages:paginate(spec,key).length,specification_sha256:hash,actual_browser_layout:'pending',actual_pdf:'pending'});
 }
}
fs.writeFileSync(new URL('generation.json',dir),JSON.stringify({state:'generated HTML, not browser/PDF acceptance evidence',results},null,2));
console.log(JSON.stringify(results));
