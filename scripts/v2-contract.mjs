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
  "/mesai-pusulam/fazla-mesai-hesaplama/",
  "/mesai-pusulam/kidem-ihbar-tazminati-hesaplama/",
  "/safaksayar/",
  "/safaksayar/privacy/",
  "/safaksayar/terms/",
  "/safaksayar/support/",
  "/safaksayar/community/",
  "/safaksayar/data-safety/",
  "/safaksayar/delete-account/",
  "/cv-hazirla/",
  "/cv-hazirla/privacy/",
  "/cv-hazirla/terms/",
  "/cv-hazirla/support/",
  "/cv-hazirla/data-safety/"
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
assert.match(read('index.html'),/href="\/cv-hazirla\/"/);
assert.match(read('cv-hazirla/privacy/index.html'),/internete bağlanmaz/);
assert.match(read('cv-hazirla/data-safety/index.html'),/Data Not Collected/);
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
// Real Mesai Pusulam gallery must include exactly the eight committed assets.
const mesaiGallery=read('mesai-pusulam/index.html');
const galleryAssets=["/assets/01-genel-gorunum.webp","/assets/02-mesai-ekle.webp","/assets/03-izin-ve-rapor.webp","/assets/04-tahmini-odeme.webp","/assets/05-kazanc-ve-kesinti.webp","/assets/06-maas-gecmisi.webp","/assets/07-pdf-raporu.webp","/assets/08-yedekleme.webp"];
for(const asset of galleryAssets) {
 assert(mesaiGallery.includes('src="'+asset+'"'),'missing screenshot '+asset);
 assert(fs.existsSync(path.join(root,asset.slice(1))),'missing physical screenshot '+asset);
}
assert.equal((mesaiGallery.match(/class="mp-gallery-card"/g)||[]).length,8,'screenshot count must be eight');
assert(!mesaiGallery.includes('Gerçek ekranlar <span class=\'accent\'>yakında.'),'placeholder text remains');
assert(!mesaiGallery.includes('Ekran görüntüleri henüz eklenmedi'),'placeholder box remains');
assert(mesaiGallery.includes('id="mp-gallery-dialog"'),'screenshot lightbox missing');
assert(mesaiGallery.includes('href="/mesai-pusulam/gallery.css?v=1"'),'gallery styles missing');
assert(mesaiGallery.includes('src="/mesai-pusulam/gallery.js?v=1"'),'gallery behavior missing');
// Every Mesai Pusulam page offers the App Store Smart App Banner.
for(const page of realPaths.filter(p=>p.startsWith('mesai-pusulam/')))assert(read(page).includes('<meta name="apple-itunes-app" content="app-id=6815601696">'),page+' smart app banner');
assert(read('mesai-pusulam/index.html').includes('href="/mesai-pusulam/fazla-mesai-hesaplama/"'),'guide link missing');
assert(read('mesai-pusulam/index.html').includes('href="/mesai-pusulam/kidem-ihbar-tazminati-hesaplama/"'),'guide link missing');
console.log('Site contracts OK:',urls.length,'canonical URLs, 5 Mesai redirects, old root redirects, assets and policy links.');
