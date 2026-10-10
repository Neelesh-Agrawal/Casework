# Audit: Systems Thinking (src/v2/content/tracks/systems.js)

Validator: `node scripts/validate-content.mjs` reports 0 errors and 0 warnings for systems.js (34 cases, 30 decisions, 4 hands-on, strong-is-longest 20%, strong ids A10/B10/C10). No correct choice id was changed.

## Per-case verdicts

- systems-01 Spot the Strays: FIXED: in `sayIt`, "I put all twelve on one board... the rest drifted" contradicted the board, which shows 9 of 12 (2 reference, 3 variants, 4 drift). It now says nine, three variants, four drifted. Softened the `caps` hotspot's "all-caps is slower to read" claim (the evidence covers long passages, not two-word labels). Mock checked: all 4 hotspots present, and the 5 decoys are fine.
- systems-02 Twenty-Three Oranges: FIXED: the insight said tokens mean "a 24th orange can no longer appear by accident", which is not true without linting. It now says a stray value stands out in review. `inTheWild` now cites the DTCG's first stable format (2025.10, released October 2025).
- systems-03 What Blue Means: FIXED: the strong outcome said dark mode "took a day of token work", but systems-06 has dark mode taking five weeks. Reworded so the two cases agree. The Spectrum global/alias/component token tiers were checked and are correct.
- systems-04 Seven, Thirteen, Twenty-One: FIXED: "Tailwind's default spacing steps are multiples of 4px" was wrong, because Tailwind also has 1px, 2px, 6px, 10px and 14px steps. It now says the scale is built on a 4px (0.25rem) unit. Made the Material 8dp/4dp grid wording more precise.
- systems-05 Fourteen Sizes: FIXED: the okay outcome and `sayIt` said the 1.333 scale "left no size for table labels" because of the 16 to 21 jump. But the scale also goes down to 12, so the real gap is 12, 16, 21. Both now say that. Tailwind sizes were checked and are correct.
- systems-06 Lights Out: OK. The invert-filter results are accurate (#FF5A1F inverts to a blue), and the Material dark-theme guidance is cited correctly.
- systems-07 At Exactly 768: FIXED: the logic was backwards. With `min-width: 768` the header would be desktop at 768px, not mobile. I swapped the values (header 769, sidebar 768) in the situation and scene, so the described bug can actually happen. Tailwind and Bootstrap breakpoints were checked.
- systems-08 How Round: FIXED: the evidence said 7 radius values, but the situation lists 6 (4, 6, 8, 12, 16, 999). Changed to 6. The strong outcome now says which 41 cards moved.
- systems-09 Whose Shadow: OK.
- systems-10 Token Review: FIXED: the `value-name` explanation blamed hardcoding the hex, but the decoys `--color-text-primary` and `--color-surface` hardcode hex too. The explanation now leads with the naming and duplication. The `case` explanation claimed every other token has "a category prefix", but `--orange-500` and `--red-600` don't. Removed that claim. Mock checked: all 4 hotspot rows present, and the decoys are fine.
- systems-11 Is a Button an Atom: OK. Matches Brad Frost's examples (label, input, button as atoms; search form as a molecule; book published 2016).
- systems-12 Three Cards: OK. The MUI Card subcomponents are correct.
- systems-13 Where the Nav Lives: OK. Matches Frost's header-organism example.
- systems-14 Two Weeks of Labels: FIXED: the strong answer relied on an unstated fact, that imports don't depend on atomic level. Added "in code every component is imported by name from one package" to the situation, so the costly "breaks imports" option can be judged.
- systems-15 Primitives First: OK. The "rule of three" is attributed correctly to refactoring practice.
- systems-16 The Sixth Empty State: OK. Minor: `inTheWild` repeats systems-01's interface-inventory reference.
- systems-17 Modal or Drawer: OK. The GOV.UK "When to use / When not to use" sections are accurate.
- systems-18 Who Owns the Button: OK. Nathan Curtis's solitary/centralised/federated team models are accurate.
- systems-19 The Mega Dropdown: OK.
- systems-20 Six Requests: FIXED: the "Loading state for Button" item clashed with systems-18, where Growth's loading state is already merged on the strong path. Replaced it with a should-tier item, "Compact size for Select" (item id `select-size`), keeping the same reasoning. WCAG 2.4.7 Focus Visible (AA) is cited correctly.
- systems-21 Type Versus Variant: FIXED (improvement): `inTheWild` now cites the semver.org FAQ advice to deprecate in a minor release before removing in a major, which is what this case teaches. The vaguer React claim was dropped.
- systems-22 Eight Months Old: OK. Storybook Autodocs and MDX are accurate.
- systems-23 Retiring LegacyAlert: OK. The numbers match (31 by codemod plus 9 by hand = 40, and about 75% matches systems-24). MUI codemods are real.
- systems-24 The Notice: OK. Exactly one good option per slot, and the preview mock matches the spec.
- systems-25 Fourteen Mismatches: FIXED: the strong outcome said each component got a "designer and engineer pair", but the takeaway and reaction say "one named owner". Now consistent. Made the Code Connect description more precise (code snippets shown in Dev Mode).
- systems-26 The Shortcut: FIXED: "their 8 best one-offs" didn't match the evidence (23 one-offs, 15 already in the system, so exactly 8 missing). It now says the 8 the system lacked.
- systems-27 The Signature Button: FIXED: `sayIt` said "five of eight testers missed the main action". The evidence shows 5 of 8 found it, so 3 missed. Corrected. GOV.UK principle 1, "Start with user needs", was checked.
- systems-28 One Hour: FIXED: the okay outcome had a garbled sentence ("The same week of failing screens, plus a precedent"). Rewritten. WCAG 1.4.3, including the inactive-component exemption, is cited correctly.
- systems-29 Going Native: OK. Flutter's Material and Cupertino widgets are accurate.
- systems-30 A Second Product: OK.
- systems-31 Fighting the Defaults: FIXED: the takeaway said to "Buy" behaviour, but Radix and React Aria are free. It now says "Reuse... from a headless library".
- systems-32 Is It Working: OK. Minor: the strong choice mentions a "drop in UI bugs" that has no evidence item. Acceptable.
- systems-33 Going Public: FIXED: `inTheWild` named Shopify Polaris as an open system. Shopify deprecated Polaris React in October 2025 (the repo is kept for history, with no maintenance) and moved to Polaris Web Components. Replaced it with IBM's Carbon, which is open source and actively maintained.
- systems-34 The Split Pane: FLAG: this case teaches nearly the same lesson as systems-19 (one team needs a specialised component, so they build it with system tokens and it joins the system later). The debrief frames it as ownership and scope, so it is defensible, but the owner may want a sharper difference, for example a pattern that two teams need in slightly different forms.

## Mock check (spot cases)
- `button-inventory` (systems-01): all hotspots (`off-orange`, `pill`, `short`, `caps`) exist. Small mismatches with the mockSpec, none of which affect play: the reference label is 13px in the mock but the spec says 14px; the caps button also uses an 11px font (spec does not say this, but it falls under the same hotspot).
- `token-table` (systems-10): all hotspot rows exist and the decoys match the spec. The title uses a comma where the spec has a colon (cosmetic).

## Summary
34 cases: 16 OK, 17 fixed, 1 flagged. No verdicts or correct choice ids were changed.

Most important corrections:
1. systems-07: the breakpoint bug was logically impossible as written (min-width 768 cannot be mobile at 768px). The values are now swapped so the bug is real.
2. systems-27: `sayIt` misread the evidence (5/8 found the action, so 3/8 missed it, not 5/8).
3. systems-33: Shopify Polaris is no longer a good example of an open, maintained system (Polaris React was deprecated in October 2025). Replaced it with IBM Carbon.
4. systems-04: the Tailwind spacing claim was inaccurate.
5. Cross-case consistency: 03 vs 06 (dark mode effort), 18 vs 20 (Button loading state), 25 (owner vs pair), 01, 08 and 26 (counts that didn't match the evidence).
6. systems-14: added the missing fact that made the strong answer depend on something the player wasn't told.
