import {escape,math} from './math.mjs';
export function equationDiagram(q,lang='en'){
 const d=q.diagram,z=lang==='zh';
 if(d.type==='fee-table')return `<div class="expression-table-wrap"><table class="expression-table"><caption>${z?'費用資料（固定費用只付一次）':'Cost information (fixed charge paid once)'}</caption><tbody><tr><th>${z?'固定費用':'Fixed charge'}</th><td>$${d.fixed}</td></tr><tr><th>${d.unit==='hour'?(z?'每小時':'Per hour'):(z?'每局':'Per game')}</th><td>$${d.rate}</td></tr><tr><th>${z?'總費用':'Total'}</th><td>$${escape(d.total)}</td></tr></tbody></table></div>`;
 if(d.type==='equation-steps')return `<ol class="equation-steps" aria-label="${z?'按次序閱讀的步驟':'Steps in reading order'}">${d.lines.map(line=>`<li>${escape(line[lang])}</li>`).join('')}</ol>`;
 if(d.type==='equation-check')return `<div class="equation-panels"><section><h3>${z?'原左邊的代入式':'Original left side after substitution'}</h3>${math(d.left)}</section><section><h3>${z?'原右邊':'Original right side'}</h3>${math(d.right)}</section></div><p class="muted">${z?'先計算，再比較兩邊；這些面板不預先判定相等。':'Calculate, then compare both sides; these panels do not pre-judge equality.'}</p>`;
 return `<div class="equation-panels"><section><h3>${z?'原方程左邊':'Original left side'}</h3>${math(d.left)}</section><section><h3>${z?'原方程右邊':'Original right side'}</h3>${math(d.right)}</section></div><p class="muted">${z?'等號表示相同的值；兩邊須進行相同的有效運算。這不是以正負數當作實物重量的圖。':'Equality means the same value: apply the same valid operation to both sides. These are expression panels, not physical weights for signed quantities.'}</p>`;
}
