import fs from 'node:fs';
import {identity,validatePaper} from '../src/papers/paper.mjs';
import {paperCSS,paginate,renderPaper} from '../src/papers/render.mjs';

// Combine unchanged topic sample specifications for one native print job per
// language/document kind. This is review material, not a new paper schema.
const topics=['signed','expressions','equations','angles'];
const folder=new URL('../samples/pilot-review/',import.meta.url);
fs.mkdirSync(folder,{recursive:true});
const documents=[];
for(const lang of ['en','zh']){
 for(const key of [false,true]){
  const kind=key?'Solutions':'Student';let html='',page=1;const sections=[];
  for(const topic of topics){
   const relative=`samples/${topic}/${lang}_Specification.json`;
   const spec=validatePaper(JSON.parse(fs.readFileSync(new URL('../'+relative,import.meta.url),'utf8')));
   const fingerprint=await identity(spec),count=paginate(spec,key).length;
   html+=renderPaper(spec,fingerprint,key);
   sections.push({topic,specification:relative,specification_sha256:fingerprint,first_pdf_page:page,pages:count,question_ids:spec.items.map(x=>x.question.id)});
   page+=count;
  }
  const name=`${lang}_${kind}.html`;
  fs.writeFileSync(new URL(name,folder),`<!doctype html><html lang="${lang==='zh'?'zh-Hant':'en'}"><meta charset="utf-8"><title>Four-topic pilot review - ${lang} - ${kind}</title><style>${paperCSS}</style>${html}</html>`);
  documents.push({file:name,lang,kind,pages:page-1,sections,pdf_review:'pending'});
 }
}
fs.writeFileSync(new URL('generation.json',folder),JSON.stringify({scope:'24 retained curriculum families; six working lines; four topic specifications concatenated using the production renderer; not a mixed-paper specification',documents},null,2)+'\n');
console.log(JSON.stringify(documents.map(({file,pages})=>({file,pages}))));
