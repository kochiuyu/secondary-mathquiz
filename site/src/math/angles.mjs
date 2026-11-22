import {geometrySectorSize} from './angle-geometry.mjs';
export const angleFamilies=[
 {id:'GE01',title:{en:'Use local angle relationships',zh:'使用基本角關係'},objective:'JS-19-1',contract:'number'},
 {id:'GE02',title:{en:'Name an angle pair',zh:'辨認角對'},objective:'JS-19-2',contract:'choice'},
 {id:'GE03',title:{en:'Use given parallel lines',zh:'運用已知平行線'},objective:'JS-19-4',contract:'number'},
 {id:'GE04',title:{en:'Test a parallel-line claim',zh:'檢驗平行線的結論'},objective:'JS-19-3',contract:'choice'},
 {id:'GE05',title:{en:'Triangle interior and exterior angles',zh:'三角形內角與外角'},objective:'JS-19-5',contract:'number'},
 {id:'GE06',title:{en:'Explain the triangle angle rules',zh:'解釋三角形角定理'},objective:'JS-19-5',contract:'manual'}
].map(f=>({...f,topic:'js-19',version:1,state:'implemented-author-draft',source:'EDB JS 2017; explanatory notes 2020; independent review pending'}));
const gb=(en,zh)=>({en,zh});
const anglePairNames={corresponding:gb('corresponding angles','同位角'),alternate:gb('alternate interior angles','內錯角'),same:gb('same-side interior angles','同旁內角')};
function angleRandom(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6d2b79f5;let v=h;v=Math.imul(v^v>>>15,v|1);v^=v+Math.imul(v^v>>>7,v|61);return((v^v>>>14)>>>0)/4294967296;};}
function anglePosition(index,intersection,reflected){const inside=intersection==='A'?index>=2:index<2,right=([0,3].includes(index))!==reflected;return gb(`at ${intersection}, ${inside?'inside':'outside'} the two-intersection region and on the ${right?'right':'left'} of directed t`,`在 ${intersection}，位於兩交點之間區域的${inside?'內側':'外側'}，且在有方向的 t 的${right?'右':'左'}方`);}
export function angleExposureKey(id,model){
 if(id==='GE06')return 'GE06:triangle-angle-proof:v1';
 if(id==='GE02')return id+':'+JSON.stringify({pair:model.pair,p:model.p,q:model.q});
 const {rotation,reflected,...semantic}=model;if(model.vertical)delete semantic.phiB;
 return id+':'+JSON.stringify(semantic);
}
export function generateAngle(id,seed,version=1){
 if(version!==1)throw Error('This geometry question version is unavailable.');if(typeof seed!=='string'||seed.length>80)throw Error('Invalid seed.');const family=angleFamilies.find(f=>f.id===id);if(!family)throw Error('Unknown angle family.');
 const rnd=angleRandom(id+':'+seed),int=(a,b)=>Math.floor(rnd()*(b-a+1))+a,pick=a=>a[int(0,a.length-1)],shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=int(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
 const q={id,seed,version,objective:family.objective,marks:[2,1,2,3,2,4][Number(id.slice(2))-1],lines:id==='GE06'?6:5,resourceState:'author-draft'},rotation=30*int(0,11),reflected=rnd()<.5;
 if(id==='GE01'){
  const mode=pick(['straight','point','vertical','complementary','supplementary']),a=mode==='complementary'?int(20,70):mode==='point'?int(45,130):int(30,150),b=mode==='point'?int(45,130):0;const answer=mode==='vertical'?a:mode==='point'?360-a-b:mode==='complementary'?90-a:180-a;
  q.model={kind:'local-angles',mode,a,b,rotation,reflected};q.answer=String(answer);q.math='x = ?';
  const relation={straight:gb('Two adjacent angles lie on one straight line.','兩個鄰角在同一直線上。'),point:gb('Three consecutive sectors make one complete turn around O.','O 點周圍三個連續角合起來是一周角。'),vertical:gb('Two straight lines cross at O; the marked sectors are vertically opposite.','兩直線相交於 O，所標示的是對頂角。'),complementary:gb('The marked adjacent sectors fill a right angle.','所標示的鄰角合起來是一個直角。'),supplementary:gb('The two marked adjacent angles are stated to be supplementary.','已知兩個標示的鄰角互為補角。')}[mode];
  q.prompt=gb(`${relation.en} The known angle${mode==='point'?'s are':' is'} ${a}°${mode==='point'?` and ${b}°`:''}. Find x in degrees and give a reason.`,`${relation.zh}已知角為 ${a}°${mode==='point'?` 和 ${b}°`:''}。求 x（度），並給理由。`);
  const rule=mode==='vertical'?gb('Vertically opposite angles are equal.','對頂角相等。'):mode==='point'?gb('Angles making a full turn sum to 360°.','一周角合共 360°。'):mode==='complementary'?gb('Complementary angles sum to 90°.','餘角之和為 90°。'):gb('The stated straight/supplementary angle total is 180°.','已知平角或補角的總和為 180°。');
  q.hint=gb('Identify the given relationship before choosing an equality or a total.','先辨認已知角關係，再選擇相等或角的總和。');q.solution=gb(`${rule.en} Hence x=${answer}°.`,`${rule.zh}所以 x=${answer}°。`);q.manualReason=true;q.reasonRubric=gb('Name the applicable given relation and show the equality/subtraction. Numerical correctness alone does not verify this reason.','須說明適用的已知角關係，並展示相等或減法；數值正確不代表理由已獲核實。');
 }else if(['GE02','GE03','GE04'].includes(id)){
  const pair=id==='GE04'?pick(['corresponding','alternate','same','vertical']):id==='GE03'?pick(['corresponding','alternate','same','two-step']):pick(['corresponding','alternate','same']);
  let p,qIndex;if(pair==='corresponding'){p=id==='GE02'?int(0,3):0;qIndex=p;}else if(pair==='alternate'){p=pick([2,3]);qIndex=p===2?0:1;}else if(pair==='same'){p=pick([2,3]);qIndex=p===2?1:0;}else if(pair==='two-step'){p=0;qIndex=1;}else{p=0;qIndex=2;}
  let phiA,phiB;
  if(id==='GE02'){phiA=int(-30,30);phiB=phiA+pick([-12,-8,8,12]);}
  else if(id==='GE03'){phiA=int(10,70);phiB=phiA;}
  else{phiA=int(-50,50);phiB=pair==='vertical'?phiA+pick([0,0,-9,9]):rnd()<.5?phiA:phiA+pick([-9,-1,1,9]);}
  const vertical=pair==='vertical',a=geometrySectorSize(phiA,p),b=geometrySectorSize(vertical?phiA:phiB,qIndex),positionP=anglePosition(p,'A',reflected),positionQ=anglePosition(qIndex,vertical?'A':'B',reflected);
  q.model={kind:id==='GE02'?'angle-pair':id==='GE03'?'parallel-property':'parallel-test',pair,p,q:qIndex,phiA,phiB,vertical,parallelGiven:id==='GE03',rotation,reflected};
  const positions=gb(`A transversal t meets l at A and m at B. Direct t from B towards A. P is ${positionP.en}; Q is ${positionQ.en}.`,`截線 t 與 l、m 分別相交於 A、B，t 的方向由 B 指向 A。P ${positionP.zh}；Q ${positionQ.zh}。`);
  if(id==='GE02'){
   q.answer=pair;q.options=shuffle(Object.entries(anglePairNames).map(([id,label])=>({id,label})));q.math='P, Q';q.prompt=gb(`${positions.en} Name the pair. Parallelism is not given; the sketch is not a premise about equality.`,`${positions.zh}辨認角對。未有給定平行；不可從草圖外觀推斷角相等。`);q.hint=gb('Use intersection, inside/outside and side of the directed transversal.','按交點、內外位置及截線的哪一方來辨認。');q.solution=gb(`P and Q are ${anglePairNames[pair].en}. This names their positions; without parallelism it does not establish equality or a 180° sum.`,`P、Q 是${anglePairNames[pair].zh}。這只表示位置；未有平行條件，不可因此判定相等或和為 180°。`);
  }else if(id==='GE03'){
   q.answer=String(b);q.math=`P = ${a}°; Q = x`;q.prompt=gb(`${positions.en} Given l ∥ m and P=${a}°, find Q=x and give a reason.`,`${positions.zh}已知 l ∥ m，P=${a}°。求 Q=x，並給理由。`);
   q.hint=gb('Use the stated parallel premise together with the marked pair positions.','須同時使用已知平行條件及所標示的角對位置。');
   const reason=pair==='two-step'?gb('First use the corresponding angle at B, then its adjacent straight-line angle.','先用 B 的同位角，再用其鄰接平角。'):pair==='same'?gb('Same-side interior angles between parallel lines sum to 180°.','平行線的同旁內角之和為 180°。'):gb(`${anglePairNames[pair].en} between parallel lines are equal.`,`平行線的${anglePairNames[pair].zh}相等。`);
   q.solution=gb(`${reason.en} Thus Q=${b}°.`,`${reason.zh}所以 Q=${b}°。`);q.manualReason=true;q.reasonRubric=gb('Name l ∥ m, identify the angle pair and any local straight-angle step. Review the written chain separately from the final number.','須指出 l ∥ m、角對，以及適用的鄰接平角步驟；書面推理與最終數值分開評閱。');
  }else{
   q.answer=vertical?'insufficient':phiA===phiB?'yes':'no';q.math=`P = ${a}°; Q = ${b}°`;q.options=shuffle([{id:'yes',label:gb('Yes, they must be parallel','是，必定平行')},{id:'no',label:gb('No, the stated angle data rule out parallelism','否，已知角資料排除了平行')},{id:'insufficient',label:gb('The data are insufficient to decide','資料不足，未能判定')}]);
   q.prompt=gb(`${positions.en} P=${a}° and Q=${b}°. ${vertical?'These are vertically opposite angles at A, with no angle data at B.':`The marked pair is ${anglePairNames[pair].en}.`} Must l and m be parallel? Explain using only these givens; appearance is not a premise.`,`${positions.zh}P=${a}°，Q=${b}°。${vertical?'這是 A 的對頂角，B 並無角度資料。':`所標示的是${anglePairNames[pair].zh}。`}l、m 是否必定平行？只用已知條件解釋，不可以外觀作依據。`);
   q.hint=gb('A parallel test needs a relationship linking the two different intersections, not just a local equality at one intersection.','判定平行須有連起兩個不同交點的角關係，不能只憑同一交點的局部相等。');
   const qualifies=pair==='same'?a+b===180:a===b;
   q.solution=vertical?gb('Insufficient: vertically opposite angles are equal regardless of the direction of m. No relationship with an angle at B is given.','資料不足：不論 m 的方向如何，對頂角本來都相等；未有給定與 B 的角之間的關係。'):gb(`${a}${pair==='same'?`+${b}=${a+b}`:` and ${b}`} ${qualifies?'satisfy':'do not satisfy'} the ${pair==='same'?'180° same-side interior condition':'equal-angle condition for this pair'}. Therefore ${qualifies?'l ∥ m':'l and m cannot be parallel under these givens'}.`,`${pair==='same'?`${a}+${b}=${a+b}`:`${a} 與 ${b}`} ${qualifies?'符合':'不符合'}${pair==='same'?'同旁內角和為 180°':'這類角對相等'}的條件，所以${qualifies?' l ∥ m':'在這些已知條件下 l、m 不平行'}。`);q.manualReason=true;q.reasonRubric=gb('Identify the stated relationship and its parallel test, or explain why local vertical equality gives no information about the second line.','指出已知角關係和相應的平行判定條件，或解釋為何局部對頂角相等不能提供另一條線的資料。');
  }
 }else{
  let A,B,C;do{B=int(20,130);C=int(20,130);A=180-B-C;}while(A<20||A>140);const proof=id==='GE06',target=proof?'proof':pick(['interior','exterior']);
  q.model={kind:proof?'triangle-proof':'triangle-angles',A,B,C,target,rotation,reflected};q.math=proof?'α + β + γ = ?':`A = ${A}°; B = ${B}°`;
  if(!proof){q.answer=String(target==='interior'?C:A+B);q.prompt=gb(`In triangle ABC, A=${A}° and B=${B}°. ${target==='interior'?'Find the interior angle C=x.':'BC is extended beyond C to D. Find the exterior angle ACD=x.'} Give a reason.`,`在三角形 ABC，A=${A}°，B=${B}°。${target==='interior'?'求內角 C=x。':'BC 越過 C 延長至 D，求外角 ACD=x。'}並給理由。`);q.hint=gb('Identify whether x is inside the triangle or between AC and the extended ray CD.','先辨認 x 是三角形內角，還是 AC 與延長射線 CD 之間的外角。');q.solution=gb(`${target==='interior'?`A+B+C=180°, so C=180−${A}−${B}=${C}°.`:`ACD=A+B=${A}+${B}=${A+B}°; equivalently ACD+C=180°.`}`,`${target==='interior'?`A+B+C=180°，所以 C=180−${A}−${B}=${C}°。`:`外角 ACD=A+B=${A}+${B}=${A+B}°；亦可用 ACD+C=180°。`}`);q.reasonRubric=gb('Identify the requested sector and use the triangle interior sum or exterior-angle theorem with the two remote interior angles.','指出所求角區域，並使用三角形內角和，或外角等於兩個不相鄰內角之和的定理。');}
  else{q.answer='p=β; q=γ; p+α+q=180°; E+γ=180°; therefore E=α+β.';q.contract={type:'manual'};q.prompt=gb('In triangle ABC, the constructed line uAv is parallel to BC. The marked angles at A on that line are p and q; the triangle angles are α, β, γ. Use alternate interior and straight angles to prove α+β+γ=180°. Then, with BC extended to D, prove the exterior angle E at C equals α+β.','在三角形 ABC，已作 uAv ∥ BC。A 點直線上的兩個標示角為 p、q；三角形內角為 α、β、γ。請用內錯角及平角證明 α+β+γ=180°，再在 BC 延長至 D 時證明 C 的外角 E=α+β。');q.hint=gb('Match p with β and q with γ using the constructed parallel lines. Do not use the triangle-sum theorem to prove itself.','先利用所作平行線把 p 與 β、q 與 γ 配對；不要用三角形內角和定理來證明它自己。');q.solution=gb('Because uAv ∥ BC, p=β and q=γ by alternate interior angles. Along the straight line at A, p+α+q=180°. Substitute to obtain α+β+γ=180°. Also E+γ=180° along BCD, so E=α+β. This is a deductive proof, not a measurement of this particular drawing.','因 uAv ∥ BC，內錯角相等，故 p=β、q=γ。在 A 的平角上，p+α+q=180°，代入得 α+β+γ=180°。又因 BCD 為直線，E+γ=180°，所以 E=α+β。這是演繹證明，不是量度某幅圖的結果。');q.reasonRubric=gb('Manual review of the entire proof: cite the constructed parallel premise, match both alternate pairs, use the straight angle at A, and derive the exterior claim using E+γ=180°. Do not accept a numerical answer or circular use of triangle-sum as a proof of the general statement.','整份證明需人工評閱：引用所作的平行條件、配對兩組內錯角、使用 A 的平角，再由 E+γ=180° 推出外角結果。單一數值或以內角和定理循環證明本身，不能構成一般命題的證明。');}
  q.manualReason=true;
 }
 if(!q.contract)q.contract=q.options?{type:'choice',answer:q.answer}:{type:'number',answer:q.answer,unit:'degree',form:'number-literal'};
 q.diagram={type:'angle-geometry',model:q.model};q.exposureKey=angleExposureKey(id,q.model);return q;
}
