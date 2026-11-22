import {Q,scalar} from './exact.mjs';
const pcText=(en,zh)=>({en,zh});
export const percentageFamilies=[
 ['PC01','Find a signed percentage change','求有正負號的百分變化','JS-5-1'],
 ['PC02','Find the new value','求新值','JS-5-1'],
 ['PC03','Recover the original value','求原值','JS-5-1'],
 ['PC04','Discount and profit or loss','折扣與盈虧','JS-5-2'],
 ['PC05','Combine successive changes','連續增減','JS-5-2'],
 ['PC06','Compare simple and compound interest','單利息與複利息','JS-5-2'],
 ['PC07','Combine changes in components','成分增減','JS-5-2'],
 ['PC08','Apply a supplied tax schedule','運用題設稅階','JS-5-2']
].map(([id,en,zh,objective])=>({id,title:pcText(en,zh),objective,contract:'number',topic:'js-5',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020, Unit 5; independent review pending'}));
function percentageRandom(seed){let state=2166136261;for(const c of seed)state=Math.imul(state^c.charCodeAt(0),16777619);return()=>{state+=0x6d2b79f5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const pcMultiplier=r=>new Q(100+r,100);
export const percentageExposureKey=(id,model)=>id+':'+JSON.stringify(model);
export function generatePercentage(id,seed,version=1){
 if(version!==1)throw Error('This percentage question version is unavailable.');
 if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const f=percentageFamilies.find(f=>f.id===id);if(!f)throw Error('Unknown percentage family.');
 const rnd=percentageRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)];
 const q={id,seed,version,objective:f.objective,marks:3,lines:6,resourceState:'author-draft',manualReason:true};let value;
 const exact=pcText(' Enter an exact final number or fraction, without a unit or % sign. Do not round. Explain the reference quantity and method.',' 請輸入準確的最終數值或分數，不加單位或 %，不取近似值；說明基準量及方法。');
 if(['PC01','PC02','PC03'].includes(id)){
  const rate=pick(id==='PC03'?[-80,-50,-25,-20,-10,0,5,12,25,50,125]:[-100,-80,-50,-25,-20,-10,0,5,12,25,50,125]),original=int(1,40)*20,next=new Q(original).mul(pcMultiplier(rate));
  // Retain only the givens in the semantic model. An unknown value is not a given.
  q.model=id==='PC01'?{kind:'change',original,next:String(next)}:id==='PC02'?{kind:'new',original,rate}:{kind:'original',next:String(next),rate};
  if(id==='PC01'){
   value=new Q(rate);q.math=`${original} → ${next}`;
   q.prompt=pcText(`A quantity changes from ${original} to ${next}. Find its signed percentage change, using ${original} as the original reference quantity. A decrease needs a minus sign.`,`一個量由 ${original} 變成 ${next}。以原值 ${original} 為基準，求有正負號的百分變化；減少須用負號。`);
   q.solution=pcText(`Change = ${next} - ${original}. Divide by the original ${original}, then multiply by 100: ${rate}%. Reversing the direction changes the denominator.`,`改變量 = ${next} - ${original}。除以原值 ${original} 再乘 100，得 ${rate}%。反方向的基準量不同。`);
  }else if(id==='PC02'){
   value=next;q.math=`${original} × (1 + (${rate})/100)`;
   q.prompt=pcText(`The original value is ${original}. It changes by ${rate}%. Find the new value. Negative change means depreciation; positive change means growth.`,`原值為 ${original}，百分變化為 ${rate}%。求新值。負變化表示減少或折舊，正變化表示增長。`);
   q.solution=pcText(`The multiplier is (100 + ${rate})/100 = ${pcMultiplier(rate)}. New value = ${original} × ${pcMultiplier(rate)} = ${next}.`,`倍數為 (100 + ${rate})/100 = ${pcMultiplier(rate)}。新值 = ${original} × ${pcMultiplier(rate)} = ${next}。`);
  }else{
   value=new Q(original);q.math=`? × (1 + (${rate})/100) = ${next}`;
   q.prompt=pcText(`After a change of ${rate}%, the new value is ${next}. Find the original value.`,`百分變化為 ${rate}% 後，新值是 ${next}。求原值。`);
   q.solution=pcText(`The nonzero multiplier is ${pcMultiplier(rate)}. Original = ${next} ÷ (${pcMultiplier(rate)}) = ${original}. Multiplying back gives ${next}. A 100% decrease cannot uniquely determine an original value.`,`非零倍數為 ${pcMultiplier(rate)}。原值 = ${next} ÷ (${pcMultiplier(rate)}) = ${original}；乘回去得到 ${next}。減少 100% 後不能唯一確定原值。`);
  }
  q.hint=pcText('Percentage change uses (new - original)/original × 100. New = original × (1 + signed rate/100); reverse a nonzero multiplier by division.','百分變化為（新值 − 原值）÷ 原值 × 100。新值 = 原值 ×（1 + 有正負號的百分率/100）；求原值須除以非零倍數。');
  q.diagram={type:'percentage-model',kind:'base',label:pcText('The original quantity is the 100% reference.','原值就是 100% 的基準量。')};
 }else if(id==='PC04'){
  const cost=int(4,20)*50,markup=pick([10,20,25,40,50]),discount=pick([10,20,25,30]),mode=pick(['selling','profit-rate']),marked=new Q(cost).mul(pcMultiplier(markup)),selling=marked.mul(pcMultiplier(-discount));
  q.model={kind:'retail',cost,markup,discount,mode};value=mode==='selling'?selling:selling.add(new Q(-cost)).div(new Q(cost)).mul(new Q(100));q.math=`${cost} → ${marked} → ?`;
  q.prompt=pcText(`An item costs HK$${cost}. Its marked price is ${markup}% above cost. A ${discount}% discount is then taken off the marked price. ${mode==='selling'?'Find the selling price in HK$.':'Find the signed profit/loss percentage based on cost; a loss needs a minus sign.'}`,`貨品成本為 HK$${cost}，標價比成本高 ${markup}%，再按標價減價 ${discount}%。${mode==='selling'?'求售價（港元）。':'以成本為基準，求有正負號的盈利／虧損百分率；虧損須用負號。'}`);
  q.hint=pcText('Markup uses cost; discount uses marked price; profit/loss percentage uses cost again. These bases differ.','加價以成本為基準；折扣以標價為基準；盈虧百分率再以成本為基準。');
  q.solution=pcText(`Marked price = ${marked}. Selling price = ${marked} × ${pcMultiplier(-discount)} = ${selling}. ${mode==='profit-rate'?`(selling - cost)/cost × 100 = ${value}%.`:`The selling price is HK$${value}.`} The discount is not taken off cost.`,`標價 = ${marked}。售價 = ${marked} × ${pcMultiplier(-discount)} = ${selling}。${mode==='profit-rate'?`（售價 − 成本）÷ 成本 × 100 = ${value}%。`:`售價為 HK$${value}。`}折扣並非按成本計算。`);
 }else if(id==='PC05'){
  const original=int(2,20)*100,r1=pick([-50,-20,-10,10,20,50]),r2=pick([-50,-20,-10,10,20,50]),mode=pick(['new','overall']),next=new Q(original).mul(pcMultiplier(r1)).mul(pcMultiplier(r2));
  q.model={kind:'successive',original,r1,r2,mode};value=mode==='new'?next:next.div(new Q(original)).add(new Q(-1)).mul(new Q(100));q.math=`${original} → (${r1}%) → (${r2}%) → ?`;
  q.prompt=pcText(`A quantity starts at ${original}. It changes by ${r1}%, then by ${r2}% of the value after the first change. ${mode==='new'?'Find the final value.':'Find the overall signed percentage change relative to the initial value.'}`,`一個量起初為 ${original}，先改變 ${r1}%，再以第一次改變後的值為基準改變 ${r2}%。${mode==='new'?'求最終值。':'相對最初的值，求整體有正負號的百分變化。'}`);
  q.hint=pcText('Multiply the two multipliers. Adding signed rates misses the changed second base.','把兩個倍數相乘；直接相加百分率會忽略第二次的基準量已改變。');
  q.solution=pcText(`Final = ${original} × ${pcMultiplier(r1)} × ${pcMultiplier(r2)} = ${next}. ${mode==='overall'?`Overall change = (${next}/${original} - 1) × 100 = ${value}%.`:`The requested final value is ${value}.`}`,`最終值 = ${original} × ${pcMultiplier(r1)} × ${pcMultiplier(r2)} = ${next}。${mode==='overall'?`整體變化 = (${next}/${original} − 1) × 100 = ${value}%。`:`所求最終值為 ${value}。`}`);
  q.diagram={type:'percentage-model',kind:'timeline',r1,r2};
 }else if(id==='PC06'){
  const principal=int(1,12)*1000,rate=pick([2,4,5,10]),years=int(2,3),mode=pick(['simple','compound']),target=pick(['amount','interest']);let amount=new Q(principal);
  if(mode==='simple')amount=amount.mul(new Q(100+rate*years,100));else for(let y=0;y<years;y++)amount=amount.mul(pcMultiplier(rate));
  q.model={kind:'interest',principal,rate,years,mode,target};value=target==='amount'?amount:amount.add(new Q(-principal));q.math=`P = ${principal}; r = ${rate}%; t = ${years}`;
  q.prompt=pcText(`In a hypothetical account, HK$${principal} earns ${rate}% per year for ${years} years, with ${mode==='simple'?'simple interest on the original principal only':'compound interest added annually'}. No deposits, withdrawals or fees occur. Find the ${target==='amount'?'final amount (principal plus interest)':'interest earned only'} in HK$.`,`假設本金 HK$${principal}，年利率 ${rate}%，存期 ${years} 年，按${mode==='simple'?'原本金計單利息':'每年複利一次'}，沒有存款、提款或費用。求${target==='amount'?'本利和':'利息（不含本金）'}（港元）。`);
  q.hint=pcText('Simple interest keeps the same principal base each year; annual compound interest uses the previous balance. Distinguish interest from amount.','單利息每年以原本金為基準；年複利息以上一年的結餘為基準。分清利息與本利和。');
  q.solution=pcText(`${mode==='simple'?`Interest = ${principal} × ${rate}/100 × ${years}.`:`Multiply the balance by ${pcMultiplier(rate)} once per year, ${years} times.`} Amount = ${amount}; interest = ${amount.add(new Q(-principal))}. Requested value = ${value}.`,`${mode==='simple'?`利息 = ${principal} × ${rate}/100 × ${years}。`:`每年結餘乘 ${pcMultiplier(rate)}，共 ${years} 次。`}本利和 = ${amount}；利息 = ${amount.add(new Q(-principal))}。所求值為 ${value}。`);
 }else if(id==='PC07'){
  const a=int(1,12)*100,b=int(1,12)*100,ra=pick([-50,-20,0,10,25,50]),rb=pick([-20,0,10,25,50]),next=new Q(a).mul(pcMultiplier(ra)).add(new Q(b).mul(pcMultiplier(rb)));
  q.model={kind:'components',a,b,ra,rb};value=next.add(new Q(-a-b)).div(new Q(a+b)).mul(new Q(100));q.math=`A: ${a} (${ra}%); B: ${b} (${rb}%)`;
  q.prompt=pcText(`A total consists only of component A (${a} units) and B (${b} units). A changes by ${ra}% of its own original amount; B changes by ${rb}% of its own original amount. Find the signed percentage change of the total relative to ${a+b}.`,`總量只由 A（${a} 單位）及 B（${b} 單位）組成。A 按本身原值改變 ${ra}%，B 按本身原值改變 ${rb}%。以總原值 ${a+b} 為基準，求總量有正負號的百分變化。`);
  q.hint=pcText('Calculate each changed component, add, then compare with the original total. An unweighted average works only for equal original components.','先分別計新成分，再相加，最後與總原值比較；只有原成分相等時才能直接平均百分率。');
  q.solution=pcText(`New A = ${new Q(a).mul(pcMultiplier(ra))}; new B = ${new Q(b).mul(pcMultiplier(rb))}. New total = ${next}. Overall change = (${next} - ${a+b})/${a+b} × 100 = ${value}%.`,`新 A = ${new Q(a).mul(pcMultiplier(ra))}；新 B = ${new Q(b).mul(pcMultiplier(rb))}。新總量 = ${next}。總百分變化 = (${next} − ${a+b})/${a+b} × 100 = ${value}%。`);
 }else{
  const allowance=100000,band=50000,income=pick([80000,100000,125000,150000,175000,200000,250000]),r1=2,r2=6,net=Math.max(0,income-allowance),first=Math.min(net,band),rest=Math.max(0,net-band);
  q.model={kind:'tax',schedule:'fictional-classroom-2026-11-22',income,allowance,band,r1,r2};value=new Q(first*r1+rest*r2,100);q.math=`${income} − ${allowance}`;
  q.prompt=pcText(`Use this fictional classroom salaries-tax schedule, dated 22 November 2026 (not current Hong Kong law): annual income HK$${income}; allowance HK$${allowance}. Taxable income is max(0, income - allowance). Charge 2% on the first HK$50000 of taxable income and 6% on the remainder. There are no other rules or deductions. Find the tax in HK$.`,`只用以下虛構課堂薪俸稅表（日期：2026 年 11 月 22 日，並非現行香港法例）：年收入 HK$${income}，免稅額 HK$${allowance}。應課稅收入 = max(0, 收入 − 免稅額)。首 HK$50000 應課稅收入按 2% 計算，其餘按 6% 計算，沒有其他規則或扣除。求稅款（港元）。`);
  q.hint=pcText('Subtract the allowance, stopping at zero. Split taxable income into the stated bands; the higher rate applies only to the remainder.','先扣免稅額，最低為零；再按稅階分開計算，高稅率只適用於餘額。');
  q.solution=pcText(`Taxable income = ${net}. First band = ${first}; remainder = ${rest}. Tax = ${first} × 2/100 + ${rest} × 6/100 = HK$${value}.`,`應課稅收入 = ${net}；首階收入 = ${first}，餘額 = ${rest}。稅款 = ${first} × 2/100 + ${rest} × 6/100 = HK$${value}。`);
 }
 q.prompt=pcText(q.prompt.en+exact.en,q.prompt.zh+exact.zh);q.answer=String(value);q.contract={type:'number',answer:q.answer,form:'number-literal'};
 q.reasonRubric=pcText('Review the base quantity, signed rate or multiplier, units and interpretation against the worked model. The automatic final value does not verify this explanation.','對照解答，檢視基準量、有正負號的百分率或倍數、單位及解釋。自動核對最終數值並不核實這段理由。');
 q.exposureKey=percentageExposureKey(id,q.model);return q;
}
export function percentageFeedback(q,input){
 if(!q.id?.startsWith('PC'))return null;let v;try{v=scalar(input);}catch{return null;}if(v.eq(scalar(q.answer)))return null;const m=q.model;
 if(q.id==='PC01'&&scalar(m.next).n!==0n&&v.eq(scalar(m.next).add(new Q(-m.original)).div(scalar(m.next)).mul(new Q(100))))return pcText('You used the new value as denominator. The requested change is based on the original value.','你用了新值作分母；所求百分變化須以原值為基準。');
 if(q.id==='PC03'&&v.eq(scalar(m.next).mul(pcMultiplier(-m.rate))))return pcText('Undo the multiplier by division. Applying an opposite percentage to the new value uses a different base.','應除以原倍數；向新值套用相反百分率會用了不同基準量。');
 if(q.id==='PC05'&&v.eq(m.mode==='overall'?new Q(m.r1+m.r2):new Q(m.original).mul(pcMultiplier(m.r1+m.r2))))return pcText('The second change uses the changed value. Multiply the multipliers rather than adding the rates.','第二次以改變後的值為基準；應把倍數相乘，不能直接相加百分率。');
 if(q.id==='PC07'&&v.eq(new Q(m.ra+m.rb,2)))return pcText('The original components may have different sizes. Weight their changes by their original amounts.','兩個原成分可能大小不同，須按各自原值計算改變量。');
 return null;
}
