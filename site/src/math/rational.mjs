import {scalar} from './exact.mjs';
const riText=(en,zh)=>({en,zh});
export const rationalFamilies=[
 ['RI01','Evaluate integer nth roots','求整數的 n 次方根','JS-4-1','number'],
 ['RI02','Interpret the square-root sign','理解平方根符號','JS-4-1','choice'],
 ['RI03','Recognise rational and irrational numbers','辨別有理數與無理數','JS-4-2','choice'],
 ['RI04','Locate a root on a number line','在數線上表示方根','JS-4-2','choice']
].map(([id,en,zh,objective,contract])=>({id,title:riText(en,zh),objective,contract,topic:'js-4',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020, Unit 4 foundation; independent review pending'}));
function rationalRandom(seed){let s=2166136261;for(const c of seed)s=Math.imul(s^c.charCodeAt(0),16777619);return()=>{s+=0x6d2b79f5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function rationalExposureKey(id,m){
 // Renaming a classification example or principal-root magnitude is not a new concept.
 const semantic=id==='RI02'?{kind:m.kind,case:m.base===0?'zero':m.base===1?'unit':'positive'}:id==='RI03'?{kind:m.kind}:m;
 return id+':'+JSON.stringify(semantic);
}
export function generateRational(id,seed,version=1){
 if(version!==1)throw Error('This rational-number question version is unavailable.');
 if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const f=rationalFamilies.find(f=>f.id===id);if(!f)throw Error('Unknown rational-number family.');
 const rnd=rationalRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)],shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const q={id,seed,version,objective:f.objective,marks:3,lines:5,resourceState:'author-draft',manualReason:true};
 if(id==='RI01'){
  const n=int(2,5),base=int(0,8)*(n%2?pick([-1,1]):1),radicand=base**n;
  q.model={kind:'integer-root',n,base,radicand};q.math=`root(${n},${radicand})`;q.answer=String(base);
  q.prompt=riText('Find the exact value of this real nth root. Give one number and explain by checking the corresponding power. An even root means the nonnegative root.','求這個實數 n 次方根的準確值，填寫一個數，並用相應的乘方核對答案。偶數次方根取非負的值。');
  q.hint=riText('Which number, multiplied by itself the stated number of times, gives the radicand? Odd powers can be negative; the principal even root is nonnegative.','哪一個數自乘指定的次數後，會得到被開方數？奇數次乘方可以是負數；偶數次方根則取非負值。');
  q.solution=riText(`The value is ${base}, because (${base})^${n} = ${radicand}. ${n%2?'An odd real root has the same sign as its radicand.':'The radical denotes the nonnegative even root, not a pair of solutions.'}`,`答案是 ${base}，因為 (${base})^${n} = ${radicand}。${n%2?'奇數次實方根與被開方數的正負號相同。':'這個根號取非負的偶數次方根，答案不是一對數。'}`);
  q.contract={type:'number',answer:q.answer,form:'number-literal'};
  if(n===2&&radicand>0)q.diagram={type:'rational-model',kind:'square',area:radicand};
 }else if(id==='RI02'){
  const kind=pick(['principal','negative-root','square']),base=int(0,8);q.model={kind,base};
  q.math=kind==='square'?`(-${base})^2`:`${kind==='negative-root'?'-':''}root(2,${base*base})`;
  const result=kind==='square'?base*base:kind==='negative-root'?-base:base;q.answer='value:'+String(result);
  const values=[...new Set([String(result),String(-result),String(base+1),String(-base-1),String(base*base+1),String(base+2),String(-base-2)])].slice(0,4);
  q.options=shuffle(values.map(value=>({id:'value:'+value,label:riText(value,value)})));
  q.prompt=riText('Choose the value of the displayed expression. Explain the effect of the root sign, any minus sign and any brackets.','選出算式的值，並說明根號、負號及括號各自的作用。');
  q.hint=riText('Read the operation first: taking a square root, negating that root, and squaring a negative number are different operations.','先看清楚運算：求平方根、取平方根的相反數，以及把負數平方，是不同的運算。');
  q.solution=kind==='square'?riText(`(-${base})^2 = ${result}. The brackets make the whole nonpositive number the base of the square.`,`(-${base})^2 = ${result}。括號表示整個非正數都是平方的底數。`):riText(`The principal square root of ${base*base} is ${base}. ${kind==='negative-root'?`The outside minus sign then gives ${result}.`:'The radical itself does not mean plus or minus.'}`,`${base*base} 的非負平方根是 ${base}。${kind==='negative-root'?`根號外的負號把答案變成 ${result}。`:'根號本身並不表示「正負兩個答案」。'}`);
  q.contract={type:'choice',answer:q.answer};
 }else if(id==='RI03'){
  const kind=pick(['integer','fraction','terminating','recurring','perfect-root','nonsquare-root','pi','pi-decimal']),n=int(0,9),d=int(2,9),negative=pick([false,true]);
  q.model={kind,n,d,negative};
  const nonsquare=pick([2,3,5,6,7,8,10,11,12,13,14,15]);q.model.radicand=nonsquare;
  q.math=kind==='integer'?String(-n):kind==='fraction'?`${negative?'-':''}${n}/${d}`:kind==='terminating'?`${negative?'-':''}0.${n}${d}`:kind==='recurring'?`rec(0,${n}${d})`:kind==='perfect-root'?`root(2,${n*n})`:kind==='nonsquare-root'?`${negative?'-':''}root(2,${nonsquare})`:kind==='pi'?'π':'3.14';
  const irrational=['nonsquare-root','pi'].includes(kind);q.answer=irrational?'irrational':'rational';
  q.options=shuffle([{id:'rational',label:riText('Rational','有理數')},{id:'irrational',label:riText('Irrational','無理數')}]);
  const qualifier=kind==='recurring'?riText(`The block ${n}${d} repeats forever, exactly. `,`數字組 ${n}${d} 無限循環，這是準確的表示。`):kind==='pi-decimal'?riText('Treat 3.14 as the exact finite decimal written here, not as pi. ','把這裏的 3.14 視為準確的有限小數，而不是圓周率。'):riText('This expression denotes its exact value. ','這個算式表示其準確值。');
  q.prompt=riText(qualifier.en+'Is this number rational or irrational? Choose and give a mathematical reason.',qualifier.zh+'這個數是有理數還是無理數？請選擇並說明數學理由。');
  q.hint=riText('A rational number can be written as p/q with integers p, q and q ≠ 0. A root sign does not automatically mean irrational.','有理數可寫成 p/q，其中 p、q 是整數，而且 q ≠ 0。有根號不一定就是無理數。');
  const reason=kind==='recurring'?riText(`It equals ${n*10+d}/99, so it is rational. An explicitly recurring decimal is not the same as an unexplained decimal prefix.`,`它等於 ${n*10+d}/99，所以是有理數。清楚指明循環的小數，與只寫出幾個小數位的數不同。`):kind==='pi'?riText('Pi is a standard example of an irrational number. Its finite decimal approximations are rational; they are not pi itself.','圓周率是常見的無理數。圓周率的有限小數近似值是有理數，與圓周率本身不同。'):kind==='nonsquare-root'?riText(`${nonsquare} is a positive integer that is not a perfect square. Its square root, and the negative of that root, are irrational. A formal irrationality proof is not required here.`,`${nonsquare} 是正整數，但不是完全平方數，所以它的平方根及該平方根的相反數都是無理數。這裏不要求寫出無理性的正式證明。`):kind==='perfect-root'?riText(`The root equals the integer ${n}, which is ${n}/1. It is rational.`,`這個平方根等於整數 ${n}，亦即 ${n}/1，所以是有理數。`):riText('An integer, a fraction of integers with nonzero denominator, or an exact terminating decimal can be written as a fraction of integers. It is rational.','整數、分母非零的整數分數，以及準確的有限小數，都可寫成整數之比，所以是有理數。');
  q.solution=reason;q.contract={type:'choice',answer:q.answer};
 }else{
  const radicand=pick(Array.from({length:89},(_,i)=>i+2).filter(n=>!Array.from({length:10},(_,i)=>i*i).includes(n))),negative=pick([false,true]);
  let k=0;while((k+1)*(k+1)<radicand)k++;
  const lower=negative?-k-1:k;q.model={kind:'interval',radicand,negative,k,lower};q.math=`${negative?'-':''}root(2,${radicand})`;q.answer='interval:'+lower;
  const lows=[lower-1,lower,lower+1,lower+2];q.options=shuffle(lows.map(lo=>({id:'interval:'+lo,label:riText(`Between ${lo} and ${lo+1} (endpoints excluded)`,`介乎 ${lo} 與 ${lo+1} 之間（不包括端點）`)})));
  q.prompt=riText('Between which consecutive integers does this exact number lie? Choose an interval and justify the bounds by comparing squares. Sketch its approximate position in your working.','這個數的準確值介乎哪兩個相鄰整數之間？請選出區間，用平方比較說明上下界，並在解題空間畫出它的大約位置。');
  q.hint=riText('First bound the positive square root using neighbouring integer squares. For its negative, reflect the interval across zero and reverse the order.','先用相鄰整數的平方，找出非負平方根的上下界。如果原數帶負號，便把區間關於零反射，並注意大小次序。');
  q.solution=riText(`${k}² = ${k*k} < ${radicand} < ${(k+1)*(k+1)} = ${k+1}². The positive square root is between ${k} and ${k+1}. ${negative?`Negating reverses the bounds, giving ${lower} < the number < ${lower+1}.`:`Therefore ${lower} < the number < ${lower+1}.`} A sketch only needs a sensible approximate location; the bounds are exact.`,`${k}² = ${k*k} < ${radicand} < ${(k+1)*(k+1)} = ${k+1}²，所以非負平方根介乎 ${k} 與 ${k+1} 之間。${negative?`取相反數後，大小次序倒轉，故原數介乎 ${lower} 與 ${lower+1} 之間。`:`故原數介乎 ${lower} 與 ${lower+1} 之間。`}圖上只需標示合理的大約位置，但上下界是準確的。`);
  q.contract={type:'choice',answer:q.answer};q.diagram={type:'rational-model',kind:'line',min:lower-1,max:lower+3};
 }
 q.reasonRubric=riText('Review the power check, exact-number definition or bounds as appropriate. The automatic result does not verify the written explanation or the sketch.','按題意檢視乘方核對、有理數定義或上下界的理由。自動核對結果不代表文字解釋或數線草圖已獲核實。');
 q.exposureKey=rationalExposureKey(id,q.model);return q;
}
export function rationalFeedback(q,input){
 if(q.id!=='RI01')return null;let value;try{value=scalar(input);}catch{return null;}
 if(q.model.n%2===0&&q.model.base>0&&value.toString()===String(-q.model.base))return riText('That negative number has the same even power. The radical here denotes the nonnegative root.','這個負數的偶數次乘方雖然相同，但題目的根號取非負方根。');
 return null;
}
