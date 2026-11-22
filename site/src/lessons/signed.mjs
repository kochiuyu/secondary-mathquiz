import {generateCurriculum} from '../math/signed.mjs';
export const signedLessons=[
 {id:'SN-L1',families:['SN01','SN02'],title:{en:'Where is zero?',zh:'零在哪裏？'},why:{en:'A reference point lets us describe opposite directions and compare values accurately.',zh:'先定基準，才能準確描述相反方向和比較數值。'},
  before:{en:'Read equally spaced ticks and compare positive numbers. You can revisit arithmetic at any time.',zh:'能讀等距刻度、比較正數；需要時可隨時重溫計算。'},
  goals:{en:['Explain positive, negative and zero relative to a stated reference.','Place and compare directed numbers, including fractions.'],zh:['按已知基準解釋正數、負數與零。','在數線上表示及比較有向數，包括分數。']},
  readiness:{en:'A thermometer reads 2 °C below zero. Before calculating, which side of zero should you use?',zh:'溫度計顯示低於零度 2 °C。未計算前，應選零的哪一側？'},
  readinessAnswer:{en:'The negative side: −2 °C. The reference is 0 °C, not the first temperature you happen to see.',zh:'應選負數的一側，即 −2 °C。基準是 0 °C，並不是隨意看到的第一個氣溫。'},
  sections:[
   {title:{en:'Name the reference first',zh:'先說清基準'},text:{en:'Zero marks the reference. Values above it are positive; values below it are negative. Zero itself is neither positive nor negative. A thermometer uses 0 °C; a net balance can use no gain or loss. State the convention before attaching a sign.',zh:'零標示基準。高於基準用正數，低於基準用負數；零本身既不是正數，也不是負數。氣溫可用 0 °C 作基準，淨收支可用沒有盈虧作基準。加正負號前，先說清約定。'}},
   {title:{en:'Order is position, not unsigned digits',zh:'大小取決於位置，不是忽略符號後的數字'},text:{en:'On an equally spaced number line, values increase to the right. Thus −3 is greater than −7, although 3 is smaller than 7. Distance from zero answers a different question. Opposite numbers such as −4 and 4 are equally far from zero on opposite sides.',zh:'在等距數線上，數值向右增加。因此 −3 大於 −7，雖然 3 小於 7。離零多遠是另一個問題。相反數如 −4 和 4，位於零的兩側，距離相同。'}},
   {title:{en:'Fractions use the same scale',zh:'分數沿用同一刻度'},text:{en:'−1/2 lies between −1 and 0. Compare numbers using the same reference and tick scale; an exact fraction and its exact decimal name the same point. You do not need to memorise a separate ordering rule for fractions.',zh:'−1/2 位於 −1 與 0 之間。比較時要用相同基準與刻度；準確分數和相應準確小數表示同一個點，不用另背一套分數大小規則。'}}],
  takeaway:{en:'State the reference, keep the sign, then compare positions. Zero is neither positive nor negative.',zh:'先定基準、保留符號，再比較位置；零既不是正數，也不是負數。'},
  next:{en:'Next, use movement and inverse operations to add and subtract directed numbers.',zh:'下一步，用移動與逆運算理解有向數的加減法。'}},
 {id:'SN-L2',families:['SN03','SN04'],title:{en:'Moves, inverses and sign patterns',zh:'移動、逆運算與符號規律'},why:{en:'Inverse relationships explain sign rules and give a reliable way to check a calculation.',zh:'逆運算能解釋符號規律，也能幫助檢驗計算。'},
  before:{en:'Know what the signs mean and how values are ordered. Revisit “Where is zero?” if needed.',zh:'能理解正負號和數值大小；需要時可重溫「零在哪裏？」。'},
  goals:{en:['Interpret addition and subtraction as directed movement.','Use multiplication patterns and inverse products to check signs.'],zh:['以有向移動理解加減法。','用乘法規律和逆運算檢驗乘除符號。']},
  readiness:{en:'Starting at −4, would adding 7 move left or right? What changes if the operation is subtracting −7?',zh:'從 −4 出發，加 7 應向左還是向右？如果改為減去 −7，又會怎樣？'},
  readinessAnswer:{en:'Adding 7 moves right. Subtracting −7 also moves right, because subtraction adds the opposite: −4−(−7)=−4+7=3.',zh:'加 7 向右移；減去 −7 也向右移，因為減去一個數即加上其相反數：−4−（−7）=−4+7=3。'},
  sections:[
   {title:{en:'Keep the operation and the operand separate',zh:'分清運算符號與數的正負號'},text:{en:'The first number gives the starting position. Adding a positive moves right; adding a negative moves left. Subtracting a number means adding its opposite. For example, 5−(−2)=5+2=7, whereas 5+(−2)=3. Read the operation before choosing the direction.',zh:'第一個數是起點。加正數向右移，加負數向左移；減去一個數即加上其相反數。例如 5−（−2）=5+2=7，但 5+（−2）=3。先讀清運算，再選方向。'}},
   {title:{en:'Explain the sign with a pattern',zh:'用規律解釋符號'},text:{en:'The products 3×2=6, 3×1=3 and 3×0=0 decrease by 3, so continuing gives 3×(−1)=−3. Likewise, (−3)×2=−6, (−3)×1=−3, (−3)×0=0 increase by 3, so (−3)×(−1)=3. These patterns explain why two negative factors have a positive product.',zh:'3×2=6、3×1=3、3×0=0 的結果每次減 3，繼續便得 3×（−1）=−3。同樣，（−3）×2=−6、（−3）×1=−3、（−3）×0=0 的結果每次加 3，所以（−3）×（−1）=3。這解釋了兩個負因數相乘為何得正數。'}},
   {title:{en:'Check division with multiplication',zh:'用乘法檢驗除法'},text:{en:'Since (−3)×2=−6, we have (−6)÷(−3)=2. For nonzero factors or quotients, equal signs give a positive result and different signs give a negative result. A zero factor gives a zero product, and 0 divided by a nonzero number is 0. Division by 0 is not defined.',zh:'因為（−3）×2=−6，所以（−6）÷（−3）=2。非零數相乘或相除，同號得正、異號得負。因數為零，積為零；零除以非零數，商為零。除以零沒有定義。'}}],
  takeaway:{en:'Read the operation, add the opposite when subtracting, and check division using an inverse product.',zh:'讀清運算；減法可改成加上相反數；除法可用乘法檢驗。'},
  next:{en:'Next, combine these operations in brackets and distinguish a change from a final value.',zh:'下一步，把運算放進括號，並分清變化與最後數值。'}},
 {id:'SN-L3',families:['SN05','SN06'],title:{en:'A change is not a final value',zh:'變化不等於最後數值'},why:{en:'Correct operation order and a clear model prevent plausible calculations from answering the wrong question.',zh:'運算次序和清楚的模型，能避免算式看似合理卻答非所問。'},
  before:{en:'Add, subtract, multiply and divide directed numbers; use exact fractions. Revisit the previous session if sign handling is uncertain.',zh:'能進行有向數四則運算，並使用準確分數；如正負號仍不穩，可重溫上一節。'},
  goals:{en:['Calculate a bracketed expression in the correct order.','Find and interpret final minus initial, then check by addition.'],zh:['按正確次序計算含括號的算式。','求並解釋「最後減最初」，再用加法檢驗。']},
  readiness:{en:'A temperature goes from −4 °C to 3 °C. Is 3 °C the final temperature or the change?',zh:'氣溫由 −4 °C 變為 3 °C。3 °C 是最後氣溫，還是氣溫變化？'},
  readinessAnswer:{en:'It is the final temperature. The change is 3−(−4)=+7 °C, a rise of 7 °C.',zh:'它是最後氣溫。變化是 3−（−4）=+7 °C，即上升 7 °C。'},
  sections:[
   {title:{en:'Let the bracket define a whole quantity',zh:'把括號內看成整個量'},text:{en:'In [−3+2×(−4)]÷(−2), first multiply inside the brackets: 2×(−4)=−8. Then add: −3+(−8)=−11. Finally divide the whole result: (−11)÷(−2)=11/2=5.5. A fraction is an exact answer; no rounding is needed.',zh:'在［−3+2×（−4）］÷（−2）中，先算括號內乘法：2×（−4）=−8；再相加：−3+（−8）=−11；最後把整個結果相除：（−11）÷（−2）=11/2=5.5。分數是準確答案，不用取近似值。'}},
   {title:{en:'Name the initial value, change and final value',zh:'分清最初數值、變化與最後數值'},text:{en:'Initial + change = final, so change = final − initial. For a temperature from −4 °C to 3 °C, the change is +7 °C. For the reverse journey from 3 °C to −4 °C, it is −7 °C. The size of the change is the same, but its direction differs.',zh:'最初數值 + 變化 = 最後數值，所以變化 = 最後數值 − 最初數值。由 −4 °C 變為 3 °C，變化為 +7 °C；反過來由 3 °C 變為 −4 °C，變化為 −7 °C。變化的幅度相同，方向不同。'}},
   {title:{en:'Check the model, then explain the sign',zh:'檢驗模型，再解釋符號'},text:{en:'Substitute your change back into initial + change = final. State the unit and whether the quantity rises or falls. A correct final number checks one part of the work; a written explanation still needs self or teacher review. Use a fresh check to see whether you can choose the method without a model beside it.',zh:'把變化代回「最初數值 + 變化 = 最後數值」檢驗，再說明單位和上升或下降。最終數值正確只核對了部分作答；書面解釋仍需自行或由教師評閱。可透過沒有參考例子的新題檢視是否能自行選擇方法。'}}],
  takeaway:{en:'Follow the bracket structure. In context, answer the requested quantity and verify initial + change = final.',zh:'按括號結構計算；在情境中求題目指定的量，並檢驗「最初數值 + 變化 = 最後數值」。'},
  next:{en:'Use these directed values when reading algebraic expressions and solving equations. The expressions path is now available as a draft; equations and angles remain in design.',zh:'之後可用有向數理解代數式和解方程；代數式路線已有初稿；方程和角仍在設計階段。'}}
];
const signedModelSeeds={'SN-L1':['SN-L1:model-0:0','SN-L1:model-1:7'],'SN-L2':['SN-L2:model-0:2','SN-L2:model-1:2'],'SN-L3':['SN-L3:model-0:0','SN-L3:model-1:0']};
export function lessonExamples(lesson){return lesson.families.map((id,i)=>generateCurriculum(id,signedModelSeeds[lesson.id][i]));}
const lessonExposureModels={
 'SN-L1':[['SN01',{kind:'reference',magnitude:2,direction:-1}],['SN02',{kind:'comparison',a:'-7',b:'-3'}]],
 'SN-L2':[['SN03',{kind:'movement',a:-4,b:7,operation:'add'}],['SN03',{kind:'movement',a:-4,b:-7,operation:'subtract'}],['SN03',{kind:'movement',a:5,b:-2,operation:'subtract'}],['SN03',{kind:'movement',a:5,b:-2,operation:'add'}],...[[3,2],[3,1],[3,0],[3,-1],[-3,2],[-3,1],[-3,0],[-3,-1]].map(([a,b])=>['SN04',{kind:'product',a,b,operation:'multiply'}]),['SN04',{kind:'product',a:-6,b:-3,operation:'divide'}]],
 'SN-L3':[['SN05',{kind:'mixed',a:-3,b:2,c:-4,d:-2}],['SN06',{kind:'change',initial:-4,final:3}],['SN06',{kind:'change',initial:3,final:-4}]]
};
export function recordedLessonExamples(studied){return signedLessons.filter(l=>studied.includes('lesson:'+l.id+':v1')).flatMap(l=>[...lessonExamples(l),...lessonExposureModels[l.id].map(([id,model])=>({id,exposureKey:id+':'+JSON.stringify(model)}))]);}
