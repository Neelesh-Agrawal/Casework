# Casework content audit: rubric

Audience: anyone who designs, from first-year design students to working designers with degrees. In an era where AI does much of the production work, the value Casework offers is **judgment**: knowing which call to make, why, and how to defend it. Every case must earn its place for that audience.

Audit every case in your file, one by one, against all of the checks below. Fix what is wrong directly in the file. Do not skip any case.

## 1. Factual accuracy (zero tolerance)
- Every named principle, law, heuristic or guideline is real and described correctly (e.g. Hick's law, Fitts's law, Gestalt laws, Nielsen heuristics, peak-end rule, Von Restorff, Jakob's law, default effect).
- WCAG references: the success criterion number, name and level must be correct (e.g. 1.4.3 Contrast (Minimum) AA 4.5:1 normal text / 3:1 large text; large text = 18pt (24px) regular or 14pt (~18.66px) bold; 1.4.11 Non-text Contrast 3:1; 2.5.8 Target Size (Minimum) AA 24x24 CSS px in WCAG 2.2; 2.5.5 Target Size (Enhanced) AAA 44x44; 1.4.1 Use of Color; 2.4.7 Focus Visible; 2.1.1 Keyboard; 2.1.2 No Keyboard Trap; 3.3.1 Error Identification; 3.3.2 Labels or Instructions; 2.2.1 Timing Adjustable; 2.3.3 Animation from Interactions AAA). Verify anything you are not certain of.
- Platform guidance cited correctly (Apple HIG 44x44 pt, Material 48x48 dp, etc.).
- `inTheWild`: only claims about real companies/products that are well documented and still true. If you are not confident a specific company does exactly this, rewrite it as a general pattern ("Many SaaS onboarding flows...") or cite a standard instead. No invented studies, no statistics attributed to real organisations unless they are real and widely cited (and then cite them accurately, e.g. Baymard figures only if correct).
- Numbers inside the story (Launchly's own metrics) may be fictional, but must be plausible and internally consistent across situation, evidence, choices, outcomes and debrief.

## 2. Exactly one right answer
- An experienced senior designer reading the case must agree which choice is `strong`. If two choices are defensible as best, or the strong one depends on unstated facts, fix it (add a fact to the situation/evidence, sharpen a choice).
- `okay` is a genuine half-right; `costly` is tempting but wrong. No strawmen, no trick wording.
- The strong answer must not be guessable from tells (it being the only nuanced/longest option, or the situation giving it away).
- Hands-on (spot/compose/triage): every hotspot is a real problem, decoys are genuinely fine, the `good` slot option is clearly best, triage tiers are defensible. For spot cases, open the mock component in `src/v2/ui/mocks/*.jsx` (or `src/v2/ui/mocks.jsx`) and confirm each hotspot actually appears in the mock and the decoys are not accidentally problems. Do NOT edit mock files; list any mismatch in your report.

## 3. Value
- The debrief teaches something transferable, not trivia. `insight` explains why, `trap` explains why the tempting answer tempts, `takeaway` is a rule someone can use at work tomorrow.
- Would a mid-level designer learn or sharpen something? If a case is too obvious or too trivial, make it sharper (better trade-off, better evidence), without changing its topic.
- Language: plain English, no jargon without context, no idioms that don't translate.

## 4. Consistency and form
- Situation, evidence, ask, choices, outcomes and debrief all describe the same story (names, roles, numbers).
- People: only the documented cast (see docs/content-guide.md), with correct roles. Don't assign gendered pronouns to Sam or Dana.
- No em dashes or en dashes. Respect the length limits in the content guide.
- After editing, `node scripts/validate-content.mjs` must report 0 errors for your file (other agents edit other files in parallel; ignore their errors).

## Report
Write `docs/audit/<track>.md` with:
1. A one-line verdict per case: `ux-07 Three More Fields: OK` or `... FIXED: <what and why>` or `... FLAG: <issue needing the owner's decision>`.
2. A short summary: how many OK / fixed / flagged, and the most important corrections.
