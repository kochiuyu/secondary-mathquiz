// Exact, bounded arithmetic. Learner input is parsed as data, never executed.
const abs = n => n < 0n ? -n : n;
function gcd(a,b) { a=abs(a); b=abs(b); while(b) [a,b]=[b,a%b]; return a || 1n; }
export class InputError extends Error { constructor(message,code='invalid') { super(message); this.code=code; } }
export class Q {
  constructor(n,d=1n) {
    n=BigInt(n); d=BigInt(d);
    if(!d) throw new InputError('Division by zero.');
    if(d<0n) {n=-n;d=-d;} const g=gcd(n,d);this.n=n/g;this.d=d/g;
    if(abs(this.n)>10n**60n || this.d>10n**60n) throw new InputError('The expression is too large.','unsupported');
  }
  add(b){return new Q(this.n*b.d+b.n*this.d,this.d*b.d);}
  neg(){return new Q(-this.n,this.d);}
  mul(b){return new Q(this.n*b.n,this.d*b.d);}
  div(b){return new Q(this.n*b.d,this.d*b.n);}
  eq(b){return this.n===b.n&&this.d===b.d;}
  toString(){return this.d===1n?String(this.n):`${this.n}/${this.d}`;}
}
const zero=()=>new Q(0), one=()=>new Q(1);
const poly=q=>[q,zero(),zero()];
function add(a,b){return a.map((v,i)=>v.add(b[i]));}
function neg(a){return a.map(v=>v.neg());}
function mul(a,b){
  const c=Array.from({length:5},zero);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)c[i+j]=c[i+j].add(a[i].mul(b[j]));
  if(c[3].n||c[4].n)throw new InputError('Only polynomials up to degree 2 are supported.','unsupported');
  return c.slice(0,3);
}
export function normalize(s){return String(s).normalize('NFKC').replace(/[−–﹣]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').trim();}
export function parse(text){
  const s=normalize(text);
  if(!s)throw new InputError('Enter an answer.','empty');
  if(s.length>160)throw new InputError('Use at most 160 characters.','unsupported');
  const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|x|[+*/()^\-]|\S/g)||[];
  if(tokens.length>80)throw new InputError('The expression is too complex.','unsupported');
  for(const t of tokens)if(!/^(?:\d+(?:\.\d*)?|\.\d+|x|[+*/()^\-])$/.test(t))throw new InputError('Use numbers, x, +, −, ×, /, brackets or powers 0–2.','unsupported');
  let i=0,depth=0;
  const peek=()=>tokens[i];
  const take=()=>tokens[i++];
  function atom(){
    if(++depth>12)throw new InputError('Too many nested brackets.','unsupported');
    const t=take();let a;
    if(t==='('){a=sum();if(take()!==')')throw new InputError('Close each bracket.');}
    else if(t==='x')a=[zero(),one(),zero()];
    else if(t&&/^(\d|\.)/.test(t)){
      if(t.replace('.','').length>12)throw new InputError('Use numbers with at most 12 digits.','unsupported');
      const [n,f='']=t.split('.');a=poly(new Q(BigInt((n||'0')+f),10n**BigInt(f.length)));
    }else throw new InputError('Check the expression near '+(t||'the end')+'.');
    if(peek()==='^'){take();const k=take();if(!['0','1','2'].includes(k))throw new InputError('Only powers 0, 1 and 2 are supported.','unsupported');if(k==='0'&&(a[1].n||a[2].n))throw new InputError('Variable zero powers need explicit domain handling.','unsupported');if(k==='0'&&!a[0].n&&!a[1].n&&!a[2].n)throw new InputError('Zero to the zero power is undefined.');a=k==='0'?poly(one()):k==='2'?mul(a,a):a;}
    depth--;return a;
  }
  function unary(){if(peek()==='+'){take();return unary();}if(peek()==='-'){take();if(++depth>12)throw new InputError('Too many signs.','unsupported');const v=neg(unary());depth--;return v;}return atom();}
  function product(){
    let a=unary();
    while(peek()==='*'||peek()==='/'||peek()==='x'||peek()==='('){
      const op=(peek()==='x'||peek()==='(')?'*':take();const b=unary();
      if(op==='/'){
        if(b[1].n||b[2].n)throw new InputError('Variable denominators require a different answer checker.','unsupported');
        a=a.map(v=>v.div(b[0]));
      }else a=mul(a,b);
    }
    return a;
  }
  function sum(){let a=product();while(peek()==='+'||peek()==='-'){const op=take(),b=product();a=add(a,op==='-'?neg(b):b);}return a;}
  const result=sum();if(i!==tokens.length)throw new InputError('Check the expression near '+peek()+'.');return result;
}
export function scalar(s){if(normalize(s).includes('x'))throw new InputError('Enter a numerical value, not a variable expression.','unsupported');const p=parse(s);if(p[1].n||p[2].n)throw new InputError('Enter a number, fraction or exact decimal.','unsupported');return p[0];}
export function equivalent(a,b){const x=parse(a),y=parse(b);return x.every((q,i)=>q.eq(y[i]));}
export function mark(contract,input){
  try{
    if(contract.type==='choice')return {status:input?input===contract.answer?'correct':'incorrect':'empty'};
    if(contract.type==='manual')return {status:String(input).trim()?'manual':'empty'};
    let text=normalize(input);
    if(contract.type==='number'){
      text=text.replace(/^x\s*=\s*/,'');if(contract.unit==='degree')text=text.replace(/°$/,'');
      if(!scalar(text).eq(scalar(contract.answer)))return {status:'incorrect'};
      if(contract.form==='number-literal'&&!/^(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)|[+-]?\d+\s*\/\s*[+-]?\d+)$/.test(text.trim()))return {status:'wrong-form'};
      return {status:'correct'};
    }
    if(contract.type==='expression'){
      if(!equivalent(text,contract.answer))return {status:'incorrect'};
      if(contract.form==='expanded'&&/[()]/.test(text))return {status:'wrong-form'};
      return {status:'correct'};
    }
    if(contract.type==='set'){
      const parts=text.replace(/^\{|\}$/g,'').split(/[,;]/).map(v=>v.trim());
      if(parts.some(v=>!v))throw new InputError('List every solution, separated by commas.');
      if(parts.length>8)throw new InputError('Too many solutions.','unsupported');
      const values=parts.map(v=>scalar(v).toString());const expected=contract.answers.map(v=>scalar(v).toString());
      return {status:values.length===expected.length&&new Set(values).size===values.length&&expected.every(v=>values.includes(v))?'correct':'incorrect'};
    }
    return {status:'unsupported',message:'This answer contract is not supported.'};
  }catch(e){if(e instanceof InputError)return {status:e.code,message:e.message};throw e;}
}
