// Disposable development fixtures. These are not published curriculum fixtureFamilies.
export const FIXTURE_VERSION=2;
export const fixtureFamilies=[
 {id:'signed',title:{en:'Signed numbers',zh:'有向數'},objective:'JS-2-2',topic:'js-2',contract:'number'},
 {id:'expression',title:{en:'Expand an expression',zh:'展開代數式'},objective:'JS-11-2',topic:'js-11',contract:'expression'},
 {id:'equation',title:{en:'Solve a linear equation',zh:'解一元一次方程'},objective:'JS-8-1',topic:'js-8',contract:'number'},
 {id:'angle',title:{en:'Angles on a line',zh:'直線上的角'},objective:'JS-19-1',topic:'js-19',contract:'number'},
 {id:'choice',title:{en:'Compare signed values',zh:'比較有向數'},objective:'JS-2-1',topic:'js-2',contract:'choice'},
 {id:'fraction',title:{en:'Exact fractions',zh:'分數的準確值'},objective:'JS-1-6',topic:'js-1',contract:'number'}
];
function hash(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function random(seed){let a=hash(seed);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function generateFixture(id,seed,version=FIXTURE_VERSION){
 if(![1,FIXTURE_VERSION].includes(version))throw new Error('This question version is unavailable. Keep the original prototype to reopen it.');
 if(typeof seed!=='string'||seed.length>80)throw new Error('Invalid seed.');
 const family=fixtureFamilies.find(f=>f.id===id);if(!family)throw new Error('Unknown question family.');
 const r=random(id+':'+seed),int=(a,b)=>Math.floor(r()*(b-a+1))+a;
 const q={id,seed,version,objective:family.objective,marks:2,lines:3};
 const B=(en,zh)=>({en,zh});
 if(id==='signed'){
  const a=int(-12,8),b=int(-9,9);Object.assign(q,{math:`${a} + (${b})`,answer:String(a+b),contract:{type:'number',answer:String(a+b)},
   prompt:B('Calculate.','計算。'),hint:B('Start at the first number; adding a negative number moves left.','從第一個數開始；加負數即向左移。'),solution:B(`${a} + (${b}) = ${a+b}.`,`${a} + (${b}) = ${a+b}。`),diagram:{type:'line',a,b}});
 }else if(id==='expression'){
  const a=int(2,7),b=int(1,7),c=int(1,5);const ans=`${a}x+${a*b+c}`;
  Object.assign(q,{math:`${a}(x + ${b}) + ${c}`,answer:ans,contract:{type:'expression',answer:ans,form:'expanded'},prompt:B('Expand the brackets and simplify.','展開括號並化簡。'),hint:B('Multiply every term inside the bracket by the number outside.','以括號外的數乘括號內的每一項。'),solution:B(`${a}(x + ${b}) + ${c} = ${a}x + ${a*b} + ${c} = ${ans}.`,`${a}(x + ${b}) + ${c} = ${a}x + ${a*b} + ${c} = ${ans}。`)});
 }else if(id==='equation'){
  const a=int(2,8),x=int(-6,9),b=int(-9,9),c=a*x+b;
  Object.assign(q,{math:`${a}x ${b<0?'−':'+'} ${Math.abs(b)} = ${c}`,answer:String(x),contract:{type:'number',answer:String(x)},prompt:B('Find x.','求 x。'),hint:B('Undo the constant term on both sides, then divide by the coefficient.','在等號兩邊消去常數項，再除以 x 的係數。'),solution:B(`${a}x = ${c-b}; x = ${x}. Check: ${a} × (${x}) + (${b}) = ${c}.`,`${a}x = ${c-b}；x = ${x}。驗算：${a} × (${x}) + (${b}) = ${c}。`),diagram:{type:'balance',a,b,c}});
 }else if(id==='angle'){
  const a=int(3,15)*10,x=180-a;
  Object.assign(q,{math:`${a}° + x = 180°`,answer:String(x),contract:{type:'number',answer:String(x),unit:'degree'},prompt:B('Find x. Then explain the angle relationship.','求 x，並解釋所用的角的關係。'),hint:B('Adjacent angles on a straight line add to 180°.','直線上的鄰角之和為 180°。'),solution:B(`x = 180° − ${a}° = ${x}°. Adjacent angles on a straight line sum to 180°.`, `x = 180° − ${a}° = ${x}°。直線上的鄰角之和為 180°。`),diagram:{type:'angle',a},manualReason:true});
 }else if(id==='choice'){
  const a=-int(2,18),b=a+int(1,5),options=[{id:'a',label:String(a)},{id:'b',label:String(b)}];if(r()>.5)options.reverse();
  Object.assign(q,{math:`${a}, ${b}`,answer:'b',contract:{type:'choice',answer:'b'},options,prompt:B('Choose the greater number.','選出較大的數。'),hint:B('On a number line, the greater number is further to the right.','在數線上，較大的數在較右的位置。'),solution:B(`${b} > ${a}.`,`${b} > ${a}。`)});
 }else if(id==='fraction'){
  const a=int(1,7),b=int(2,9),c=int(1,5);const answer=`${a+b*c}/${b}`;
  Object.assign(q,{math:`${a}/${b} + ${c}`,answer,contract:{type:'number',answer},prompt:B('Give an exact answer as a number or fraction.','以數或分數寫出準確答案。'),hint:B('Write the integer with the same denominator as the fraction.','把整數改寫為同分母的分數。'),solution:B(`${a}/${b} + ${c} = (${a} + ${b*c})/${b} = ${answer}.`,`${a}/${b} + ${c} = (${a} + ${b*c})/${b} = ${answer}。`)});
 }
 if(version>=2&&q.contract.type==='number')q.contract.form='number-literal';
 return q;
}
export function makeFixtureItems(ids,seed,count=6){
 if(!Array.isArray(ids)||!ids.length||count<1||count>12||!Number.isInteger(count))throw new Error('Choose 1–12 questions and at least one set.');
 return Array.from({length:count},(_,i)=>generateFixture(ids[i%ids.length],`${seed}:${i}`));
}

export {fixtureFamilies as families,generateFixture as generate,makeFixtureItems as makeItems};
