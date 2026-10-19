# Font loading (performance stage 1)

Manrope (variable weights 400–800) and Libre Baskerville (normal/italic 400)
are served as WOFF2 from `public/fonts`. Latin and Latin Extended faces retain
Google Fonts' unicode ranges. Only the Latin Manrope and italic Libre files
are preloaded, matching the first-screen heading; other faces load on demand.
The two preloaded files total 46,140 bytes.

Source: Google Fonts CSS2, downloaded 2026-10-18:
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Manrope:wght@400..800&display=swap

The original font licenses are distributed beside the files. No system fonts
are distributed. The stylesheet is bundled with the application stylesheet;
there are no Google Fonts stylesheet or preconnect requests. Font files use
`font-display: optional`, so a slow connection does not trigger a late font
swap after the first layout. Preloading still makes the brand fonts available
for the first paint on normal connections.

Fallback aliases use locally installed Arial/Arial Bold and Georgia/Georgia
Italic. `size-adjust` is target normalized OS/2 x-height divided by fallback
normalized OS/2 x-height. Vertical overrides are target hhea ascent, absolute
descent and line gap divided by target units-per-em and that size adjustment.
Values were calculated from the shipped fonts and macOS system fallback fonts
using FontTools. Matching x-height/vertical metrics reduces movement but does
not guarantee identical line breaks. Devices without these local fonts use
the generic family and must be included in published performance validation.

Validation: production build, TypeScript check, six existing lead-form tests,
WOFF2 decoding, PT-BR glyph coverage and variable weight range. Visual QA:
home and products/services at desktop size; home and Manager login at mobile
size. No horizontal overflow was observed on the mobile home.

Published baseline: PageSpeed mobile report do079wpmb6, 2026-10-18:
performance 78, FCP 3.2 s, LCP 3.6 s, TBT 0 ms, CLS 0.150.
The first published follow-up (lgtf8hsb0l) reached performance 89, FCP 1.7 s,
LCP 2.6 s, TBT 0 ms and CLS 0.143 on mobile. Desktop CLS was 0.207. The report
still attributed the shifts to late web-font changes, so stage 2 changed the
display strategy and removed vertical centering from the desktop hero image.
Run three mobile and three desktop measurements after publication and compare
medians. Target CLS <= 0.10. Local checks are not a PageSpeed measurement.
