export function ratioDiagram(d,lang='en'){
 const z=lang==='zh';
 if(d.kind==='parts'){
  const total=d.parts.reduce((a,b)=>a+b,0),unit=400/total;let x=40;
  const groups=d.parts.map((n,i)=>{const rects=Array.from({length:n},(_,j)=>`<rect x="${x+j*unit}" y="45" width="${unit}" height="32" fill="${['#d4eae4','#f5e3c4','#dce8f1'][i]}" stroke="#176d65"/>`).join(''),label=`<text x="${x+n*unit/2}" y="30">${'ABC'[i]}: ${n}</text>`;x+=n*unit;return label+rects;}).join('');
  return `<svg class="ratio-model" viewBox="0 0 480 110" role="img" aria-label="${z?'分配份數':'Ratio parts'}: ${d.parts.join(':')}. ${z?'未標出所求體積。':'The requested volume is not shown.'}"><g text-anchor="middle" font-size="18" fill="#173349">${groups}<text x="240" y="104">${z?'同一大小的份':'Equal-sized parts'}</text></g></svg>`;
 }
 if(d.kind==='table'){
  const labels={workers:['workers','人數'],input:['input','輸入'],output:['output','輸出']},label=s=>labels[s]?.[z?1:0]||s,height=50+d.rows.length*38;
  return `<svg class="ratio-model" viewBox="0 0 480 ${height}" role="img" aria-label="${label(d.left)} / ${label(d.right)}: ${d.rows.map(r=>r.join(' / ')).join('; ')}"><g fill="none" stroke="#8eaaa5"><rect x="60" y="4" width="360" height="${height-8}" rx="6"/><path d="M240 4V${height-4}M60 43H420"/>${d.rows.slice(1).map((_,i)=>`<path d="M60 ${81+i*38}H420"/>`).join('')}</g><g text-anchor="middle" fill="#173349" font-size="19"><text x="150" y="30">${label(d.left)}</text><text x="330" y="30">${label(d.right)}</text>${d.rows.map(([a,b],i)=>`<text x="150" y="${70+i*38}">${a}</text><text x="330" y="${70+i*38}">${b}</text>`).join('')}</g></svg>`;
 }
 return `<svg class="ratio-model" viewBox="0 0 480 150" role="img" aria-label="${z?'示意平面圖，不按螢幕比例；標示長度':'Schematic plan, not to screen scale; labelled length'} ${d.label}, 1:${d.scale}"><path d="M70 55H410V100H70Z" fill="#e0efeb" stroke="#176d65" stroke-width="2"/><path d="M70 30H410M70 23V37M410 23V37" fill="none" stroke="#173349"/><g text-anchor="middle" font-size="18" fill="#173349"><text x="240" y="22">${d.label}</text><text x="240" y="80">1:${d.scale}</text><text x="240" y="136">${z?'只用標示數值，不要量度':'Use labels; do not measure'}</text></g></svg>`;
}
