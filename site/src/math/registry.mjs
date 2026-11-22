import {families as fixtureFamilies,generate as generateFixture,FIXTURE_VERSION} from './fixtures.mjs';
import {curriculumFamilies,generateCurriculum} from './signed.mjs';
import {expressionFamilies,generateExpression} from './expressions.mjs';
import {equationFamilies,generateEquation} from './equations.mjs';
export {FIXTURE_VERSION};
export const families=[...curriculumFamilies,...expressionFamilies,...equationFamilies,...fixtureFamilies.map(f=>({...f,development:true}))];
export function generate(id,seed,version){
 return equationFamilies.some(f=>f.id===id)?generateEquation(id,seed,version??1):expressionFamilies.some(f=>f.id===id)?generateExpression(id,seed,version??1):curriculumFamilies.some(f=>f.id===id)?generateCurriculum(id,seed,version??1):generateFixture(id,seed,version??FIXTURE_VERSION);
}
export function makeItems(ids,seed,count=6){
 if(!Array.isArray(ids)||!ids.length||ids.some(id=>!families.some(f=>f.id===id))||!Number.isInteger(count)||count<1||count>12)throw Error('Choose 1–12 questions and at least one available set.');
 return Array.from({length:count},(_,i)=>generate(ids[i%ids.length],`${seed}:${i}`));
}
