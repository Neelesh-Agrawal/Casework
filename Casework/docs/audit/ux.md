# UX Thinking track audit (src/v2/content/tracks/ux.js)

## Verdicts per case

- ux-01 Three More Fields: OK
- ux-02 Five Users, Three Quit: OK (mock `signup-form` in src/v2/ui/mocks.jsx matches: all 4 hotspots present, decoys fine)
- ux-03 The Brand Orange: OK (checked the numbers: white on #F76707 is 3.04:1, white on #C2410C is 5.18:1, and 14pt bold is 18.66px, so all correct)
- ux-04 The Four-Second Wait: OK (Nielsen's 10-second percent-done guidance is quoted correctly)
- ux-05 Four New Pings: OK
- ux-06 Error 403: FIXED: the error read "403: Unauthorized request", but HTTP 403 is "Forbidden" (401 is Unauthorized), and the case shouldn't teach that mix-up. Changed it to "Error 403: Forbidden" in both the situation and the scene. In inTheWild, Google Docs shows "Request access" when you have no access, not when you "can't edit", so I corrected that wording.
- ux-07 Fourteen Widgets: OK
- ux-08 The Bolder Font: FIXED: SF claim made accurate. SF was released as separate Display and Text cuts. Today it uses one variable font with optical sizes, so "comes in" overstated it.
- ux-09 Three Slots: OK (Nielsen's severity factors are right: frequency, impact, persistence)
- ux-10 Mobile Can Wait: FIXED: the costly outcome mentioned "App store reviews", but this is a responsive web redesign and no native app exists in the story. Changed to support tickets and social posts.
- ux-11 Clearly Better: OK (the ~2 weeks is plausible: about 4,000 per arm detects 3 points)
- ux-12 The CFO's Question: OK
- ux-13 Nothing to See: OK
- ux-14 Delete Workspace: OK (checked: GitHub really does have a Danger Zone and makes you type the repo name)
- ux-15 Stuck in the Modal: OK (2.1.2 No Keyboard Trap A and 2.4.7 Focus Visible AA are correct, and so is the APG dialog pattern)
- ux-16 Six More Buttons: OK
- ux-17 Launch Day: FIXED: the strong answer moves the press article by a week, but the case never said that was possible, so the right answer rested on an unstated fact. Added to the situation that the reporter can run the piece a week later.
- ux-18 Where Do I Look: OK
- ux-19 Active or Not: OK (1 in 12 men and 1.4.1 are correct)
- ux-20 Three Equal Plans: OK
- ux-21 The Busy Hero: FIXED: inTheWild said iOS blurs "behind sheets". Sheets dim what's behind them, they don't blur it. Changed to context menus and Control Center.
- ux-22 The 24px Button: FIXED: the costly outcome said "half a second slower per click". That's not plausible for a 48 to 24px change, so I made it a qualitative claim. WCAG 2.5.8, Apple 44pt and Material 48dp are all correct.
- ux-23 Make Them Earn It: OK
- ux-24 The Default Plan: OK (Johnson and Goldstein 2003 is cited correctly)
- ux-25 Only 3 Seats Left: OK (verified that the FTC's 2022 staff report covers false scarcity and fake countdown timers. DSA Art. 25 is correct.)
- ux-26 Two Hundred Reviews: OK (2.2.2 Pause, Stop, Hide is correct)
- ux-27 Three Days Left: OK
- ux-28 Wasted Space: OK
- ux-29 The Red Badge: FIXED: the okay/costly verdicts didn't match their outcomes or the debrief. B ("New feature" text) cut error readings to 4 of 8, but C (help-centre legend) changed nothing for 98% of users, and the trap itself says "a legend is worse". Swapped the verdicts: B is now okay, C is now costly, and meters adjusted. Strong (A) is unchanged. I also removed an unverifiable claim about Atlassian's "new" lozenge colour; it's now a general design-system pattern.
- ux-30 The Elegant Icon: OK
- ux-31 Sam's First Card: OK, with a mock FLAG (see below). #B8B8B8 on white is 1.98:1, so "about 2:1" is correct.
- ux-32 Card Flips: OK (2.3.3 is AAA, correct)
- ux-33 Everything Is 12px: FIXED: M3 sizes were given as "px". They are now named by style (Body Medium 14, Body Large 16).
- ux-34 We Know Our Users: OK
- ux-35 The Numbers Say Enough: OK
- ux-36 Dark Mode: FIXED: Jonas, the engineer, was reporting interviewees' phone settings, which is Priya's interview data. Moved that line to Priya, aligned it with the evidence (6 of 8), and made the situation match.
- ux-37 Forty-Seven Findings: OK
- ux-38 What's a Workspace: OK
- ux-39 Twelve Buttons: OK
- ux-40 The Copied Modal: OK (Cunningham 1992 is correct)
- ux-41 The Cancel Flow: OK (mock `cancel-flow` matches all 4 hotspots. The FTC rule was adopted in 2024 and vacated in 2025, both stated correctly.)
- ux-42 Twelve Settings: OK
- ux-43 Lost in Handoff: FIXED: the build used 14px, but the files only disagreed between 16 and 15, and sayIt says "guessing between 15 and 16". Changed the build value to 15px so the story holds together.
- ux-44 Brutal Reviews: OK

## Mock mismatches (not edited, for the engine team)

- `project-card` (src/v2/ui/mocks/ux.jsx), FLAG: both buttons are white 12px bold text on #FF6B2C, which is about 2.9:1. That's an unlisted contrast failure, and it repeats the exact mistake ux-03 teaches. The tap still counts as the `buttons` hotspot, but the debrief only talks about hierarchy. Suggest a darker orange (e.g. #C2410C) for both buttons. Minor spec drift: the title is 18px in the mock and 20px in the spec, the description is 12px against 13px, and "Due" sits 4px below the "68% complete" label rather than the bar itself. None of these changes the lesson.
- `signup-form`, `cancel-flow`: match their specs.

## Summary

- 44 cases audited: 34 OK, 10 fixed, 0 case-level flags (1 mock flag).
- The most important fixes:
  - ux-29: the okay/costly verdicts were the wrong way round compared with their own outcomes and debrief.
  - ux-17: the strong answer depended on an unstated fact (a movable press date).
  - ux-06: 403 was mislabelled as "Unauthorized".
- Factual tightening: Google Docs, SF typeface, iOS blur, M3 sizes, and an unverifiable Atlassian colour claim.
- `node scripts/validate-content.mjs` reports 0 errors and 0 warnings for ux.js. Strong is the longest choice in 33% of decisions, and there are no en or em dashes.
