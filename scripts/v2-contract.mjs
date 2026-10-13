import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pages=['index.html','mesaitakip/index.html','mesaitakip/privacy/index.html','mesaitakip/terms/index.html','mesaitakip/support/index.html','mesaitakip/data-safety/index.html','safaksayar/index.html','safaksayar/privacy/index.html','safaksayar/terms/index.html','safaksayar/support/index.html','safaksayar/data-safety/index.html','safaksayar/community/index.html','safaksayar/delete-account/index.html'];
for(const page of pages){
 const html=read(page);
 assert.match(html,/<html lang="tr">/,page);
 assert.match(html,/<meta name="viewport"/,page);
 assert.match(html,/<title>[^<]+<\/title>/,page);
 assert.match(html,/href="\/v2\.css/,page);
 assert.match(html,/src="\/v2\.js/,page);
 assert.match(html,/<main id="main"/,page);
 assert.match(html,/rel="canonical"/,page);
 assert.doesNotMatch(html,/Mesai Pro|ŞafakSayar Plus|Your App Name|example\.com/,page);
 const route=page==='index.html'?'/':'/'+page.replace(/index\.html$/,'');
 assert(html.includes('href="https://yucelsonmez.com.tr'+route+'"'),page+' canonical');
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)){
  let target=match[1].replace(/^\//,'');
  if(target==='')target='index.html';
  if(target.endsWith('/'))target+='index.html';
  assert(fs.existsSync(path.join(root,target)),page+' missing resource '+target);
 }
}
assert.match(read('index.html'),/Mesai Pusulam/);
assert.match(read('index.html'),/ŞafakSayar/);
assert.match(read('mesaitakip/index.html'),/id6815601696/);
assert.match(read('mesaitakip/index.html'),/src="\/assets\/mesai-pusulam-icon\.png"/);
assert.match(read('index.html'),/src="\/assets\/mesai-pusulam-icon\.png"/);
assert.match(read('safaksayar/index.html'),/id6817507399/);
assert.match(read('safaksayar/privacy/index.html'),/AdMob/);
assert.match(read('safaksayar/delete-account/index.html'),/Hesap silme talebi gönder/);
assert.match(read('app-ads.txt'),/^google\.com, pub-[0-9]+, DIRECT, /);
assert.equal(read('CNAME').trim(),'yucelsonmez.com.tr');
assert.match(read('robots.txt'),/Sitemap: https:\/\/yucelsonmez\.com\.tr\/sitemap\.xml/);
for(const p of ['privacy.html','terms.html','support.html','delete-account.html','community.html','data-safety.html'])
 assert.match(read(p),/http-equiv="refresh"/,p+' redirect preserved');
console.log('V2 contract OK: '+pages.length+' canonical pages, names, linked assets and redirects.');
