# Audit: daily.js (Daily Case pool, 50 cases)

All 50 cases are `decision` cases. No spot cases, so there were no mocks to check. Validator: 0 errors, 0 warnings. Strong is the longest choice in 20% of cases. Strong ids are A 17, B 19, C 14. No em or en dashes. No correct-choice ids were changed.

## Per-case verdicts

- daily-01 Would You Pay: OK (The Mom Test cited correctly)
- daily-02 Which Label Is Mine: FIXED: removed gendered pronouns for Sam (situation, outcome B)
- daily-03 Who Said That: FIXED: outcome B mentioned "Priya's survey", but Priya is not in this standalone case. Now reads "the next user survey".
- daily-04 Red Dot, Green Dot: OK (1.4.1 Use of Color, Level A, correct; ~1 in 12 men is correct). Minor note: some seniors might rank the blue/orange palette above the hover tooltip. The okay/costly order can be defended because the palette still relies on colour alone. Left as is.
- daily-05 Day Three Winner: FIXED: outcome A said the real lift was +1%, but B and C say +3%. All three now agree on about +3%.
- daily-06 Only Five People: OK (Nielsen 2000 article title and claim correct)
- daily-07 Invite Everyone: OK (LinkedIn $13M "Add Connections" settlement in 2015 is correct)
- daily-08 The Nine-Slice Pie: FIXED: outcome said "Integrations first, Mobile fifth". That contradicts the setup, where Rhea can't tell which of the two is bigger. Changed to third and fourth.
- daily-09 Custom Dropdown: OK (first rule of ARIA use correct)
- daily-10 Ask Me Anything: FIXED: situation said those who type "mostly" say hello, but the evidence gives 22% of openers. Changed to "many".
- daily-11 The Card Sort Proof: FIXED: removed gendered pronoun for Sam
- daily-12 Off-Centre Play: OK (centroid direction and overshoot explained correctly)
- daily-13 Alt Text Everything: OK (1.1.1 and W3C alt decision tree correct)
- daily-14 Moved Your Deadline: OK (85% of 3,200 leaves 480 wrong, which matches; HAI guidelines correct)
- daily-15 Ask the Fans: OK (Wald survivorship example correct)
- daily-16 Streaks Up, Work Flat: OK
- daily-17 Centred Budgets: OK
- daily-18 Minutes Active: OK (Microsoft Productivity Score change in Dec 2020 correct)
- daily-19 Just Ask It: OK
- daily-20 The Ctrl+S Habit: OK
- daily-21 Tiny Row Icons: OK (2.5.8 AA 24x24 correct; 16px targets with a 4px gap fail the spacing exception too; Apple 44x44pt correct)
- daily-22 Twelve Problems: FIXED: removed gendered pronouns for Sam (situation, choices B/C, outcomes A/B/C)
- daily-23 Start the Axis at 90: OK (4x ratio and one-third churn drop check out; Tufte lie factor correct)
- daily-24 Delete the Toolbar: OK (Nielsen heuristics 6 and 7 numbered correctly)
- daily-25 Three Days, Exactly: OK (HAI G2 quoted correctly)
- daily-26 The Last-Step Fee: OK (Brignull "Hidden costs"; the UK DMCC Act 2024 bans drip pricing)
- daily-27 Final Final v3: FIXED: the scene showed the cut name as "Q3-client-report-final-…". The first 24 characters include the "v", so it now reads "…final-v…".
- daily-28 Learn More, Learn More: FIXED: removed gendered pronoun for Sam (2.4.4 A and 2.4.9 AAA are correct)
- daily-29 Clicking the Faces: OK (Clarity and FullStory rage and dead clicks are real; Norman signifiers correct)
- daily-30 The Mobile Mix: OK (the segment arithmetic is exact: 12% to 9%, and a revert gives 8%; Berkeley 1973 correct)
- daily-31 Knows Everything: FIXED: outcome B said "questions about files" fell from 40%, but the 40% covers everything it can't see. Wording aligned.
- daily-32 Edge to Edge: OK (Bringhurst 45 to 75 characters; 1.4.8 AAA 80 characters; the 24px line-length maths checks out)
- daily-33 Three Opinions: OK
- daily-34 Ten Thousand Rows: OK (Nielsen 10-second limit; 212 of 10,000 matches the ~2% in the evidence)
- daily-35 Logged Out Mid-Brief: OK (2.2.1 Level A, 20-second extend correct)
- daily-36 Slow and Smooth: FIXED: removed gendered pronoun for Sam
- daily-37 The Private Project: FIXED: inTheWild cited HAI guideline "Scope services when in doubt" as if it were about data permissions. That guideline is about uncertainty over the user's goal, so the citation is removed. The well-documented Microsoft 365 Copilot permission claim stays.
- daily-38 Not Now, Again: OK (Brignull "Nagging"; Chrome quieter notification UI correct)
- daily-39 Where Do I Click: FIXED: removed gendered pronouns for Sam (situation, scene)
- daily-40 Three Days Late: FIXED: evidence said "Next Monday (+3 days)", but Wednesday plus 3 days is Saturday. Changed to "+3 working days".
- daily-41 John Doe Fits: OK (Content Reel plugin real; about 30% extra space for German is a common localisation rule)
- daily-42 Nobody Rates It: OK (HAI G13 and G15 correct)
- daily-43 Three Percent: OK
- daily-44 No Zoom Allowed: FIXED: the strong choice and outcome said cards "reflow into one column" under pinch-zoom. Pinch-zoom does not trigger reflow, so they now describe a layout that holds up when zoomed. inTheWild now cites the W3C ACT rule: user-scalable=no fails 1.4.4 Resize Text (AA). It also describes 1.4.10 Reflow correctly.
- daily-45 No Invites, No Entry: OK (Facebook's "friends early" growth finding correctly framed as a correlation)
- daily-46 Text on the Mountain: OK (1.4.3 ratios correct; Material scrim guidance real)
- daily-47 Train on Everything: FIXED: outcome A named Kofi, who is not in this standalone case. Changed to "Sales". (Zoom 2023 and Slack 2024 claims verified.)
- daily-48 Pretty Beats Usable: OK (Nielsen 2001 article and aesthetic-usability effect correct)
- daily-49 Promise a Date: OK
- daily-50 Spaces Not Allowed: OK (GOV.UK phone number guidance and Postel's principle correct)

## Near-duplicates in the pool (owner decision)

- FLAG daily-20 (Ctrl+S Habit) and daily-29 (Clicking the Faces): same lesson told the same way. Users repeatedly do something "wrong", so make the product respond the way they expect. The takeaways are almost the same. Consider sharpening one toward its own principle: Jakob's law (habits from other apps) vs signifiers (false affordance).
- FLAG daily-01 (Would You Pay) and daily-48 (Pretty Beats Usable): both teach "what people say is not what they do". The settings differ (survey intent vs test preference), but players may feel the repeat if both come up close together.
- Minor overlap, acceptable: daily-10 and daily-31 both cite HAI G1 "make clear what the system can do" (discoverability vs limits). daily-07 and daily-47 both teach "defaults decide, so ask clearly" (invites vs data consent). daily-27 and daily-41 both treat truncation as the tempting wrong fix. "Hover tooltip" is the wrong answer in daily-04 and daily-27.

## Summary

- 50 cases: 34 OK, 16 FIXED, 0 flagged per case. There are 2 near-duplicate pair flags above.
- Most important corrections:
  - Sam had gendered pronouns in 6 cases (02, 11, 22, 28, 36, 39). All are removed.
  - Internal number inconsistencies are fixed: the A/B lift in 05, the chart ranking in 08, the deadline arithmetic in 40, and the 40% scope in 31.
  - A technically wrong accessibility claim in 44 is fixed: pinch-zoom does not reflow. The case now carries an accurate W3C citation.
  - A misapplied Microsoft HAI guideline in 37 is removed.
  - Characters who are not in the case (Priya in 03, Kofi in 47) are removed so each case stands alone.
