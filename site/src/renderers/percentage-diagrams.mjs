// Only supplied information and reference structure appear before reveal.
export function percentageDiagram(d,lang='en'){
 const z=lang==='zh';
 if(d.kind==='timeline'){
  const label=z?`先改變 ${d.r1}%，再以第一次改變後的值為基準改變 ${d.r2}%；最終值未知。`:`First change ${d.r1}%, then ${d.r2}% based on the changed value; final value unknown.`;
  return `<svg class="percentage-model" viewBox="0 0 480 140" role="img" aria-label="${label}"><g fill="#e0efeb" stroke="#176d65" stroke-width="2"><rect x="10" y="60" width="105" height="45" rx="8"/><rect x="185" y="60" width="105" height="45" rx="8"/><rect x="365" y="60" width="105" height="45" rx="8"/><path d="M120 82H178M170 75L178 82L170 89M295 82H358M350 75L358 82L350 89" fill="none"/></g><g fill="#173349" text-anchor="middle" font-size="17"><text x="62" y="88">${z?'原值':'Original'}</text><text x="237" y="88">${z?'新基準':'New base'}</text><text x="417" y="88">?</text><text x="149" y="40">${d.r1}%</text><text x="327" y="40">${d.r2}%</text></g></svg>`;
 }
 const label=z?'原值就是 100% 的基準量；此圖不顯示所求值。':'The original is the 100% reference; this diagram does not show the requested value.';
 return `<svg class="percentage-model" viewBox="0 0 480 115" role="img" aria-label="${label}"><rect x="30" y="45" width="420" height="32" rx="5" fill="#e0efeb" stroke="#176d65" stroke-width="2"/><g stroke="#176d65">${[1,2,3,4,5,6,7,8,9].map(i=>`<path d="M${30+i*42} 45V77"/>`).join('')}</g><g fill="#173349" text-anchor="middle" font-size="19"><text x="240" y="30">${z?'原值 = 100%':'Original = 100%'}</text><text x="240" y="105">${z?'先說清基準量':'Name the reference quantity first'}</text></g></svg>`;
}
