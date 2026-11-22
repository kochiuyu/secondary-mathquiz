import {Q,scalar} from './exact.mjs';
const rpText=(en,zh)=>({en,zh});
export const ratioFamilies=[
 ['RP01','Compare quantities in common units','統一單位後比較','JS-6-1','choice'],
 ['RP02','Share in a two- or three-term ratio','按兩項比或三項比分配','JS-6-2','number'],
 ['RP03','Calculate and convert unit rates','計算及換算率','JS-6-1','number'],
 ['RP04','Find an average speed','求平均速率','JS-6-2','number'],
 ['RP05','Use a stated direct proportion','運用已知的正比例','JS-6-2','number'],
 ['RP06','Use a stated inverse proportion','運用已知的反比例','JS-6-2','number'],
 ['RP07','Distinguish proportional relationships','分辨比例關係','JS-6-1','choice'],
 ['RP08','Read a scale plan','理解比例尺平面圖','JS-6-2','number']
].map(([id,en,zh,objective,contract])=>({id,title:rpText(en,zh),objective,contract,topic:'js-6',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020, Unit 6; independent review pending'}));
function ratioRandom(seed){let s=2166136261;for(const c of seed)s=Math.imul(s^c.charCodeAt(0),16777619);return()=>{s+=0x6d2b79f5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function ratioGcd(a,b){while(b)[a,b]=[b,a%b];return a;}
export function ratioExposureKey(id,m){
 const semantic=id==='RP01'?{kind:m.kind,a:m.gramsA/ratioGcd(m.gramsA,m.gramsB),b:m.gramsB/ratioGcd(m.gramsA,m.gramsB)}:id==='RP07'?{kind:m.kind,rule:m.rule}:m;
 return id+':'+JSON.stringify(semantic);
}
export function ratioRuleValue(rule,k,c,x){return rule==='direct'?new Q(k*x):rule==='inverse'?new Q(k,x):rule==='offset'?new Q(k*x+c):rule==='square'?new Q(x*x):new Q(c-x);}
export function generateRatio(id,seed,version=1){
 if(version!==1)throw Error('This rates-and-ratios question version is unavailable.');if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const family=ratioFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown rates-and-ratios family.');
 const rnd=ratioRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)],shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const q={id,seed,version,objective:family.objective,marks:3,lines:6,resourceState:'author-draft',manualReason:true};let value;
 if(id==='RP01'){
  const a=int(1,9),b=pick([1,2,3,4,5,6,7,8,9].filter(x=>x!==a)),factor=pick([25,50,100,125,200]),gramsA=a*factor,gramsB=b*factor,g=ratioGcd(gramsA,gramsB),u=gramsA/g,v=gramsB/g;
  q.model={kind:'common-unit-ratio',gramsA,gramsB};q.answer='simplest';q.math=`A: ${new Q(gramsA,1000)} kg; B: ${gramsB} g`;
  q.prompt=rpText('Choose the simplest whole-number mass ratio A:B. Keep the order A then B, and explain the unit conversion.','選出最簡整數質量比 A:B。依照先 A 後 B 的次序，並說明單位換算。');
  q.options=shuffle([{id:'simplest',label:`${u}:${v}`},{id:'reversed',label:`${v}:${u}`},{id:'unreduced',label:`${u*2}:${v*2}`},{id:'wrong-unit',label:`${u}:${v*1000}`}]);
  q.hint=rpText('Convert both masses to grams, then divide both terms by their greatest common divisor. Equivalent ratios need not be in simplest form.','先把兩個質量都換成克，再把兩項同除以最大公因數。等值的比未必已是最簡比。');
  q.solution=rpText(`A = ${gramsA} g, B = ${gramsB} g. Divide both by ${g}: A:B = ${u}:${v}. ${u*2}:${v*2} is equivalent but not simplest. Reversing the order changes the comparison.`,`A = ${gramsA} 克，B = ${gramsB} 克。兩項同除以 ${g}，得 A:B = ${u}:${v}。${u*2}:${v*2} 等值但未約至最簡；次序顛倒會改變比較對象。`);
 }else if(id==='RP02'){
  const parts=Array.from({length:pick([2,3])},()=>int(1,7)),total=int(3,30)*10,target=int(0,parts.length-1),sum=parts.reduce((a,b)=>a+b,0);
  q.model={kind:'sharing',parts,total,target};value=new Q(total*parts[target],sum);q.math=`${parts.map((_,i)=>'ABC'[i]).join(':')} = ${parts.join(':')}`;
  q.prompt=rpText(`A total of ${total} litres is shared completely between ${parts.length} containers in the stated volume ratio. Find container ${'ABC'[target]}'s volume in litres.`,`把 ${total} 公升全部按所示體積比分給 ${parts.length} 個容器。求容器 ${'ABC'[target]} 的體積（公升）。`);
  q.hint=rpText('The whole is the sum of all ratio parts, not just the parts other than the requested one. Fractional litres are allowed.','總份數是所有比項之和，並非只加其他部分。體積可以是分數公升。');
  q.solution=rpText(`Total parts = ${sum}. One part = ${total}/${sum} litres. Container ${'ABC'[target]} receives ${parts[target]} parts: ${value} litres. Adding all shares reconstructs ${total}.`,`總份數 = ${sum}，每份 = ${total}/${sum} 公升。容器 ${'ABC'[target]} 佔 ${parts[target]} 份，得 ${value} 公升；各份額相加須回到 ${total}。`);
  q.diagram={type:'ratio-model',kind:'parts',parts,target};
 }else if(id==='RP03'){
  const mode=pick(['price','kmh-to-ms','ms-to-kmh']);
  if(mode==='price'){
   const grams=pick([200,250,400,500,750]),price=int(10,90);q.model={kind:'unit-rate',mode,grams,price};value=new Q(price*1000,grams);q.math=`HK$${price} / ${grams} g`;
   q.prompt=rpText(`A ${grams} g pack costs HK$${price}. Find the unit price in HK$ per kg.`,`一包 ${grams} 克的貨品售 HK$${price}。求每公斤的單價（港元／公斤）。`);
   q.solution=rpText(`Mass = ${new Q(grams,1000)} kg. Unit price = ${price} ÷ (${new Q(grams,1000)}) = ${value} HK$/kg.`,`質量 = ${new Q(grams,1000)} 公斤；每公斤單價 = ${price} ÷ (${new Q(grams,1000)}) = ${value} 港元／公斤。`);
  }else{
   const speed=int(1,30)*(mode==='kmh-to-ms'?3:1);q.model={kind:'unit-rate',mode,speed};value=mode==='kmh-to-ms'?new Q(speed*1000,3600):new Q(speed*3600,1000);q.math=`${speed} ${mode==='kmh-to-ms'?'km/h':'m/s'}`;
   q.prompt=rpText(`Convert the given speed to ${mode==='kmh-to-ms'?'m/s':'km/h'}.`,`把所示速率換成${mode==='kmh-to-ms'?'米／秒（m/s）':'公里／小時（km/h）'}。`);
   q.solution=rpText(`1 km = 1000 m; 1 h = 3600 s. ${mode==='kmh-to-ms'?`${speed} × 1000/3600`:`${speed} × 3600/1000`} = ${value} ${mode==='kmh-to-ms'?'m/s':'km/h'}.`,`1 公里 = 1000 米，1 小時 = 3600 秒。${mode==='kmh-to-ms'?`${speed} × 1000/3600`:`${speed} × 3600/1000`} = ${value} ${mode==='kmh-to-ms'?'米／秒':'公里／小時'}。`);
  }
  q.hint=rpText('A rate is an amount per one unit of another quantity. Convert both numerator and denominator units before comparing or calculating.','率表示一個量相對另一個量每一單位的數量；分子及分母的單位都要換對。');
 }else if(id==='RP04'){
  const v1=int(2,8)*10,v2=pick([20,30,40,50,60,70,80].filter(v=>v!==v1)),t1=pick([15,20,30,45,60]),t2=pick([15,20,30,45,60]);
  q.model={kind:'average-speed',v1,v2,t1,t2};value=new Q(v1*t1+v2*t2,t1+t2);q.math=`${v1} km/h, ${t1} min; ${v2} km/h, ${t2} min`;
  q.prompt=rpText('A vehicle travels at the first speed for the first time, then at the second speed for the second time, with no stop between. Find its average speed for the whole journey in km/h.','車輛先按第一個速率行駛第一段時間，再按第二個速率行駛第二段時間，中途不停站。求全程平均速率（公里／小時）。');
  q.hint=rpText('Average speed is total distance divided by total time. A simple average of speeds works here only when the two times are equal.','平均速率 = 總路程 ÷ 總時間；只有兩段時間相等時，才可直接把兩個速率取平均。');
  q.solution=rpText(`Distances = ${new Q(v1*t1,60)} km and ${new Q(v2*t2,60)} km. Total time = ${new Q(t1+t2,60)} h. Average speed = ${value} km/h.`,`兩段路程為 ${new Q(v1*t1,60)} 公里及 ${new Q(v2*t2,60)} 公里；總時間為 ${new Q(t1+t2,60)} 小時，平均速率 = ${value} 公里／小時。`);
 }else if(id==='RP05'){
  const mass1=pick([2,3,4,5,6]),cost1=int(3,20)*10,mass2=pick([1,2,3,4,5,6,7,8,9].filter(x=>x!==mass1));q.model={kind:'direct',mass1,cost1,mass2};value=new Q(cost1*mass2,mass1);q.math=`${mass1} kg → HK$${cost1}; ${mass2} kg → ?`;
  q.prompt=rpText('The total cost is directly proportional to the mass bought: there is no fixed charge or bulk discount. Given the first purchase, find the second cost in HK$.','總價與所買質量成正比例，沒有固定收費或大量購買折扣。由第一次購買的資料，求第二次的總價（港元）。');
  q.hint=rpText('Keep cost/mass unchanged. Find the price for one kg, then multiply by the new mass.','每公斤單價保持不變；先求一公斤的價錢，再乘以新質量。');
  q.solution=rpText(`The mass ratio is ${mass2}/${mass1}, so the cost ratio is the same. New cost = ${cost1} × ${mass2}/${mass1} = HK$${value}.`,`質量倍數為 ${mass2}/${mass1}，總價亦乘相同倍數。新總價 = ${cost1} × ${mass2}/${mass1} = HK$${value}。`);
  q.diagram={type:'ratio-model',kind:'table',left:'kg',right:'HK$',rows:[[mass1,cost1],[mass2,'?']]};
 }else if(id==='RP06'){
  const workers1=int(2,8),hours1=int(2,12),workers2=pick([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==workers1));q.model={kind:'inverse',workers1,hours1,workers2};value=new Q(workers1*hours1,workers2);q.math=`${workers1} workers → ${hours1} h; ${workers2} workers → ?`;
  q.prompt=rpText('For the same fixed job, completion time is inversely proportional to the number of workers. Assume identical constant productivity, no interference and no setup time. Find the new completion time in hours.','完成同一固定工作所需時間與工人人數成反比例。假設每人生產力相同且固定，互不干擾，沒有準備時間。求新的人數所需時間（小時）。');
  q.hint=rpText('If the worker count is multiplied by a factor, divide the time by that factor. The total worker-hours must stay unchanged.','人數乘某個倍數，時間便除以同一倍數；總人時須保持不變。');
  q.solution=rpText(`The worker ratio is ${workers2}/${workers1}, so the time ratio is ${workers1}/${workers2}. New time = ${hours1} × ${workers1}/${workers2} = ${value} h. Both cases use ${workers1*hours1} worker-hours.`,`人數倍數為 ${workers2}/${workers1}，時間倍數則為 ${workers1}/${workers2}。新時間 = ${hours1} × ${workers1}/${workers2} = ${value} 小時；兩種情況均需 ${workers1*hours1} 人時。`);
  q.diagram={type:'ratio-model',kind:'table',left:'workers',right:'h',rows:[[workers1,hours1],[workers2,'?']]};
 }else if(id==='RP07'){
  const rule=pick(['direct','inverse','offset','square','decrease']),k=int(2,6),c=int(8,15),xs=[1,2,4];q.model={kind:'classification',rule,k,c};q.answer=rule==='direct'?'direct':rule==='inverse'?'inverse':'neither';
  const description={direct:rpText(`For any positive input, each unit costs HK$${k}, with no fixed fee.`,`對任何正數購買量，每單位售 HK$${k}，不收固定費。`),inverse:rpText(`A fixed divisible job requires ${k} worker-hours. The input is the number of identical workers and the output is completion time in hours. All work at constant productivity without interference or setup time.`,`一項可分工的固定工作需 ${k} 人時。輸入為工人人數，輸出為完成時間（小時）。每人生產力相同且固定，互不干擾，沒有準備時間。`),offset:rpText(`A charge has a fixed HK$${c} fee plus HK$${k} for each unit.`,`總收費包含固定費 HK$${c}，另加每單位 HK$${k}。`),square:rpText('Each positive input is a square side length; the output is its area.','正數輸入是正方形邊長，輸出是面積。'),decrease:rpText(`A container starts with ${c} litres; after x litres are removed the output is the remaining amount, for 0 < x < ${c}.`,`容器原有 ${c} 公升，取走 x 公升後，輸出為剩餘量，範圍是 0 < x < ${c}。`)}[rule];
  q.math=xs.map(x=>`${x} → ${ratioRuleValue(rule,k,c,x)}`).join('; ');
  q.prompt=rpText(`${description.en} Classify the relationship between input and output throughout the stated model. The table illustrates the rule; it does not by itself define every unobserved value. Explain using ratios or a counterexample.`,`${description.zh} 判斷題設模型中輸入與輸出的關係。表中數據只用於展示規則，不能單靠幾組數據確定所有未列出的值。請用比或反例解釋。`);
  q.options=shuffle([{id:'direct',label:rpText('Direct proportion','正比例')},{id:'inverse',label:rpText('Inverse proportion','反比例')},{id:'neither',label:rpText('Neither','兩者皆非')}]);
  q.hint=rpText('Direct: doubling input doubles output. Inverse: doubling input halves output. Increasing together, or moving in opposite directions, is insufficient.','正比例：輸入加倍，輸出也加倍；反比例：輸入加倍，輸出減半。只看同增或一增一減並不足夠。');
  q.solution=rpText(`${q.answer==='direct'?'Each input ratio equals the corresponding output ratio.':q.answer==='inverse'?'Each input ratio is the reciprocal of the corresponding output ratio.':`For inputs 1 and 2, outputs are ${ratioRuleValue(rule,k,c,1)} and ${ratioRuleValue(rule,k,c,2)}. The output neither doubles nor halves, so both proportional claims fail.`} The stated rule is needed to justify a conclusion over the full domain.`,`${q.answer==='direct'?'輸入的比與相應輸出的比相同。':q.answer==='inverse'?'輸入的比與相應輸出的比互為倒數。':`輸入由 1 變成 2，輸出為 ${ratioRuleValue(rule,k,c,1)} 及 ${ratioRuleValue(rule,k,c,2)}，既非加倍，也非減半，因此兩種比例關係都不成立。`}要判斷整個範圍的關係，仍須根據題設規則。`);
  q.diagram={type:'ratio-model',kind:'table',left:'input',right:'output',rows:xs.map(x=>[x,String(ratioRuleValue(rule,k,c,x))])};
 }else{
  const scale=pick([50,100,200,500,1000,25000]),planTenths=int(10,90),mode=pick(['actual','plan']),actual=new Q(planTenths*scale,1000),plan=new Q(planTenths,10);q.model={kind:'scale',scale,planTenths,mode};value=mode==='actual'?actual:plan;
  q.math=`1:${scale}`;
  q.prompt=mode==='actual'?rpText(`A plan has scale 1:${scale}, meaning 1 cm on the plan represents ${scale} cm in reality. The labelled plan length is ${plan} cm. Find the actual length in metres. Use the label; do not measure this schematic drawing.`,`平面圖比例尺為 1:${scale}，即圖上 1 厘米代表實際 ${scale} 厘米。標示的圖上長度是 ${plan} 厘米。求實際長度（米）。只用標示數值，不要量度示意圖。`):rpText(`A plan has scale 1:${scale}, meaning 1 cm on the plan represents ${scale} cm in reality. The actual length is ${actual} m. Find its length on the plan in cm. Do not measure this schematic drawing.`,`平面圖比例尺為 1:${scale}，即圖上 1 厘米代表實際 ${scale} 厘米。實際長度是 ${actual} 米。求圖上長度（厘米），不要量度示意圖。`);
  q.hint=rpText('The scale compares lengths in the same units. Convert metres to centimetres or centimetres to metres at the appropriate step.','比例尺比較的是同單位長度；在適當步驟把米換成厘米，或把厘米換成米。');
  q.solution=mode==='actual'?rpText(`${plan} cm on plan represents ${plan} × ${scale} = ${actual.mul(new Q(100))} cm. Divide by 100 to obtain ${actual} m.`,`圖上 ${plan} 厘米代表實際 ${plan} × ${scale} = ${actual.mul(new Q(100))} 厘米；除以 100 得 ${actual} 米。`):rpText(`${actual} m = ${actual.mul(new Q(100))} cm. Plan length = ${actual.mul(new Q(100))} ÷ ${scale} = ${plan} cm.`,`${actual} 米 = ${actual.mul(new Q(100))} 厘米；圖上長度 = ${actual.mul(new Q(100))} ÷ ${scale} = ${plan} 厘米。`);
  q.diagram={type:'ratio-model',kind:'plan',scale,label:mode==='actual'?`${plan} cm`:'? cm'};
 }
 if(q.options)q.contract={type:'choice',answer:q.answer};else {q.answer=String(value);q.contract={type:'number',answer:q.answer,form:'number-literal'};q.prompt=rpText(q.prompt.en+' Enter an exact final number or fraction without units. Do not round; explain your method and units.',q.prompt.zh+' 請輸入準確的最終數值或分數，不加單位、不取近似值；另說明方法及單位。');}
 q.reasonRubric=rpText('Review the order of quantities, common units, total parts and stated proportional assumptions as applicable. A correct value or selected model does not verify the explanation.','按題意檢視量的次序、統一單位、總份數及已知比例假設。數值或選項正確，並不代表解釋已獲核實。');
 q.exposureKey=ratioExposureKey(id,q.model);return q;
}
export function ratioFeedback(q,input){
 if(!q.id?.startsWith('RP')||q.options)return null;let v;try{v=scalar(input);}catch{return null;}if(v.eq(scalar(q.answer)))return null;const m=q.model;
 if(q.id==='RP04'&&v.eq(new Q(m.v1+m.v2,2)))return rpText('The travel times differ. Divide total distance by total time instead of averaging the two speeds.','兩段時間不同，應把總路程除以總時間，不能直接平均兩個速率。');
 if(q.id==='RP06'&&v.eq(new Q(m.hours1*m.workers2,m.workers1)))return rpText('You scaled the time in the same direction as the worker count. For this fixed job, use the reciprocal ratio.','你把時間按人數的相同倍數縮放；同一固定工作應使用倒數比。');
 if(q.id==='RP05'&&v.eq(new Q(m.cost1*m.mass1,m.mass2)))return rpText('The cost follows the mass ratio in the same direction for this stated direct proportion.','題設為正比例，總價應按質量的相同倍數改變。');
 if(q.id==='RP08'&&m.mode==='actual'&&v.eq(new Q(m.planTenths*m.scale,10)))return rpText('That is the actual length in centimetres. The question requests metres.','這是以厘米表示的實際長度；題目要求以米作答。');
 return null;
}
