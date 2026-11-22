import {Q,scalar} from './exact.mjs';
export const equationFamilies=[
 {id:'EQ01',title:{en:'Test a proposed solution',zh:'檢驗所提的解'},objective:'JS-8-1',contract:'choice'},
 {id:'EQ02',title:{en:'Undo an operation chain',zh:'逆轉運算鏈'},objective:'JS-8-1',contract:'number'},
 {id:'EQ03',title:{en:'Repair an invalid bracket step',zh:'修正錯誤的括號步驟'},objective:'JS-8-1',contract:'choice'},
 {id:'EQ04',title:{en:'Unknowns on both sides',zh:'兩邊均有未知數'},objective:'JS-8-1',contract:'number'},
 {id:'EQ05',title:{en:'Form a contextual equation',zh:'從情境建立方程'},objective:'JS-8-2',contract:'choice'},
 {id:'EQ06',title:{en:'Solve and interpret a model',zh:'解模型並解釋結果'},objective:'JS-8-3',contract:'number'}
].map(f=>({...f,topic:'js-8',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020; independent review pending'}));
const qb=(en,zh)=>({en,zh});
function equationRandom(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6d2b79f5;let v=h;v=Math.imul(v^v>>>15,v|1);v^=v+Math.imul(v^v>>>7,v|61);return((v^v>>>14)>>>0)/4294967296;};}
export const affineText=(a,b)=>`(${a})x ${b<0?'−':'+'} ${Math.abs(b)}`;
export function generateEquation(id,seed,version=1){
 if(version!==1)throw Error('This equation question version is unavailable.');
 if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const family=equationFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown equation family.');
 const rnd=equationRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)],nonzero=()=>pick([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
 const q={id,seed,version,objective:family.objective,marks:[2,2,3,2,2,3][Number(id.slice(2))-1],lines:5,resourceState:'author-draft'};
 const shuffle=options=>{for(let i=options.length-1;i>0;i--){const j=int(0,i);[options[i],options[j]]=[options[j],options[i]];}return options;};
 if(id==='EQ01'||id==='EQ02'){
  const a=nonzero(),b=int(-12,12),root=new Q(int(-20,20),pick([1,2,3,4])),c=new Q(a).mul(root).add(new Q(b)).toString();
  q.math=`${affineText(a,b)} = ${c}`;
  if(id==='EQ01'){
   const candidate=(rnd()<.5?root:root.add(new Q(pick([-2,-1,1,2]),2))).toString(),left=new Q(a).mul(scalar(candidate)).add(new Q(b));
   q.model={kind:'candidate',a,b,c,candidate};q.answer=left.eq(scalar(c))?'yes':'no';q.options=shuffle([{id:'yes',label:qb('Yes, it is a solution','是，它是方程的解')},{id:'no',label:qb('No, it is not a solution','不是，它不是方程的解')}]);
   q.prompt=qb(`Does x = ${candidate} solve this original equation? Compare both sides and explain.`,`x = ${candidate} 是否為這個原方程的解？比較兩邊並解釋。`);
   q.hint=qb('Substitute the proposed value into the original left side, then compare with the original right side.','把所提的數值代入原方程左邊，再與原方程右邊比較。');
   q.solution=qb(`At x = ${candidate}, the left side is (${a})×(${candidate})+(${b}) = ${left}; the right side is ${c}. They ${q.answer==='yes'?'are equal, so this is':'are not equal, so this is not'} a solution.`,`當 x = ${candidate}，左邊為 (${a})×(${candidate})+(${b}) = ${left}；右邊為 ${c}。兩邊${q.answer==='yes'?'相等，所以這是':'不相等，所以這不是'}方程的解。`);
   q.manualReason=true;q.reasonRubric=qb('Manually review substitution into the original equation and an explicit comparison of both side values. A correct selection alone does not verify this explanation.','人工評閱：須代入原方程，並明確比較兩邊的值。選項正確不代表解釋已獲核實。');
   q.diagram={type:'equation-check',candidate,left:`(${a})×(${candidate})+(${b})`,right:c};
  }else{
   q.model={kind:'affine',a,b,c};q.answer=root.toString();q.prompt=qb('Solve the equation. Enter the value of x.','解方程，輸入 x 的值。');
   const remainder=scalar(c).add(new Q(-b)).toString();
   q.hint=qb('Subtract the constant from both sides, then divide both sides by the nonzero coefficient.','兩邊同減常數項，再同除以非零的系數。');
   q.solution=qb(`Subtract ${b} from both sides: (${a})x = ${remainder}. Divide both sides by ${a}: x = ${root}. Check in the original: (${a})×(${root})+(${b}) = ${c}.`,`兩邊同減 ${b}，得 (${a})x = ${remainder}；再同除以 ${a}，得 x = ${root}。代回原式檢驗：(${a})×(${root})+(${b}) = ${c}。`);
   q.diagram={type:'equation-steps',lines:[qb(`Original: ${q.math}`,`原式：${q.math}`),qb(`Apply the same subtraction (−${b}) to both sides.`,`兩邊進行相同的減法（減 ${b}）。`),qb(`Then divide both sides by ${a}.`,`再把兩邊同除以 ${a}。`)]};
  }
 }else if(id==='EQ03'){
  const a=int(2,6),b=int(1,6),c=pick([-12,-10,-8,-6,-4,-2,2,4,6,8,10,12]);q.model={kind:'repair',a,b,c};q.math=`${a}(x − ${b}) = ${c}`;q.answer='distributed';
  const correct=`${a}x − ${a*b} = ${c}`,wrong=`${a}x − ${b} = ${c}`;
  q.options=shuffle([{id:'distributed',label:correct},{id:'unchanged',label:wrong},{id:'wrong-sign',label:`${a}x + ${a*b} = ${c}`}]);
  q.prompt=qb(`A learner replaces the original equation by ${wrong}. Choose a correct replacement for that line and explain the error.`,`某同學把原方程改寫為 ${wrong}。選出可正確取代該行的式子，並解釋錯誤。`);
  q.hint=qb('The factor outside the brackets multiplies every term inside, including the signed constant.','括號外的因數須乘以括號內每一項，包括帶正負號的常數項。');
  q.solution=qb(`Use ${correct}. The factor ${a} multiplies both x and −${b}; the proposed line multiplied only x. The original equation has exactly one solution, x = ${new Q(c,a).add(new Q(b))}.`,`應為 ${correct}。因數 ${a} 須同時乘以 x 和 −${b}；所提的步驟只乘了 x。原方程只有一個解，x = ${new Q(c,a).add(new Q(b))}。`);
  q.manualReason=true;q.reasonRubric=qb('Manually review an explanation that the factor multiplies every term, including the negative constant. The selected line is checked separately.','人工評閱解釋：因數須乘以每一項，包括負的常數項。所選式子與解釋分開核對。');
  q.diagram={type:'equation-steps',lines:[qb(`Original: ${q.math}`,`原式：${q.math}`),qb(`Proposed line (not valid): ${wrong}`,`所提步驟（不成立）：${wrong}`)]};
 }else if(id==='EQ04'){
  const a=nonzero(),d=pick([-5,-4,-3,-2,-1,0,1,2,3,4,5].filter(x=>x!==a)),b=int(-6,6),c=int(-12,12),root=new Q(int(-18,18),pick([1,2,3,4])),e=new Q(a-d).mul(root).add(new Q(a*b+c)).toString();
  q.model={kind:'both-sides',a,b,c,d,e};q.math=`${a}(x + (${b})) + (${c}) = (${d})x + (${e})`;q.answer=root.toString();
  q.prompt=qb('Solve the equation. Keep both original sides available for checking.','解方程，並保留原方程兩邊以供檢驗。');
  q.hint=qb('Expand the bracket, subtract the same variable term on both sides, then isolate x. The collected coefficient is nonzero.','先展開括號，再把兩邊同減相同的未知數項，然後求 x。合併後的系數不為零。');
  const constant=a*b+c,right=scalar(e).add(new Q(-constant)),check=new Q(d).mul(root).add(scalar(e));
  q.solution=qb(`Expand to (${a})x+(${constant}) = (${d})x+(${e}). Subtract (${d})x and ${constant} from both sides: (${a-d})x = ${right}. Thus x = ${root}. In the original equation both sides equal ${check}.`,`展開得 (${a})x+(${constant}) = (${d})x+(${e})。兩邊同減 (${d})x 和 ${constant}，得 (${a-d})x = ${right}，所以 x = ${root}。代回原方程，兩邊均等於 ${check}。`);
  q.diagram={type:'equation-balance',left:`${a}(x+(${b}))+(${c})`,right:`(${d})x+(${e})`};
 }else{
  const fixed=int(2,15),rate=id==='EQ06'?2*int(1,5):int(2,8),root=id==='EQ06'?new Q(int(1,24),2):new Q(int(2,12)),total=new Q(rate).mul(root).add(new Q(fixed)).toString();
  q.model={kind:id==='EQ05'?'model-choice':'rental',fixed,rate,total};q.math=id==='EQ05'?'x = ?':'x = ?';q.diagram={type:'fee-table',fixed,rate,total,unit:id==='EQ06'?'hour':'game'};
  if(id==='EQ05'){
   q.answer='fixed-plus-rate';q.options=shuffle([{id:'fixed-plus-rate',label:`${rate}x + ${fixed} = ${total}`},{id:'fixed-repeated',label:`(${rate} + ${fixed})x = ${total}`},{id:'swapped',label:`${fixed}x + ${rate} = ${total}`}]);
   // Equal fixed/rate would make the swapped option identical. Use a distinct missing-fixed option instead.
   if(fixed===rate)q.options.find(o=>o.id==='swapped').label=`${rate}x = ${total}`;
   q.prompt=qb(`Entry costs $${fixed} once and each game costs $${rate}. The total is $${total}. Let x be the number of games. Choose an equation and explain the two costs.`,`入場費一次 $${fixed}，每局遊戲 $${rate}，總費用 $${total}。設遊戲局數為 x。選出方程，並解釋兩種費用。`);
   q.hint=qb('The fixed fee is paid once. The per-game charge is paid x times.','固定費用只付一次；每局費用須付 x 次。');
   q.solution=qb(`The repeated cost is ${rate}x and the one-time cost is ${fixed}, so ${rate}x+${fixed}=${total}. The fixed fee is not repeated.`,`重複費用為 ${rate}x，加上一次的固定費用 ${fixed}，得 ${rate}x+${fixed}=${total}。固定費用不會按局數重複。`);
   q.reasonRubric=qb('Manually review the definition of x, the rate multiplied by x, the fixed fee paid once, and the total on the other side.','人工評閱：說清 x 的定義、每局費用乘以 x、固定費用只付一次，以及另一邊的總費用。');
  }else{
   q.answer=root.toString();q.answerUnit=qb('hours','小時');q.prompt=qb(`A rental costs $${fixed} once plus $${rate} per hour. Half-hours are allowed and charged proportionally. The total is $${total}. Let x be the rental time in hours. Find x; write your equation and explain why the time is allowed.`,`租用費為一次 $${fixed}，另加每小時 $${rate}。可按半小時租用，費用按比例計算。總費用 $${total}。設租用時間為 x 小時。求 x，寫出方程並解釋時間是否符合規定。`);
   q.hint=qb('Remove the one-time charge before dividing by the hourly rate. Check the half-hour condition and original total.','先扣去一次費用，再除以每小時費用；檢查半小時的規定和原來總費用。');
   const remainder=scalar(total).add(new Q(-fixed));
   q.solution=qb(`Let x be hours: ${fixed}+${rate}x=${total}. Then ${rate}x=${remainder}, so x=${root} hours. This is a positive multiple of half an hour. Check: ${fixed}+${rate}×(${root})=${total}.`,`設時間為 x 小時：${fixed}+${rate}x=${total}，得 ${rate}x=${remainder}，所以 x=${root} 小時。這是半小時的正整數倍，符合規定。檢驗：${fixed}+${rate}×(${root})=${total}。`);
   q.reasonRubric=qb('Manually review a defined unknown in hours, an equivalent fixed-plus-rate equation, substitution into the total, and the positive half-hour interpretation. Automatic final-value correctness does not verify these parts.','人工評閱：以小時定義未知數、等價的固定費用加按時費用方程、代回總費用，以及正的半小時倍數之解釋。最終數值自動核對正確，不代表這些部分已獲核實。');
  }
  q.manualReason=true;
 }
 q.contract=q.options?{type:'choice',answer:q.answer}:{type:'number',answer:q.answer,form:'number-literal'};
 q.exposureKey=id+':'+JSON.stringify(q.model);return q;
}
