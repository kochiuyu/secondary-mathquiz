// Dependency-free packaging for a portable, file-openable prototype.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const full=JSON.parse(fs.readFileSync(path.join(root,'curriculum/objectives.json'),'utf8'));
const catalogue={schema_version:full.schema_version,records:full.records.map(r=>({id:r.id,stage:r.stage,unit:r.unit,unit_title:r.unit_title,official_reference:r.official_reference,official_classification:r.official_classification,classification_components:r.classification_components,description:r.description,suggested_route:r.suggested_route,prerequisites:{required:r.prerequisites.required},scope:{site_unit_boundary_summary:r.scope.site_unit_boundary_summary}}))};
fs.writeFileSync(path.join(root,'curriculum/catalogue.json'),JSON.stringify(catalogue));
const files=['src/math/exact.mjs','src/math/fixtures.mjs','src/math/signed.mjs','src/math/signed-feedback.mjs','src/math/expressions.mjs','src/math/equations.mjs','src/math/angle-geometry.mjs','src/math/angles.mjs','src/math/basic.mjs','src/math/registry.mjs','src/lessons/basic.mjs','src/lessons/signed.mjs','src/lessons/expressions.mjs','src/lessons/equations.mjs','src/lessons/angles.mjs','src/renderers/basic-diagrams.mjs','src/renderers/math.mjs','src/renderers/review.mjs','src/renderers/angles.mjs','src/renderers/equation-diagrams.mjs','src/renderers/number-line.mjs','src/renderers/expression-diagrams.mjs','src/app/basic-views.mjs','src/app/signed-views.mjs','src/app/expression-views.mjs','src/app/equation-views.mjs','src/app/angle-views.mjs','src/papers/paper.mjs','src/papers/render.mjs','src/app/storage.mjs','src/app/session.mjs','src/app/imports.mjs','src/app/app.mjs'];
let script=files.map(file=>{
 let source=fs.readFileSync(path.join(root,file),'utf8').replace(/^import .*?;\s*$/gm,'').replace(/^export \{[^}]*\};?\s*$/gm,'').replace(/^export /gm,'');
 if(file==='src/app/app.mjs')source='const esc=escape;\n'+source;
 return '// '+file+'\n'+source;
}).join('\n');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8').replace("@import url('src/papers/preview.css');",()=>fs.readFileSync(path.join(root,'src/papers/preview.css'),'utf8'));
const data=JSON.stringify(catalogue).replace(/</g,'\\u003c');
// Replacement callbacks preserve literal dollar signs in templates (notably
// "$${price}") rather than treating them as String.replace substitution tokens.
const html=fs.readFileSync(path.join(root,'shell.html'),'utf8').replace('<link rel="stylesheet" href="styles.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="src/app/app.mjs"></script>',()=>'<script type="application/json" id="embedded-curriculum">'+data+'</script>\n<script type="module">'+script.replace(/<\/script/gi,'<\\/script')+'</script>');
fs.writeFileSync(path.join(root,'Secondary_MathQuiz_Prototype.html'),html);
// Publish the complete app as one HTML artifact to avoid mixed cached module versions.
fs.writeFileSync(path.join(root,'index.html'),html);
fs.writeFileSync(path.join(root,'tests/bundle-syntax.mjs'),script);
console.log('Built Secondary_MathQuiz_Prototype.html ('+Buffer.byteLength(html)+' bytes)');
