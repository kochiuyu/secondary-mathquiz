import {generate,makeItems,FIXTURE_VERSION} from '../math/registry.mjs';
export function canonical(v){if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
export async function identity(spec){const bytes=new TextEncoder().encode(canonical(spec));const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
// A digest and its displayed/exported paper must come from the same immutable snapshot.
export async function preparePaper(spec,compute=identity){const snapshot=structuredClone(spec);return {spec:snapshot,fingerprint:await compute(snapshot)};}
export function previewCoordinator(compute=identity){let revision=0;return async spec=>{const ticket=++revision,result=await preparePaper(spec,compute);return ticket===revision?result:null;};}
export function createPaper(ids,seed,count=6,lang='en'){
 return {kind:'secondary-mathquiz-paper',schema:1,generatorVersion:FIXTURE_VERSION,title:'Secondary MathQuiz',seed,lang,layout:{format:'A4',perPage:3},items:makeItems(ids,seed,count).map(question=>({question,marks:question.marks,lines:question.lines}))};
}
export function validatePaper(p){
 if(!p||p.kind!=='secondary-mathquiz-paper'||p.schema!==1||![1,FIXTURE_VERSION].includes(p.generatorVersion))throw new Error('This paper needs the original supported prototype version.');
 if(Object.keys(p).some(k=>!['kind','schema','generatorVersion','title','seed','lang','layout','items'].includes(k)))throw new Error('Unknown paper fields are not accepted.');
 if(typeof p.title!=='string'||p.title.length>100||typeof p.seed!=='string'||p.seed.length>60||!['en','zh'].includes(p.lang)||p.layout?.format!=='A4'||p.layout.perPage!==3||!Array.isArray(p.items)||!p.items.length||p.items.length>12)throw new Error('Invalid paper specification.');
 if(Object.keys(p.layout).some(k=>!['format','perPage'].includes(k)))throw new Error('Unknown layout fields are not accepted.');
 for(const item of p.items){if(Object.keys(item).some(k=>!['question','marks','lines'].includes(k)))throw new Error('Unknown question fields are not accepted.');if(!Number.isInteger(item.marks)||item.marks<1||item.marks>20||!Number.isInteger(item.lines)||item.lines<1||item.lines>6)throw new Error('Marks/working space are out of range.');const q=item.question;if(canonical(generate(q.id,q.seed,q.version))!==canonical(q))throw new Error('The question snapshot does not match its version.');}
 return p;
}
