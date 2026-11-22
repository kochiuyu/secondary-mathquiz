export const geometrySector=(phi,index)=>({start:[phi,90,phi+180,270][index],end:[90,phi+180,270,phi+360][index]});
export const geometrySectorSize=(phi,index)=>index%2===0?90-phi:90+phi;
export function geometryTriangle(B,C){
 const cot=d=>1/Math.tan(d*Math.PI/180),height=200/(cot(B)+cot(C));
 return {A:[-100+height*cot(B),-65+height],B:[-100,-65],C:[100,-65],D:[170,-65]};
}
export function geometryTransform(point,rotation=0,reflected=false){const t=rotation*Math.PI/180,x=point[0]*(reflected?-1:1),y=point[1];return [x*Math.cos(t)-y*Math.sin(t),x*Math.sin(t)+y*Math.cos(t)];}
export function geometryScene(model){
 const segments=[],arcs=[],labels=[],parallel=[],markers=[];
 const ray=(center,angle,length=95)=>[center[0]+length*Math.cos(angle*Math.PI/180),center[1]+length*Math.sin(angle*Math.PI/180)];
 const line=(center,angle,length=100,dashed=false)=>segments.push({from:ray(center,angle+180,length),to:ray(center,angle,length),dashed});
 const arc=(center,start,end,label,radius=30)=>arcs.push({center,start,end,label,radius});
 const label=(point,text)=>labels.push({point,text});
 if(model.kind==='local-angles'){
  const O=[0,0],{mode,a,b=0}=model;
  let directions;
  if(mode==='vertical'){directions=[0,a,180,180+a];arc(O,0,a,`${a}°`);arc(O,180,180+a,'x');}
  else if(mode==='point'){directions=[0,a,a+b];arc(O,0,a,`${a}°`);arc(O,a,a+b,`${b}°`);arc(O,a+b,360,'x',38);}
  else{const total=mode==='complementary'?90:180;directions=[0,a,total];arc(O,0,a,`${a}°`);arc(O,a,total,'x');if(total===90)markers.push([[16,0],[16,16],[0,16]]);}
  for(const angle of directions)segments.push({from:O,to:ray(O,angle,105)});label([-10,-14],'O');
 }else if(['angle-pair','parallel-property','parallel-test'].includes(model.kind)){
  const A=[0,65],B=[0,-65];line(A,model.phiA,100);line(B,model.phiB,100);line([0,0],90,155);
  label([-15,73],'A');label([-15,-57],'B');label(ray(A,model.phiA,114),'l');label(ray(B,model.phiB,114),'m');label([12,151],'t');
  const p=geometrySector(model.phiA,model.p),q=geometrySector(model.vertical?model.phiA:model.phiB,model.q);
  arc(A,p.start,p.end,'P',27);arc(model.vertical?A:B,q.start,q.end,'Q',39);
  if(model.parallelGiven){parallel.push({point:ray(A,model.phiA,65),angle:model.phiA},{point:ray(B,model.phiB,65),angle:model.phiB});}
 }else{
  const {A,B,C,D}=geometryTriangle(model.B,model.C),aStart=180+model.B,aEnd=360-model.C;
  segments.push({from:A,to:B},{from:B,to:C},{from:C,to:A});label([A[0],A[1]+19],'A');label([B[0]-14,B[1]-14],'B');label([C[0]+13,C[1]-15],'C');
  const proof=model.kind==='triangle-proof';arc(A,aStart,aEnd,proof?'α':`${model.A}°`,28);arc(B,0,model.B,proof?'β':`${model.B}°`,30);
  if(proof||model.target==='exterior'){segments.push({from:C,to:D});label([D[0]+9,D[1]-10],'D');arc(C,0,180-model.C,proof?'E':'x',35);if(proof)arc(C,180-model.C,180,'γ',23);}
  else arc(C,180-model.C,180,'x',30);
  if(proof){line(A,0,135,true);label([A[0]-143,A[1]],'u');label([A[0]+143,A[1]],'v');arc(A,180,aStart,'p',40);arc(A,aEnd,360,'q',40);parallel.push({point:[A[0]+90,A[1]],angle:0},{point:[35,B[1]],angle:0});}
 }
 return {segments,arcs,labels,parallel,markers};
}
