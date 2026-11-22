from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[1];site=root/'site'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
assert read(root/'evidence/validation.json')['result']=='passed for stated design/sample scope'
assert read(site/'tests/results.json')['exitCode']==0
release=read(root/'evidence/angles-implementation.json')
digest=hashlib.sha256((site/'Secondary_MathQuiz_Prototype.html').read_bytes()).hexdigest()
assert digest==read(site/'qa/build.json')['sourceHash']==release['portable_source_sha256']
# Workflow passes are separate from manual/independent acceptance.
# Match current source evidence; do not reuse earlier-topic browser passes.
assert release['state']=='implemented-author-draft; hosted browser workflows passed; independent review pending'
browser=read(site/'planning/browser-hosted-angles-run.json')
assert browser['sourceHash']==digest and len(browser['automatic'])==21 and all(r['status']=='pass' for r in browser['automatic'])
assert release['automated']=={'tests':59,'pass':59,'fail':0,'new_angle_seed_cases':1800,'geometry_render_cases':480}
assert len(read(site/'curriculum/catalogue.json')['records'])==237
assert all((site/'samples/signed'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
assert all((site/'samples/expressions'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
assert all((site/'samples/equations'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
assert all((site/'samples/angles'/f'{lang}_{label}.html').is_file() for lang in ['en','zh'] for label in ['Student','Solutions'])
excluded={'manifest.json','bundle-syntax.mjs','acceptance-syntax.mjs','Review_P1.cmd'}
files=[p for p in sorted(root.rglob('*')) if p.is_file() and '__pycache__' not in p.parts and p.name not in excluded]
manifest={'version':'0.9.0','state':'four-topic implementation draft; hosted browser workflows pass; independent review pending','portable_source_sha256':digest,'files':[{'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
archive=root.parent/'Secondary_MathQuiz_P2_Angles_Hosted_v1.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files+[root/'manifest.json']:z.write(p,'Secondary_MathQuiz_P2/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'archive':str(archive),'bytes':archive.stat().st_size,'files':len(files)+1,'node_checks':59,'browser_workflows':21,'status':'public author draft; workflows passed; manual acceptance incomplete'}))
