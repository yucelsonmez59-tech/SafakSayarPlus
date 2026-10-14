# Yücel Sönmez — Mobile Apps Website

**Canonical website:** https://yucelsonmez.com.tr/  
**Source repository:** yucelsonmez59-tech/SafakSayarPlus  
**Hosting:** GitHub Pages, main branch, repository root, custom domain via CNAME

This is the **single canonical site source** for the developer homepage, **Mesai Pusulam** and **ŞafakSayar**.

## Canonical paths

| Section | Path |
|---|---|
| Homepage | `/` |
| Mesai Pusulam | `/mesai-pusulam/` |
| Mesai privacy | `/mesai-pusulam/privacy/` |
| Mesai terms | `/mesai-pusulam/terms/` |
| Mesai support | `/mesai-pusulam/support/` |
| Mesai data safety | `/mesai-pusulam/data-safety/` |
| ŞafakSayar | `/safaksayar/` |
| Şafak privacy | `/safaksayar/privacy/` |
| Şafak terms | `/safaksayar/terms/` |
| Şafak support | `/safaksayar/support/` |
| Şafak community | `/safaksayar/community/` |
| Şafak data safety | `/safaksayar/data-safety/` |
| Şafak account deletion | `/safaksayar/delete-account/` |

**Redirect compatibility only:** `/mesaitakip/` and its privacy, terms, support and data-safety paths are simple HTML redirects to the canonical Mesai Pusulam equivalents. Root legacy links like `/privacy.html` remain redirects, not duplicate documents. GitHub Pages does not provide editable HTTP 301 rules, so these are HTML meta redirects with `noindex` and canonical to their new destinations. Update external store links when editable; then these old compatibility routes can be retired later if desired.

## Clean source

Shared `v2.css` and `v2.js`, native static HTML and policy documents; no paid hosting, runtime backend, CMS, template mockup photos, fake reviews, or extra landing framework. Original Mesai Pusulam iOS icon and ŞafakSayar app icon are maintained. The Mesai Pusulam page displays eight product screenshots in a responsive gallery.

Original visual inspiration: Bohdan's `app-landing` under MIT. Attribution/license retained as `LICENSE-app-landing`.

## Compliance

App Store Connect and Google Play Console privacy, support and account-deletion URLs must be kept consistent with the released apps. Keep `app-ads.txt`, `CNAME`, Google Search Console verification, `robots.txt`, `sitemap.xml` and `/.well-known/security.txt` available. Disclosures are reviewed against SDKs/actual builds, and the site alone does not guarantee store approval.

## Tests

`npm test` runs both the built-in static link/HTML/JS/CSS checks and the canonical route/redirect contract tests. GitHub Actions runs checks for commits and pull requests. A successful build is not a substitute for a visual browser smoke test.

## Historical second website repo

The old `mesaitakip-privacy` GitHub Pages website is *not* the canonical site. It needs to remain a redirect only until app store or shared links no longer point to that GitHub Pages address. GitHub repo deletion is a separate destructive account-level operation, not part of the website deployment.
