import {Q} from './exact.mjs';
const eb=(en,zh)=>({en,zh});
export const expressionFamilies=[
 {id:'EX01',title:eb('Words to an expression','由文字寫出代數式'),objective:'JS-7-1',contract:'expression'},
 {id:'EX02',title:eb('Read an expression in words','以文字理解代數式'),objective:'JS-7-2',contract:'choice'},
 {id:'EX03',title:eb('Write a formula with two quantities','用兩個量寫公式'),objective:'JS-7-1',contract:'manual'},
 {id:'EX04',title:eb('Propose and explain a sequence pattern','提出並解釋數列規律'),objective:'JS-7-3',contract:'manual'},
 {id:'EX05',title:eb('Evaluate a supplied general term','由已知通項求指定項'),objective:'JS-7-3',contract:'number'},
 {id:'EX06',title:eb('Follow an input–output rule','依輸入輸出規則計算'),objective:'JS-7-4',contract:'number'}
].map(f=>({...f,topic:'js-7',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020; independent review pending'}));
function expressionRandom(seed){let state=2166136261;for(const c of seed)state=Math.imul(state^c.charCodeAt(0),16777619);return()=>{state+=0x6d2b79f5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function sequenceValue(rule,n){if(!Number.isInteger(n)||n<1||n>20)throw Error('Unsupported sequence index.');const rules={odd:()=>2*n-1,even:()=>2*n,square:()=>n*n,triangular:()=>n*(n+1)/2};if(!rules[rule])throw Error('Unknown sequence rule.');return rules[rule]();}
export function sequenceFormula(rule){return {odd:'2n − 1',even:'2n',square:'n²',triangular:'n(n + 1)/2'}[rule];}
export function generateExpression(id,seed,version=1){
 if(version!==1)throw Error('This expression-family version is unavailable.');
 if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const family=expressionFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown expression family.');
 const random=expressionRandom(id+':'+seed),int=(a,b)=>Math.floor(random()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)];
 const q={id,seed,version,objective:family.objective,marks:family.contract==='manual'?3:1,lines:family.contract==='manual'?5:3,resourceState:'author-draft'};
 if(id==='EX01'){
  const a=int(2,9),b=int(1,12),mode=pick(['scale-sum','less-than','subtract-from']);q.model={kind:'words',a,b,mode};q.math='x';
  const templates={
   'scale-sum':{answer:`${a}*(x+${b})`,prompt:eb(`Write an expression for ${a} times the sum of x and ${b}.`,`以代數式表示「x 與 ${b} 的和的 ${a} 倍」。`),solution:eb(`First form x + ${b}, then multiply the whole sum by ${a}: ${a}(x + ${b}). Equivalent expressions are accepted; expansion is not required.`,`先寫 x + ${b}，再把整個和乘以 ${a}，得 ${a}(x + ${b})。可用等價代數式，不必展開。`)},
   'less-than':{answer:`${a}*x-${b}`,prompt:eb(`Write an expression for ${b} less than ${a} times x.`,`以代數式表示「x 的 ${a} 倍減去 ${b}」。`),solution:eb(`${a} times x is ${a}x. Subtract ${b} from it: ${a}x − ${b}.`, `x 的 ${a} 倍是 ${a}x，再減去 ${b}，得 ${a}x − ${b}。`)},
   'subtract-from':{answer:`${b}-${a}*x`,prompt:eb(`Subtract ${a} times x from ${b}. Write an expression.`,`以代數式表示「${b} 減去 x 的 ${a} 倍」。`),solution:eb(`The starting quantity is ${b}; subtract ${a}x from it: ${b} − ${a}x.`,`起初的量是 ${b}，從它減去 ${a}x，得 ${b} − ${a}x。`)}}
  Object.assign(q,templates[mode]);q.contract={type:'expression',answer:q.answer};q.hint=eb('Identify what is being multiplied or subtracted as a whole. Preserve the order and grouping.','先找出整個被乘或被減的量，保留運算次序和分組。');
 }else if(id==='EX02'){
  const mode=pick(['grouped','two-variables']),a=int(2,6),b=int(1,9);q.model=mode==='grouped'?{kind:'reading',mode,a,b}:{kind:'reading',mode};q.math=mode==='grouped'?`${a}(x + ${b})`:'bh';q.answer='meaning';
  q.prompt=eb('Choose the phrase that describes the expression.','選出能表達此代數式的文字片語。');
  q.options=mode==='grouped'?[
   {id:'meaning',label:eb(`${a} times the sum of x and ${b}`,`x 與 ${b} 的和的 ${a} 倍`)},
   {id:'outside-add',label:eb(`The sum of ${a} times x and ${b}`,`x 的 ${a} 倍與 ${b} 的和`)},
   {id:'inside-subtract',label:eb(`${a} times the difference x minus ${b}`,`x 減去 ${b} 所得差的 ${a} 倍`)}
  ]:[{id:'meaning',label:eb('The product of b and h','b 與 h 的積')},{id:'sum',label:eb('The sum of b and h','b 與 h 的和')},{id:'quotient',label:eb('b divided by h','b 除以 h')}];
  for(let i=q.options.length-1;i>0;i--){const j=int(0,i);[q.options[i],q.options[j]]=[q.options[j],q.options[i]];}
  q.contract={type:'choice',answer:q.answer};q.hint=eb('Read the operation and its grouping. Adjacent variable letters represent multiplication, not a two-digit number.','先讀運算及分組；相鄰的變量字母表示相乘，不是兩位數。');
  q.solution=mode==='grouped'?eb(`The brackets group x + ${b}; the factor ${a} multiplies this entire sum.`,`括號把 x + ${b} 分為一組；${a} 乘以整個和。`):eb('bh means b × h, the product of b and h.','bh 即 b × h，是 b 與 h 的積。');
 }else if(id==='EX03'){
  const shape=pick(['triangle','rectangle']);q.model={kind:'area-formula',shape};q.math='A = ?';q.answer=shape==='triangle'?'b*h/2':'b*h';q.contract={type:'manual'};q.manualReason=true;
  q.prompt=shape==='triangle'?eb('A triangle has base b and perpendicular height h, both positive lengths. Complete A = __ and explain the factor 1/2.','三角形的底為 b、垂直高度為 h，兩者均為正長度。完成 A = __，並解釋因數 1/2。'):eb('A rectangle has length b and width h, both positive lengths. Complete its area formula A = __ and explain the roles of b and h.','長方形的長為 b、闊為 h，兩者均為正長度。完成面積公式 A = __，並解釋 b、h 的作用。');
  q.hint=shape==='triangle'?eb('Compare two identical triangles with a parallelogram of base b and height h.','把兩個相同三角形與底為 b、高為 h 的平行四邊形比較。'):eb('Area combines the two perpendicular lengths by multiplication.','面積由兩條互相垂直的長度相乘而得。');
  q.solution=shape==='triangle'?eb('A = bh/2. Two congruent copies form a parallelogram of area bh, so each triangle has half that area. Equivalent formulas such as hb/2 or 0.5bh are valid.','A = bh/2。兩個全等三角形可拼成面積為 bh 的平行四邊形，因此一個三角形佔其一半。hb/2、0.5bh 等等價公式亦可。'):eb('A = bh. Multiply length b by width h; the area has square units. hb is an equivalent formula.','A = bh，把長 b 乘以闊 h；面積使用平方單位。hb 是等價公式。');
  q.reasonRubric=eb('Manual review of the whole response: variables have the stated meanings; the formula models area; the explanation justifies multiplication and, for a triangle, halving. Accept equivalent valid formulas.','整份作答需人工評閱：變量意思正確、公式能表示面積，並能解釋相乘及三角形面積的一半因數。接受合理的等價公式。');
  q.diagram={type:'area-formula',shape};
 }else if(id==='EX04'){
  const rule=pick(['odd','even','square','triangular']),start=int(1,4),terms=Array.from({length:4},(_,i)=>sequenceValue(rule,start+i));q.model={kind:'open-sequence',rule,start,terms};q.math=terms.join(', ')+', ?';q.answer=String(sequenceValue(rule,start+4));q.contract={type:'manual'};q.manualReason=true;q.nonUnique=true;
  const names={odd:eb('consecutive odd numbers','連續奇數'),even:eb('consecutive even numbers','連續偶數'),square:eb('consecutive square numbers','連續正方形數'),triangular:eb('consecutive triangular numbers','連續三角形數')};
  q.prompt=eb('Suggest one possible next term. Explain a rule that fits all four given terms. Is that continuation forced by the four terms alone?','提出一個可能的下一項，並解釋符合所有四個已知項的規律。只憑這四項，延伸結果是否唯一？');
  q.hint=eb('Look for a familiar number pattern or consecutive differences, but explain your chosen rule. A finite prefix does not force one continuation.','可觀察熟悉的數列或相鄰項的差，但要解釋所選規律。有限的已知項不能唯一確定延伸。');
  q.solution=eb(`One possible next term is ${q.answer}, continuing ${names[rule].en}. A different clearly explained rule fitting every given term may give a different continuation. The prefix alone does not force a unique next term.`,`一個可能的下一項是 ${q.answer}，按${names[rule].zh}延伸。若另一個清楚的規律符合所有已知項，也可以有不同的下一項；只憑有限項不能確定唯一延伸。`);
  q.reasonRubric=eb('Manual review: the rule must fit all four given terms and the proposed next term. Acknowledge non-uniqueness. A different consistent rule is not wrong merely because it differs from the model. No algebraic recurrence is required.','人工評閱：規律須符合所有四個已知項及所提下一項，並指出延伸並非唯一。其他一致的規律不會只因不同於參考例子而算錯；不要求代數遞推式。');q.diagram={type:'sequence-cards',terms};
 }else if(id==='EX05'){
  const rule=pick(['odd','even','square','triangular']),n=int(1,12);q.model={kind:'general-term',rule,n};q.answer=String(sequenceValue(rule,n));q.math=`aₙ = ${sequenceFormula(rule)}; n = ${n}`;q.contract={type:'number',answer:q.answer,form:'number-literal'};
  q.prompt=eb(`The general term is supplied. Find a${n}, the term at position ${n}.`,`已給定數列通項。求第 ${n} 項 a${n}。`);q.hint=eb('Replace every n in the supplied rule by the requested position. The index and the term value are different roles.','把規則中的每個 n 都換成指定項的位置；項的位置和項的值作用不同。');
  q.solution=eb(`Use n = ${n} in ${sequenceFormula(rule)} to obtain ${q.answer}. The explicit general term determines this value; it is not a guess from a prefix.`,`把 n = ${n} 代入 ${sequenceFormula(rule)}，得 ${q.answer}。這個值由已知通項決定，不是僅憑前幾項猜測。`);q.diagram={type:'term-table',n};
 }else{
  const rule=pick(['affine','square-plus']),a=int(2,6),b=int(-4,4),input=int(-5,5);q.model=rule==='affine'?{kind:'machine',rule,a,b,input}:{kind:'machine',rule,b,input};q.answer=String((rule==='affine'?a*input:input*input)+b);q.contract={type:'number',answer:q.answer,form:'number-literal'};
  const processing=rule==='affine'?eb(`multiply by ${a}, then ${b<0?'subtract':'add'} ${Math.abs(b)}`,`先乘以 ${a}，再${b<0?'減去':'加上'} ${Math.abs(b)}`):eb(`square the whole input, then ${b<0?'subtract':'add'} ${Math.abs(b)}`,`先把整個輸入值平方，再${b<0?'減去':'加上'} ${Math.abs(b)}`);
  q.math=`${rule==='affine'?a+'x':'x²'} ${b<0?'−':'+'} ${Math.abs(b)}; x = (${input})`;q.prompt=eb(`A machine follows this rule: ${processing.en}. Find the output for input ${input}.`,`機器按規則處理：${processing.zh}。輸入 ${input} 時，求輸出。`);
  q.hint=eb('Follow the stated processing order. Put a negative input in brackets before squaring.','按指定次序處理；負的輸入值在平方前須放入括號。');
  q.solution=eb(`For input ${input}, the first operation gives ${rule==='affine'?a*input:input*input}; applying the remaining ${b<0?'subtraction':'addition'} gives ${q.answer}. The same input under the same rule gives the same output.`,`輸入 ${input}，第一步得 ${rule==='affine'?a*input:input*input}；再${b<0?'減去':'加上'} ${Math.abs(b)}，得 ${q.answer}。相同輸入按同一規則會得到相同輸出。`);
  q.diagram={type:'input-output',input,processing};
 }
 q.exposureKey=id+':'+JSON.stringify(q.model);return q;
}
