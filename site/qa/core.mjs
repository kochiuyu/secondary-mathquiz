export const acceptanceVersion='0.7.0';
export const automaticChecks=[
 ['A01','Load the application'],['A02','Catalogue and cleared URL filters'],
 ['A03','Draft, language switch and reload'],['A04','Reason review after editing'],
 ['A05','Learner isolation'],['A06','Paper identity and reopen'],
 ['A07','Import cancellation and failed review'],['A08','390px page overflow'],
 ['A09','Rendered fraction geometry'],['A10','Three bilingual signed-number lessons and mobile reflow'],['A11','Six curriculum families, resume and separate reason evidence'],['A12','Curriculum paper identity and bilingual key'],['A13','Three bilingual expressions lessons and mobile reflow'],['A14','Manual expressions, draft review and scoring separation'],['A15','Expressions paper and bilingual manual rubrics']
];
export const manualChecks=[
 ['M01','Desktop and mobile appearance in both languages'],
 ['M02','Keyboard, focus and screen-reader feedback'],
 ['M03','200% browser zoom'],
 ['M04','English and Chinese student/key PDFs, including six working lines'],
 ['M05','Two real tabs and denied/full browser storage'],
 ['M06','Repository subdirectory and direct-link reload']
];
export function acceptancePrefix(run){
 if(typeof run!=='string'||!/^[a-zA-Z0-9-]{8,64}$/.test(run))throw new Error('Invalid acceptance run ID.');
 return 'secondary-mathquiz:qa:'+run+':';
}
export function acceptanceApp(html){
 const marker="const PREFIX='secondary-mathquiz:p2:';";
 if(html.split(marker).length!==2)throw new Error('Expected exactly one application storage namespace. Rebuild before preparing acceptance.');
 const replacement="const PREFIX='secondary-mathquiz:qa:'+(()=>{const run=new URL(location.href).searchParams.get('run');if(!/^[a-zA-Z0-9-]{8,64}$/.test(run||''))throw new Error('Open this copy through the acceptance runner.');return run;})()+':';";
 return html.replace(marker,replacement).replaceAll('href="planning/source-register.md"','href="../planning/source-register.md"');
}
export function acceptanceFaultApp(html,mode){
 const faults={
  denied:"storage={getItem(){throw new DOMException('Controlled storage denial','SecurityError');},setItem(){throw new DOMException('Controlled storage denial','SecurityError');}};",
  quota:"storage={getItem(){return null;},setItem(){throw new DOMException('Controlled quota limit','QuotaExceededError');}};"
 };
 if(!Object.hasOwn(faults,mode))throw new Error('Choose a declared storage fault.');
 const app=acceptanceApp(html),marker='const repo=repository(storage);';
 if(app.split(marker).length!==2)throw new Error('Expected one repository binding.');
 return app.replace(marker,faults[mode]+'\n'+marker);
}
export function acceptanceReport({run,automatic=[],manual=[],environment={},sourceHash='',at=new Date().toISOString()}){
 acceptancePrefix(run);
 const statuses=new Set(['pending','pass','fail','blocked']);
 const rows=(definitions,results,kind)=>definitions.map(([id,title])=>{
  const item=results.find(r=>r.id===id),notes=String(item?.notes||'').slice(0,4000);
  let status=statuses.has(item?.status)?item.status:'pending';
  if(kind==='manual'&&status==='pass'&&!notes.trim())status='pending';
  return {id,title,status,notes,evidence:kind==='manual'?'reviewer-recorded':'browser-runner'};
 });
 const auto=rows(automaticChecks,automatic,'automatic'),human=rows(manualChecks,manual,'manual'),all=[...auto,...human];
 sourceHash=typeof sourceHash==='string'&&/^[a-f0-9]{64}$/.test(sourceHash)?sourceHash:'';
 const status=all.some(x=>x.status==='fail')?'fail':sourceHash&&all.every(x=>x.status==='pass')?'recorded-pass':'pending';
 return {kind:'secondary-mathquiz-acceptance',schema:1,prototypeVersion:acceptanceVersion,run,at,sourceHash,status,
  environment,automatic:auto,manual:human,independentCurriculumReview:false,classroomReview:false,
  scope:'Browser workflow measurements plus reviewer-recorded observations. A saved report does not independently certify curriculum, translation or classroom readiness.'};
}
