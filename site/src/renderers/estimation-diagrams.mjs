export function estimationDiagram(d,lang='en'){
 const z=lang==='zh',lo=Math.floor(d.n/d.step)*d.step,hi=lo+d.step,mid=(lo+hi)/2,x=40+(d.n-lo)*400/d.step;
 return `<svg class="estimation-model" viewBox="0 0 480 120" role="img" aria-label="${z?'原值':'Original'} ${d.n}; ${z?'相鄰倍數':'neighbouring multiples'} ${lo}, ${hi}; ${z?'中點':'midpoint'} ${mid}. ${z?'尚未標示捨入結果。':'No rounded result is selected.'}"><path d="M40 65H440M40 56V74M240 56V74M440 56V74" fill="none" stroke="#176d65" stroke-width="2"/><circle cx="${x}" cy="65" r="5" fill="#c77e43"/><g fill="#173349" text-anchor="middle" font-size="18"><text x="40" y="100">${lo}</text><text x="240" y="100">${mid}</text><text x="440" y="100">${hi}</text><text x="240" y="25">${z?'原值':'Original'} ${d.n}</text></g></svg>`;
}
