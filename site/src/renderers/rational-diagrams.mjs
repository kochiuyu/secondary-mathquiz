// Authored root/recurring notation is kept separate from the legacy polynomial renderer.
const riEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function rationalMath(text){
 const root=String(text).match(/^(-?)root\(([2-5]),(-?\d+)\)$/),recurring=String(text).match(/^rec\((\d+),(\d+)\)$/);
 let body;
 if(root){const radicand=`<mn>${root[3]}</mn>`;body=(root[1]?'<mo>−</mo>':'')+(root[2]==='2'?`<msqrt>${radicand}</msqrt>`:`<mroot>${radicand}<mn>${root[2]}</mn></mroot>`);}
 else if(recurring)body=`<mn>${recurring[1]}</mn><mo>.</mo><mover accent="true"><mn>${recurring[2]}</mn><mo>¯</mo></mover>`;
 else return null;
 const label=root?`${root[1]?'negative ':''}${root[2]==='2'?'square':root[2]==='3'?'cube':root[2]+'th'} root of ${root[3]}`:`${recurring[1]} point ${recurring[2]} recurring`;
 return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${riEscape(label)}"><mrow>${body}</mrow></math>`;
}
export function rationalDiagram(d,lang='en'){
 const z=lang==='zh';
 if(d.kind==='square'){
  const caption=z?`正方形面積為 ${d.area} 平方單位。邊長是未知量；圖形只表示正方形，並非按未知邊長的比例繪製。`:`A square has area ${d.area} square units. Its side is unknown; the figure shows the square relationship, not a measured side length.`;
  return `<figure class="rational-figure"><svg viewBox="0 0 440 140" role="img" aria-label="${riEscape(caption)}"><rect x="165" y="18" width="105" height="105" rx="2" fill="#e0f0ec" stroke="#196c65" stroke-width="2"/><text x="218" y="75">${d.area}</text><text x="145" y="75">?</text></svg><figcaption>${riEscape(caption)}</figcaption></figure>`;
 }
 if(d.kind==='line'){
  const caption=z?'等距整數刻度只供參考；未知數的位置尚未標出。請先比較平方，再畫出大約位置。':'Equally spaced integer marks are reference points. The unknown position is not marked. Compare squares, then sketch an approximate position.';
  const ticks=Array.from({length:d.max-d.min+1},(_,i)=>d.min+i).map(n=>{const x=35+(n-d.min)/(d.max-d.min)*370;return `<path d="M${x} 42v14"/><text x="${x}" y="82">${n}</text>`;}).join('');
  return `<figure class="rational-figure"><svg viewBox="0 0 440 105" role="img" aria-label="${riEscape(caption)}"><path d="M20 49H420" fill="none" stroke="#173349" stroke-width="2"/><g fill="none" stroke="#173349" stroke-width="2">${ticks}</g></svg><figcaption>${riEscape(caption)}</figcaption></figure>`;
 }
 return '';
}
