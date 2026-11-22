import {generate,makeItems} from '../math/registry.mjs';
import {mark} from '../math/exact.mjs';
import {canonical} from '../papers/paper.mjs';
const sessionSeed=s=>typeof s==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,59}$/.test(s);
export function createSession(ids,seed,mode='practice',count=6){
 if(!['practice','check','learn'].includes(mode))throw new Error('Invalid session mode.');
 if(!sessionSeed(seed))throw new Error('Invalid session seed.');
 const session={schema:1,id:'session-'+seed,mode,seed,index:0,createdAt:new Date().toISOString(),completedAt:null,
  items:makeItems(ids,seed,count),responses:Array.from({length:count},()=>({input:'',reason:'',hint:false,solution:false,priorExposure:false,attempts:[],manualReview:null}))};
 if(mode==='learn')session.workedExample=generate(session.items[0].id,seed+':worked-example');
 return session;
}
export function workedExample(session){return session.workedExample||generate(session.items[0].id,session.seed+':worked-example',session.items[0].version);}
export function avoidExposedExamples(session,previous=[],extraExposed=[]){
 const signature=q=>q.exposureKey||q.id+':'+q.math,seen=new Set(extraExposed.map(signature));
 for(const old of previous){old.items.forEach((q,i)=>{const r=old.responses[i];if(r.attempts.length||r.hint||r.solution)seen.add(signature(q));});if(old.mode==='learn')seen.add(signature(workedExample(old)));}
 if(session.mode==='learn')seen.add(signature(workedExample(session)));
 for(let i=0;i<session.items.length;i++){
  let q=session.items[i],tries=0;while(seen.has(signature(q))&&tries<40)q=generate(q.id,`${session.seed}:${i}:retry-${++tries}`,q.version);
  session.items[i]=q;session.responses[i].priorExposure=seen.has(signature(q));seen.add(signature(q));
 }
 return session;
}
export function setReason(session,index,value){
 const r=session.responses[index],text=String(value);if(text.length>2000)throw new Error('Use at most 2,000 characters for the reason.');
 if(text!==r.reason)r.manualReview=null;r.reason=text;
}
export function setAnswerDraft(session,index,value){
 const r=session.responses[index],text=String(value);if(text.length>200)throw Error('Use at most 200 characters for the answer.');
 if(text!==r.input)r.manualReview=null;r.input=text;
}
export function selfReviewReason(session,index){
 const q=session.items[index],r=session.responses[index];
 if(!q.manualReason||!r.solution||!r.attempts.length||!r.reason.trim()||r.input!==r.attempts.at(-1).input)throw new Error('Write a reason, record/check the current answer and compare the solution before self-reviewing.');
 r.manualReview='self';
}
export function answer(session,index,input){
 const response=session.responses[index],q=session.items[index];
 setAnswerDraft(session,index,input);if(response.manualReview&&response.attempts.at(-1)?.input!==response.input)response.manualReview=null;
 const result=mark(q.contract,input);
 response.input=String(input);
 if(!['empty','invalid','unsupported'].includes(result.status)){
  if(response.attempts.length>=100)response.attempts.splice(1,1); // Keep the original first attempt.
  response.attempts.push({...result,input:String(input),assisted:response.hint||response.solution,at:new Date().toISOString()});
 }
 return result;
}
export function evidenceSummary(session){
 const result={correct:0,attempted:0,independentCorrect:0,assisted:0,manualPending:0,selfReviewed:0,automaticTotal:session.items.filter(q=>q.contract.type!=='manual').length,manualSubmitted:0};
 session.responses.forEach((r,i)=>{
  const attempts=r.attempts||[],last=attempts.at(-1);if(last)result.attempted++;
  if(last?.status==='correct')result.correct++;
  if(last?.status==='manual')result.manualSubmitted++;
  if(r.hint||r.solution)result.assisted++;
  // Count only the first submitted, unrevealed answer as independent evidence.
  if(session.mode==='check'&&!r.priorExposure&&attempts[0]?.status==='correct'&&!attempts[0].assisted)result.independentCorrect++;
  if((session.items[i].manualReason||session.items[i].contract.type==='manual')&&last){if(r.manualReview==='self'&&r.reason.trim()&&r.input===last.input)result.selfReviewed++;else result.manualPending++;}
 });return result;
}
export function validateSession(s){
 if(!s||s.schema!==1||!sessionSeed(s.seed)||s.id!=='session-'+s.seed||!['practice','check','learn'].includes(s.mode))throw new Error('Unsupported session.');
 if(!Array.isArray(s.items)||!s.items.length||s.items.length>12||!Array.isArray(s.responses)||s.responses.length!==s.items.length)throw new Error('Invalid session size.');
 if(!Number.isInteger(s.index)||s.index<0||s.index>=s.items.length)throw new Error('Invalid saved question.');
 if(s.workedExample){const q=s.workedExample;if(s.mode!=='learn'||canonical(generate(s.items[0].id,s.seed+':worked-example',q.version))!==canonical(q))throw new Error('The worked-example snapshot does not match its declared version.');}
 for(let i=0;i<s.items.length;i++){
  const q=s.items[i],r=s.responses[i];if(canonical(generate(q.id,q.seed,q.version))!==canonical(q))throw new Error('The question snapshot does not match its declared version.');
  if(!r||typeof r.input!=='string'||r.input.length>200||typeof r.reason!=='string'||r.reason.length>2000||typeof r.hint!=='boolean'||typeof r.solution!=='boolean'||typeof r.priorExposure!=='boolean'||!Array.isArray(r.attempts)||r.attempts.length>100)throw new Error('Invalid response record.');
  if(r.manualReview!==null&&r.manualReview!=='self')throw new Error('Unsupported manual review label.');
  for(const a of r.attempts)if(!['correct','incorrect','wrong-form','manual'].includes(a.status)||typeof a.input!=='string'||a.input.length>200||typeof a.assisted!=='boolean'||typeof a.at!=='string')throw new Error('Invalid attempt.');
 }
 return s;
}
export function validateBackup(data){
 if(!data||data.kind!=='secondary-mathquiz-progress'||data.schema!==1||!data.profile)throw new Error('Choose a P1 progress backup (version 1).');
 const p=data.profile;
 if(typeof p.name!=='string'||p.name.length>40||!Array.isArray(p.sessions)||p.sessions.length>100||!Array.isArray(p.studied)||p.studied.length>100||p.studied.some(id=>typeof id!=='string'||id.length>100))throw new Error('Invalid profile backup.');
 p.sessions.forEach(validateSession);
 if(new Set(p.sessions.map(s=>s.id)).size!==p.sessions.length)throw new Error('Duplicate session identity.');
 return p;
}
