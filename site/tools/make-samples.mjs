import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument} from '../src/papers/render.mjs';
const out=new URL('../samples/',import.meta.url);fs.mkdirSync(out,{recursive:true});
for(const lang of ['en','zh']){
 const spec=createPaper(['signed','expression','equation','angle','choice','fraction'],'p1-review-sample',6,lang);
 spec.title=lang==='zh'?'中學數學 · 示例練習':'Secondary Mathematics · Sample Practice';
 const hash=await identity(spec);
 for(const key of [false,true])fs.writeFileSync(new URL(`Sample_${lang}_${key?'Solutions':'Student'}.html`,out),printableDocument(spec,hash,key));
 fs.writeFileSync(new URL(`Sample_${lang}_Specification.json`,out),JSON.stringify(spec,null,2));
}
console.log('Created reproducible bilingual sample sheets and keys.');
