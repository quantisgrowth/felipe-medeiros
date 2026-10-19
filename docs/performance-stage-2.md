# Performance stage 2

This stage addresses the remaining findings in PageSpeed report `lgtf8hsb0l`.

## Images

The two published JPEGs transferred about 643 KiB. Their responsive WebP
replacements total 74,788 bytes across four files; each visitor receives one
hero file and one about file according to viewport width. The legacy Supabase
URLs are mapped to these local files, so no database migration is required.

The Manager now creates `-small.webp` and `-large.webp` variants for every new
photo, stores the large URL in `site_settings`, and serves the paired file with
`srcset`. New uploads use a one-year cache because every path contains a UUID.
Hero photos are eager but low priority because the heading is the measured LCP;
the below-fold about photo is lazy-loaded.

## Stability, cache, and contrast

- Web fonts use `font-display: optional` to prevent a late swap on slow links.
- The desktop portrait is top-aligned, so title height no longer moves it.
- `/fonts/*` and `/images/*` receive a one-year immutable cache rule.
- Light-background eyebrow text has a calculated contrast ratio of 6.05:1.
- Muted foreground text on the light surface has a calculated ratio of 6.46:1.

The JavaScript opportunity remains lower priority: the measured TBT is 0 ms,
and forcing below-fold content out of the initial render could weaken SEO or
introduce new layout shifts. Reassess the bundle only after the published
font/image/cache changes are measured.
