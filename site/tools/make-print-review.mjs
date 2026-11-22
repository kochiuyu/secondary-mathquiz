import fs from 'node:fs';
import {createPaper,identity} from '../src/papers/paper.mjs';
import {printableDocument} from '../src/papers/render.mjs';
const out=new URL('../samples/print-review/',import.meta.url);fs.mkdirSync(out,{recursive:true});
for(const lang of ['en','zh']){
 const spec=createPaper(['signed','expression','equation','angle','choice','fraction'],'p1-print-review',6,lang);
 spec.title=lang==='zh'?'中學數學 · 加大作答空間示例':'Secondary Mathematics · Large Working Space';spec.items.forEach(item=>item.lines=6);
 const hash=await identity(spec);
 for(const key of [false,true])fs.writeFileSync(new URL(`${lang}_${key?'Solutions':'Student'}.html`,out),printableDocument(spec,hash,key));
 fs.writeFileSync(new URL(`${lang}_Specification.json`,out),JSON.stringify(spec,null,2));
}
console.log('Prepared bilingual six-line print-review fixtures; PDF inspection is still pending.');
