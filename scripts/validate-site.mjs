import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ignoredDirs=new Set(['.git','node_modules']);
const files=[];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(ignoredDirs.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full); else files.push(path.relative(root,full).replaceAll('\\','/'));
  }
}
walk(root);

const fileSet=new Set(files);
const errors=[];
const warnings=[];
const htmlFiles=files.filter(f=>f.endsWith('.html'));
const cssFiles=files.filter(f=>f.endsWith('.css'));
const jsFiles=files.filter(f=>f.endsWith('.js'));

const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const stripQuery=s=>s.split('#')[0].split('?')[0];

function internalTarget(url){
  if(!url.startsWith('/')||url.startsWith('//')) return null;
  let clean=stripQuery(url);
  if(clean==='/') return 'index.html';
  clean=clean.replace(/^\//,'');
  if(clean.endsWith('/')) clean+='index.html';
  return clean;
}

for(const file of htmlFiles){
  const html=read(file);
  const redirect=/http-equiv=["']refresh["']/i.test(html);
  const is404=file==='404.html';

  if(!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${file}: <title> eksik`);
  if(!redirect&&!is404&&!/name=["']viewport["']/i.test(html)) errors.push(`${file}: viewport eksik`);
  if(!redirect&&!is404&&!/rel=["']canonical["']/i.test(html)) errors.push(`${file}: canonical eksik`);

  const ids=[...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m=>m[1]);
  const duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);
  for(const id of new Set(duplicateIds)) errors.push(`${file}: duplicate id #${id}`);

  for(const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{ JSON.parse(match[1]); } catch(error){ errors.push(`${file}: JSON-LD geçersiz — ${error.message}`); }
  }

  for(const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)){
    if(!/rel=["'][^"']*noopener/i.test(match[0])) errors.push(`${file}: target=_blank bağlantısında rel=noopener eksik`);
  }

  const attrs=[...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
  for(const url of attrs){
    if(url.startsWith('#')){
      const id=url.slice(1);
      if(id&&!ids.includes(id)) errors.push(`${file}: bulunamayan anchor ${url}`);
      continue;
    }
    const target=internalTarget(url);
    if(!target) continue;
    if(!fileSet.has(target)) errors.push(`${file}: bulunamayan iç kaynak ${url} -> ${target}`);
  }
}

function braceBalance(content){
  let depth=0,inString=null,escaped=false,inComment=false;
  for(let i=0;i<content.length;i++){
    const ch=content[i],next=content[i+1];
    if(inComment){ if(ch==='*'&&next==='/'){inComment=false;i++;} continue; }
    if(!inString&&ch==='/'&&next==='*'){inComment=true;i++;continue;}
    if(inString){
      if(escaped){escaped=false;continue;}
      if(ch==='\\'){escaped=true;continue;}
      if(ch===inString) inString=null;
      continue;
    }
    if(ch==='"'||ch==="'"){inString=ch;continue;}
    if(ch==='{') depth++;
    if(ch==='}') depth--;
    if(depth<0) return depth;
  }
  return depth;
}

for(const file of cssFiles){
  const balance=braceBalance(read(file));
  if(balance!==0) errors.push(`${file}: CSS brace dengesi bozuk (${balance})`);
}

for(const file of jsFiles){
  const source=read(file);
  try{ new Function(source); } catch(error){ errors.push(`${file}: JavaScript syntax — ${error.message}`); }
}

if(fileSet.has('site.webmanifest')){
  try{JSON.parse(read('site.webmanifest'));}catch(error){errors.push(`site.webmanifest: JSON geçersiz — ${error.message}`);}
}

if(fileSet.has('sitemap.xml')){
  const xml=read('sitemap.xml');
  const urls=[...xml.matchAll(/<loc>https:\/\/yucelsonmez\.com\.tr([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
  for(const url of urls){
    const target=internalTarget(url||'/');
    if(target&&!fileSet.has(target)) errors.push(`sitemap.xml: rota dosyası bulunamadı ${url} -> ${target}`);
  }
}

if(read('CNAME').trim()!=='yucelsonmez.com.tr') errors.push('CNAME beklenen domain ile eşleşmiyor');
if(!/Sitemap:\s*https:\/\/yucelsonmez\.com\.tr\/sitemap\.xml/i.test(read('robots.txt'))) warnings.push('robots.txt sitemap satırı kontrol edilmeli');

if(errors.length){
  console.error('\nSite validation FAILED\n');
  errors.forEach(e=>console.error('✗ '+e));
  if(warnings.length){console.error('\nWarnings');warnings.forEach(w=>console.error('! '+w));}
  process.exit(1);
}

console.log(`Site validation OK — ${htmlFiles.length} HTML, ${cssFiles.length} CSS, ${jsFiles.length} JS dosyası kontrol edildi.`);
warnings.forEach(w=>console.warn('! '+w));
