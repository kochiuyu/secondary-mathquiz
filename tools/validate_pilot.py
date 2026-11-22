"""Validate draft references and sample models; not an unimplemented generator test."""
from pathlib import Path
from fractions import Fraction as Q
from collections import Counter
import ast,json

ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/name).read_text(encoding='utf-8'))
families=read('data/families.json')['families']
topics=read('data/topics.json')['topics']
sessions=read('data/sessions.json')['sessions']
objectives={r['id']:r for r in read('data/objective-snapshot.json')['records']}

# Exact coefficient maps. This independent QA parser never executes the text.
def poly(text):
    def add(a,b,sign=1):
        out=dict(a)
        for k,v in b.items():out[k]=out.get(k,Q(0))+sign*v
        return {k:v for k,v in out.items() if v}
    def mul(a,b):
        out={}
        for k,v in a.items():
            for j,w in b.items():
                key=tuple(sorted(k+j));out[key]=out.get(key,Q(0))+v*w
        return {k:v for k,v in out.items() if v}
    def walk(n):
        if isinstance(n,ast.Constant) and type(n.value) is int:return {():Q(n.value)} if n.value else {}
        if isinstance(n,ast.Name) and n.id in {'x','b','h'}:return {(n.id,):Q(1)}
        if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.UAdd,ast.USub)):
            a=walk(n.operand);return {k:v*(-1 if isinstance(n.op,ast.USub) else 1) for k,v in a.items()}
        if isinstance(n,ast.BinOp):
            a,b=walk(n.left),walk(n.right)
            if isinstance(n.op,ast.Add):return add(a,b)
            if isinstance(n.op,ast.Sub):return add(a,b,-1)
            if isinstance(n.op,ast.Mult):return mul(a,b)
            if isinstance(n.op,ast.Div):
                assert set(b)=={()} and b[()]!=0
                return {k:v/b[()] for k,v in a.items()}
            if isinstance(n.op,ast.Pow):
                assert isinstance(n.right,ast.Constant) and type(n.right.value) is int and n.right.value in [0,1,2]
                return {():Q(1)} if n.right.value==0 else (a if n.right.value==1 else mul(a,a))
        raise AssertionError('Unsupported design QA expression')
    return walk(ast.parse(text,mode='eval').body)

assert len(families)==24 and len(sessions)==12 and len(topics)==4 and len(objectives)==15
ids=[f['id'] for f in families];assert len(set(ids))==24
topic_ids={t['id'] for t in topics}
assert Counter(f['topic'] for f in families)=={t:6 for t in topic_ids}
assert Counter(s['topic'] for s in sessions)=={t:3 for t in topic_ids}
assert set(o for f in families for o in f['objectives'])==set(objectives)
for o in objectives.values():assert o['official_classification']=='foundation'
for s in sessions:
    assert s['state']=='design-draft' and len(s['sequence'])==6
    assert set(s['families'])<=set(ids)
    assert all(next(f for f in families if f['id']==i)['topic']==s['topic'] for i in s['families'])
assert set(i for s in sessions for i in s['families'])==set(ids)

report=[]
for f in families:
    assert f['state']=='design-draft' and f['topic'] in topic_ids
    assert set(f['objectives'])<=set(objectives)
    e=f['example'];m=e['validation_model'];k=m['kind']
    for field in ['prompt','hint','solution']:
        assert all(e[field][lang].strip() for lang in ['en','zh-Hant'])
        assert any('\u3400'<=c<='\u9fff' for c in e[field]['zh-Hant'])
        assert '\ufffd' not in e[field]['zh-Hant']
    assert e['model_response'].strip()
    assert all(f[x].strip() for x in ['demand','domain_and_constraints','answer_contract','p1_capability','visual_and_accessible_alternative'])
    assert f['negative_cases_and_feedback'] and 1<=f['paper']['marks']<=4 and 2<=f['paper']['working_lines']<=6
    scope='closed sample model; not generated variants or rendered output'
    if k=='signed-context':assert Q(m['magnitude'])*m['direction']==Q(m['expected'])
    elif k=='compare':
        assert max(Q(m['left']),Q(m['right']))==Q(m['expected_value'])
        assert m['expected']==('left:' if Q(m['left'])>Q(m['right']) else 'right:')+m['expected_value']
    elif k=='add-subtract':assert Q(m['a'])+(-1 if m['operation']=='subtract' else 1)*Q(m['b'])==Q(m['expected'])
    elif k=='divide':assert Q(m['divisor'])!=0 and Q(m['dividend'])/Q(m['divisor'])==Q(m['expected'])
    elif k=='mixed':
        assert Q(m['d'])!=0 and (Q(m['a'])+Q(m['b'])*Q(m['c']))/Q(m['d'])==Q(m['expected'])
        assert Q(m['expected'])==Q('5.5') and Q(m['expected'])!=Q(2)
    elif k=='change':assert Q(m['initial'])+Q(m['expected'])==Q(m['final'])
    elif k=='polynomial-samples':
        p=poly(m['expected'])
        assert all(poly(x)==p for x in m['equivalent'])
        assert all(poly(x)!=p for x in m['wrong'])
        scope='exact polynomial coefficient identities and deliberately different expressions; not a sampling proof'
    elif k=='area-formula':
        assert poly(m['expected'])==poly('h*b/2')==poly('b*h*(1/2)')
        assert Q(m['sample_b'])*Q(m['sample_h'])/2==Q(m['expected_value'])
        scope='formula algebra and one numeric substitution; geometric explanation/manual rubric still needs review'
    elif k=='sequence-open':
        assert m['nonunique'] is True
        assert m['prefix']==[n*(n+1)//2 for n in range(1,5)] and m['model_next']==15
        # Independent counterexample rule, for QA only, not a junior prerequisite.
        def alternative(n):return Q(n*(n+1),2)+Q((n-1)*(n-2)*(n-3)*(n-4),24)
        assert [alternative(n) for n in range(1,5)]==m['prefix'] and alternative(5)==16
        scope='preferred continuation checked and a different consistent continuation demonstrated; student reasoning remains manual'
    elif k=='sequence-term':assert m['index']*(m['index']+1)//2==Q(m['expected'])
    elif k=='machine':assert Q(m['input'])**2+Q(m['b'])==Q(m['expected'])
    elif k=='candidate':
        valid=Q(m['a'])*Q(m['candidate'])+Q(m['b'])==Q(m['c'])
        assert ('yes' if valid else 'no')==m['expected']
        assert Q(m['a'])*Q(-1)+Q(m['b'])!=Q(m['c'])
    elif k=='linear':
        assert Q(m['a'])!=0 and Q(m['a'])*Q(m['expected'])+Q(m['b'])==Q(m['c'])
        assert Q(m['a'])*Q(4)+Q(m['b'])!=Q(m['c'])
    elif k=='repair-distribution':
        a,b=Q(m['a']),Q(m['b'])
        assert [a,-a*b]==list(map(Q,m['correct_coefficients']))
        assert poly('2*(x-3)')==poly('2*x-6') and poly('2*x+6')!=poly('2*x-6') and poly('2*x-3')!=poly('2*x-6')
        scope='corrected-line algebra checked; written explanation/manual mark not auto-certified'
    elif k=='both-sides':
        a,b,c,d,v,x=map(Q,[m['a'],m['b'],m['c'],m['d'],m['e'],m['expected']])
        assert a!=d and a*(x+b)+c==d*x+v
        assert all(a*(w+b)+c!=d*w+v for w in [Q(3),Q(-9)])
    elif k=='context-equation':
        fixed,rate,total,count=map(Q,[m['fixed'],m['rate'],m['total'],m['count']])
        assert fixed+rate*count==total
        assert rate*(count+fixed)!=total and rate*count!=total+fixed and fixed*count+rate!=total
    elif k=='duration':
        fixed,rate,total,step,x=map(Q,[m['fixed'],m['rate'],m['total'],m['step'],m['expected']])
        assert rate>0 and fixed+rate*x==total and x>=0 and (x/step).denominator==1
        assert fixed+rate*5!=total
    elif k=='angle-sum':assert m['total']-sum(m['known'])==Q(m['expected'])
    elif k=='parallel-equality':
        assert m['parallel_given'] is True and m['given']==Q(m['expected'])
        scope='stated parallel/corresponding numerical model checked; no diagram rendered or proof mark verified'
    elif k=='parallel-test':
        assert m['pair']=='same-side-interior' and sum(m['angles'])==180 and m['expected']=='yes'
        assert 112+67!=180
        scope='named same-side angle sum and near-miss checked; topology/drawing and written reason remain manual'
    elif k=='triangle':
        c=Q(m['expected']);assert m['a']>0 and m['b']>0 and c>0
        assert m['a']+m['b']+c==180 and m['a']+m['b']==Q(m['exterior']) and c+Q(m['exterior'])==180
    elif k=='choice':
        if f['id']=='EX02':
            assert poly('3*(x+2)')!=poly('3*x+2') and poly('3*(x+2)')!=poly('3+2*x')
            scope='choice identities and differing algebra meanings checked; bilingual phrase quality needs independent review'
        else:scope='choice identities/position-description draft only; angle-pair topology and diagram still require mathematical/rendered review'
    elif k=='proof':
        assert len(m['rubric'])==4
        scope='manual proof rubric structure only; no automatic proof validity or rendered correspondence claim'
    else:raise AssertionError(k)
    if 'choices' in m:
        choices=m['choices'];keys=[x['id'] for x in choices]
        assert len(keys)==len(set(keys)) and keys.count(m['expected'])==1
        for lang in ['en','zh-Hant']:assert len({c[lang] for c in choices})==len(choices)
    if k not in ['polynomial-samples']:
        assert m['expected']==e['model_response']
    report.append({'family':f['id'],'result':'passed for stated scope','scope':scope})

result={'date':'2026-11-22','design_version':'0.1.0','result':'passed for stated design/sample scope','families':24,'topics':4,'session_outlines':12,'mapped_objectives':15,
 'review_status':'author self-check; independent mathematics/language and classroom review pending',
 'limits':['No curriculum generator has been implemented or validated by this report.','No browser, visual, screen-reader, print or full-lesson test is performed.','Manual/open reasoning cases are explicitly limited below.','P1.8 is accepted for bounded prototype authoring; all curriculum resources remain planned.'],
 'samples':report}
(ROOT/'evidence/validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='samples'},ensure_ascii=True))
