import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument} from '../src/papers/render.mjs';
const dir=new URL('../samples/signed/',import.meta.url);fs.mkdirSync(dir,{recursive:true});
for(const lang of ['en','zh']){
 const spec=createPaper(['SN01','SN02','SN03','SN04','SN05','SN06'],'signed-print-v1',6,lang);spec.title=lang==='en'?'Directed numbers — pilot draft':'有向數 — 試點初稿';spec.items.forEach(i=>i.lines=6);const hash=await identity(spec);
 fs.writeFileSync(new URL(lang+'_Specification.json',dir),JSON.stringify(spec,null,2));
 for(const [key,label] of [[false,'Student'],[true,'Solutions']])fs.writeFileSync(new URL(lang+'_'+label+'.html',dir),printableDocument(spec,hash,key));
 console.log(lang+' '+hash);
}
