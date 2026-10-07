# yucelsonmez.com.tr

Public static website for **Yücel Sönmez** plus the product, support and legal pages for **ŞafakSayar Plus** and **Mesai Pro**.

## Routes
- `/` — software developer portfolio
- `/safaksayar/` — ŞafakSayar Plus product page
- `/mesaitakip/` — Mesai Pro product page
- Existing privacy, terms, support, data-safety, community and account-deletion URLs remain stable.
- `/404.html` — shared not-found page
- `/.well-known/security.txt` — security contact

## Stack
Static semantic HTML, CSS and small dependency-free JavaScript. No runtime framework, web-font request or client-side analytics dependency.

## Quality checks
The repository includes a dependency-free static validator.

```bash
npm run validate
```

It checks internal links/assets, anchors, duplicate IDs, canonical/title basics, JSON-LD, `target="_blank"` safety, JavaScript syntax, CSS brace balance, manifest JSON, sitemap routes, CNAME and robots configuration.

The same validation runs on push and pull requests through `.github/workflows/site-quality.yml`.

## Deployment
GitHub Pages → `main` → repository root, with `CNAME` set to `yucelsonmez.com.tr`.

Public URLs are intentionally preserved.
