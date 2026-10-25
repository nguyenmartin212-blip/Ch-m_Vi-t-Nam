import fs from 'node:fs';
const raw = JSON.parse(fs.readFileSync('reference/site-observations.json', 'utf8'));
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const names = raw.entities.map(e=>e.name).sort((a,b)=>b.length-a.length);
const texts = s => [...s.matchAll(/^\s*\d+ text (.+)$/gm)].map(m=>m[1]);
const categories = ['Điểm đến','Di sản','Thiên nhiên','Ăn uống','Vui chơi','Làng nghề','Văn hóa','Trải nghiệm'];
const entities = raw.entities.map(e=>{
 const ts=texts(e.overview), meta=ts.find(t=>t.includes(' · MIỀN')) || '';
 const ci=ts.indexOf(e.name); const desc=ts[ci+1]||'';
 const category=categories.find(c=>meta.startsWith(c.toUpperCase()))||'Trải nghiệm';
 const region=meta.includes('MIỀN BẮC')?'north':meta.includes('MIỀN NAM')?'south':'central';
 const after = label => ts.includes(label)?ts[ts.indexOf(label)+1] || '':'';
 const relations=[...e.connections.matchAll(/^\s*\d+ button (.+) ›$/gm)].map(m=>{
  const name=names.find(n=>m[1].startsWith(n+' '));
  return name?{id:slug(name),label:m[1].slice(name.length+1)}:null;
 }).filter(Boolean);
 const sources=[]; let label='Nguồn tham chiếu';
 for(const line of e.sources.split('\n')){
  const h=line.match(/heading (.+), Value: 3/); if(h) label=h[1];
  const l=line.match(/link Description: Mở tài liệu gốc ↗, Value: (\S+)/); if(l) sources.push({label,url:l[1].startsWith('http')?l[1]:'https://'+l[1]});
 }
 const maps=e.overview.match(/Value: ((?:https?:\/\/)?(?:www\.)?(?:google\.[^\s]+|maps\.[^\s]+))/);
 const narrative=ts.filter(t=>t.length>125 && t!==desc && !t.startsWith('Thời lượng, mùa đi'));
 const placeType=after('Thông tin để lên kế hoạch'),address=after('Khu vực / địa chỉ tham khảo');
 return {id:slug(e.name),name:e.name,category,region,description:desc,tags:ts[ci+2]||'',placeType,address,duration:after('Thời lượng gợi ý · mẫu'),budget:after('Mức chi tiêu · mẫu'),relations,sources,narrative:[...new Set(narrative)],maps:maps?(maps[1].startsWith('http')?maps[1]:'https://'+maps[1]):null};
});
fs.writeFileSync('src/data/explore.json',JSON.stringify(entities,null,2));
console.log('Imported',entities.length,'entities;',entities.reduce((n,e)=>n+e.relations.length,0),'directed adjacency entries');
