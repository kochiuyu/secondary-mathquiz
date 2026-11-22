import {Q,scalar} from './exact.mjs';
const apText=(en,zh)=>({en,zh});
export const estimationFamilies=[
 ['AP01','Distinguish exact and approximate reports','分辨準確值與近似值','JS-3-1','choice'],
 ['AP02','Round to decimal places','取至指定位數的小數','JS-3-1','number'],
 ['AP03','Round to significant figures','取至指定位數的有效數字','JS-3-1','number'],
 ['AP04','Round to a stated place','取至指定的位','JS-3-1','number'],
 ['AP05','Compare rounding strategies','比較捨入策略','JS-3-2','number'],
 ['AP06','Calculate a prescribed estimate','按指定策略估算','JS-3-2','number'],
 ['AP07','Choose rounding for a context','按情境取整','JS-3-3','number'],
 ['AP08','Design and review an estimate (optional)','設計及檢視估算（選修增潤）','JS-3-4','manual']
].map(([id,en,zh,objective,contract])=>({id,title:apText(en,zh),objective,contract,topic:'js-3',version:1,state:'implemented-author-draft',optional:id==='AP08',source:'EDB JS 2017; explanatory notes 2020, Unit 3; independent review pending'}));
export const estimationCoreFamilies=estimationFamilies.filter(f=>!f.optional);
function estimationRandom(seed){let s=2166136261;for(const c of seed)s=Math.imul(s^c.charCodeAt(0),16777619);return()=>{s+=0x6d2b79f5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function estimationDecimal(n,places){if(!Number.isSafeInteger(n)||n<0||!Number.isInteger(places)||places<0||places>8)throw Error('Invalid bounded decimal.');if(!places)return String(n);const s=String(n).padStart(places+1,'0');return s.slice(0,-places)+'.'+s.slice(-places);}
// Work in integer ticks; no binary floating-point rounding is used.
export function estimationRound(n,step,mode='nearest'){
 if(!Number.isSafeInteger(n)||n<0||!Number.isSafeInteger(step)||step<=0||!['nearest','up','down'].includes(mode))throw Error('Invalid rounding domain.');
 const a=BigInt(n),b=BigInt(step),whole=a/b,remainder=a%b;
 return Number((whole+((mode==='up'&&remainder>0n)||(mode==='nearest'&&remainder*2n>=b)?1n:0n))*b);
}
export function estimationSignificant(n,scale,figures){
 if(!Number.isSafeInteger(n)||n<=0||n>=10**scale||!Number.isInteger(scale)||scale<4||scale>8||!Number.isInteger(figures)||figures<2||figures>4)throw Error('Invalid significant-figure domain.');
 const power=Math.max(0,String(n).length-figures),step=10**power,rounded=estimationRound(n,step),outPlaces=scale-Math.max(0,String(rounded).length-figures);
 return {answer:estimationDecimal(rounded/10**(scale-outPlaces),outPlaces),places:outPlaces,step};
}
export function estimationExposureKey(id,m){const semantic=id==='AP01'?{kind:m.kind,report:m.report}:id==='AP08'?{kind:m.kind,scenario:m.scenario}:m;return id+':'+JSON.stringify(semantic);}
export function generateEstimation(id,seed,version=1){
 if(version!==1)throw Error('This estimation question version is unavailable.');if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');
 const f=estimationFamilies.find(f=>f.id===id);if(!f)throw Error('Unknown estimation family.');
 const rnd=estimationRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)],shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const q={id,seed,version,objective:f.objective,marks:id==='AP08'?4:3,lines:6,resourceState:'author-draft',manualReason:true};let value,places;
 if(id==='AP01'){
  const report=pick(['count','defined','measured','rounded']),n=int(12,98);q.model={kind:'report',report,n};q.math='';q.answer=['count','defined'].includes(report)?'exact':'approximate';
  const scenario={count:apText(`Every attendee was counted once, with no omissions or duplicates. The exact tally is ${n}.`,`每名出席者均點算一次，沒有遺漏或重複，準確點算結果為 ${n} 人。`),defined:apText('By the definition of the units, 1 metre equals 100 centimetres.','按照單位的定義，1 米等於 100 厘米。'),measured:apText(`A ruler measurement is reported as ${n}.0 cm to the nearest tenth of a centimetre.`,`用尺量得的長度報作 ${n}.0 厘米，已取至最接近的十分之一厘米。`),rounded:apText(`An exact tally was rounded to the nearest ten and reported as about ${n*10} people.`,`把準確點算結果取至最接近的十位，報作「大約 ${n*10} 人」。`)}[report];
  q.prompt=apText(`${scenario.en} Is the report stated to be exact or approximate? Explain why.`,`${scenario.zh} 這份報告所述的是準確值還是近似值？請說明理由。`);
  q.options=shuffle([{id:'exact',label:apText('Exact','準確值')},{id:'approximate',label:apText('Approximate','近似值')}]);q.hint=apText('Read how the number was obtained and reported. A decimal is not automatically approximate; an integer is not automatically exact.','留意數值如何得出及報告。小數未必是近似值，整數也未必是準確值。');
  q.solution=q.answer==='exact'?apText('The given complete tally or unit definition is exact under the stated assumptions. Its notation alone is not the deciding factor.','題設明言完整點算或按定義換算，因此在所列假設下是準確值；不能只憑記法判斷。'):apText('The report deliberately gives a rounded measurement or tally. It does not retain the full underlying value.','報告已把量度或點算結果取近似值，沒有保留原來數值的全部資料。');
 }else if(id==='AP02'){
  const n=pick([int(0,999999),123450,999950,120000,5,50,500]),scale=4,dp=int(0,3),step=10**(scale-dp),rounded=estimationRound(n,step);places=dp;value=estimationDecimal(rounded/step,dp);q.model={kind:'decimal-places',n,scale,dp};q.math=estimationDecimal(n,scale);
  q.prompt=apText(`Round the displayed exact decimal to ${dp} decimal places. For these nonnegative values, a halfway value rounds upwards. Write all ${dp} digits after the decimal point (none if ${dp}=0).`,`把所示準確小數以四捨五入法取至 ${dp} 位小數。本組非負數恰在中點時向上取。須保留小數點後 ${dp} 位（${dp}=0 時不寫小數點）。`);
  q.hint=apText('Keep the requested decimal places, inspect the next digit, and round once from the original value. Keep required trailing zeros.','保留指定位數的小數，查看下一位，直接由原值捨入一次；保留所需末尾零。');
  q.solution=apText(`${q.math} ≈ ${value} to ${dp} decimal places. The result reports a precision; extra or missing decimal places change that report.`,`${q.math} ≈ ${value}（${dp} 位小數）。答案亦表達所需準確程度，多寫或少寫小數位都會改變報告方式。`);
 }else if(id==='AP03'){
  const n=pick([int(1000,99999),45000,99995,10005]),scale=pick([5,6,7]),figures=pick([2,3,4]),out=estimationSignificant(n,scale,figures);places=out.places;value=out.answer;q.model={kind:'significant',n,scale,figures};q.math=estimationDecimal(n,scale);
  q.prompt=apText(`Round the displayed positive decimal to ${figures} significant figures using nearest rounding, halfway upwards. Write a decimal with its required trailing zeros; do not use a fraction or scientific notation.`,`把所示正小數以四捨五入法取至 ${figures} 位有效數字，中點向上取。請用小數並保留所需末尾零，不用分數或科學記數法。`);
  q.hint=apText('Start counting at the first nonzero digit. Leading zeros locate the decimal; zeros after the first nonzero digit can be significant. Recheck the place after a carry.','由第一個非零數字開始數。前導零只表示位值；第一個非零數字後的零可以是有效數字。進位後須重新檢查位值。');
  q.solution=apText(`${q.math} ≈ ${value} to ${figures} significant figures. Leading zeros do not count. The displayed trailing zeros retain the requested precision.`,`${q.math} ≈ ${value}（${figures} 位有效數字）。前導零不計算，所寫末尾零保留指定的準確程度。`);
 }else if(id==='AP04'){
  const n=int(0,99999),step=pick([10,100,1000]);q.model={kind:'place',n,step};q.math=String(n);value=String(estimationRound(n,step));
  q.prompt=apText(`Round this whole number to the nearest ${step}, halfway upwards.`,`把這個整數以四捨五入法取至最接近的 ${step}，中點向上取。`);
  q.hint=apText('Locate the two neighbouring multiples of the stated place. Compare distances and keep the nearer one; a halfway value uses the higher one.','找出該位值兩個相鄰倍數，比較距離，取較接近的一個；恰在中點則取較大者。');
  q.solution=apText(`${n} ≈ ${value} to the nearest ${step}. This is rounding to a place, not counting significant figures.`,`${n} ≈ ${value}（取至最接近的 ${step}）。這是取至指定的位，並非數有效數字。`);
 }else if(id==='AP05'){
  const n=int(0,9999),step=pick([10,100]),mode=pick(['nearest','up','down']);q.model={kind:'strategy',n,step,mode};q.math=String(n);value=String(estimationRound(n,step,mode));
  const word={nearest:apText('round to nearest, halfway upwards','捨入至最接近的倍數，中點向上取'),up:apText('round up','上捨入'),down:apText('round down','下捨入')}[mode];
  q.prompt=apText(`Apply this strategy to a multiple of ${step}: ${word.en}. An exact multiple stays unchanged.`,`以 ${step} 的倍數作${word.zh}。原值若已是該倍數，則保持不變。`);
  q.hint=apText('Rounding up gives the least allowed multiple not below the value; rounding down gives the greatest allowed multiple not above it. Nearest can go either way.','上捨入取不小於原值的最小指定倍數，下捨入取不大於原值的最大指定倍數；捨入則可能向上或向下。');
  q.solution=apText(`The requested ${word.en} result is ${value}. Nearby multiples are ${Math.floor(n/step)*step} and ${Math.ceil(n/step)*step}; an exact multiple need not move.`,`${word.zh}的結果為 ${value}；兩邊倍數為 ${Math.floor(n/step)*step} 及 ${Math.ceil(n/step)*step}。若原值已是倍數，便不移動。`);
  q.diagram={type:'estimation-model',kind:'line',n,step};
 }else if(id==='AP06'){
  const a=int(11,99),b=int(11,99),op=pick(['add','multiply','divide']),ar=estimationRound(a,10),br=estimationRound(b,10);q.model={kind:'prescribed',a,b,op};q.math=`${a} ${op==='add'?'+':op==='multiply'?'×':'÷'} ${b}`;value=String(op==='add'?new Q(ar+br):op==='multiply'?new Q(ar*br):new Q(ar,br));
  q.prompt=apText('Use exactly this estimation strategy: round EACH input to the nearest ten, halfway upwards; then apply the displayed operation to the rounded inputs. Enter the exact value of that estimate, as a number or fraction, without units. Do not round the final result again. Explain your replacements.','只用指定估算策略：先把每個原數取至最接近的十位，中點向上取，再以捨入後兩數作所示運算。輸入這個估算結果的準確數值或分數，不加單位，不把最終結果再捨入，並說明替代的數值。');
  q.hint=apText('An estimate follows the stated replacements; it is not the exact calculation rounded at the end. The positive divisor cannot round to zero here.','按所列規則替代原數，不是先精確運算再把答案捨入。本題的正除數不會被捨入為零。');
  q.solution=apText(`Replace ${a} by ${ar} and ${b} by ${br}. The prescribed estimate is ${value}. Other strategies can give other estimates; this check only verifies this specified procedure.`,`以 ${ar} 代替 ${a}、以 ${br} 代替 ${b}，指定估算結果為 ${value}。其他策略可能有其他估算值；本自動檢查只核對題設步驟。`);
 }else if(id==='AP07'){
  const mode=pick(['capacity','budget']),capacity=pick([24,30,40,50]),people=int(1,300),price=int(8,60),budget=int(0,500);q.model=mode==='capacity'?{kind:'context',mode,people,capacity}:{kind:'context',mode,budget,price};q.math=mode==='capacity'?`${people} ÷ ${capacity}`:`${budget} ÷ ${price}`;value=String(mode==='capacity'?Math.ceil(people/capacity):Math.floor(budget/price));
  q.prompt=mode==='capacity'?apText(`There are exactly ${people} passengers. Each bus holds at most ${capacity}; every passenger needs a seat. Find the minimum whole number of buses. Explain why the rounding direction fits the requirement.`,`確有 ${people} 名乘客，每輛巴士最多載 ${capacity} 人，每人均須有座位。求最少整數輛巴士，並解釋為何這樣取整。`):apText(`A fictional ticket costs exactly HK$${price}. With HK$${budget} and no other fees, find the maximum whole number of tickets affordable without exceeding the budget. Explain the rounding direction.`,`假設每張票準確售 HK$${price}，預算 HK$${budget}，沒有其他費用。求不超過預算最多可買多少整數張票，並解釋取整方向。`);
  q.hint=apText('Enough seats require rounding a non-integer quotient up; affordable complete tickets require rounding it down. If the quotient is already an integer, keep it.','座位足夠時非整數商須向上取整；只買付得起的整數張票時須向下取整；商若已是整數則不變。');
  q.solution=mode==='capacity'?apText(`${value} buses provide ${Number(value)*capacity} seats; one fewer would fail the ${people}-seat requirement. This is a minimum sufficient whole count.`,`${value} 輛提供 ${Number(value)*capacity} 個座位，少一輛便不能滿足 ${people} 人的需求。這是足夠的最少整數數目。`):apText(`${value} tickets cost HK$${Number(value)*price}; one more would cost HK$${(Number(value)+1)*price}, beyond HK$${budget}. This is a maximum affordable whole count.`,`${value} 張共售 HK$${Number(value)*price}，多一張便要 HK$${(Number(value)+1)*price}，超過 HK$${budget}。這是付得起的最多整數張數。`);
 }else{
  const scenario=pick(['supplies','crowd','travel']),n=int(12,40);q.model={kind:'investigation',scenario,n};q.answer='A proposed strategy with assumptions, an estimate and a reasonableness check.';q.math=scenario==='supplies'?`${n}; 27–33`:scenario==='crowd'?`${n}; 18–24`:`${n}; 20–30`;
  const context=scenario==='supplies'?apText(`A school event needs one drink per learner. There are ${n} classes, with roughly 27–33 learners in each. Counts are provisional.`,`學校活動每名學生需一份飲品，共 ${n} 班，每班約 27–33 人，人數尚未確定。`):scenario==='crowd'?apText(`A crowd occupies about ${n} rows, with roughly 18–24 people per row. Row lengths and gaps vary.`,`一群人約佔 ${n} 行，每行大約 18–24 人，各行長度及空隙不一。`):apText(`A trip is approximately ${n} km, with an expected moving speed around 20–30 km/h. There may also be stops.`,`路程約 ${n} 公里，預期行駛速率約 20–30 公里／小時，中途也可能停留。`);
  q.prompt=apText(`Optional enrichment (JS-3-4), entirely manually reviewed. ${context.en} Propose a useful estimate for the decision, choose your own justified precision/strategy, state assumptions and check reasonableness. Give an alternative or range and a limitation. Put a short proposal in the answer and details in the reason. Several responses can be valid.`,`選修增潤（JS-3-4），全題人工評閱。${context.zh} 請按決策需要提出估算，自選並解釋合適的準確程度及策略，列出假設、檢查合理性，並給另一估算或範圍及一項限制。答案欄寫簡短建議，理由欄詳述。可有多個合理答案。`);
  q.hint=apText('Decide what the estimate is for before choosing precision. A planning allowance, a central estimate and a rough range answer different needs; state which you chose.','先決定估算用途，再選準確程度。留有餘量的計劃數、中央估計及粗略範圍服務不同需要，須說清所選方法。');
  q.solution=scenario==='supplies'?apText(`One possible plan is about ${n*33} drinks if using 33 per class as a provisional high planning figure. A central estimate is about ${n*30}; a rough model range is ${n*27}–${n*33}. The figures are not guaranteed attendance bounds, so confirm counts and consider spare supplies. Other justified plans are valid.`,`一種計劃是每班暫按較高的 33 人準備，約需 ${n*33} 份；中央估計約 ${n*30} 份，粗略模型範圍為 ${n*27}–${n*33}。這不是實際出席人數的保證界限，仍須確認人數及考慮備用份數；接受其他有理由的計劃。`):scenario==='crowd'?apText(`One central model uses 21 per row: about ${n*21} people. Using the provisional figures gives roughly ${n*18}–${n*24}. Check row variation and empty spaces; neither the range nor the central value is a certified count. Accept other justified sampling/rounding strategies.`,`可暫按每行 21 人估約 ${n*21} 人；依暫定數據的粗略範圍為 ${n*18}–${n*24}。須檢視行列差異及空隙；此範圍和中央值都不是經核實的點算。接受其他合理抽樣或捨入方法。`):apText(`Using 25 km/h gives about ${new Q(n,25)} h moving time. Using 20–30 km/h gives roughly ${new Q(n,30)}–${new Q(n,20)} h before stops. Route uncertainty and stops can change the total; add and justify any allowance rather than calling it exact. Accept other useful justified precision choices.`,`暫用每小時 25 公里，行駛時間約 ${new Q(n,25)} 小時；按每小時 20–30 公里，未計停留約 ${new Q(n,30)}–${new Q(n,20)} 小時。路線及停留會改變總時間；額外時間須有理由，不能當作準確值。接受其他適用且有解釋的準確程度。`);
  q.contract={type:'manual'};q.optional=true;
 }
 if(!q.contract){if(q.options)q.contract={type:'choice',answer:q.answer};else {q.answer=String(value);q.contract={type:'number',answer:q.answer,form:'number-literal',...(places!==undefined?{decimalPlaces:places}:{})};}}
 q.reasonRubric=id==='AP08'?apText('Review the decision, assumptions, strategy, precision, plausible alternatives/range and limitations. Evaluate the whole proposal manually; the worked example is not a unique answer.','人工檢視決策需要、假設、策略、準確程度、其他合理估算／範圍及限制；示例並非唯一答案。'):apText('Review the interpretation of precision, rounding direction, replacement steps and contextual meaning as appropriate. Automatic value/choice checking does not verify the written explanation.','按題意檢視準確程度、捨入方向、替代步驟及情境意思；自動核對數值或選項不會核實書面解釋。');
 q.exposureKey=estimationExposureKey(id,q.model);return q;
}
export function estimationFeedback(q,input){
 if(!q.id?.startsWith('AP')||q.options||q.contract.type==='manual')return null;let supplied;try{supplied=scalar(input);}catch{return null;}
 if(supplied.eq(scalar(q.answer))&&Number.isInteger(q.contract.decimalPlaces))return apText('The value matches. Report the requested precision, including trailing zeros, as a decimal rather than a fraction.','數值相同，請用小數寫出指定準確程度，保留末尾零，不用分數。');
 if(q.id==='AP06'){const m=q.model,exact=m.op==='add'?new Q(m.a+m.b):m.op==='multiply'?new Q(m.a*m.b):new Q(m.a,m.b);if(supplied.eq(exact)&&!supplied.eq(scalar(q.answer)))return apText('That is the exact calculation on the original inputs. This task asks for the estimate after rounding each input first.','這是以原數準確運算的值；本題要求先把每個原數捨入後再運算的估算值。');}
 return null;
}
