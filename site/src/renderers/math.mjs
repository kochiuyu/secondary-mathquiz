import {estimationDiagram} from './estimation-diagrams.mjs';
import {ratioDiagram} from './ratio-diagrams.mjs';
import {percentageDiagram} from './percentage-diagrams.mjs';
import {basicDiagram} from './basic-diagrams.mjs';
import {angleDiagram} from './angles.mjs';
import {signedNumberLine} from './number-line.mjs';
import {equationDiagram} from './equation-diagrams.mjs';
import {expressionDiagram} from './expression-diagrams.mjs';
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const optionLabel=(o,lang='en')=>typeof o.label==='string'?o.label:o.label?.[lang]||'';
export function math(text){
 // Render our authored, bounded fixture notation with native MathML; text fallback is its aria-label.
 const tokens=String(text).match(/\d+\/\d+|\d+(?:\.\d+)?|[A-Za-zαβγ]|[^\s]/g)||[],parts=[];
 for(let i=0;i<tokens.length;i++){
  const v=tokens[i];if(v==='²'&&parts.length){parts.push(`<msup>${parts.pop()}<mn>2</mn></msup>`);continue;}if(v==='ₙ'&&parts.length){parts.push(`<msub>${parts.pop()}<mi>n</mi></msub>`);continue;}
  if(v==='^'&&parts.length&&/^[0-9?]$/.test(tokens[i+1]||'')){parts.push(`<msup>${parts.pop()}${tokens[i+1]==='?'?'<mo>?</mo>':'<mn>'+tokens[i+1]+'</mn>'}</msup>`);i++;continue;}
  parts.push(/^\d+\/\d+$/.test(v)?`<mfrac><mn>${v.split('/')[0]}</mn><mn>${v.split('/')[1]}</mn></mfrac>`:/^\d+(?:\.\d+)?$/.test(v)?`<mn>${v}</mn>`:/^[A-Za-zαβγ]$/.test(v)?`<mi>${v}</mi>`:`<mo>${escape(v)}</mo>`);
 }
 const body=parts.join('');
 return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${escape(text)}"><mrow>${body}</mrow></math>`;
}
export function diagram(q,lang='en'){
 if(!q.diagram)return '';
 const d=q.diagram;
 if(d.type==='estimation-model')return estimationDiagram(d,lang);
 if(d.type==='ratio-model')return ratioDiagram(d,lang);
 if(d.type==='percentage-model')return percentageDiagram(d,lang);
 if(d.type==='basic-model')return basicDiagram(q,lang);
 if(d.type==='angle-geometry')return angleDiagram(q,lang);
 if(['equation-check','equation-steps','equation-balance','fee-table'].includes(d.type))return equationDiagram(q,lang);
 if(['area-formula','sequence-cards','term-table','input-output'].includes(d.type))return expressionDiagram(q,lang);
 if(d.type==='signed-line')return signedNumberLine(q,lang);
 if(d.type==='line'){
  const min=Math.min(-15,d.a,d.a+d.b)-2,max=Math.max(15,d.a,d.a+d.b)+2,pos=n=>30+(n-min)/(max-min)*420;
  const ticks=Array.from({length:max-min+1},(_,i)=>min+i).filter(n=>n%5===0).map(n=>`<path d="M${pos(n)} 43v14"/><text x="${pos(n)}" y="78">${n}</text>`).join('');
  return `<svg viewBox="0 0 480 105" role="img" aria-label="${lang==='zh'?'有向數數線，標示起點。':'Signed number line showing the starting value.'}"><g class="ink"><path d="M25 50H455"/>${ticks}</g><circle cx="${pos(d.a)}" cy="50" r="6" fill="#196c65"/><text x="${pos(d.a)}" y="27" class="start">${d.a}</text></svg>`;
 }
 if(d.type==='angle'){
  // The known angle is measured from the left ray; x occupies the remaining angle.
  const theta=(180-d.a)*Math.PI/180,x=240+135*Math.cos(theta),y=140-135*Math.sin(theta);
  return `<svg viewBox="0 0 480 170" role="img" aria-label="${lang==='zh'?`直線上的兩個鄰角；已知一角為 ${d.a} 度，另一角為 x。`:`Two adjacent angles on a straight line; one is ${d.a} degrees and the other is x.`}"><path d="M35 140H445M240 140L${x} ${y}" class="ink"/><path d="M200 140A40 40 0 0 1 ${240+40*Math.cos(theta)} ${140-40*Math.sin(theta)}" fill="none" stroke="#196c65" stroke-width="2"/><text x="165" y="112">${d.a}°</text><text x="305" y="118">x</text><circle cx="240" cy="140" r="3" fill="#173349"/></svg>`;
 }
 return `<svg viewBox="0 0 480 110" role="img" aria-label="${lang==='zh'?'等式兩邊必須進行相同運算。':'Apply the same operation to both sides of the equation.'}"><path d="M90 45H390M240 45V95M205 95H275M120 45L90 80H150ZM360 45L330 80H390Z" class="ink"/><text x="120" y="28">${d.a}x ${d.b<0?'−':'+'} ${Math.abs(d.b)}</text><text x="360" y="28">${d.c}</text></svg>`;
}
