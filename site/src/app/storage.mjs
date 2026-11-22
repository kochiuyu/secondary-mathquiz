import {validateSession} from './session.mjs';
import {validatePaper} from '../papers/paper.mjs';
export const PREFIX='secondary-mathquiz:p2:';
export function freshProfile(id='learner-1',name='Learner 1'){return {schema:1,id,name,revision:0,sessions:[],paper:null,studied:[]};}
function validRegistry(v){return v?.schema===1&&Array.isArray(v.profiles)&&v.profiles.length>=1&&v.profiles.length<=10&&v.profiles.every(p=>p&&typeof p.id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(p.id)&&typeof p.name==='string'&&p.name.trim()&&p.name.length<=40)&&new Set(v.profiles.map(p=>p.id)).size===v.profiles.length&&v.profiles.some(p=>p.id===v.active);}
export function repository(storage){
 let volatile=false;
 const parse=(key)=>{try{const v=storage.getItem(key);return v?JSON.parse(v):null;}catch{volatile=true;return null;}};
 return {
  get volatile(){return volatile;},
  registry(){const v=parse(PREFIX+'profiles');if(v&&!validRegistry(v))volatile=true;return validRegistry(v)?v:{schema:1,active:'learner-1',profiles:[{id:'learner-1',name:'Learner 1'}]};},
  saveRegistry(value){
   try{
    if(!validRegistry(value))throw new Error('Invalid learner registry.');
    const raw=storage.getItem(PREFIX+'profiles'),remote=raw?JSON.parse(raw):null;
    if(remote&&!validRegistry(remote))throw new Error('The saved registry needs a supported version.');
    // Profiles can be added or selected here, never deleted: merge the latest known identities.
    const profiles=[...new Map([...(remote?.profiles||[]),...value.profiles].map(p=>[p.id,p])).values()],next={schema:1,active:value.active,profiles};
    if(!validRegistry(next))throw new Error('Use up to 10 learner profiles.');
    storage.setItem(PREFIX+'profiles',JSON.stringify(next));value.profiles=profiles;return true;
   }catch{volatile=true;return false;}
  },
  load(id,name){const v=parse(PREFIX+id);if(!v)return freshProfile(id,name);if(v.schema!==1||v.id!==id||typeof v.name!=='string'||!Number.isInteger(v.revision)||!Array.isArray(v.sessions)||v.sessions.length>100||!Array.isArray(v.studied))throw new Error('This saved profile needs a supported version. It has not been overwritten.');v.sessions.forEach(validateSession);if(v.paper)validatePaper(v.paper);return v;},
  save(profile){
   try{
    const key=PREFIX+profile.id,raw=storage.getItem(key),remote=raw?JSON.parse(raw):null;
    if(remote&&remote.revision!==profile.revision)return {ok:false,reason:'conflict'};
    const next={...profile,revision:profile.revision+1};storage.setItem(key,JSON.stringify(next));profile.revision=next.revision;return {ok:true};
   }catch{volatile=true;return {ok:false,reason:'unavailable'};}
  }
 };
}
