import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument,paginate} from '../src/papers/render.mjs';
const dir=new URL('../samples/angles/',import.meta.url);fs.mkdirSync(dir,{recursive:true});const results=[];
for(const lang of ['en','zh']){
 const spec=createPaper(['GE01','GE02','GE03','GE04','GE05','GE06'],'angles-print-v1',6,lang);spec.title=lang==='en'?'Angles and parallel lines - pilot draft':'角與平行線 — 試行草稿';spec.items.forEach(i=>i.lines=6);const hash=await identity(spec);
 fs.writeFileSync(new URL(lang+'_Specification.json',dir),JSON.stringify(spec,null,2));
 for(const [key,label] of [[false,'Student'],[true,'Solutions']]){fs.writeFileSync(new URL(lang+'_'+label+'.html',dir),printableDocument(spec,hash,key));results.push({lang,document:label,pages:paginate(spec,key).length,specification_sha256:hash,actual_browser_layout:'pending',actual_pdf:'pending'});}
}
fs.writeFileSync(new URL('generation.json',dir),JSON.stringify({state:'generated HTML; browser/PDF review separate',results},null,2));console.log(JSON.stringify(results));
