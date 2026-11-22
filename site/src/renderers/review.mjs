// Presentation guidance is separate from immutable question snapshots so that
// retained version-1 sessions and paper specifications continue to validate.
export function reasonGuidance(q,lang='en'){
 const zh=lang==='zh';
 if(q.id==='EX03'&&q.model?.kind==='area-formula'){
  return q.model.shape==='triangle'
   ?(zh?'整份作答需人工評閱：b 是底，h 是相應的垂直高度；公式須等價於 A = bh/2，並以兩個全等三角形組成平行四邊形來解釋一半因數。面積使用平方單位。':'Manual review of the whole response: b is the base and h its perpendicular height; the formula must be equivalent to A = bh/2. Justify the half factor using two congruent triangles forming a parallelogram. Area uses square units.')
   :(zh?'整份作答需人工評閱：b 是長，h 是闊；公式須等價於 A = bh，並解釋兩個互相垂直的長度相乘得到面積。面積使用平方單位。':'Manual review of the whole response: b is the length and h the width; the formula must be equivalent to A = bh. Explain why multiplying the two perpendicular lengths gives the area. Area uses square units.');
 }
 if(q.reasonRubric?.[lang])return q.reasonRubric[lang];
 if(q.id==='angle'&&q.manualReason)return zh?'說明同一直線上的鄰角和為 180°，並展示減法。':'State that adjacent angles on a straight line total 180° and show the subtraction.';
 return '';
}

export function markingGuide(item,lang='en'){
 const {question:q,marks:m}=item,zh=lang==='zh';
 if(!Number.isInteger(m)||m<1||m>20)throw Error('Marks must be an integer from 1 to 20.');
 const marks=n=>`${n} ${n===1?'mark':'marks'}`;
 const guidance=reasonGuidance(q,lang);
 if(q.contract.type==='manual')return (zh?`全題 ${m} 分需人工評閱。`:m===1?'The single mark requires manual review. ':`All ${marks(m)} require manual review. `)+guidance;
 if(q.manualReason||guidance){
  const answer=zh?(q.options?'選項':'數值'):(q.options?'Selection':'Final value');
  if(m===1)return zh?`${answer}：1 分。書面理由仍需人工評閱；本題未另設理由分。${guidance}`:`${answer}: 1 mark. The written reason still requires manual review; no separate reason mark is allocated. ${guidance}`;
  return zh?`${answer}：${Math.ceil(m/2)} 分；理由：${Math.floor(m/2)} 分（人工評閱）。${guidance}`:`${answer}: ${marks(Math.ceil(m/2))}; reason: ${marks(Math.floor(m/2))} (manual review). ${guidance}`;
 }
 if(q.options)return zh?`選對答案：${m} 分。`:`Correct selection: ${marks(m)}.`;
 if(m===1)return zh?'正確答案：1 分。':'Correct final answer: 1 mark.';
 return zh?`正確答案：1 分；有效方法：${m-1} 分。方法分必須有可評閱的步驟證據；接受有效的其他方法。`:`Correct final answer: 1 mark; valid method: ${marks(m-1)}. Method credit requires recorded working; accept valid alternatives.`;
}
