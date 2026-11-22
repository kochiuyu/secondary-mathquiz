import {geometryScene,geometryTransform} from '../math/angle-geometry.mjs';
import {escape} from './math.mjs';
export function angleDiagram(question,lang='en'){
 const m=question.diagram.model,s=geometryScene(m),z=lang==='zh',move=p=>geometryTransform(p,m.rotation,m.reflected),polar=(a,t,r)=>[a[0]+r*Math.cos(t*Math.PI/180),a[1]+r*Math.sin(t*Math.PI/180)];
 const cloud=[...s.segments.flatMap(x=>[x.from,x.to]),...s.labels.map(x=>x.point),...s.arcs.flatMap(a=>[polar(a.center,(a.start+a.end)/2,a.radius+20)])].map(move);
 const xs=cloud.map(p=>p[0]),ys=cloud.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min(390/(maxX-minX||1),255/(maxY-minY||1));
 const project=p=>{const [x,y]=move(p);return [240+(x-(minX+maxX)/2)*scale,170-(y-(minY+maxY)/2)*scale];};
 const pos=p=>project(p).map(x=>x.toFixed(2)).join(' '),text=(p,label,cls='')=>{const [x,y]=project(p);return `<text x="${x.toFixed(2)}" y="${(y+6).toFixed(2)}" class="${cls}">${escape(label)}</text>`;};
 const segments=s.segments.map(a=>`<path d="M${pos(a.from)}L${pos(a.to)}" class="geometry-line" ${a.dashed?'stroke-dasharray="6 5"':''}/>`).join('');
 const arcs=s.arcs.map(a=>{const r=a.radius*scale,start=polar(a.center,a.start,a.radius),end=polar(a.center,a.end,a.radius),large=a.end-a.start>180?1:0,sweep=m.reflected?1:0;return `<path d="M${pos(start)}A${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} ${sweep} ${pos(end)}" class="geometry-arc"/>${text(polar(a.center,(a.start+a.end)/2,a.radius+21),a.label,'geometry-angle-label')}`;}).join('');
 const marks=s.parallel.map(a=>[0,8].map(offset=>{const c=polar(a.point,a.angle,offset),back=polar(c,a.angle+180,9),one=polar(back,a.angle+90,5),two=polar(back,a.angle-90,5);return `<path d="M${pos(one)}L${pos(c)}L${pos(two)}" class="geometry-parallel"/>`;}).join('')).join('');
 const right=s.markers.map(points=>`<path d="M${points.map(pos).join('L')}" class="geometry-arc"/>`).join('');
 const alternative=z?'角區域、點及直線以字母標示；完整的已知條件和所求角均見題目。只在已知或所作平行時標上平行記號，勿以外觀代替理由。':'Letters identify sectors, vertices and lines. The question gives the complete conditions and requested angle. Parallel marks appear only for a given or constructed parallel premise; appearance is not a reason.';
 return `<figure class="angle-figure"><svg class="angle-geometry" viewBox="0 0 480 340" role="img" aria-label="${escape(alternative)}">${segments}${right}${marks}${arcs}${s.labels.map(l=>text(l.point,l.text,'geometry-point-label')).join('')}</svg><figcaption>${alternative}</figcaption></figure>`;
}
