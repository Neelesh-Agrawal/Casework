# Casework — Content Guide

Casework is a **story game**, not a quiz. The player is the first product designer at **Launchly**, a 40-person startup that makes a project tool for remote teams. Every case is a short scene in the Launchly office: colleagues talk (to you and to each other), pressure builds, and you make one call. Then someone reacts, and the consequence plays out.

The audience is design students and junior designers who *know* the laws (Hick, Fitts, Gestalt, WCAG, Jakob's Law…) but struggle to apply them under real pressure. Every case must make them *apply* a principle in a messy, human situation — never recite it.

Gold-standard examples live in `src/v2/content/tracks/ux.js` (the first 15 cases, written in the older schema — copy their voice, research rigour and debrief quality, but use the **scene schema below**).

---

## 1. The non-negotiables

1. **Exactly one right answer.** Every decision has exactly one `strong`, one `okay`, one `costly` choice. An experienced designer reading it must agree which is best. If reasonable seniors could argue, rewrite the case until they can't (add a fact to the evidence, sharpen the constraint). No career, taste or "it depends" questions.
2. **No tells.** All three choices must be within ±15% of each other in character length. The `strong` choice must NOT be the longest choice in more than ~35% of a track's decisions. Don't make the right answer the only "nuanced" sounding one, and don't make wrong answers lazy strawmen. A wrong answer must be something a smart person under pressure would genuinely pick — deferring to authority, the fast fix, the "obviously principled" overcorrection, the compromise that satisfies nobody.
3. **Costly ≠ stupid.** The `costly` answer is usually the *tempting* one. The `okay` answer is usually right instinct / wrong execution, or a half-fix.
4. **Show the principle, don't name it in the scene.** Characters never say "Hick's Law". The principle appears only in the debrief.
5. **Real numbers.** Every decision gets 1–3 evidence items with concrete values (percentages, counts, sizes, times). Fictional numbers are fine; they must be plausible and internally consistent.
6. **Accurate.** Every principle, guideline number, and "in the wild" claim must be correct. Only cite real products/companies doing things you are confident they actually do. If unsure, describe the pattern generally instead ("Most major SaaS signups…"). Never invent studies or statistics attributed to real organisations. WCAG criteria must be cited with correct numbers.
7. **Short.** Scene lines ≤ 200 characters each. Choices 60–120 characters. Outcomes ≤ 260 characters. Debrief fields ≤ 320 characters each.
8. **Plain words.** Write for someone whose second language might be English. No idioms that don't translate, no jargon without context.

## 2. The cast (only these characters)

| id | Name | Role | Voice |
|---|---|---|---|
| `rhea` | Rhea Kapoor | CEO & co-founder | Fast, numbers-first, impatient, warm underneath. Says "today". |
| `priya` | Priya Nair | User Researcher | Calm ally. Always has a recording or a number. |
| `marcus` | Marcus Webb | Product Manager | Sprint-board brain. Fair, but the deadline wins. |
| `jonas` | Jonas Berg | Staff Engineer | Blunt, dry humour. Says no first, then helps. |
| `ana` | Ana Souza | Head of Brand | Protective of the brand. Loves the orange. |
| `kofi` | Kofi Mensah | Head of Sales | Every request comes with a deal attached. Charming. |
| `lena` | Lena Fischer | ML Engineer | Precise. Knows exactly how the AI model fails. |
| `sam` | Sam Ortiz | Junior Designer | Eager, talented, makes beginner mistakes you review. |
| `dana` | Dana Park | Head of Design (arrives later in the story) | Your manager. Gives you rope. |

The player is "you" and never speaks in the scene — the player's voice is the choice they pick.

## 3. Places (the 3D office rooms)

`ceo-office` · `meeting-room` · `design-desk` · `eng-pod` · `kitchen` · `lounge` · `research-lab` · `video-call`

Pick the place that fits the scene. Vary them — no more than two consecutive cases in the same place.

## 4. Moods (character expressions)

`neutral` · `happy` · `worried` · `annoyed` · `thinking` · `excited`

Use them — they drive the character illustrations. A scene where everyone is `neutral` is a dead scene.

## 5. Case schema

```js
{
  id: 'ux-07',                 // track prefix + two-digit number, unique
  kind: 'decision',            // 'decision' | 'spot' | 'compose' | 'triage'
  title: 'Three More Fields',  // 2–4 words, intriguing, no colons
  principle: "Interaction cost", // the concept this case teaches (for coverage tracking)
  place: 'video-call',
  time: 'Mon 09:40',           // weekday + 24h time
  cast: ['rhea', 'priya'],     // everyone who speaks in the scene or reaction (1–3 people)
  scene: [                     // 2–4 beats. A conversation, not a monologue.
    { who: 'rhea', mood: 'annoyed', says: 'Sales says half our signups are students and tire-kickers.' },
    { who: 'rhea', mood: 'neutral', says: 'Add phone, company size and job title to the form. I want to know who\'s walking in.' },
    { who: 'priya', mood: 'worried', says: 'Every field we\'ve tested costs us four to seven percent of signups. Just saying.' },
  ],
  evidence: [                  // 1–3 items, shown on a laptop/whiteboard prop
    { label: 'Signup completion today', value: '38%' },
    { label: 'Each added field', value: '−4 to 7%' },
  ],
  ask: 'It\'s your first week. What do you propose?',
  choices: [
    {
      id: 'A',
      text: 'Add all three. Qualified leads are worth a dip in signups — Sales needs that data.',
      verdict: 'costly',                       // exactly one each of strong / okay / costly
      meters: { users: -2, business: -1, team: 1, speed: 1 },   // each -2..+2
      reaction: { who: 'priya', mood: 'worried', says: 'Okay. I\'ll set up tracking so we can see what it costs.' },
      outcome: 'Completion fell to 29%. Sales got cleaner data on a much smaller pile. Two weeks later the fields came out again.',
    },
    // B, C …
  ],
  debrief: {
    principle: 'Interaction cost & progressive profiling',   // the named principle/law, accurate
    insight: 'Why the strong answer works, in plain words.',
    trap: 'Why the tempting answer tempts, and why it fails.',
    inTheWild: 'A real, verifiable example, or a correct guideline/standard reference.',
  },
}
```

- `reaction` is one line from a cast member right after the player chooses — it's what makes it feel like a story. The reaction must not reveal the verdict outright; the outcome does that.
- `meters`: users = user experience/trust, business = revenue/company goals, team = relationships/collaboration, speed = delivery speed. The strong answer is not always +2 everywhere — trade-offs are real (e.g. strong answers often cost some speed).

### Hands-on kinds (max 4 per track, at least 3)

These need a custom illustrated mock UI, which the engine team builds from your spec. Use them where *doing* teaches better than *choosing* (spotting contrast problems, alignment, hierarchy, writing microcopy, prioritising).

**spot** — tap the problems in a mock UI
```js
{ ...common fields (no choices),
  kind: 'spot', ask: 'Tap the 4 problems in the form.', taps: 6,   // taps = problems + 2
  mock: 'signup-form',                       // kebab-case id for the mock
  mockSpec: 'A light-mode signup card: logo, heading "Create your account", Google button (fine), email input filled "maya.k@gmail.co" with NO label [labels], …',
  hotspots: [{ id: 'labels', label: 'Placeholders used as labels', explain: '…' }],
}
```
In `mockSpec`, describe every element top-to-bottom, and mark problem elements with `[hotspotId]`. Include 3+ correct decoy elements so it's not trivial.

**compose** — build a piece of UI copy from parts, with a live preview
```js
{ kind: 'compose', ask: '…', preview: 'upload-error', previewSpec: 'describe the UI the copy appears in',
  submitLabel: 'Send to Jonas',
  slots: [{ id: 'headline', label: 'Headline', options: [{ text, grade: 'good'|'meh'|'bad', note }] }] }
```
Each slot: 3 options, exactly one `good`.

**triage** — pick N of M items
```js
{ kind: 'triage', ask: 'Choose the 3 issues to fix this sprint.', pick: 3, submitLabel: 'Lock it in',
  items: [{ id, text, tier: 'must'|'should'|'nice', note }] }   // 6 items: 2 must, 2 should, 2 nice
```

### Situation (required on EVERY case, all kinds) - this is what the player reads

The game no longer shows `scene` as a chat. The player reads one short `situation` paragraph, the evidence sticky notes, the `ask`, then the choices. `scene` and `reaction` stay in the data but are not shown.

```js
situation: "Your first week at Launchly. Sales says half of all signups are students who will never buy, so Rhea, the CEO, wants phone, company size and job title added to the signup form, live today. Priya, the researcher, has tested this before: every extra field cost 4 to 7% of signups.",
```

- Second person ("you"), present tense, plain words. 2 to 4 sentences, 150 to 420 characters (hard max 460).
- Name a person with their role on first mention ("Rhea, the CEO,"). At most one short direct quote, only if it adds pressure or voice.
- It must carry every fact needed to make the call that is in the scene lines. Facts already on the evidence notes can be referenced, not repeated in full.
- Must not hint at the answer, and must not name the principle.
- No em dashes or en dashes anywhere in the case. Use a plain hyphen, a comma, or a full stop.

### Takeaways (required on EVERY case, all kinds)

Casework is a learning tool first. Every case carries two things the player keeps in their playbook:

```js
takeaway: 'For every form field, ask: do we need this before they see any value?',
sayIt: 'Let\'s collect the same data one minute later, when it costs us nothing. Priya\'s tests say each field drops signups by four to seven percent.',
```

- `takeaway` — a rule of thumb the player can apply at work tomorrow. Imperative, concrete, ≤ 140 chars. Not a restatement of the principle's name; a habit or a check ("Before shipping a confirmation dialog, ask: will people see it every time?").
- `sayIt` — the exact words to use with the stakeholder in the scene (or a typical one) to win the argument respectfully. First person, spoken, ≤ 220 chars. It should name the trade-off and lean on evidence, never on authority or jargon ("Fitts's Law says…" is banned — explain the effect instead).

## 6. Chapters

A track is `{ id, number, title, subtitle, blurb, color, chapters: [{ id, title, tagline, intro, briefing, retro, cases: [...] }] }`.
Chapters are story acts with a clear arc (first weeks → growth → scale). 5–7 cases per chapter. The `intro` (≤ 320 chars) sets the scene in the story.

Every chapter opens and closes with a **team discussion** played in the track's room in the 3D office. These are what make it feel like a real team — and they carry real learning.

```js
briefing: [   // 3–5 beats, before the first case. Colleagues talk to each other about what's coming.
  { who: 'marcus', mood: 'thinking', says: 'Signups are flat and Rhea wants answers by Friday.' },
  { who: 'priya', mood: 'neutral', says: 'Before we touch anything, can we look at where people actually drop?' },
  { who: 'jonas', mood: 'annoyed', says: 'As long as nobody asks me for another pop-up.' },
],
retro: [      // 3–5 beats, after the last case. The team looks back and names what they learned.
  { who: 'priya', mood: 'happy', says: 'Biggest lesson for me: every field we add is a toll people pay before they get anything.' },
  { who: 'jonas', mood: 'neutral', says: 'And confirmations nobody reads aren\'t safety. Undo is.' },
  { who: 'marcus', mood: 'thinking', says: 'Next time growth asks for four notifications, we start with the one about real people.' },
],
```

- Each beat ≤ 160 characters. 2–4 different speakers. Natural, specific, a little human (jokes, worry, disagreement) — never a lecture.
- The briefing frames the chapter's problem space and hints at tensions the player will face, without giving away answers.
- The retro recaps 3–5 of the chapter's principles in the team's own words, so the player hears each lesson a second time. It must not refer to the player's specific choices (the game adds a personalised line itself).

## 7. Self-check before you finish

Run `node scripts/validate-content.mjs` from `D:\Ship69\Day23\Casework`. It must report zero errors. Then re-read every case as a sceptical senior designer: *Is there exactly one defensible best answer? Would I pick the costly one if I were rushed? Is every factual claim true?*
