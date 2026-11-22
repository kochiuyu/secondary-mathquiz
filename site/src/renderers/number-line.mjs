import {escape} from './math.mjs';
import {scalar} from '../math/exact.mjs';
export function numberLineModel(q){
 const d=q.diagram,values=d.values.map(v=>Number(scalar(v).n)/Number(scalar(v).d)),all=[0,...values,...(d.bounds||[])];
 if(d.minimum!==undefined)all.push(d.minimum);if(d.maximum!==undefined)all.push(d.maximum);
 const lo=Math.min(...all),hi=Math.max(...all),span=Math.max(hi-lo,2),step=d.tick||[.5,1,2,5,10].find(s=>span/s<=10)||10;
 const minimum=Math.floor((lo-step)/step)*step,maximum=Math.ceil((hi+step)/step)*step;
 const position=v=>28+(v-minimum)/(maximum-minimum)*424;
 const ticks=Array.from({length:Math.round((maximum-minimum)/step)+1},(_,i)=>minimum+i*step);
 return {minimum,maximum,step,ticks,points:values.map((v,i)=>({value:v,label:d.values[i],x:position(v),labelY:116+i%2*24})),movement:d.movement?{start:position(d.movement.start),end:position(d.movement.start+d.movement.delta),delta:d.movement.delta}:null,position};
}
export function signedNumberLine(q,lang='en'){
 const m=numberLineModel(q),description=q.diagram.description[lang];
 const ticks=m.ticks.map(v=>`<path d="M${m.position(v)} 65v12"/><text x="${m.position(v)}" y="98">${v}</text>`).join('');
 const points=m.points.map(p=>`<circle cx="${p.x}" cy="70" r="5" fill="#176d65"/>${m.ticks.some(t=>Math.abs(t-p.value)<1e-10)?'':`<text x="${p.x}" y="${p.labelY}" class="point-label">${escape(p.label)}</text>`}`).join('');
 let move='';if(m.movement){const {start,end,delta}=m.movement,dir=delta>=0?1:-1;move=delta===0?`<text x="${start}" y="35">${lang==='zh'?'位置不變':'No movement'}</text>`:`<path d="M${start} 55V30H${end}M${end-dir*8} 24L${end} 30L${end-dir*8} 36" fill="none" stroke="#a85d25" stroke-width="3"/><text x="${(start+end)/2}" y="19">${delta>0?'+':''}${delta}</text>`;}
 return `<figure class="signed-line-figure"><svg class="signed-numberline" viewBox="0 0 480 155" role="img" aria-label="${escape(description)}"><g class="ink"><path d="M22 70H458"/>${ticks}</g>${points}${move}</svg><figcaption>${escape(description)}</figcaption></figure>`;
}
