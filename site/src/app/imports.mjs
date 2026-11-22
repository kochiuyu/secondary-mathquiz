import {validateBackup} from './session.mjs';
import {validatePaper} from '../papers/paper.mjs';

// A confirmation applies only to the fully validated copy and learner that were reviewed.
export function progressImportReview(){
 let pending=null;
 return {
  cancel(){pending=null;},
  review(data,profileId){
   pending=null;
   const candidate=validateBackup(structuredClone(data));
   if(candidate.paper)validatePaper(candidate.paper);
   pending={profileId,profile:candidate};
   return {sessions:candidate.sessions.length};
  },
  apply(current){
   const reviewed=pending;pending=null;
   if(!reviewed||reviewed.profileId!==current.id)throw new Error('Review this backup for the selected learner before replacing any work.');
   const saved=reviewed.profile;
   return {...current,sessions:structuredClone(saved.sessions),studied:structuredClone(saved.studied),paper:saved.paper?structuredClone(saved.paper):null};
  }
 };
}
