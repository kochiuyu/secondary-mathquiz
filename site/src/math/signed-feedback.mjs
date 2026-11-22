import {scalar,Q} from './exact.mjs';
export function signedFeedback(q,input){
 if(!q.id.startsWith('SN'))return null;
 if(q.id==='SN02')return {en:'Compare the two positions on the same number line. Further right means greater, including for negative values.',zh:'在同一條數線上比較位置；越右的數越大，負數也一樣。'};
 let value;try{value=scalar(input);}catch{return null;}const m=q.model;
 if(q.id==='SN01'&&value.eq(new Q(-Number(q.answer)))&&Number(q.answer)!==0)return {en:'That value uses the opposite side of the reference. Check whether the temperature is above or below 0 °C.',zh:'這個數值位於基準的另一側。請檢查氣溫是高於還是低於 0 °C。'};
 if(q.id==='SN03'&&m.operation==='subtract'&&m.b<0&&value.eq(new Q(m.a+m.b)))return {en:'This result adds the negative operand. The question subtracts it: add its opposite instead.',zh:'這個結果是加上該負數，但題目要求減去它；請改為加上它的相反數。'};
 if(q.id==='SN04'&&Number(q.answer)!==0&&value.eq(new Q(-Number(q.answer))))return {en:'Check the sign using an inverse multiplication or the sign pattern before changing the magnitude.',zh:'先用逆向乘法或符號規律檢查正負號，再檢查數值大小。'};
 if(q.id==='SN05'&&value.eq(new Q((m.a+m.b)*m.c,m.d))&&!value.eq(scalar(q.answer)))return {en:'This matches adding before multiplying. Inside the brackets, complete the multiplication first.',zh:'這與先相加再相乘的結果相同；括號內應先算乘法。'};
 if(q.id==='SN06'&&value.eq(new Q(m.final))&&!value.eq(scalar(q.answer)))return {en:'That is the final temperature. The question asks for the change: final minus initial.',zh:'這是最後氣溫；題目要求的是變化，即最後數值減最初數值。'};
 return null;
}
