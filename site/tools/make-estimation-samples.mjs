import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument,paginate} from '../src/papers/render.mjs';
import {estimationFamilies} from '../src/math/estimation.mjs';
const dir=new URL('../samples/estimation/',import.meta.url);fs.mkdirSync(dir,{recursive:true});const results=[];
for(const lang of ['en','zh']){
 const spec=createPaper(estimationFamilies.map(f=>f.id),'estimation-print-v1',8,lang);spec.title=lang==='en'?'Approximation and estimation - core and optional review':'近似值與估算 — 核心及選修評閱';spec.items.forEach(i=>i.lines=6);const hash=await identity(spec);
 fs.writeFileSync(new URL(lang+'_Specification.json',dir),JSON.stringify(spec,null,2));
 for(const [key,label] of [[false,'Student'],[true,'Solutions']]){fs.writeFileSync(new URL(lang+'_'+label+'.html',dir),printableDocument(spec,hash,key));results.push({lang,document:label,pages:paginate(spec,key).length,specification_sha256:hash,actual_browser_layout:'pending',actual_pdf:'pending'});}
}
fs.writeFileSync(new URL('generation.json',dir),JSON.stringify({state:'generated HTML; browser/PDF review separate',results},null,2));console.log(JSON.stringify(results));
