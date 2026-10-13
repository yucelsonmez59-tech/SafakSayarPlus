import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const urls=[
  "/",
  "/mesai-pusulam/",
  "/mesai-pusulam/privacy/",
  "/mesai-pusulam/terms/",
  "/mesai-pusulam/support/",
  "/mesai-pusulam/data-safety/",
  "/safaksayar/",
  "/safaksayar/privacy/",
  "/safaksayar/terms/",
  "/safaksayar/support/",
  "/safaksayar/community/",
  "/safaksayar/data-safety/",
  "/safaksayar/delete-account/"
];
const realPaths=urls.map(url=>url==='/'?'index.html':url.slice(1)+'index.html');

for(const [i,page] of realPaths.entries()){
 const html=read(page);
 assert.match(html,/<html lang="tr">/,page);
 assert.match(html,/<meta name="viewport"/,page);
 assert.match(html,/<title>[^<]+<\/title>/,page);
 assert.match(html,/href="\/v2\.css/,page);
 assert.match(html,/src="\/v2\.js/,page);
 assert.match(html,/<main id="main"/,page);
 assert.match(html,/rel="canonical"/,page);
 assert.doesNotMatch(html,/Mesai Pro|ŞafakSayar Plus|Your App Name|example\.com/,page);
 assert(!html.includes('/mesaitakip/'),page+' legacy link');
 assert(html.includes('href="https://yucelsonmez.com.tr'+urls[i]+'"'),page+' canonical');
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)){
  let target=match[1].replace(/^\//,'');
  if(target==='')target='index.html';
  if(target.endsWith('/'))target+='index.html';
  assert(fs.existsSync(path.join(root,target)),page+' missing resource '+target);
 }
}
const sitemap=read('sitemap.xml');
for(const uri of urls)assert(sitemap.includes('<loc>https://yucelsonmez.com.tr'+uri+'</loc>'),'missing sitemap '+uri);
assert(!sitemap.includes('/mesaitakip/'),'legacy sitemap URL');
assert.match(read('index.html'),/Mesai Pusulam/);
assert.match(read('mesai-pusulam/index.html'),/id6815601696/);
assert.match(read('mesai-pusulam/index.html'),/src="\/assets\/mesai-pusulam-icon\.png"/);
assert.match(read('index.html'),/src="\/assets\/mesai-pusulam-icon\.png"/);
assert.match(read('safaksayar/index.html'),/id6817507399/);
assert.match(read('safaksayar/privacy/index.html'),/AdMob/);
assert.match(read('safaksayar/delete-account/index.html'),/Hesap silme talebi gönder/);
assert.match(read('app-ads.txt'),/^google\.com, pub-[0-9]+, DIRECT, /);
assert.equal(read('CNAME').trim(),'yucelsonmez.com.tr');
assert.match(read('robots.txt'),/Sitemap: https:\/\/yucelsonmez\.com\.tr\/sitemap\.xml/);
for(const path of ['','privacy/','terms/','support/','data-safety/']){
 const old=read('mesaitakip/'+path+'index.html');
 const dest='/mesai-pusulam/'+path;
 assert(old.includes('content="0; url='+dest+'"'),'invalid old redirect '+path);
 assert(old.includes('href="https://yucelsonmez.com.tr'+dest+'"'),'missing redirect canonical '+path);
 assert(old.includes('name="robots" content="noindex'),'old route indexable '+path);
}
for(const p of ['privacy.html','terms.html','support.html','delete-account.html','community.html','data-safety.html'])assert.match(read(p),/http-equiv="refresh"/,p+' root redirect');
for(const obsolete of ['styles.css','portfolio.css','portfolio.js','script.js','mesaitakip/mesai.css','mesaitakip/mesai.js','assets/mesai-calendar.webp','assets/mesai-reports.webp','assets/mesai-settings.webp'])assert(!fs.existsSync(path.join(root,obsolete)),'old asset not removed: '+obsolete);
console.log('Site contracts OK:',urls.length,'canonical URLs, 5 Mesai redirects, old root redirects, assets and policy links.');
