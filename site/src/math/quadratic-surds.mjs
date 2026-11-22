// Opt-in exact quadratic surds. No decimal tolerance and no learner-code execution.
// This module is deliberately not wired into learner questions until the Unit 4 release.
import {Q,InputError} from './exact.mjs';

export const SURD_CONTRACT_VERSION=1;
const surdLimits=Object.freeze({characters:160,tokens:80,depth:12,terms:8,radicand:1000000,rootComponent:10000});
const surdMessages={
 empty:['Enter an answer.','請輸入答案。'],
 syntax:['Check the numbers, operators and brackets. Use sqrt(2) for a square root.','請檢查數字、運算符號及括號。平方根可輸入為 sqrt(2)。'],
 syntaxScope:['Use numbers, +, -, *, /, brackets and sqrt(...). Variables, powers and nested roots are not supported here.','請使用數字、+、-、*、/、括號及 sqrt(...)。這裏不支援變數、乘方或巢狀根式。'],
 size:['This expression exceeds the supported exact-arithmetic limits.','這個算式超出了精確運算的支援範圍。'],
 negativeRoot:['A real square root needs a nonnegative radicand.','在實數範圍內，被開方數不能是負數。'],
 zeroDivisor:['Division by zero is undefined.','除數不能是零。'],
 divisorScope:['Use a nonzero single-term divisor; binomial denominators are outside this checker.','除數須為非零的單項式；這個檢查器不處理二項式分母。'],
 contract:['This exact-surd question needs a supported contract and version.','這道精確根式題的答案設定或版本不受支援。'],
 form:['The value is correct. Simplify the surds, collect like terms and use reduced coefficients with rational denominators.','數值正確。請化簡根式、合併同類根式，並把係數約至最簡及使用有理數分母。']
};
class SurdInputError extends InputError {
 constructor(key,code='unsupported'){super(surdMessages[key][0],code);this.key=key;}
}
function surdFail(key,code){throw new SurdInputError(key,code);}
function surdGcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function surdSquareParts(n){
 if(!Number.isSafeInteger(n)||n<1||n>surdLimits.radicand)surdFail('size');
 let outside=1,inside=1;
 for(let p=2;p*p<=n;p++){
  let exponent=0;while(n%p===0){n/=p;exponent++;}
  outside*=p**Math.floor(exponent/2);if(exponent%2)inside*=p;
 }
 if(n>1)inside*=n;
 return {outside,inside};
}
function surdProductParts(a,b){
 // a and b are already squarefree, so their gcd is exactly the extracted factor.
 const outside=surdGcd(a,b),inside=(a/outside)*(b/outside);
 if(inside>surdLimits.radicand)surdFail('size');
 return {outside,inside};
}
function surdCopyQ(q){if(!(q instanceof Q))surdFail('size');return new Q(q.n,q.d);}
function surdCanonicalInteger(text,signed=false){
 if(typeof text!=='string')return false;
 const magnitude=signed&&text.startsWith('-')?text.slice(1):text;
 return (/^[1-9]\d{0,59}$/.test(magnitude)||magnitude==='1'+'0'.repeat(60))&&(signed||!text.startsWith('-'));
}

export class QuadraticSurd {
 #terms;
 constructor(entries=[]){
  if(!Array.isArray(entries)||entries.length>64)surdFail('size');
  const terms=new Map();
  for(const entry of entries){
   if(!Array.isArray(entry)||entry.length!==2)surdFail('size');
   const [d,coefficient]=entry,{outside,inside}=surdSquareParts(d);
   const c=surdCopyQ(coefficient).mul(new Q(outside)).add(terms.get(inside)||new Q(0));
   if(c.n)terms.set(inside,c);else terms.delete(inside);
  }
  if(terms.size>surdLimits.terms)surdFail('size');
  this.#terms=new Map([...terms].sort(([a],[b])=>a-b));
 }
 static rational(q){return new QuadraticSurd([[1,surdCopyQ(q)]]);}
 static root(q){
  q=surdCopyQ(q);
  if(q.n<0n)surdFail('negativeRoot','invalid');
  if(q.n>BigInt(surdLimits.rootComponent)||q.d>BigInt(surdLimits.rootComponent)||q.n*q.d>BigInt(surdLimits.radicand))surdFail('size');
  if(!q.n)return new QuadraticSurd();
  const {outside,inside}=surdSquareParts(Number(q.n*q.d));
  return new QuadraticSurd([[inside,new Q(BigInt(outside),q.d)]]);
 }
 entries(){return [...this.#terms].map(([d,c])=>[d,surdCopyQ(c)]);}
 rationalValue(){if(!this.#terms.size)return new Q(0);return this.#terms.size===1&&this.#terms.has(1)?surdCopyQ(this.#terms.get(1)):null;}
 add(other){return new QuadraticSurd([...this.entries(),...other.entries()]);}
 neg(){return new QuadraticSurd(this.entries().map(([d,c])=>[d,c.neg()]));}
 mul(other){
  const entries=[];
  for(const [d,c] of this.#terms)for(const [e,k] of other.#terms){
   const {outside,inside}=surdProductParts(d,e);entries.push([inside,c.mul(k).mul(new Q(outside))]);
  }
  return new QuadraticSurd(entries);
 }
 div(other){
  if(!other.#terms.size)surdFail('zeroDivisor','invalid');
  if(other.#terms.size!==1)surdFail('divisorScope');
  const [[e,k]]=other.#terms;
  const entries=[];
  for(const [d,c] of this.#terms){
   const {outside,inside}=surdProductParts(d,e);
   entries.push([inside,c.mul(new Q(outside)).div(k.mul(new Q(e)))]);
  }
  return new QuadraticSurd(entries);
 }
 eq(other){return this.#terms.size===other.#terms.size&&[...this.#terms].every(([d,c])=>other.#terms.has(d)&&c.eq(other.#terms.get(d)));}
 toJSON(){return [...this.#terms].map(([radicand,c])=>({radicand,n:String(c.n),d:String(c.d)}));}
 static fromJSON(data){
  if(!Array.isArray(data)||data.length>surdLimits.terms)surdFail('contract');
  let previous=0;const entries=[];
  for(const term of data){
   if(!term||Object.keys(term).sort().join(',')!=='d,n,radicand'||!Number.isSafeInteger(term.radicand)||term.radicand<=previous||term.radicand>surdLimits.radicand||!surdCanonicalInteger(term.n,true)||!surdCanonicalInteger(term.d))surdFail('contract');
   if(surdSquareParts(term.radicand).outside!==1)surdFail('contract');
   const c=new Q(term.n,term.d);if(String(c.n)!==term.n||String(c.d)!==term.d)surdFail('contract');
   entries.push([term.radicand,c]);previous=term.radicand;
  }
  return new QuadraticSurd(entries);
 }
}

function surdLiteral(text){
 if(text.replace('.','').length>12)surdFail('size');
 const [whole,fraction='']=text.split('.');return new Q(BigInt((whole||'0')+fraction),10n**BigInt(fraction.length));
}
function surdParseTree(input){
 const raw=String(input);if(raw.length>surdLimits.characters)surdFail('size');
 const text=raw.normalize('NFKC').replace(/[−–﹣]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/√/g,'sqrt').trim();
 if(!text)surdFail('empty','empty');
 if(text.length>surdLimits.characters)surdFail('size');
 const tokens=text.match(/sqrt|(?:\d+(?:\.\d*)?|\.\d+)|[+*/()\-]|\S/g)||[];
 if(tokens.length>surdLimits.tokens)surdFail('size');
 for(const token of tokens)if(!/^(?:sqrt|\d+(?:\.\d*)?|\.\d+|[+*/()\-])$/.test(token))surdFail('syntaxScope');
 let position=0,depth=0,inRoot=false;
 const peek=()=>tokens[position],take=()=>tokens[position++];
 function guarded(make){if(++depth>surdLimits.depth)surdFail('size');const node=make();depth--;return node;}
 function atom(){
  const token=take();
  if(token==='(')return guarded(()=>{const child=sum();if(take()!==')')surdFail('syntax','invalid');return {kind:'group',child,value:child.value};});
  if(token==='sqrt'){
   if(inRoot)surdFail('syntaxScope');
   if(take()!=='(')surdFail('syntax','invalid');
   return guarded(()=>{
    inRoot=true;const child=sum();inRoot=false;
    if(take()!==')')surdFail('syntax','invalid');
    const rational=child.value.rationalValue();if(rational===null)surdFail('syntaxScope');
    return {kind:'root',child,value:QuadraticSurd.root(rational)};
   });
  }
  if(token&&/^(?:\d|\.)/.test(token)){const q=surdLiteral(token);return {kind:'literal',q,value:QuadraticSurd.rational(q)};}
  surdFail('syntax','invalid');
 }
 function unary(){
  if(peek()==='+'||peek()==='-')return guarded(()=>{const sign=take(),child=unary();return {kind:'unary',sign,child,value:sign==='-'?child.value.neg():child.value};});
  return atom();
 }
 function product(){
  let left=unary();
  while(peek()==='*'||peek()==='/'||implicitProduct()){
   const op=peek()==='*'||peek()==='/'?take():'*',right=unary();
   left={kind:'binary',op,left,right,value:op==='*'?left.value.mul(right.value):left.value.div(right.value)};
  }
  return left;
 }
 function implicitProduct(){return peek()==='('||peek()==='sqrt';}
 function sum(){
  let left=product();
  while(peek()==='+'||peek()==='-'){
   const op=take(),right=product();left={kind:'binary',op,left,right,value:left.value.add(op==='-'?right.value.neg():right.value)};
  }
  return left;
 }
 const tree=sum();if(position!==tokens.length)surdFail('syntax','invalid');return tree;
}
function surdUnwrap(node){while(node.kind==='group')node=node.child;return node;}
function surdRationalAtom(node){
 node=surdUnwrap(node);
 if(node.kind==='literal')return node.q;
 if(node.kind==='unary'){const q=surdRationalAtom(node.child);return q&&(node.sign==='-'?q.neg():q);}
 if(node.kind==='binary'&&node.op==='/'){
  const a=surdUnwrap(node.left),b=surdUnwrap(node.right),n=surdRationalAtom(a),d=surdRationalAtom(b);
  if(!n||!d||n.d!==1n||d.d!==1n||d.n<=1n||a.kind==='binary'||b.kind==='binary')return null;
  const q=n.div(d);return q.n===n.n&&q.d===d.n?q:null;
 }
 return null;
}
function surdSimpleTerm(node){
 node=surdUnwrap(node);
 if(node.kind==='unary'){const term=surdSimpleTerm(node.child);return term&&{d:term.d,c:node.sign==='-'?term.c.neg():term.c};}
 const rational=surdRationalAtom(node);if(rational)return {d:1,c:rational};
 if(node.kind==='root'){
  const child=surdUnwrap(node.child);
  if(child.kind!=='literal'||child.q.d!==1n||child.q.n<=1n)return null;
  const d=Number(child.q.n);return surdSquareParts(d).outside===1?{d,c:new Q(1)}:null;
 }
 if(node.kind==='binary'&&node.op==='*'){
  const a=surdRationalAtom(node.left),b=surdRationalAtom(node.right);
  const radical=a?surdSimpleTerm(node.right):b?surdSimpleTerm(node.left):null;
  if(!radical||radical.d===1||!radical.c.eq(new Q(1)))return null;
  return {d:radical.d,c:a||b};
 }
 if(node.kind==='binary'&&node.op==='/'){
  const term=surdSimpleTerm(node.left),denominator=surdUnwrap(node.right);
  if(!term||term.d===1||term.c.d!==1n||denominator.kind!=='literal'||denominator.q.d!==1n||denominator.q.n<=1n)return null;
  const c=term.c.div(denominator.q);return c.n===term.c.n&&c.d===denominator.q.n?{d:term.d,c}:null;
 }
 return null;
}
function surdTreeIsSimplest(tree){
 const terms=[];
 function visit(node,sign=1){
  node=surdUnwrap(node);
  if(node.kind==='unary')return visit(node.child,node.sign==='-'?-sign:sign);
  if(node.kind==='binary'&&(node.op==='+'||node.op==='-'))return visit(node.left,sign)&&visit(node.right,node.op==='-'?-sign:sign);
  const term=surdSimpleTerm(node);if(!term)return false;
  terms.push({d:term.d,c:sign===-1?term.c.neg():term.c});return true;
 }
 if(!visit(tree))return false;
 if(terms.length===1&&!terms[0].c.n)return terms[0].d===1;
 const seen=new Set();return terms.every(({d,c})=>{if(!c.n||seen.has(d))return false;seen.add(d);return true;});
}
export function parseSurd(input){return surdParseTree(input).value;}
export function surdsEquivalent(a,b){return parseSurd(a).eq(parseSurd(b));}
export function markSurd(contract,input,lang='en'){
 const language=lang==='zh'?1:0;
 const resultError=e=>({status:e instanceof InputError?e.code:'unsupported',message:surdMessages[e.key||'size'][language]});
 let expected;
 try{
  if(!contract||contract.type!=='quadratic-surd'||contract.version!==SURD_CONTRACT_VERSION||typeof contract.answer!=='string'||(contract.form!==undefined&&contract.form!=='simplest'))surdFail('contract');
  expected=parseSurd(contract.answer);
  if(contract.canonical!==undefined&&!QuadraticSurd.fromJSON(contract.canonical).eq(expected))surdFail('contract');
 }catch{return {status:'unsupported',message:surdMessages.contract[language]};}
 try{
  const tree=surdParseTree(input);
  if(!tree.value.eq(expected))return {status:'incorrect'};
  if(contract.form==='simplest'&&!surdTreeIsSimplest(tree))return {status:'wrong-form',message:surdMessages.form[language]};
  return {status:'correct'};
 }catch(e){if(!(e instanceof InputError))throw e;return resultError(e);}
}
