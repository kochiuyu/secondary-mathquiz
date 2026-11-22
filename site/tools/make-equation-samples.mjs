import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument,paginate} from '../src/papers/render.mjs';
const dir=new URL('../samples/equations/',import.meta.url);fs.mkdirSync(dir,{recursive:true});const results=[];
for(const lang of ['en','zh']){
 const spec=createPaper(['EQ01','EQ02','EQ03','EQ04','EQ05','EQ06'],'equations-print-v1',6,lang);spec.title=lang==='en'?'Linear equations - pilot draft':'一元一次方程 — 試行草稿';spec.items.forEach(i=>i.lines=6);const hash=await identity(spec);
 fs.writeFileSync(new URL(lang+'_Specification.json',dir),JSON.stringify(spec,null,2));
 for(const [key,label] of [[false,'Student'],[true,'Solutions']]){fs.writeFileSync(new URL(lang+'_'+label+'.html',dir),printableDocument(spec,hash,key));results.push({lang,document:label,pages:paginate(spec,key).length,specification_sha256:hash,actual_browser_layout:'pending',actual_pdf:'pending'});}
}
fs.writeFileSync(new URL('generation.json',dir),JSON.stringify({state:'generated HTML; browser/PDF acceptance separate',results},null,2));console.log(JSON.stringify(results));
