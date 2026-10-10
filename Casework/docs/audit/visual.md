# Audit: Visual Foundations (src/v2/content/tracks/visual.js)

All quoted contrast ratios were recomputed with the WCAG 2.x relative-luminance formula and are correct: white on #FF6B00 2.86, #DC2626 on #CC4400 1.01, white on #CC4400 4.78, #6B7280 4.83, #374151 10.31, #E5E7EB 1.24, #9CA3AF 2.54, #2563EB 5.17, white on #0057B7 6.89. The visual-02 blues have no hex values; Royal (6.89) matches #0057B7, and Navy 11.85 vs white with 1.24 vs #1F2937 is internally consistent.

## Per case

- visual-01 The Brand Orange: OK (2.86:1, 4.78:1, 1.01:1 verified; large-text definition 24px / 18.66px bold correct)
- visual-02 Five Shades of Blue: FIXED: inTheWild said Material Design "defines each interactive colour together with its hover and pressed states"; Material actually uses state layers. Reworded to Carbon hover/active tokens and Material state layers.
- visual-03 Red for Success: FIXED: inTheWild listed Material Design as using green for success; Material's colour roles have an error colour but no success colour. Replaced with IBM Carbon (with Atlassian and Polaris, both correct).
- visual-04 Red Fields Only: OK (8% of men / 1 in 12, WCAG 1.4.1 and 3.3.1, GOV.UK error pattern all correct)
- visual-05 Light and Airy: FIXED: sayIt called all four problems "too faint", but the status dot is a colour-only problem, not a faintness one. Reworded. Mock checked (see mock notes).
- visual-06 Just Invert It: FIXED: the "two sprints" estimate appeared in sayIt and the outcome but not in the situation (added to Jonas's line). The costly outcome mentioned "the tweet", which was never set up; changed to the feature request.
- visual-07 The Wellbeing Check-in: OK
- visual-08 Eleven Colours: FIXED: sayIt said "five colours plus Other covers 88%", but the top five alone are 88% (with Other it is 100%). Reworded.
- visual-09 Playfair Everywhere: OK (Playfair Display is designed for titling and headlines at larger sizes)
- visual-10 Tiny Type: OK (1.4.4 Resize Text 200%, 16px browser default, GOV.UK 19px body on large screens all correct; 3 + 1 = 4 of 6 testers consistent)
- visual-11 Wall of Text: OK (1.4.8 AAA 1.5 line spacing and 1.4.12 AA text spacing correct)
- visual-12 Seven Weights: OK (Material 3 type scale uses only Regular 400 and Medium 500: correct)
- visual-13 The Help Article: OK (1.4.8 AAA 80 characters and no justification, Bringhurst 45 to 75 characters, orange 24px heading failing 3:1 all correct). Mock note below.
- visual-14 Script in the Table: OK
- visual-15 Same Size Everywhere: OK (iOS Safari zooms inputs under 16px; iOS default Body style is 17pt; 16 x 0.8 = 12.8px matches "about 13px")
- visual-16 All Caps Urgency: FIXED: costly outcome said completion "stayed at 32%" when the baseline was 31%; now "barely moved, to 32%". Tinker research and GOV.UK block-capitals advice verified.
- visual-17 The 7px Padding: OK (1 + 7 = 8, 1 + 4 = 5 so 3px off: arithmetic correct)
- visual-18 Twelve Fields: FIXED: inTheWild named GitHub and Google Account settings specifically; rewritten as a general pattern to avoid an unverifiable, changeable product claim.
- visual-19 Three Card Paddings: OK
- visual-20 Margin or Padding: FIXED: sayIt quoted "40 overrides", a number that only exists in the costly outcome (leaks the result before it happens). Reworded.
- visual-21 Pixel for Pixel: OK. Mock note below.
- visual-22 Twenty-Three Values: OK
- visual-23 Cramped on Mobile: OK (327/343/359px and +16/+32px arithmetic correct; Material 16dp compact margins and iOS 16/20pt layout margins correct)
- visual-24 Cramped Button: FIXED: sayIt claimed "two applications missed their deadline", which only happens in the costly outcome. Replaced with the fact from the situation (accidental drafts). WCAG 2.5.8 / 2.5.5, Apple 44pt and Material 48dp verified.
- visual-25 Everything Is Important: OK
- visual-26 Z or F: OK (NN/g's F-pattern guidance described accurately)
- visual-27 Heavy on the Left: OK
- visual-28 Grids Are Boring: OK (Muller-Brockmann, Grid Systems in Graphic Design, 1981: correct; 3 x 6 = 18 hours consistent)
- visual-29 The Lost Button: FIXED: inTheWild named Slack, Notion and Figma pricing pages; pricing pages change often, so rewritten as a general SaaS pattern.
- visual-30 The Diagonal Stripe: OK
- visual-31 Fold Anxiety: FIXED: minor wording in the situation ("a 3,000-person customer company"). NN/g 2018 figure of 57% of viewing time above the fold verified.
- visual-32 Launch Week Review: OK (tiers defensible: two WCAG failures on key flows as must, two shoulds, two polish nices)

## Mock notes (src/v2/ui/mocks/visual.jsx, not edited)

- billing-settings (visual-05): all four hotspots and all decoys match the spec, and the decoy colours really pass. MISMATCH: `data-hotspot="status-dot"` is attached only to the first row's dot (green, "paid"). A player who taps the red "failed" dot, the most natural one to tap, will register a miss. The hotspot should cover the whole Status column or every dot.
- help-article (visual-13): hotspots present. MINOR: the mock is 560px wide with 11px text, so the "measure" paragraph runs roughly 90 to 100 characters per line, not the ~140 in the spec, and it is only two lines long. It still reads as long, but the problem is less obvious than intended; a wider or longer paragraph would make it clearer. The justified paragraph is only 210px wide and short, so the "rivers" are faint.
- profile-settings (visual-21): all four hotspots and decoys match. MINOR: the `label-gap` hotspot wraps only the Name and Email fields; the Job title label has the same 16px/16px problem but sits outside the hotspot, so tapping it counts as a miss.

## Summary

32 cases: 21 OK, 11 fixed, 0 flagged (the three mock issues above are for the engine team, not content decisions). No correct-answer ids were changed; every strong choice holds up.

Most important corrections:
1. visual-03: Material Design does not define a green success colour; the inTheWild example now cites systems that do.
2. visual-02: Material's hover and pressed states are state layers, not separate colour values; claim corrected.
3. visual-20 and visual-24: sayIt lines quoted results that only happen in the costly outcomes; replaced with facts from the situation.
4. visual-08 and visual-06: internal-consistency fixes (88% maths, the unexplained "two sprints" and "tweet").
5. visual-18 and visual-29: named-company claims rewritten as general patterns.

Validator: `node scripts/validate-content.mjs` reports 0 errors and 0 warnings for visual.js (strong-is-longest 32%).
