import {escape} from './math.mjs';
// Only givens are pictured. A reverse power never reveals a factor count.
export function basicDiagram(q,lang='en'){
 const d=q.diagram,z=lang==='zh';if(d?.type!=='basic-model')return '';
 let values,caption;
 if(d.kind==='digits'){values=[...String(d.n)];caption=z?`給定數 ${d.n}；檢查能否被 ${d.divisor} 整除。`:`Given number ${d.n}; test divisibility by ${d.divisor}.`;}
 else if(d.kind==='power'){values=d.exponent===null?[`${z?'底數':'Base'}: ${d.base}`,`${z?'值':'Value'}: ${d.value}`,`${z?'指數':'Exponent'}: ?`]:[`${z?'底數':'Base'}: ${d.base}`,`${z?'指數':'Exponent'}: ${d.exponent}`];caption=z?'底數與指數的角色不同。':'The base and exponent have different roles.';}
 else if(d.kind==='split'){values=[String(d.n),`${d.left} × ${d.right}`];caption=z?'這是一次分拆；仍須檢查每個因數是否為質數。':'This is one split; check whether every factor is prime.';}
 else {values=d.numbers.map(String);caption=z?`對全部 ${d.numbers.length} 個給定數求 ${d.operation}。`:`Find the ${d.operation} for all ${d.numbers.length} given numbers.`;}
 return `<figure class="basic-figure"><div class="basic-cards" role="group" aria-label="${escape(caption)}">${values.map(v=>`<span>${escape(v)}</span>`).join('')}</div><figcaption>${escape(caption)}</figcaption></figure>`;
}
