# Audit: UI Craft (craft.js)

## Verdicts

- craft-01 Twelve Jobs: FIXED: sayIt quoted "the last colour change already broke 30 screens", which only happens in the costly outcome; now cites the 14 Button bugs from the evidence.
- craft-02 Where Did It Go: OK
- craft-03 Forty Faces: FIXED: sayIt and trap said "our admins have 120" while evidence says avg 40, max 300; reworded to "bigger teams have 120 or more" / "up to 300".
- craft-04 One Size Fits None: OK
- craft-05 Eight Tabs Wide: OK
- craft-06 Eight Columns, One Phone: OK
- craft-07 The Mystery Icon: OK
- craft-08 The Shouting Icon: FIXED: situation used "her/she" for Sam (cast rule); rewritten without pronouns.
- craft-09 The Members Table: OK (minor mock notes below)
- craft-10 Twenty-Eight Pixels: OK (2.5.8 AA 24px, 2.5.5 AAA 44px, Apple 44pt, Material 48dp all correct)
- craft-11 Nothing Happens: OK (3.3.1 A, 3.3.3 AA correct)
- craft-12 No Way Out: OK
- craft-13 Two Orange Buttons: OK
- craft-14 The Div Dropdown: OK (first rule of ARIA, 2.1.1 Level A correct)
- craft-15 The Squashed Card: OK
- craft-16 Two Seconds to Undo: FIXED: option B outcome said Undo "caught about half" and "23% arrived after the toast had gone" at 4s, which contradicts a 3.4s median and 23% after 5s; now "caught most" and "about a third" late. Softened the 2.2.1 claim to "in effect, a time limit".
- craft-17 The White Void: OK
- craft-18 Six Review Comments: OK
- craft-19 Errors at the End: OK
- craft-20 Edit Beside the List: FIXED: removed the Jira side-panel claim (Jira boards now usually open issues in a modal, so not reliably true); kept Asana's task pane plus a general pattern.
- craft-21 Five Hundred a Day: OK
- craft-22 Searching for 3M: OK
- craft-23 Same Dialog, Different Stakes: OK
- craft-24 Remove Maya: OK
- craft-25 Did It Save: OK
- craft-26 Twenty Questions: OK
- craft-27 The Slowest Widget: OK
- craft-28 Sent Twice: FIXED: timing did not add up. Median second click was 2.6s, after the ~2s send had finished, so "disable until done" (the strong answer) would not have stopped it. Median changed to 1.2s. Strong choice now also shows "Sent" afterwards and dedupes on the server (not a time window), so it covers the 20% who click after 3s. Correct answer unchanged (C).
- craft-29 The Silent Bell: OK
- craft-30 Saving Nothing: OK
- craft-31 Outline None: FIXED: the case blamed "the browser's default blue ring" for flashing on every mouse click. Modern browsers' default rings already use :focus-visible and don't show on button clicks. Now the old stylesheet's custom :focus rule is to blame (situation, scene, evidence label, option C and its outcome). The insight now notes browser defaults work this way. 2.4.7 AA and 2.4.11 AA confirmed.
- craft-32 Are These Clickable: FIXED: "Don Norman coined 'signifier'" was inaccurate (the term comes from semiotics); now "brought the term into interaction design".
- craft-33 The State Sheet: FIXED: chapter 6 intro and this situation used "her/She" for Dana; rewritten without pronouns. Hotspots OK.
- craft-34 Wrong Key: OK (Nielsen heuristic 9 correct. Lena, the ML engineer, logging integration errors is a slight stretch of her role but acceptable)
- craft-35 Did It Upload: OK
- craft-36 Saved, Supposedly: OK

Also fixed: chapter 3 intro said "why her mocks keep coming back" (Sam); it now reads "why so many mocks keep coming back".

## Mock check (no mock edits made)

- members-table (craft-09): all four hotspots are present (`sortcue` on the Role header, `colouronly` on the row 1 dot, `numbers` on the row 2 seats cell, `hoveractions` on the row 2 overlay). Two small mismatches with the spec: (1) the decoy "long emails show in full on hover and on focus" is not visible in the static mock, which only shows the ellipsis, so a player could fairly read the truncation as a problem; consider a tooltip showing one full address. (2) Avatars are 14px, not the 24px in the spec (harmless).
- invite-field-states (craft-33): all four hotspots are present and the decoys look fine. Small mismatch: the "Long text" row only shows the ellipsis, not "full text visible when focused", same risk as above.
- remove-member-dialog (craft-24 preview): matches the previewSpec.

## Summary

36 cases: 26 OK, 10 FIXED, 0 FLAG. No correct-answer ids changed. Validator: 0 errors, 0 warnings for craft.js (strong-is-longest 25%).

Most important corrections:
1. craft-28: the timing numbers made the strong answer fail on its own evidence. Fixed the numbers and the strong choice.
2. craft-31: the factual premise about browser default focus rings on mouse clicks was outdated. Re-based it on a custom :focus rule.
3. craft-16: option B's outcome numbers contradicted the evidence.
4. craft-01 and craft-03: sayIt lines used facts from a costly outcome, or figures not in the evidence.
5. Gendered pronouns for Sam and Dana removed in four places, and the Jira and "Norman coined" claims corrected.
