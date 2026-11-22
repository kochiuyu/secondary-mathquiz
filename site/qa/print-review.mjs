const frame=document.querySelector('#paper'),runButton=document.querySelector('#run'),exportButton=document.querySelector('#export');
const summary=document.querySelector('#summary'),results=document.querySelector('#results');
let report;
function assert(ok,message){if(!ok)throw Error(message);}
function load(url){return new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>{frame.onload=null;reject(Error('Document did not load.'));},15000);
 frame.onload=()=>{clearTimeout(timer);frame.onload=null;resolve(frame.contentDocument);};frame.src=url;
});}
function inspect(doc,entry){
 const pages=[...doc.querySelectorAll('.paper-page')],rows=[];
 assert(pages.length===entry.pages,'Unexpected HTML page count.');
 let index=0;
 for(const section of entry.sections){
  const questionNumbers=[];
  for(let i=0;i<section.pages;i++,index++){
   const page=pages[index],box=page.getBoundingClientRect(),footer=page.querySelector('.paper-footer'),foot=footer.getBoundingClientRect();
   assert(Math.abs(box.width-210*96/25.4)<2,'Page width is not A4.');
   assert(Math.abs(box.height-297*96/25.4)<2,'Page grew beyond A4 height.');
   assert(page.scrollWidth<=page.clientWidth+1,'Horizontal page overflow.');
   assert(footer.textContent.includes(section.specification_sha256.slice(0,12)),'Wrong paper fingerprint.');
   assert(footer.textContent.includes(`${i+1} / ${section.pages}`),'Wrong topic page numbering.');
   for(const question of page.querySelectorAll('.paper-question')){
    const q=question.getBoundingClientRect(),n=question.querySelector('h2').textContent.match(/^([1-6])\./)?.[1];
    assert(q.bottom+8<foot.top,'Question overlaps the footer.');
    assert(q.left>=box.left&&q.right<=box.right,'Question exceeds page bounds.');questionNumbers.push(Number(n));
    assert(question.querySelectorAll('.paper-work').length===(entry.kind==='Student'?6:0),'Student working lines or key separation changed.');
    assert(Boolean(question.querySelector('.solution'))===(entry.kind==='Solutions'),'Student/key solutions are mixed.');
   }
   for(const text of page.querySelectorAll('svg text')){
    const rect=text.getBoundingClientRect();assert(rect.left>=box.left&&rect.right<=box.right,'Diagram label exceeds page bounds.');
   }
   for(const text of page.querySelectorAll('.signed-numberline text'))assert(doc.defaultView.getComputedStyle(text).stroke==='none','Number-line text inherited an outline stroke.');
   for(const svg of page.querySelectorAll('.signed-numberline'))assert(Math.abs(svg.getBoundingClientRect().height-130)<1,'Number-line print size changed.');
   rows.push({pdf_page:index+1,topic:section.topic,topic_page:i+1,questions:page.querySelectorAll('.paper-question').length,width_px:Math.round(box.width),height_px:Math.round(box.height),footer_clearance_px:Math.round(foot.top-Math.max(...[...page.querySelectorAll('.paper-question')].map(x=>x.getBoundingClientRect().bottom)))});
  }
  assert(questionNumbers.join(',')==='1,2,3,4,5,6','Topic questions missing, duplicated or out of order.');
 }
 return rows;
}
runButton.addEventListener('click',async()=>{
 runButton.disabled=true;exportButton.disabled=true;results.replaceChildren();
 report={kind:'secondary-mathquiz-print-layout-review',schema:1,date:new Date().toISOString(),method:'Browser DOM geometry of production-rendered review booklets; not PDF/physical-print acceptance',documents:[],pdf_acceptance:'pending',independent_content_review:false};
 try{
  const [generation,build]=await Promise.all([fetch('../samples/pilot-review/generation.json',{cache:'no-store'}).then(r=>r.json()),fetch('build.json',{cache:'no-store'}).then(r=>r.json())]);
  report.source_sha256=build.sourceHash;
  for(const entry of generation.documents){
   summary.textContent='Checking '+entry.file;
   const row={file:entry.file,lang:entry.lang,kind:entry.kind,status:'pending',expected_pages:entry.pages};
   try{const doc=await load('../samples/pilot-review/'+entry.file);row.pages=inspect(doc,entry);row.status='pass';}
   catch(error){row.status='fail';row.error=error.message;}
   report.documents.push(row);const li=document.createElement('li');li.textContent=entry.file+': '+row.status+(row.error?' - '+row.error:' - '+row.pages.length+' pages');results.append(li);
  }
  const pass=report.documents.filter(x=>x.status==='pass').length;report.status=pass===4?'pass':'fail';
  summary.textContent=`HTML layouts: ${pass}/4 documents passed. ${report.documents.reduce((sum,x)=>sum+(x.pages?.length||0),0)} pages measured. Actual PDF/physical printing remains pending.`;
 }catch(error){report.status='fail';report.error=error.message;summary.textContent=error.message;}
 finally{runButton.disabled=false;exportButton.disabled=false;}
});
exportButton.addEventListener('click',()=>{
 if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='Secondary_MathQuiz_Print_Layout_Review.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
