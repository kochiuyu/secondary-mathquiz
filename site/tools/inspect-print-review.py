from pathlib import Path
from pypdf import PdfReader
import hashlib,json,re,unicodedata
root=Path(__file__).resolve().parents[1]
folder=root/'samples/print-review'
out=[]
specs={lang:json.loads((folder/f'{lang}_Specification.json').read_text(encoding='utf-8')) for lang in ['en','zh']}
assert specs['en']['items']==specs['zh']['items']
for lang,spec in specs.items():
    identity=hashlib.sha256(json.dumps(spec,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
    for kind in ['Student','Solutions']:
        path=folder/f'{lang}_{kind}.pdf'
        reader=PdfReader(path)
        text=[unicodedata.normalize('NFKC',page.extract_text() or '') for page in reader.pages]
        assert len(reader.pages)==3,(path.name,len(reader.pages))
        assert all(abs(float(p.mediabox.width)-595.276)<1 and abs(float(p.mediabox.height)-841.89)<1 for p in reader.pages)
        assert all(identity[:12] in t for t in text),(path.name,'paper identity')
        assert all(f'{i+1} / 3' in t for i,t in enumerate(text)),(path.name,'page numbering')
        assert re.findall(r'^\s*([1-6])\.', '\n'.join(text),re.M)==list('123456'),(path.name,'question numbering')
        assert all('\ufffd' not in t and '\u25a0' not in t for t in text),(path.name,'replacement glyph')
        marker='本機示例評分' if lang=='zh' else 'Local sample marking'
        assert (marker in '\n'.join(text))==(kind=='Solutions'),(path.name,'student/key separation')
        fonts=set()
        for page in reader.pages:
            for font in page['/Resources'].get('/Font',{}).values():
                f=font.get_object();fonts.add(str(f.get('/BaseFont',f.get('/Subtype','unknown'))))
        out.append({'file':path.relative_to(root).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'pages':3,'format':'A4','paperIdentity':identity,'fonts':sorted(fonts),'textAndNumberingChecks':'passed','visualInspection':'recorded separately in planning/print-review.md'})
(root/'planning/pdf-review.json').write_text(json.dumps({'date':'2026-11-22','method':'Chrome Save as PDF; pypdf read-only verification with NFKC normalization for CJK compatibility glyphs','files':out},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
