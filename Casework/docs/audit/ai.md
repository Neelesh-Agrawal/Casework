# Audit: Designing for AI (src/v2/content/tracks/ai.js)

## Verdicts

- ai-01 The Empty Box: FIXED: the okay choice's reaction, outcome and trap said placeholders vanish "the moment you click". That's wrong, because modern browsers keep placeholder text visible on focus until you type. They now say the hints show one example at a time and disappear once typing starts.
- ai-02 Nine Seconds: FIXED: sayIt said "31% stop walking off", which reads as 31% staying. It now says "far fewer than 31% will walk off", which matches the outcome (6%). The Nielsen 1s limit, and the claim that ChatGPT, Claude and Gemini stream with Stop, are correct.
- ai-03 Made-Up Dates: OK (Perplexity citations, HAX G11 correct).
- ai-04 The Answer Card: FIXED: the takeaway listed "honest scope" as one of the four checks. In the mock, the scope line is a fine decoy and the fourth hotspot is the confidence badge, so the takeaway now says "no unearned confidence score". The mock matches the spec: all 4 hotspots are present and the decoys (timestamp, scope line, thumbs, Copy) are fine.
- ai-05 Meet Your Teammate: OK (HAX G1/G2 and the PAIR "Mental Models" chapter are real).
- ai-06 Meet Lumi: FIXED: the strong outcome said wrong answers "stayed at 22%", but the evidence shows 23% for the plain label. Changed to 23%.
- ai-07 Sent in Nine Seconds: OK (Parasuraman & Manzey, Human Factors 2010 is correct).
- ai-08 Ninety-Two Percent: FIXED: the debrief example said "14 tasks have no due date", but the choice and sayIt say 6. Made it 6 for consistency.
- ai-09 On Thin Ice: OK (compose slots: one good each, numbers consistent at 21 + 14 = 35).
- ai-10 At Risk: OK (HAX G11. US adverse-action notices under ECOA/Reg B do require the principal specific reasons).
- ai-11 Thumbs Down: FIXED: the strong choice offered "wrong facts" as a "quick fix", but that is a reason, not a fix. Reworded to "offer a fix like 'Make it shorter', ask what was wrong". HAX G15/G16 are cited correctly.
- ai-12 Provider Down: FIXED: replaced the "light bulb, not a fuse" metaphor (an idiom that doesn't translate well) with plain wording.
- ai-13 Fully Automatic: OK (Parasuraman, Sheridan & Wickens 2000. Smart Reply never auto-sends. 1,200/5 = 240 daily picks and 16% of 1,200 is about 190, both consistent). See the EU AI Act flag under ai-15.
- ai-14 The Usual Suspects: FIXED: kept the Amazon/Reuters 2018 example and dropped the hard-to-verify detail about neutralising terms. Added that the EU AI Act Annex III point 4(b) lists AI that allocates work tasks based on individual behaviour or traits as high-risk, which applies directly to this case.
- ai-15 Six Requests: FLAG: the tiers are defensible and the Annex III worker-evaluation claim is correct. But Annex III 4(b) also covers AI that "allocates tasks based on individual behaviour or personal traits". "Suggest an owner" (tier `must`, note "Low risk") and Launchly's auto-triage overall (ai-13/14) could therefore count as high-risk under EU law, depending on the signals used and the Art. 6(3) derogations. The owner should decide whether to soften the "Low risk" note or add an EU caveat. I did not change the tiers.
- ai-16 From Marcus, Sort Of: FIXED: sayIt talked about Marcus's own signature, but the decision is about Northwind's PMs. It now covers PMs in general, with Marcus as the precedent. The Article 50 description (transparency duties, machine-readable marking) is accurate.
- ai-17 The Token Bill: FIXED: the okay outcome said the bill fell to $5,000, but "a tenth of the cost" of $38k is about $4,000. Corrected. I also made the prompt-caching inTheWild precise: the case is about caching outputs, while providers discount repeated inputs. The other math checks out: 2.1M x $0.018 is about $38k, and an 86% cut gives under $6k.
- ai-18 Better With Your Data: OK (Zoom Aug 2023 terms backlash and Slack May 2024 email-to-opt-out are both accurate).
- ai-19 Admin Keys: FIXED: a typo in the okay outcome said "Two days late", which should be "Two days later". OWASP "Excessive Agency" and the 1970s origin of least privilege (Saltzer & Schroeder 1975) are correct.
- ai-20 Approve All: FIXED + FLAG (mock): inTheWild cited HAX G16 "Convey the consequences of user actions" as if it were about confirming actions. G16 is about how a user's action changes the AI's future behaviour, so it is now tied to the pre-ticked "Always allow". Mock mismatch: the `external` hotspot is just the line "To: Ana, Jonas, Priya, Tom Hale +10", and nothing in the mock tells the player that Tom Hale is external. As a content-side fix, I added to the situation that Tom Hale from client Northwind is a guest. The owner may still want the mock to show an outside email domain or org name. A small point: the recipients row sits outside the collapsed "+3 other actions" row, while the spec puts it inside. All 4 hotspots exist and the decoys are fine.
- ai-21 140 Tasks Later: OK.
- ai-22 Inactive Members: FIXED: sayIt claimed "over 100 people locked out" (6% of all 1,850 members). The 6% is the error rate of the AI's inactive picks, and the outcomes (23 wrong removals a month, about 18% of seats saved) only work that way. sayIt now says about 20 people a month, and the evidence label now reads "Inactive picks that are wrong". EU AI Act Art. 14 is correct.
- ai-23 Hidden Instructions: OK (OWASP LLM01 Prompt Injection and its mitigations are described accurately).
- ai-24 It Remembers: FIXED: the scene named the absent colleague "Ana". That is a cast member (Head of Brand), which caused confusion and attached private health information to a cast character. Changed to a non-cast teammate, "Leo", and updated the pronoun in the situation. The ChatGPT "Memory updated" claim and HAX G17 are accurate.
- ai-25 Usage Is Up: OK (the PAIR "User Needs + Defining Success" chapter is real. 19 - 6 = 13 min is consistent).
- ai-26 Hi, I'm Sophie: FIXED: the okay choice (a small-print disclosure on the support page) was no better than the costly one and arguably worse, so it wasn't a genuine half-right. It is now a real half-fix: Sophie keeps her name and tone, the photo becomes an icon, and a small "AI" tag is added, with an outcome and trap to match. The strong answer is unchanged. EU AI Act Art. 50 and the California BOT Act (2019) are accurate.
- ai-27 Word by Word: FIXED: the WCAG wording was loose. It now says WCAG 2.1 SC 4.1.3 Status Messages (AA) requires status messages to be exposed to assistive technology without moving focus. The aria-busy description is correct.
- ai-28 Twelve or Seventeen: OK.
- ai-29 The New Model: OK.
- ai-30 The Off Switch: OK (HAX G17. Microsoft 365 Copilot licences are assigned per user. 1,400 + two teams = 1,600 is consistent).

## Summary

- 30 cases: 13 OK, 16 fixed, 1 flagged (ai-15). ai-20 was also fixed and carries a mock flag.
- No correct-answer ids were changed. The validator reports 0 errors and 0 warnings for ai.js (strong-is-longest 23%).
- Most important corrections:
  - ai-26's okay choice is now a genuine half-fix instead of a second wrong answer.
  - ai-22's "over 100 locked out" contradicted its own outcomes.
  - ai-01 had a factual error about placeholder behaviour.
  - ai-20 misapplied HAX G16, and its mock gave no way to identify the external recipient.
  - ai-24 used a cast member's name for a third person's medical leave.
  - ai-17's okay outcome had an arithmetic inconsistency.
- For the owner:
  - The EU AI Act Annex III 4(b) task-allocation clause may make Launchly's own auto-triage high-risk, which affects the framing of ai-13, ai-14 and ai-15.
  - The ai-20 mock should mark the external recipient visually (for example a client email domain) without tagging it.
