from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[1];site=root/'site'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
assert read(root/'evidence/validation.json')['result']=='passed for stated design/sample scope'
assert read(site/'tests/results.json')['exitCode']==0
release=read(root/'evidence/expressions-implementation.json')
digest=hashlib.sha256((site/'Secondary_MathQuiz_Prototype.html').read_bytes()).hexdigest()
assert digest==read(site/'qa/build.json')['sourceHash']==release['portable_source_sha256']
# This is a separate draft archive, not an accepted browser-verified release.
# Never reuse historical signed-number browser passes for the changed build.
assert release['state']=='implemented-author-draft; browser verification blocked'
browser=read(site/'planning/browser-expressions-blocked.json')
assert browser['source_sha256']==digest and browser['state']=='blocked-not-run' and browser['observed_pass']==0
assert release['automated']=={'tests':46,'pass':46,'fail':0,'new_expression_seed_cases':1800}
assert len(read(site/'curriculum/catalogue.json')['records'])==237
assert all((site/'samples/signed'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
assert all((site/'samples/expressions'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
excluded={'manifest.json','bundle-syntax.mjs','acceptance-syntax.mjs','Review_P1.cmd'}
files=[p for p in sorted(root.rglob('*')) if p.is_file() and '__pycache__' not in p.parts and p.name not in excluded]
manifest={'version':'0.7.0','state':'expressions implementation draft; current browser verification blocked; independent review pending','portable_source_sha256':digest,'files':[{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
archive=root.parent/'Secondary_MathQuiz_P2_Expressions_v1.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files+[root/'manifest.json']:z.write(p,'Secondary_MathQuiz_P2/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'archive':str(archive),'bytes':archive.stat().st_size,'files':len(files)+1,'node_checks':46,'browser_workflows':'blocked-not-run (15 planned)','status':'implementation draft; browser acceptance incomplete; not published'}))
