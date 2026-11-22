import {Q,scalar} from './exact.mjs';
const bcText=(en,zh)=>({en,zh});
export const basicFamilies=[
 ['BC01','Recognise a divisibility test','運用整除性判別方法','JS-1-1','choice'],
 ['BC02','Read and evaluate a power','理解及計算乘方','JS-1-2','number'],
 ['BC03','Recognise prime factorisation','辨認質因數分解','JS-1-3','choice'],
 ['BC04','Find a greatest common divisor','求最大公因數','JS-1-4','number'],
 ['BC05','Find a least common multiple','求最小公倍數','JS-1-4','number'],
 ['BC06','Work through nested brackets','處理多重括號','JS-1-5','number'],
 ['BC07','Calculate with exact fractions','分數的準確運算','JS-1-6','number'],
 ['BC08','Connect decimals and fractions','小數與分數的混合運算','JS-1-6','number']
].map(([id,en,zh,objective,contract])=>({id,title:bcText(en,zh),objective,contract,topic:'js-1',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020, Unit 1; independent review pending'}));
function basicRandom(seed){let state=2166136261;for(const c of seed)state=Math.imul(state^c.charCodeAt(0),16777619);return()=>{state+=0x6d2b79f5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function basicGcd(a,b){while(b)[a,b]=[b,a%b];return a;}
export function basicPrimePowers(n){if(!Number.isInteger(n)||n<1||n>100000)throw Error('Positive bounded integer required.');const out=[];for(let p=2;p*p<=n;p++){let e=0;while(n%p===0){e++;n/=p;}if(e)out.push([p,e]);}if(n>1)out.push([n,1]);return out;}
const bcSup=n=>String(n).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('');
export const basicFactorText=n=>n===1?'1':basicPrimePowers(n).map(([p,e])=>String(p)+(e>1?bcSup(e):'')).join(' × ');
export function basicDecimal(n,places){const digits=String(n).padStart(places+1,'0');return digits.slice(0,-places)+'.'+digits.slice(-places);}
export function basicExposureKey(id,model){
 const semantic=['BC04','BC05'].includes(id)?{kind:model.kind,numbers:[...model.numbers].sort((a,b)=>a-b)}:model;
 return id+':'+JSON.stringify(semantic);
}
export function generateBasic(id,seed,version=1){
 if(version!==1)throw Error('This basic-computation question version is unavailable.');if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const family=basicFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown basic-computation family.');
 const rnd=basicRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)];
 const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=int(0,i);[items[i],items[j]]=[items[j],items[i]];}return items;};
 const q={id,seed,version,objective:family.objective,marks:id==='BC02'?1:2,lines:5,resourceState:'author-draft'};
 if(id==='BC01'){
  const divisor=pick([4,6,8,9]),n=int(1,9999),tail=n%(divisor===8?1000:100),digits=[...String(n)].map(Number),sum=digits.reduce((a,b)=>a+b,0);
  q.model={kind:'divisibility',n,divisor};q.answer=n%divisor===0?'yes':'no';q.math=String(n);
  q.options=shuffle([{id:'yes',label:bcText('Yes, divisible','可以整除')},{id:'no',label:bcText('No, not divisible','不能整除')}]);
  q.prompt=bcText(`Is ${n} divisible by ${divisor}? State the digit test you used. You do not need to prove why the test works.`,`${n} 能否被 ${divisor} 整除？說明所用的判別方法；不須證明該方法為何成立。`);
  const test=divisor===4?bcText(`The number formed by the last two digits is ${tail}; test whether it is divisible by 4.`,`末兩位數組成的數是 ${tail}；檢查它能否被 4 整除。`):divisor===8?bcText(`The number formed by the last three digits is ${tail}; test whether it is divisible by 8.`,`末三位數組成的數是 ${tail}；檢查它能否被 8 整除。`):divisor===9?bcText(`The digit sum is ${sum}; test whether it is divisible by 9.`,`各位數字之和是 ${sum}；檢查它能否被 9 整除。`):bcText(`The number ${n%2===0?'is':'is not'} even and its digit sum ${sum} ${sum%3===0?'is':'is not'} divisible by 3. Both conditions are needed.`,`這個數${n%2===0?'是':'不是'}偶數，而各位數字之和 ${sum}${sum%3===0?'能':'不能'}被 3 整除；兩個條件必須同時成立。`);
  q.hint=bcText('For 4 use the last two digits; for 8 use the last three; for 9 use the digit sum; for 6 check both 2 and 3.','4 看末兩位，8 看末三位，9 看各位數字之和；6 須同時通過 2 和 3 的判別。');
  q.solution=bcText(`${test.en} Therefore ${n} is ${q.answer==='yes'?'':'not '}divisible by ${divisor}.`,`${test.zh}因此 ${n}${q.answer==='yes'?'能':'不能'}被 ${divisor} 整除。`);
  q.manualReason=true;q.reasonRubric=bcText('Review the stated test and its application to this number. A proof of the general divisibility rule is not required.','評閱所述的判別方法及其在此數的應用；不要求證明一般的整除性規則。');q.diagram={type:'basic-model',kind:'digits',n,divisor};
 }else if(id==='BC02'){
  const mode=pick(['value','exponent']),base=int(mode==='value'?1:2,6),exponent=int(1,4),value=base**exponent;
  q.model=mode==='value'?{kind:'power',mode,base,exponent}:{kind:'power',mode,base,value};q.answer=String(mode==='value'?value:exponent);
  q.math=mode==='value'?`${base}^${exponent}`:`${base}^? = ${value}`;
  q.prompt=mode==='value'?bcText('Evaluate the given power. Enter its final numerical value.','計算這個乘方，輸入最終數值。'):bcText(`Write ${value} as a power with base ${base}. Enter the positive integer exponent.`,`把 ${value} 寫成以 ${base} 為底數的乘方，輸入正整數指數。`);
  q.hint=bcText('The exponent counts equal factors; it does not mean multiply the base by the exponent.','指數表示相同因子的個數，並非把底數乘以指數。');
  q.solution=bcText(`${base}^${exponent} = ${Array(exponent).fill(base).join(' × ')} = ${value}. The base is ${base}; there are ${exponent} equal factors.`,`${base}${bcSup(exponent)} = ${Array(exponent).fill(base).join(' × ')} = ${value}。底數是 ${base}，相同因子共有 ${exponent} 個。`);
  q.diagram={type:'basic-model',kind:'power',base,exponent:mode==='value'?exponent:null,value:mode==='exponent'?value:null};
 }else if(id==='BC03'){
  const powers=[int(2,3),int(0,2),int(0,1)],n=2**powers[0]*3**powers[1]*5**powers[2];q.model={kind:'prime-factorisation',powers};q.math=String(n);q.answer='prime';
  const rest=n/4,partial='4'+(rest>1?' × '+basicFactorText(rest):'');
  q.options=shuffle([{id:'prime',label:basicFactorText(n)},{id:'composite',label:partial},{id:'unit',label:'1 × '+basicFactorText(n)},{id:'wrong-power',label:basicFactorText(n*2)}]);
  q.prompt=bcText(`Choose the prime factorisation of ${n}. Explain why the factors qualify and the product is correct.`,`選出 ${n} 的質因數分解，並解釋因子為何符合要求及乘積為何正確。`);
  q.hint=bcText('Every base must be prime. A product containing 1 or a composite factor is not a prime factorisation, even if its value matches.','每個底數都須是質數；即使乘積相同，含有 1 或合成因子的式子也不是質因數分解。');
  q.solution=bcText(`${n} = ${basicFactorText(n)}. Every base is prime and the product is ${n}. The factor 4 is composite; 1 is neither prime nor composite.`,`${n} = ${basicFactorText(n)}。每個底數都是質數，乘積為 ${n}。4 是合成數；1 既不是質數，也不是合成數。`);
  q.manualReason=true;q.reasonRubric=bcText('Review that all bases are prime and multiplication reconstructs the original number. Accept prime factors in a different order.','檢查所有底數均為質數，且乘積等於原數；接受不同排列次序的質因數。');q.diagram={type:'basic-model',kind:'split',n,left:2,right:n/2};
 }else if(id==='BC04'||id==='BC05'){
  const pool=[1,2,3,4,5,6,8,9,10,12,15,18,20,24,27,30,36,40,45,60,72,90,120],numbers=Array.from({length:pick([2,3])},()=>pick(pool)),isGcd=id==='BC04';
  const result=isGcd?numbers.reduce(basicGcd):numbers.reduce((a,b)=>a/basicGcd(a,b)*b);q.model={kind:isGcd?'gcd':'lcm',numbers};q.answer=String(result);q.math=numbers.join(', ');
  q.prompt=bcText(`Find the ${isGcd?'greatest common divisor (GCD, also HCF)':'least common multiple (LCM)'} of all ${numbers.length} numbers. Use prime factorisation and explain your choice of factors.`,`求這 ${numbers.length} 個數的${isGcd?'最大公因數（GCD，亦稱 HCF）':'最小公倍數（LCM）'}。用質因數分解，並解釋因子的選擇。`);
  q.hint=isGcd?bcText('A common divisor must divide every input: use the smallest exponent of each prime across all inputs, including zero when absent.','公因數須能整除每個數：每個質因數取所有輸入中的最小指數，缺少時指數為 0。'):bcText('A common multiple must contain each input: use the largest exponent needed for each prime across all inputs.','公倍數須包含每個輸入的全部質因數：每個質因數取所有輸入中所需的最大指數。');
  const factors=numbers.map(n=>`${n} = ${basicFactorText(n)}`).join('; ');
  q.solution=bcText(`${factors}. ${isGcd?'Use only factors shared by every input, at their smallest exponents':'Use every required prime, at its largest exponent'}. ${isGcd?'GCD':'LCM'} = ${result}${result>1?' = '+basicFactorText(result):''}.`,`${factors}。${isGcd?'只用每個數共有的質因數，各取最小指數':'用所有需要的質因數，各取最大指數'}。${isGcd?'最大公因數':'最小公倍數'} = ${result}${result>1?' = '+basicFactorText(result):''}。`);
  q.manualReason=true;q.reasonRubric=bcText('Review the factorisation and the exponent choice across every input, including a third input when present. The automatic final-value check does not verify the method.','評閱質因數分解及所有輸入的指數選擇；有第三個數時也須計入。自動核對最終數值不會核實方法。');q.diagram={type:'basic-model',kind:'inputs',numbers,operation:isGcd?'GCD':'LCM'};
 }else if(id==='BC06'){
  const mode=pick(['nested-add','nested-product','nested-division']);let m,value,steps;
  if(mode==='nested-add'){
   const a=int(4,20),b=int(6,15),c=int(2,b-1),d=int(1,c-1);m={kind:'nested',mode,a,b,c,d};value=a+b-c+d;q.math=`${a} + [${b} - (${c} - ${d})]`;steps=`${c} - ${d} = ${c-d}; ${b} - ${c-d} = ${b-c+d}; ${a} + ${b-c+d} = ${value}`;
  }else if(mode==='nested-product'){
   const b=int(2,8),c=int(1,5),d=int(1,5),a=b+c+d+int(1,8),e=int(2,5);m={kind:'nested',mode,a,b,c,d,e};value=(a-b-c-d)*e;q.math=`[(${a} - ${b}) - (${c} + ${d})] × ${e}`;steps=`${a} - ${b} = ${a-b}; ${c} + ${d} = ${c+d}; ${a-b} - ${c+d} = ${a-b-c-d}; ${a-b-c-d} × ${e} = ${value}`;
  }else{
   const d=int(2,8),e=int(1,d),c=d+int(1,6),den=c-d+e,valueTarget=int(2,9),sum=den*valueTarget,a=int(1,sum-1),b=sum-a;m={kind:'nested',mode,a,b,c,d,e};value=valueTarget;q.math=`(${a} + ${b}) ÷ [${c} - (${d} - ${e})]`;steps=`${d} - ${e} = ${d-e}; ${c} - ${d-e} = ${den}; ${a} + ${b} = ${sum}; ${sum} ÷ ${den} = ${value}`;
  }
  q.model=m;q.answer=String(value);q.prompt=bcText('Calculate the final value. Follow the nested grouping and show the key steps on paper.','計算最終數值，依多重括號的組合次序運算，並在紙上列出關鍵步驟。');q.hint=bcText('Work from the innermost brackets outwards. Multiplication/division share precedence and run left to right, as do addition/subtraction.','由最內層括號開始向外處理；乘除同級由左至右，加減同級也由左至右。');q.solution=bcText(steps+'.',steps+'。');
 }else if(id==='BC07'){
  const da=pick([3,4,5,6,8,12,15]),db=pick([3,4,5,6,8,12,15]),dd=pick([3,4,5,6,8,12,15]),a=new Q(int(1,da-1),da),b=new Q(int(1,db-1),db),c=int(2,5),d=new Q(int(1,dd-1),dd),operation=pick(['multiply','divide']);
  const left=a.add(b),right=new Q(c).add(d.neg()),value=operation==='multiply'?left.mul(right):left.div(right);q.model={kind:'fractions',a:String(a),b:String(b),c,d:String(d),operation};q.answer=String(value);q.math=`(${a} + ${b}) ${operation==='multiply'?'×':'÷'} (${c} - ${d})`;
  q.prompt=bcText('Calculate exactly. Enter a final number or fraction; equivalent final fractions are accepted.','準確計算，輸入最終數值或分數；接受等值的最終分數。');q.hint=bcText('Use common denominators for addition/subtraction. For division, multiply by the reciprocal of the entire divisor.','加減先通分；除法須乘以整個除數的倒數。');q.solution=bcText(`The brackets give ${left} and ${right}. Then ${left} ${operation==='multiply'?'×':'÷'} (${right}) = ${value}.`,`兩組括號分別得 ${left} 和 ${right}，再算 ${left} ${operation==='multiply'?'×':'÷'} (${right}) = ${value}。`);
 }else{
  const mode=pick(['decimal','mixed']);let m,value,steps;
  if(mode==='decimal'){
   const a=int(1,90),b=int(1,99),c=int(1,12),d=int(2,6),left=new Q(a,10).add(new Q(b,100));value=left.mul(new Q(c,10)).div(new Q(d));m={kind:'decimals',mode,a,b,c,d};q.math=`(${basicDecimal(a,1)} + ${basicDecimal(b,2)}) × ${basicDecimal(c,1)} ÷ ${d}`;steps=bcText(`The bracket is ${left}. Multiply by ${c}/10 and divide by ${d}: ${value}.`,`括號內為 ${left}，再乘以 ${c}/10，並除以 ${d}，得 ${value}。`);
  }else{
   const a=int(20,60),b=int(1,7),c=int(1,12),d=int(1,10);value=new Q(a,10).add(new Q(b,4).mul(new Q(c,10))).add(new Q(-d,10));m={kind:'decimals',mode,a,b,c,d};q.math=`${basicDecimal(a,1)} + ${b}/4 × ${basicDecimal(c,1)} - ${basicDecimal(d,1)}`;steps=bcText(`Multiply ${b}/4 by ${c}/10 first. Then calculate ${a}/10 + ${new Q(b,4).mul(new Q(c,10))} - ${d}/10 = ${value}.`,`先算 ${b}/4 × ${c}/10，再算 ${a}/10 + ${new Q(b,4).mul(new Q(c,10))} - ${d}/10 = ${value}。`);
  }
  q.model=m;q.answer=String(value);q.prompt=bcText('Calculate exactly with the stated decimal/fraction values. Enter a final number or fraction, without rounding.','按所給小數／分數準確計算，輸入最終數值或分數，不作四捨五入。');q.hint=bcText('A terminating decimal is an exact fraction with denominator 10, 100, and so on. Convert forms when useful and preserve operation order.','有限小數可準確寫成以 10、100 等為分母的分數；可按需要轉換形式，並保留運算次序。');q.solution=steps;
 }
 q.contract=q.options?{type:'choice',answer:q.answer}:{type:'number',answer:q.answer,form:'number-literal'};
 q.exposureKey=basicExposureKey(id,q.model);return q;
}

export function basicFeedback(q,input){
 if(!q.id?.startsWith('BC')||q.options)return null;let supplied;try{supplied=scalar(input);}catch{return null;}
 const m=q.model;
 if(q.id==='BC02'&&m.mode==='value'&&supplied.eq(new Q(m.base*m.exponent))&&!supplied.eq(scalar(q.answer)))return bcText('You multiplied the base by the exponent. The exponent counts repeated factors of the base.','你把底數乘以指數了；指數表示底數重複相乘的因子個數。');
 if(['BC04','BC05'].includes(q.id)){
  const opposite=m.numbers.reduce(q.id==='BC04'?((a,b)=>a/basicGcd(a,b)*b):basicGcd);
  if(supplied.eq(new Q(opposite))&&!supplied.eq(scalar(q.answer)))return bcText(`That is the ${q.id==='BC04'?'LCM':'GCD'}. Recheck whether the question asks for a divisor of every input or a multiple containing every input.`,`這是${q.id==='BC04'?'最小公倍數':'最大公因數'}；再看題目要求的是能整除所有輸入的因數，還是包含所有輸入的倍數。`);
 }
 return null;
}
