import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {acceptanceApp,acceptanceVersion,acceptanceFaultApp} from '../qa/core.mjs';
const root=new URL('../',import.meta.url),source=fs.readFileSync(new URL('Secondary_MathQuiz_Prototype.html',root),'utf8');
const app=acceptanceApp(source);
// Version the runner URL so GitHub Pages/browser caching cannot retain an older test script.
const coreHash=createHash('sha256').update(fs.readFileSync(new URL('qa/core.mjs',root))).digest('hex').slice(0,12);
const runnerFile=new URL('qa/runner.mjs',root),runnerSource=fs.readFileSync(runnerFile,'utf8').replace(/from '\.\/core\.mjs(?:\?v=[^']*)?'/,`from './core.mjs?v=${coreHash}'`);
fs.writeFileSync(runnerFile,runnerSource);
const runnerHash=createHash('sha256').update(runnerSource).digest('hex').slice(0,12);
const runnerIndex=new URL('qa/index.html',root),indexHTML=fs.readFileSync(runnerIndex,'utf8');
fs.writeFileSync(runnerIndex,indexHTML.replace(/src="runner\.mjs(?:\?v=[^"]*)?"/,`src="runner.mjs?v=${runnerHash}"`));
const printIndex=new URL('qa/print.html',root);
if(fs.existsSync(printIndex)){
 const printHash=createHash('sha256').update(fs.readFileSync(new URL('qa/print-review.mjs',root))).digest('hex').slice(0,12);
 const sourceHash=createHash('sha256').update(source).digest('hex').slice(0,12);
 const printHTML=fs.readFileSync(printIndex,'utf8').replace(/src="print-review\.mjs(?:\?v=[^"]*)?"/,`src="print-review.mjs?v=${printHash}"`).replace(/href="(\.\.\/samples\/pilot-review\/[^"?]+\.html)(?:\?build=[^"]*)?"/g,`href="$1?build=${sourceHash}"`);
 fs.writeFileSync(printIndex,printHTML);
}
fs.writeFileSync(new URL('qa/app.html',root),app);
for(const mode of ['denied','quota'])fs.writeFileSync(new URL('qa/'+mode+'.html',root),acceptanceFaultApp(source,mode));
const script=app.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
if(!script)throw new Error('Acceptance copy has no application module.');
fs.writeFileSync(new URL('tests/acceptance-syntax.mjs',root),script);
fs.writeFileSync(new URL('qa/build.json',root),JSON.stringify({prototypeVersion:acceptanceVersion,sourceHash:createHash('sha256').update(source).digest('hex'),changes:['isolated test-storage namespace','relative source-document links'],browserExecution:'not performed'},null,2)+'\n');
console.log('Prepared /qa/index.html and its isolated application copy. Browser checks have not been run.');
