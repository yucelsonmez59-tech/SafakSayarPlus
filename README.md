# yucelsonmez.com.tr — V2 App Landing Design

**Site:** https://yucelsonmez.com.tr

**Deployment:** GitHub Pages / main / repository root. Existing CNAME and static hosting remain unchanged.

## Routes

- Home: `/`
- Mesai Pusulam: `/mesaitakip/`
- ŞafakSayar: `/safaksayar/`
- Legal, support, account deletion: all existing `/mesaitakip/*` and `/safaksayar/*` URLs preserved

Legacy redirect pages remain in place. The external `mesaitakip-privacy` GitHub Pages repository is not modified.

## Design

Visual direction inspired by Bohdan's `app-landing` (MIT): https://github.com/bohd4nx/app-landing

This is a dependency-free HTML/CSS/JS adaptation for the current branch-based GitHub Pages publishing setup, with violet accents, dotted grid, light/dark/system themes, responsive sections and individual product/legal pages.

Real application screenshots are intentionally not included yet. No fabricated customer reviews, ratings, install counts or subscription pricing.

## Transparency

Product names have been corrected; all official paths remain intact. Advertising, premium and data processing descriptions must remain consistent with *the particular released app version*, relevant SDKs and declarations in App Store Connect/Google Play Console. Website compliance does not itself guarantee approval.

The original `app-ads.txt`, Google verification, robots, sitemap, security contact and domain files remain intact.

## Quality

`npm test`: existing static validator plus V2 product/routes contract.
GitHub Actions runs tests on branch pushes and PRs.

## Deployment safety

Review the draft PR before merging. Merging to main switches the published design without changing the domain or old application URLs. Existing pages remain recoverable from Git history.

Mesai Pusulam uses its official original iOS 1024×1024 application icon, copied byte-for-byte from `mesai-pro/ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png` into `assets/mesai-pusulam-icon.png`. Screenshots remain unpopulated.
