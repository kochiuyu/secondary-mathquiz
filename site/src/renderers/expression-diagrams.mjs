import {escape} from './math.mjs';
export function expressionDiagram(q,lang='en'){
 const d=q.diagram,zh=lang==='zh';
 if(d.type==='area-formula'){
  const triangle=d.shape==='triangle',description=triangle?(zh?'底為 b、垂直高度為 h 的三角形；高度垂足有直角記號。':'Triangle with base b and perpendicular height h; the height foot has a right-angle marker.'):(zh?'長為 b、闊為 h 的長方形。':'Rectangle of length b and width h.');
  const shape=triangle?'<path d="M55 155H355L225 35Z"/><path d="M225 35V155" stroke-dasharray="5 4"/><path d="M225 141H239V155"/>':'<path d="M65 40H350V155H65ZM65 141H79V155"/>';
  return `<figure class="expression-figure"><svg viewBox="0 0 420 205" role="img" aria-label="${escape(description)}"><g class="ink">${shape}</g><text x="205" y="185">b</text><text x="${triangle?245:375}" y="100">h</text></svg><figcaption>${escape(description)}</figcaption></figure>`;
 }
 if(d.type==='sequence-cards'){
  const description=zh?'已知四項依次為 '+d.terms.join('、')+'；下一項未知。':'The four given terms are '+d.terms.join(', ')+'. The next term is not supplied.';
  return `<figure class="expression-figure"><svg viewBox="0 0 480 100" role="img" aria-label="${escape(description)}">${[...d.terms,'?'].map((v,i)=>`<rect x="${8+i*95}" y="20" width="82" height="55" rx="9" fill="#eef5f2" stroke="#9abeb5"/><text x="${49+i*95}" y="55">${v}</text>`).join('')}</svg><figcaption>${escape(description)}</figcaption></figure>`;
 }
 if(d.type==='term-table')return `<div class="expression-table-wrap"><table class="expression-table"><caption>${zh?'分清位置與項值':'Distinguish position from term value'}</caption><thead><tr><th>${zh?'位置 n':'Position n'}</th><th>${zh?'項值 aₙ':'Term aₙ'}</th></tr></thead><tbody><tr><td>${d.n}</td><td>?</td></tr></tbody></table></div>`;
 if(d.type==='input-output')return `<div class="machine-flow" role="group" aria-label="${zh?'輸入、處理、輸出':'Input, processing, output'}"><div><small>${zh?'輸入':'Input'}</small><strong>${d.input}</strong></div><span aria-hidden="true">→</span><div><small>${zh?'處理':'Processing'}</small><span>${escape(d.processing[lang])}</span></div><span aria-hidden="true">→</span><div><small>${zh?'輸出':'Output'}</small><strong>?</strong></div></div>`;
 return '';
}
