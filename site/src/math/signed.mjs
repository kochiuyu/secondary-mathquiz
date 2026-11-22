import {Q,scalar} from './exact.mjs';
export const curriculumFamilies=[
 {id:'SN01',title:{en:'Signed quantities and zero',zh:'有向數與零'},objective:'JS-2-1',topic:'js-2',contract:'number'},
 {id:'SN02',title:{en:'Compare directed numbers',zh:'比較有向數'},objective:'JS-2-1',topic:'js-2',contract:'choice'},
 {id:'SN03',title:{en:'Movement, addition and subtraction',zh:'移動、加法與減法'},objective:'JS-2-2',topic:'js-2',contract:'number'},
 {id:'SN04',title:{en:'Multiplication and division signs',zh:'乘除的符號規律'},objective:'JS-2-2',topic:'js-2',contract:'number'},
 {id:'SN05',title:{en:'Mixed operations with rational values',zh:'有理數的混合運算'},objective:'JS-2-2',topic:'js-2',contract:'number'},
 {id:'SN06',title:{en:'Find the directed change',zh:'求有向變化'},objective:'JS-2-3',topic:'js-2',contract:'number'}
].map(f=>({...f,version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020; independent review pending'}));
const sb=(en,zh)=>({en,zh});
function signedRandom(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6d2b79f5;let v=h;v=Math.imul(v^v>>>15,v|1);v^=v+Math.imul(v^v>>>7,v|61);return((v^v>>>14)>>>0)/4294967296;};}
export function generateCurriculum(id,seed,version=1){
 if(version!==1)throw Error('This curriculum question version is unavailable.');
 if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const family=curriculumFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown curriculum family.');
 const rnd=signedRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)];
 const q={id,seed,version,objective:family.objective,marks:id==='SN05'||id==='SN06'?2:1,lines:id==='SN05'||id==='SN06'?4:3,resourceState:'author-draft'};
 let answer;
 if(id==='SN01'){
  const magnitude=int(0,20),direction=magnitude?pick([-1,1]):0;answer=String(magnitude*direction);q.model={kind:'reference',magnitude,direction};
  q.math=magnitude?`0 °C; ${direction<0?'↓':'↑'} ${magnitude} °C`:'0 °C';
  q.prompt=magnitude?sb(`The temperature is ${magnitude} °C ${direction<0?'below':'above'} 0 °C. Write its directed number in °C.`,`氣溫比 0 °C ${direction<0?'低':'高'} ${magnitude} °C。以有向數表示氣溫（單位：°C）。`):sb('The temperature is exactly 0 °C. Write its directed number in °C.','氣溫剛好是 0 °C。以有向數表示氣溫（單位：°C）。');
  q.hint=sb('Zero is the reference. Below is negative; above is positive. Zero itself is neither.','以零為基準，低於零用負數，高於零用正數；零本身既不是正數，也不是負數。');
  q.solution=sb(`${magnitude===0?'At the reference, the value is zero.':direction<0?'Below zero means a negative value.':'Above zero means a positive value.'} The temperature is ${answer} °C.`,`${magnitude===0?'剛好在基準上，數值為零。':direction<0?'低於零，所以用負數表示。':'高於零，所以用正數表示。'}氣溫是 ${answer} °C。`);
  q.answerUnit=sb('°C','°C');q.diagram={type:'signed-line',values:['0'],minimum:-22,maximum:22,tick:5,description:sb('Reference zero on an equally spaced scale; use the temperature description to find the value.','等距數線上標示基準零；請按氣溫描述找出數值。')};
 }else if(id==='SN02'){
  const denominator=pick([1,2,4]),gap=int(1,8),n=int(-12*denominator,12*denominator-gap),left=new Q(n,denominator).toString(),right=new Q(n+gap,denominator).toString();
  const swap=rnd()<.5,a=swap?right:left,b=swap?left:right;answer=swap?'left':'right';q.model={kind:'comparison',a,b};q.math=`${a}, ${b}`;
  q.options=[{id:'left',label:a},{id:'right',label:b}];if(rnd()<.5)q.options.reverse();
  q.prompt=sb('Choose the greater number.','選出較大的數。');q.hint=sb('On a number line, the number further right is greater. Compare values, not just their unsigned digits.','在數線上，越右的數越大；不要只比較不帶正負號的數字。');
  q.solution=sb(`${right} > ${left}. The greater value lies further right on a number line.`,`${right} > ${left}。較大的數在數線上位於較右方。`);
  q.diagram={type:'signed-line',values:[a,b],description:sb('Both numbers are plotted on the same equally spaced number line.','兩個數標示在同一條等距數線上。')};
 }else if(id==='SN03'){
  const a=int(-12,12),b=int(-12,12),operation=pick(['add','subtract']),delta=operation==='add'?b:-b;answer=String(a+delta);q.model={kind:'movement',a,b,operation};q.math=`${a} ${operation==='add'?'+':'−'} (${b})`;
  q.prompt=sb('Calculate the final value.','計算最終數值。');q.hint=sb('Adding moves by the signed operand. Subtracting adds its opposite; subtracting a negative moves right.','加法按有向數移動；減去一個數即加上其相反數，減去負數會向右移。');
  q.solution=sb(`${q.math} = ${a} + (${delta}) = ${answer}. ${delta===0?'No movement.':`Move ${Math.abs(delta)} units ${delta>0?'right':'left'} from ${a}.`}`,`${q.math} = ${a} + (${delta}) = ${answer}。${delta===0?'位置不變。':`由 ${a} 向${delta>0?'右':'左'}移 ${Math.abs(delta)} 個單位。`}`);
  q.diagram={type:'signed-line',values:[String(a)],bounds:[a,a+delta],movement:{start:a,delta},description:sb(`Start at ${a}; ${operation==='add'?'add':'subtract'} ${b}. Tick spacing is uniform; the endpoint value is unlabelled.`,`由 ${a} 出發，${operation==='add'?'加上':'減去'} ${b}；刻度等距，終點數值未標示。`)};
 }else if(id==='SN04'){
  const operation=pick(['multiply','divide']);let a,b;
  if(operation==='divide'){b=pick([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]);const quotient=int(-9,9);a=b*quotient;answer=String(quotient);}else{a=int(-9,9);b=int(-9,9);answer=String(a*b);}
  q.model={kind:'product',a,b,operation};q.math=`(${a}) ${operation==='divide'?'÷':'×'} (${b})`;q.prompt=sb('Calculate. Use an inverse or sign pattern to check.','計算，並用逆運算或符號規律檢驗。');
  q.hint=sb('For nonzero values, equal signs give a positive product/quotient and different signs give a negative one. A zero factor/dividend gives zero; never divide by zero.','非零數相乘或相除，同號得正、異號得負。因數或被除數為零時，結果為零；不能除以零。');
  q.solution=operation==='divide'?sb(`${q.math} = ${answer}. Check: (${b}) × (${answer}) = ${a}.`,`${q.math} = ${answer}。檢驗：（${b}）×（${answer}）= ${a}。`):sb(`${q.math} = ${answer}. ${a===0||b===0?'A factor is zero.':a*b>0?'The nonzero factors have the same sign.':'The nonzero factors have different signs.'}`,`${q.math} = ${answer}。${a===0||b===0?'其中一個因數為零。':a*b>0?'兩個非零因數同號。':'兩個非零因數異號。'}`);
 }else if(id==='SN05'){
  const a=int(-9,9),b=int(-9,9),c=int(-9,9),d=pick([-4,-3,-2,2,3,4]);answer=new Q(a+b*c,d).toString();q.model={kind:'mixed',a,b,c,d};q.math=`[${a} + (${b}) × (${c})] ÷ (${d})`;
  q.prompt=sb('Calculate. Give an exact final value.','計算，寫出準確的最終數值。');q.hint=sb('Multiply inside the brackets first, then add, then divide the whole bracket result.','先計算括號內的乘法，再相加，最後把整個括號的結果相除。');
  q.solution=sb(`(${b}) × (${c}) = ${b*c}; ${a} + (${b*c}) = ${a+b*c}; (${a+b*c}) ÷ (${d}) = ${answer}.`,`（${b}）×（${c}）= ${b*c}；${a} +（${b*c}）= ${a+b*c}；（${a+b*c}）÷（${d}）= ${answer}。`);
 }else{
  const initial=int(-15,15);let final=int(-15,14);if(final>=initial)final++;const delta=final-initial;answer=String(delta);q.model={kind:'change',initial,final};q.math=`${initial} °C → ${final} °C`;
  q.prompt=sb(`The temperature changes from ${initial} °C to ${final} °C. Find the directed change in °C.`,`氣溫由 ${initial} °C 變為 ${final} °C。求氣溫的有向變化（單位：°C）。`);
  q.hint=sb('Change = final − initial. Check that initial + change = final.','變化 = 最後數值 − 最初數值；可用「最初數值 + 變化 = 最後數值」檢驗。');
  q.solution=sb(`Change = ${final} − (${initial}) = ${answer} °C: a ${delta>0?'rise':'fall'} of ${Math.abs(delta)} °C. Check: ${initial} + (${delta}) = ${final}.`,`變化 = ${final} −（${initial}）= ${answer} °C，即${delta>0?'上升':'下降'} ${Math.abs(delta)} °C。檢驗：${initial} +（${delta}）= ${final}。`);
  q.answerUnit=sb('°C change','°C（變化）');q.manualReason=true;q.reasonRubric=sb('State final minus initial and interpret the sign as rise/fall. The automatic result check does not verify your explanation.','說明「最後減最初」，並按正負號解釋上升或下降。自動核對數值並不會核實解釋。');
  q.diagram={type:'signed-line',values:[String(initial),String(final)],description:sb(`Initial temperature ${initial} °C; final temperature ${final} °C. Find their directed difference.`,`最初氣溫 ${initial} °C，最後氣溫 ${final} °C；求兩者的有向差。`)};
 }
 q.answer=answer;q.contract={type:id==='SN02'?'choice':'number',answer,...(id==='SN02'?{}:{form:'number-literal'})};
 // Semantic inputs, rather than answer or wording, define retained exposure.
 q.exposureKey=id+':'+JSON.stringify(q.model);
 validateSigned(q);return q;
}
export function validateSigned(q){
 const m=q.model;if(!m||!curriculumFamilies.some(f=>f.id===q.id))throw Error('Invalid signed-number model.');
 let expected;
 if(q.id==='SN01'){if(m.magnitude<0||m.magnitude>20||![0,-1,1].includes(m.direction)||(m.magnitude===0)!==(m.direction===0))throw Error('Invalid reference.');expected=String(m.magnitude*m.direction);}
 if(q.id==='SN02'){const a=scalar(m.a),b=scalar(m.b);if(a.eq(b))throw Error('Comparison values must differ.');expected=a.n*b.d>b.n*a.d?'left':'right';if(new Set(q.options.map(o=>o.id)).size!==2||new Set(q.options.map(o=>scalar(o.label).toString())).size!==2)throw Error('Duplicate choices.');}
 if(q.id==='SN03')expected=String(m.a+(m.operation==='add'?m.b:-m.b));
 if(q.id==='SN04'){if(m.operation==='divide'&&m.b===0)throw Error('Zero divisor.');expected=m.operation==='divide'?new Q(m.a,m.b).toString():String(m.a*m.b);}
 if(q.id==='SN05'){if(m.d===0)throw Error('Zero divisor.');expected=new Q(m.a+m.b*m.c,m.d).toString();}
 if(q.id==='SN06')expected=String(m.final-m.initial);
 if(q.answer!==expected||q.contract.answer!==expected)throw Error('Signed-number answer mismatch.');return q;
}
