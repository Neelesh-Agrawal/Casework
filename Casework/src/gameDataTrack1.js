// ─────────────────────────────────────────────────────────────
//  TRACK 1 — Visual Foundations
//  4 chapters · 28 scenarios · 4 UI tasks
//  Chapter IDs: 101–104   Scenario IDs: 1001–1028
// ─────────────────────────────────────────────────────────────

export const T1_CHAPTERS = [
  { id: 101, title: 'Colour', subtitle: 'The first thing people feel', theme: 'Colour communicates meaning, builds trust, and breaks accessibility rules when used carelessly.', icon: '🎨' },
  { id: 102, title: 'Typography', subtitle: 'Words are design too', theme: 'Type size, weight, hierarchy, and spacing define whether people can read your product — or give up.', icon: '✏️' },
  { id: 103, title: 'Spacing & Grids', subtitle: 'The invisible structure', theme: 'White space and alignment are not decoration. They are the grammar that makes a layout readable.', icon: '📐' },
  { id: 104, title: 'Layout & Visual Hierarchy', subtitle: 'Where the eye goes first', theme: 'Guide users through a screen with size, contrast, position, and weight.', icon: '🗂️' },
];

export const T1_SCENARIOS = [
  {
    id: 1001, chapter: 101,
    title: "The Brand Orange",
    narration: "Launchly's CEO hands you the brand deck. The primary colour is a vibrant orange — #FF6B00. She wants it as the login screen background with white text on top.\n\nYou open the contrast checker. The ratio is 2.1:1. WCAG AA requires 4.5:1 for normal text.\n\nThe CEO says: \"It looks fine to me.\"",
    choices: [
      { id: 'A', text: 'Use the orange background with white text — the CEO approved it.', delta: -10 },
      { id: 'B', text: 'Explain the contrast issue; propose keeping orange as an accent, not a text background.', delta: 15 },
      { id: 'C', text: 'Darken the orange to #CC4400 to pass contrast, use it as the background.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The login screen ships. Three users email support saying they can\'t read the text in bright light. One mentions low vision. Accessibility complaints arrive in week one.', lesson: 'Approvals don\'t override physics. Low contrast text is unreadable regardless of who approved it.', principle: 'WCAG Contrast', principleDetail: 'Normal text requires a 4.5:1 contrast ratio (WCAG AA). Orange on white commonly fails this for body text.' },
      B: { story: 'You show a side-by-side with contrast scores. The CEO is surprised — she had no idea. Orange becomes a header accent and CTA colour. The login screen uses dark-on-light. Accessibility: clean.', lesson: 'Show the data, not just the opinion. A contrast ratio is a fact that\'s hard to argue with.', principle: 'WCAG Contrast', principleDetail: 'Normal text requires 4.5:1 (AA). Large text (18pt+) requires 3:1. Failing contrast excludes users with low vision, in bright environments, or on cheap screens.' },
      C: { story: 'The darkened orange passes contrast but reads as muddy brown. Users don\'t associate it with the brand. The CEO asks why the colour changed and you have to explain.', lesson: 'A half-measure that degrades the brand without explaining why creates more problems than it solves.', principle: 'WCAG Contrast', principleDetail: 'Forcing brand colours to pass contrast by darkening them often destroys brand intent. The better move is to redesign where colour is used, not just what shade.' },
    },
    reflection: { law: 'WCAG 2.2 Contrast', summary: 'Accessibility is non-negotiable. Contrast ratios exist because human vision varies enormously — a screen that looks fine to one person is a wall of grey to another.', realWorld: 'The UK Government Digital Service failed an accessibility audit because department websites used brand colours with insufficient contrast. They rebuilt entire colour systems.', bestCall: 'B — propose using orange as an accent, not a text background.', learnMore: 'Search: "WCAG contrast checker" — WebAIM\'s tool checks any hex pair instantly.' },
  },
  {
    id: 1002, chapter: 101,
    title: "Five Shades of Blue",
    narration: "You're designing the primary button for Launchly's dashboard. You have five blues:\n\n• #1E90FF — bright sky blue\n• #0057B7 — deep royal blue\n• #4A90E2 — cornflower blue\n• #003087 — dark navy\n• #00BFFF — electric blue\n\nThe PM says \"just pick one, they all look the same to me.\"",
    choices: [
      { id: 'A', text: 'Pick the one you personally find most beautiful and move on.', delta: -10 },
      { id: 'B', text: 'Test contrast on backgrounds, then check which carries the emotional weight appropriate to a professional SaaS tool.', delta: 15 },
      { id: 'C', text: 'Ask the team to vote on their favourite.', delta: 5 },
    ],
    consequences: {
      A: { story: 'You pick #1E90FF. Six months later a developer uses a slightly different blue. No documented reason for the original choice means no rule to apply. Inconsistency spreads.', lesson: 'Without a documented rationale, colour decisions can\'t be defended or replicated. Every "I like it" choice creates debt.', principle: 'Colour Decision Documentation', principleDetail: 'Decisions without rationale can\'t be maintained. They become folklore ("we always used this blue") that no one can explain or update responsibly.' },
      B: { story: 'You find #0057B7 passes AA contrast on white, feels authoritative, and sits in the "trustworthy professional blue" zone. You document the choice and reasons. The system is born.', lesson: 'Colour choice is a UX decision. Contrast, emotion, and context all matter — not just aesthetics.', principle: 'Colour Semantics', principleDetail: 'Different blues signal different things. Electric blues feel playful; deep blues feel authoritative. Match hue\'s emotional register to the product\'s brand personality.' },
      C: { story: 'The vote is split 3:3:2:1:1. The PM breaks the tie by picking the brightest blue. It fails contrast on dark backgrounds. No one documented why.', lesson: 'Design decisions by committee without criteria produce incoherent outcomes. A vote is not a design process.', principle: 'Design Decision Criteria', principleDetail: 'The right process: define criteria first (contrast, mood, brand fit), then evaluate options against those criteria — not the reverse.' },
    },
    reflection: { law: 'Colour Semantics', summary: 'Blue isn\'t blue. Every hue carries association, emotional weight, and technical constraints. Make the right call — and document why.', realWorld: 'Stripe uses a specific purple-blue (#635BFF) — accessible, distinctive in a sea of generic blue SaaS, and instantly recognisable. The choice is strategic.', bestCall: 'B — evaluate on objective criteria, document the rationale.', learnMore: 'Search: "colour psychology in UI design" + "WCAG colour contrast"' },
  },
  {
    id: 1003, chapter: 101,
    title: "Red for Success",
    narration: "Your colleague designed a signup flow. When a user successfully creates an account, a banner appears in red saying \"Account created successfully!\"\n\nThey explain: \"Red stands out. Users will definitely notice it.\"",
    choices: [
      { id: 'A', text: 'Ship it — red does stand out.', delta: -10 },
      { id: 'B', text: 'Flag the issue: red means error to most users. Replace with green.', delta: 15 },
      { id: 'C', text: 'Suggest a neutral blue or purple — stands out without triggering the error association.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User testing: 60% of users seeing the red banner immediately try to find what went wrong. Several re-enter their email thinking signup failed. Conversion drops.', lesson: 'Red carries a universal semantic meaning in digital interfaces: error, danger, stop. Overriding convention creates confusion that costs conversions.', principle: 'Colour Convention', principleDetail: 'Red = error, Green = success, Yellow = warning. These aren\'t arbitrary — they\'re learnt from traffic lights, alert systems, and decades of UI convention.' },
      B: { story: 'User testing proves the point: green banners are correctly identified as success in under 1 second. Red banners cause users to pause and re-read. Green ships.', lesson: 'Convention beats novelty when the goal is instant comprehension. Users shouldn\'t have to think about what a success state means.', principle: 'Colour Convention', principleDetail: 'Jakob\'s Law: users spend most of their time on other products. They expect your colour semantics to follow what they already know.' },
      C: { story: 'The blue banner is neutral and unambiguous. It doesn\'t trigger error-panic, but users take slightly longer to identify it as positive. Green would be faster.', lesson: 'Neutral works but the convention already exists. When a convention directly serves user understanding, use it.', principle: 'Colour Convention', principleDetail: 'Inventing a new semantic colour system when a well-understood one already exists creates unnecessary cognitive load.' },
    },
    reflection: { law: 'Jakob\'s Law + Colour Convention', summary: 'Users come to your product with pre-loaded colour meanings. Fighting those meanings slows them down. Use convention deliberately.', realWorld: 'Google\'s Material Design and Apple\'s HIG both define specific semantic colour roles — because consistent convention across products trains users.', bestCall: 'B — green for success. The convention exists for good reason.', learnMore: 'Search: "semantic colours UI" + "Jakob\'s Law Laws of UX"' },
  },
  {
    id: 1004, chapter: 101,
    title: "The Form Error",
    narration: "Launchly's signup form uses colour alone to show errors: invalid fields turn red. No icon, no error message, no label change.\n\nAbout 8% of men have colour vision deficiency. Red-green colour blindness is most common.\n\nAnother designer flags it: \"What about colour-blind users?\"",
    choices: [
      { id: 'A', text: 'It\'s fine — most users can see colour. Edge case.', delta: -10 },
      { id: 'B', text: 'Add error text labels AND an icon (⚠) so the state communicates through colour + text + shape.', delta: 15 },
      { id: 'C', text: 'Add an icon next to the red field so colour-blind users have a second signal.', delta: 5 },
    ],
    consequences: {
      A: { story: 'During testing with a red-green colour-blind participant, they complete the form, submit, and are confused when nothing happens. They can\'t tell which field is invalid. They leave. 8% of men is not an edge case.', lesson: 'Designing only for the majority is an exclusion choice. 8% is not a rounding error.', principle: 'Accessible Error Signalling', principleDetail: 'WCAG 1.4.1 requires that colour is not used as the only visual means of conveying information. Error states must use at minimum one non-colour indicator.' },
      B: { story: 'You add an error icon + descriptive error text. Testing with colour-blind participants: 100% task completion. The error states also test better with all users — they get a specific explanation, not just a red glow.', lesson: 'Redundant encoding — communicating through multiple channels (colour, icon, text) — doesn\'t just help edge cases. It helps everyone.', principle: 'Redundant Error Encoding', principleDetail: 'WCAG 1.4.1: use more than colour alone. Best practice: colour + icon + descriptive text. This triples error detection speed for all users.' },
      C: { story: 'The icon helps colour-blind users distinguish fields, but without error text they still can\'t tell what\'s wrong. Form abandonment reduces but doesn\'t disappear.', lesson: 'Half measures solve half the problem. Error states need to tell users what is wrong, not just that something is wrong.', principle: 'Error State Completeness', principleDetail: 'An error indicator without an error message forces users to guess. The icon shows the symptom; the message identifies the disease.' },
    },
    reflection: { law: 'WCAG 1.4.1 — Use of Colour', summary: 'Colour is a powerful channel but it cannot be the only channel. Accessibility improvements often improve usability for all users.', realWorld: 'Nielsen Norman Group found that adding specific error text to forms reduces form abandonment by up to 22%.', bestCall: 'B — colour + icon + specific error text.', learnMore: 'Search: "WCAG 1.4.1 colour alone" + "form error state best practice"' },
  },
  {
    id: 1005, chapter: 101,
    title: "Dark Mode Decisions",
    narration: "A user tweets: \"Please add dark mode — my eyes are dying during late-night coding sessions.\"\n\nThe tweet gets 40 likes. Your PM says \"let's just invert the colours.\" You know that's not how dark mode works.\n\nYour design system uses a single set of colour tokens.",
    choices: [
      { id: 'A', text: 'Invert the colour palette as a quick fix — good enough for now.', delta: -10 },
      { id: 'B', text: 'Propose building a proper dark token set that maps the same semantic tokens to dark-appropriate values.', delta: 15 },
      { id: 'C', text: 'Use the OS-level dark mode CSS media query to automatically adjust a few key colours.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The inverted palette makes primary buttons black and backgrounds white. Images look like negatives. Status badge colours invert to their semantic opposite. Three bug reports on day one.', lesson: 'Inverting colours is not dark mode — it\'s chaos mode. Dark mode requires every colour decision to be re-evaluated for its new context.', principle: 'Semantic Colour Tokens', principleDetail: 'Proper dark mode requires a separate token set: --color-surface → dark value, --color-text → light value. Raw inversion breaks semantic relationships.' },
      B: { story: 'You build a semantic token system: --color-bg, --color-surface, --color-text-primary. Each maps to a light and dark value. Switching themes is one line of CSS. Dark mode ships correctly.', lesson: 'Design tokens are the infrastructure that makes theming — including dark mode — maintainable at scale.', principle: 'Semantic Colour Tokens', principleDetail: 'Name tokens by purpose (--color-action-primary) not value (--color-blue-500). Purpose-named tokens can remap to different values in dark mode without breaking anything.' },
      C: { story: 'The CSS media query adjusts backgrounds and text, but images, illustrations, and status colours remain in light mode values. Users rate it 2/5. "Better than nothing but not really dark mode."', lesson: 'A partial solution that ships quickly is sometimes fine. But communicate what it is — not what it isn\'t.', principle: 'Dark Mode Completeness', principleDetail: 'CSS prefers-color-scheme catches the easy cases. But shadows, images, elevation, and status colours all need re-evaluation for dark contexts.' },
    },
    reflection: { law: 'Design Tokens + Theming', summary: 'Dark mode is not a filter. It\'s a complete alternative colour system. Building it well reveals whether your colour decisions were semantic or arbitrary.', realWorld: 'GitHub took two years to ship proper dark mode because they had thousands of hardcoded hex values. Token-first colour systems make theming hours, not years.', bestCall: 'B — build semantic tokens and a proper dark palette.', learnMore: 'Search: "design tokens dark mode" + "CSS custom properties theming"' },
  },
  {
    id: 1006, chapter: 101,
    title: "The Health App Palette",
    narration: "Launchly is adding a wellness tracking feature. The PM wants the brand colour — bright electric orange — throughout the feature to keep it \"on brand.\"\n\nUsers will log anxiety levels, sleep quality, and stress scores. The content is personal and often difficult.",
    choices: [
      { id: 'A', text: 'Use the orange everywhere — brand consistency is critical.', delta: -10 },
      { id: 'B', text: 'Propose a distinct sub-palette for the wellness feature — softer, calmer tones — with orange as a subtle accent only.', delta: 15 },
      { id: 'C', text: 'Keep orange but pair with softer secondary colours to create some distinction.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User interviews reveal a pattern: people feel "on edge" when logging anxiety with bright orange everywhere. One participant says it feels like a timer is running. Wellness feature engagement: 40% below expectations.', lesson: 'Brand consistency doesn\'t override emotional appropriateness. The same colour that energises a dashboard can agitate a reflection space.', principle: 'Colour Psychology', principleDetail: 'Orange increases energy and urgency — useful for CTAs, damaging for calming contexts. Colour is not neutral. It sets the emotional register of everything on screen.' },
      B: { story: 'The wellness feature uses soft blues and greens. Users describe it as "a different mode — a space to breathe." Engagement 60% above the main dashboard average.', lesson: 'Great products know when to bend brand guidelines for the user\'s emotional wellbeing. That\'s emotional intelligence in design.', principle: 'Colour Psychology', principleDetail: 'Blue reduces heart rate and signals calm. Green suggests balance and growth. These are measurable psychophysiological responses with decades of research behind them.' },
      C: { story: 'Softer secondary colours help, but orange dominates. Users still feel mildly rushed. The hybrid approach splits the difference without fully committing to what the context needs.', lesson: 'Half-committed solutions often produce half-satisfying outcomes. When context demands a different emotional register, commit to it.', principle: 'Colour Psychology', principleDetail: 'Accent colours don\'t establish the emotional register — the dominant hue does. If orange dominates, the feature feels orange regardless of accents.' },
    },
    reflection: { law: 'Colour Psychology', summary: 'Colour isn\'t just aesthetic — it\'s physiological. Designers who understand emotional colour make products that feel appropriate, not just on-brand.', realWorld: 'Headspace uses muted orange-peach — warm but deliberately low-saturation. Calm uses blue and green almost exclusively. Neither uses their brand colour where it would create anxiety.', bestCall: 'B — a distinct sub-palette for a wellness context.', learnMore: 'Search: "colour psychology product design" + "Headspace design palette"' },
  },
  {
    id: 1007, chapter: 101,
    title: "The Rainbow Dashboard",
    narration: "The marketing team designed a dashboard for Launchly's analytics view using 11 different colours — one for each data category, spanning red, orange, yellow, green, teal, blue, indigo, purple, pink, brown, and grey.\n\n\"Designers love colour,\" the marketer says. \"This is exciting to look at.\"",
    choices: [
      { id: 'A', text: 'Ship it — more colour = more visual interest.', delta: -10 },
      { id: 'B', text: 'Redesign using a maximum of 6-7 colours, chosen with contrast and semantic meaning in mind.', delta: 15 },
      { id: 'C', text: 'Keep all 11 colours but ensure each passes WCAG contrast.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User testing: "I don\'t know where to look." "What does purple mean?" "Why is revenue yellow?" The dashboard is beautiful and impossible to parse. Average time-to-insight triples vs a monochrome prototype.', lesson: 'Colour as decoration competes with colour as information. Too many colours give users no hierarchy to follow — everything screams equally.', principle: 'Colour Limitation', principleDetail: 'Data visualisation studies show comprehension drops when more than 6-7 distinct colours are used without a clear legend. The human eye cannot effortlessly discriminate 11 simultaneous hues.' },
      B: { story: 'You reduce to a 6-colour palette — sequential blues for the primary metric family, distinct accents for revenue, users, and errors. A clear legend at top. Average time-to-insight cuts by 60% in testing.', lesson: 'Fewer, better colours create clarity. Each colour should earn its presence by carrying unique meaning.', principle: 'Colour Limitation', principleDetail: 'Edward Tufte: "every pixel should earn its place." Every colour should too. A colour without unique semantic meaning is visual noise.' },
      C: { story: 'All 11 colours pass contrast but cognitive overload remains. Accessibility improved but comprehension is not. Users still can\'t quickly parse the chart without the legend.', lesson: 'Contrast compliance is necessary but not sufficient. The number of simultaneous colours is a comprehension problem, separate from an accessibility problem.', principle: 'Colour Limitation', principleDetail: 'WCAG addresses contrast (can you see it). Cognitive load addresses colour count (can you make sense of it). Both matter.' },
    },
    reflection: { law: 'Pre-attentive Processing', summary: 'The human visual system extracts colour meaning instantly — but only when there are few enough colours to discriminate. Your palette is a communication system, not a paint box.', realWorld: 'Google\'s Material Design recommends max 3 primary colours per view. Tableau uses carefully calibrated palettes of 5-7 hues.', bestCall: 'B — reduce to 6-7 semantically meaningful colours.', learnMore: 'Search: "data visualisation colour theory" + "Edward Tufte data visualisation"' },
  },
  {
    id: 1008, chapter: 102,
    title: "Two Different Typefaces",
    narration: "You're setting up Launchly's type system. The CEO chose Playfair Display — a high-contrast serif — for marketing site headings.\n\nNow they want to use the same font for the UI: button labels, data tables, navigation items, and form inputs.",
    choices: [
      { id: 'A', text: 'Use Playfair Display everywhere — consistency across marketing and UI.', delta: -10 },
      { id: 'B', text: 'Use a neutral sans-serif (like Inter) for UI, keeping Playfair for marketing headings only.', delta: 15 },
      { id: 'C', text: 'Use Playfair for large UI headings but a sans-serif for everything below 16px.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The UI ships with Playfair Display on buttons, table headers, and navigation. At 12px, high-contrast strokes blur on lower-res screens. Navigation legibility test fails. A developer re-styles 80 components.', lesson: 'Marketing fonts are designed for display at large sizes. UI fonts need to work at 12-14px in dense layouts on sub-retina screens.', principle: 'UI vs Display Typography', principleDetail: 'High-contrast serifs have very thin strokes that disappear at small sizes. UI-first sans-serifs (Inter, Roboto, SF Pro) are engineered for legibility across a wide size range.' },
      B: { story: 'Playfair headlines on marketing pages, Inter throughout the UI. Both serve their context perfectly. The contrast creates visual distinction between the "brand world" and the "product world" — users find this subconsciously helpful.', lesson: 'Different contexts require different typefaces. The best pairing uses each font where it excels.', principle: 'UI vs Display Typography', principleDetail: 'Inter was designed specifically for on-screen legibility — high x-height, open apertures, clear letter spacing. Display fonts are optimised for large sizes and short bursts of text.' },
      C: { story: 'The size threshold helps readability but creates inconsistency — some sections mix Playfair and sans-serif confusingly. Where exactly does a "heading" end? The team debates this constantly.', lesson: 'Mixing fonts by size is harder to maintain than mixing by context. Context-based rules are cleaner and more defensible.', principle: 'Type System Clarity', principleDetail: 'A clear type system assigns each font a role (display, body, UI, code). Size-based rules create fuzzy boundaries that erode over time.' },
    },
    reflection: { law: 'Type System Design', summary: 'Not all fonts are equal in all contexts. UI typography must survive dense layouts, tiny sizes, and varied screens.', realWorld: 'Google uses Product Sans for brand/marketing and Roboto for UI. Apple uses New York for editorial and SF Pro for UI. Both maintain strict context-based type divisions.', bestCall: 'B — a UI-first sans-serif for the product, display font for marketing.', learnMore: 'Search: "UI typography best practices" + "Inter typeface design intentions"' },
  },
  {
    id: 1009, chapter: 102,
    title: "The 11px Copy",
    narration: "A junior designer has been setting body copy at 11px to keep the layout \"clean and minimal.\"\n\nThe long-form content includes pricing details, legal disclaimers, and onboarding instructions that users need to actually read.",
    choices: [
      { id: 'A', text: 'Leave it — minimal design is a valid choice.', delta: -10 },
      { id: 'B', text: 'Set minimum body copy to 16px — the web standard for comfortable reading — and revisit the layout to accommodate it.', delta: 15 },
      { id: 'C', text: 'Raise to 14px as a compromise between minimal and readable.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Analytics shows users spend 4 seconds on the pricing page then leave. Heat maps show they\'re not scrolling past the first paragraph. Qualitative interviews: "The text is too small to bother reading on my phone."', lesson: 'A design that looks clean but users won\'t read has failed. Minimal is not a virtue when it defeats the content\'s purpose.', principle: 'Minimum Readable Type Size', principleDetail: 'The browser default is 16px for a reason: reading studies show 16-18px is the range where most adults read comfortably. Below 14px, comprehension drops significantly.' },
      B: { story: 'You redesign the layout to accommodate 16px body copy. Dwell time doubles. On mobile, 16px is especially critical — 11px at arm\'s length is genuinely unreadable.', lesson: 'Legibility is a prerequisite for everything else. Users can\'t understand what they can\'t read.', principle: 'Minimum Readable Type Size', principleDetail: '16px is the browser default. It emerged from decades of reading research. Going below it requires exceptional justification.' },
      C: { story: '14px is better but marginal. Mobile users on non-retina screens still find it straining.', lesson: '14px is the industry minimum, not the ideal. For body copy users need to act on, 16px is safer.', principle: 'Minimum Readable Type Size', principleDetail: 'At 14px you need perfect line-height and very high contrast to maintain readability. 16px gives you more margin.' },
    },
    reflection: { law: 'Readability', summary: 'Type size is not a style choice — it\'s a communication decision. If users can\'t comfortably read your copy, the copy doesn\'t exist as far as they\'re concerned.', realWorld: 'The UK Government Design System sets minimum body text at 16px after user research showed smaller sizes caused form errors and reading abandonment, especially for older users.', bestCall: 'B — 16px minimum for body copy users need to read.', learnMore: 'Search: "optimal body text size web" + "GOV.UK typography system"' },
  },
  {
    id: 1010, chapter: 102,
    title: "The Dense Paragraph",
    narration: "Launchly's help documentation has 16px body copy but line-height is set to 1.0 — no extra leading.\n\nUsers complain: \"The text feels suffocating.\"",
    choices: [
      { id: 'A', text: 'The complaints are about content. Tell the content team to simplify the writing.', delta: -10 },
      { id: 'B', text: 'Set line-height to 1.5–1.6 — the standard range for comfortable body text reading.', delta: 15 },
      { id: 'C', text: 'Add paragraph spacing below each paragraph to separate blocks visually.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The content team simplifies but line-height stays at 1.0. Users still describe the text as hard to read. The feedback loop was wrong. The problem was always layout, not content length.', lesson: 'Don\'t attribute a typographic problem to a content problem. Learn to distinguish the two.', principle: 'Line Height', principleDetail: 'Reading speed research shows optimal line-height is 1.5-1.6× the font size. At 1.0, the eye has difficulty tracking from line-end to the start of the next line.' },
      B: { story: 'Changing line-height from 1.0 to 1.5 transforms the page. Users describe it as "much more breathable." Average dwell time on documentation increases 35%. A tiny CSS change with a large comprehension impact.', lesson: 'Line height is one of the highest-leverage typography decisions. A 0.5 multiplier change can transform content from illegible to comfortable.', principle: 'Line Height', principleDetail: '1.5× gives the eye a clear channel to return to the start of the next line. Below 1.2 causes eye-tracking errors. Above 2.0 causes lines to feel disconnected.' },
      C: { story: 'Paragraph spacing helps separate blocks but within each paragraph lines remain too close. Users can navigate between paragraphs but still strain within them.', lesson: 'Paragraph spacing and line-height solve different problems. You need both.', principle: 'Line Height vs Paragraph Spacing', principleDetail: 'Line-height: the vertical rhythm within a paragraph. Paragraph spacing: the separation between ideas. Both are required for comfortable long-form reading.' },
    },
    reflection: { law: 'Readability — Line Height', summary: 'Line height is invisible to users who have it right. It\'s suffocating to users who don\'t. Get it to 1.5× and leave it.', realWorld: 'Medium\'s reading experience team documented that line-height of 1.58 is optimal for their reading audience — significantly above the browser default of 1.2.', bestCall: 'B — set line-height to 1.5-1.6 for all body copy.', learnMore: 'Search: "optimal line height typography" + "CSS line-height reading research"' },
  },
  {
    id: 1011, chapter: 102,
    title: "The Weight Explosion",
    narration: "You open Launchly's design and count font weights in use: Thin (100), Light (200), Regular (300), Medium (400), SemiBold (500), Bold (600), ExtraBold (700).\n\nSeven weights across one typeface. No clear hierarchy for when each is used.",
    choices: [
      { id: 'A', text: 'Document each weight with a use case and keep all seven — more options = more flexibility.', delta: -10 },
      { id: 'B', text: 'Reduce to 3 weights: Regular for body, SemiBold for UI labels, Bold for headings — and enforce them.', delta: 15 },
      { id: 'C', text: 'Reduce to 4 weights — add Medium as a fourth tier for secondary headings.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Seven documented weights create a decision problem: designers spend time choosing between Medium and SemiBold for a button label. Developers pick whichever is easiest. The system remains incoherent.', lesson: 'More options are not more flexibility — they\'re more decisions. The value of a type system is in removing decisions, not multiplying them.', principle: 'Typographic Hierarchy', principleDetail: 'A type system should give every element a single correct weight. If you need to "decide" which weight to use, your system has too many options.' },
      B: { story: 'Three weights create clear hierarchy. Heading = Bold. Label/button = SemiBold. Body = Regular. Developers implement it in three CSS variables. New designers apply it correctly on day one without documentation.', lesson: 'The best systems have so few options that the right answer is obvious. Constraints are clarity.', principle: 'Typographic Hierarchy', principleDetail: 'Miller\'s Law: humans hold 7±2 items in working memory. A seven-weight system is at cognitive capacity. A three-weight system is automatic.' },
      C: { story: 'Four weights work, but "Medium" and "SemiBold" are close enough that designers regularly debate which to use for secondary headings.', lesson: 'When two weights look similar enough to cause debate, one of them is redundant.', principle: 'Typographic Hierarchy', principleDetail: 'Font weight differences need to be clearly perceivable. The difference between Medium (500) and SemiBold (600) is subtle. Bold (700) vs Regular (400) is immediately apparent.' },
    },
    reflection: { law: 'Visual Hierarchy — Typography', summary: 'A type system is not a font library. It\'s a hierarchy. Three weights, used with intention, create clearer hierarchy than seven used ad-hoc.', realWorld: 'GOV.UK design system uses exactly two weights: regular and bold — nothing else. They found any more created inconsistency and designer fatigue.', bestCall: 'B — three weights, each with a clear role.', learnMore: 'Search: "type scale design system" + "font weight hierarchy UI"' },
  },
  {
    id: 1012, chapter: 102,
    title: "The Display Font in the Table",
    narration: "A designer wants to use the brand display font — a decorative script — for column headers in Launchly's data table.\n\n\"It looks unique and on-brand,\" they say.\n\nThe table has 12 columns: \"Acquisition Date,\" \"Revenue,\" \"Conversion Rate,\" etc.",
    choices: [
      { id: 'A', text: 'Approve it — brand differentiation matters.', delta: -10 },
      { id: 'B', text: 'Reject it — decorative fonts in data tables damage scannability. Use the UI font at SemiBold.', delta: 15 },
      { id: 'C', text: 'Suggest a brand colour applied to column headers in the regular UI font.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Users in data-heavy roles spend 40% more time locating specific columns compared to a sans-serif control group. The decorative script draws the eye but slows pattern recognition. One power user calls it "a joke."', lesson: 'Functional contexts require functional type. Data tables are tools, not canvases.', principle: 'Functional Typography', principleDetail: 'Decorative fonts require more cognitive effort to decode. In scanning tasks, this slows users down. The more functional the context, the plainer the type should be.' },
      B: { story: 'SemiBold UI font on column headers. Users scan and locate columns 60% faster than the script version. The table is invisible in the best way — it gets out of the user\'s way and lets them work.', lesson: 'The best typography in a functional context is the typography users don\'t notice — because they\'re focused on the task, not the font.', principle: 'Functional Typography', principleDetail: 'Tables, dashboards, forms need type with high letter-differentiation and low decorative overhead. Sans-serif, medium-weight, consistent spacing.' },
      C: { story: 'Brand colour on header text adds brand presence without hurting legibility. Not as clean as pure UI type but a reasonable middle ground.', lesson: 'Brand expression in functional contexts works when it uses colour and spacing, not type style.', principle: 'Functional Typography', principleDetail: 'Colour is pre-attentive — the eye sees it without effort. Unusual letterforms require more active decoding. Use the right visual channel for brand expression in data contexts.' },
    },
    reflection: { law: 'Legibility vs Readability', summary: 'Legibility (can I decode this character?) matters more than beauty in data contexts. Every millisecond of decoding overhead accumulates into frustration.', realWorld: 'Bloomberg Terminal is notoriously ugly by graphic design standards — monospace fonts, dense layouts, no decoration. It\'s beloved by traders because it\'s maximally efficient for data scanning.', bestCall: 'B — functional type for functional contexts.', learnMore: 'Search: "legibility vs readability typography" + "data table UX best practices"' },
  },
  {
    id: 1013, chapter: 102,
    title: "Same Size Everywhere",
    narration: "Launchly's mobile app uses the same type sizes as desktop — 16px body, 24px headings, 12px captions.\n\nOn mobile, the 24px heading takes up almost half the screen width. The 12px caption is nearly invisible.",
    choices: [
      { id: 'A', text: 'Keep sizes consistent across platforms — different sizes would create inconsistency.', delta: -10 },
      { id: 'B', text: 'Implement a fluid type scale: smaller heading sizes on mobile, slightly larger captions.', delta: 15 },
      { id: 'C', text: 'Reduce only headings on mobile — keep body and captions the same.', delta: 5 },
    ],
    consequences: {
      A: { story: '24px heading wraps to two lines on 320px screens. On iPhone SE, some captions overlap tap targets. App Store reviews: "cluttered" and "hard to read on small screens."', lesson: 'Typography that works on a 1440px canvas doesn\'t automatically work on a 375px screen.', principle: 'Responsive Typography', principleDetail: 'Screen size changes the visual weight of type relative to its context. 24px on 1440px is small. 24px on 375px dominates. Scale must adapt to screen real estate.' },
      B: { story: 'Mobile headings drop to 20px, captions rise to 13px. The hierarchy is preserved but appropriately scaled. App Store review: "Feels native. Totally legible."', lesson: 'A good type scale is responsive to context. The hierarchy is the constant — the sizes adapt.', principle: 'Responsive Typography', principleDetail: 'Define hierarchy in abstract (H1, H2, body, caption) and assign context-specific sizes per breakpoint. CSS clamp() allows continuous scaling between breakpoints.' },
      C: { story: 'Smaller headings prevent wrapping. Body and caption issues remain — 12px on dense mobile UI is too small for most users, especially during one-handed use.', lesson: 'Partial responsive typography is better than none, but you need to evaluate every scale level at every breakpoint.', principle: 'Responsive Typography', principleDetail: 'Mobile demands special care for the smallest elements: captions, labels, and helper text that are secondary on desktop become barriers to usability on mobile if too small.' },
    },
    reflection: { law: 'Responsive Typography', summary: 'Typography is relative. The same number of pixels has different visual weight on different screens. Design the hierarchy — let the scale adapt.', realWorld: 'Apple\'s Human Interface Guidelines define different type sizes for each device class — iPhone, iPad, Mac — with distinct recommended ranges for each text role.', bestCall: 'B — a responsive scale that adapts heading and caption sizes per breakpoint.', learnMore: 'Search: "fluid typography CSS clamp" + "Apple HIG typography"' },
  },
  {
    id: 1014, chapter: 102,
    title: "ALL CAPS BODY",
    narration: "Your PM wants to add urgency to an onboarding prompt by setting body text in all caps:\n\n\"COMPLETE YOUR PROFILE TO GET THE MOST OUT OF LAUNCHLY. ADD YOUR TEAM, CONNECT YOUR TOOLS, AND SET YOUR GOALS.\"\n\n\"It grabs attention,\" the PM argues.",
    choices: [
      { id: 'A', text: 'Set it in all caps — the PM is right that it grabs attention.', delta: -10 },
      { id: 'B', text: 'Reject all caps for body text — it slows reading speed significantly. Use sentence case; add visual weight through size or colour instead.', delta: 15 },
      { id: 'C', text: 'Use small-caps instead of full caps — more elegant and less reading-speed impact.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User testing: participants identify the section as "a warning" or "shouting at me." Two describe it as "aggressive." Profile setup completion drops to 22%. The perception of urgency backfired into aversion.', lesson: 'All caps triggers the perception of shouting — a social norm from decades of internet culture. It creates aversion, not urgency.', principle: 'Case and Legibility', principleDetail: 'ALL CAPS reduces reading speed because it creates uniform word shapes — no ascenders or descenders for the eye to use as recognition shortcuts. Mixed case creates distinct word silhouettes.' },
      B: { story: 'Sentence case with a bold heading and action-focused CTA button: "Unlock the full platform." Profile setup completion: 58%.', lesson: 'Urgency through design means hierarchy and clarity. Urgency through all caps means noise and avoidance.', principle: 'Case and Legibility', principleDetail: 'Mixed case is 10-30% faster to read than all caps (studies by Miles Tinker, replicated multiple times). Every second of reading friction is an opportunity to disengage.' },
      C: { story: 'Small-caps looks more polished than all caps and reads marginally better, but still carries a "formal announcement" register that doesn\'t match the friendly onboarding tone.', lesson: 'Small-caps is the right tool for legal disclaimers and formal headings — not conversational onboarding copy.', principle: 'Tone Through Type', principleDetail: 'Type case contributes to tone: ALL CAPS = urgency/alarm. SMALL CAPS = formal. Sentence case = conversational. Match the case to the emotional register you want.' },
    },
    reflection: { law: 'Case and Reading Speed', summary: 'All caps has its place — logos, monograms, short labels. Three sentences of body text in all caps is a reading obstacle that produces the opposite of the intended effect.', realWorld: 'Apple\'s HIG explicitly recommends against all-caps for body text and button labels. When Apple tested it, all-caps consistently underperformed mixed case on comprehension.', bestCall: 'B — sentence case; create hierarchy through size and weight, not case.', learnMore: 'Search: "all caps reading speed research" + "case sensitivity UI text"' },
  },
  {
    id: 1015, chapter: 103,
    title: "The 7px Mistake",
    narration: "A developer comes to you: \"I need to add 7px of padding to this element. Your design has 8px of padding on similar elements everywhere else.\"\n\nYou know the design uses an 8pt grid.",
    choices: [
      { id: 'A', text: 'Allow 7px — it\'s a tiny difference and the developer knows the implementation context.', delta: -10 },
      { id: 'B', text: 'Hold the 8px. Explain the grid system and why breaking it creates long-term inconsistency.', delta: 15 },
      { id: 'C', text: 'Compromise: allow 6px — it\'s a multiple of 2 and close enough.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Six months later the codebase has padding values of 6px, 7px, 8px, 9px, 12px, 13px, 16px. No one knows which to use. "Where did our grid go?" you ask at a review.', lesson: 'Every exception to a grid system creates a precedent. Exceptions compound. The grid works through universal adoption.', principle: '8pt Grid System', principleDetail: 'An 8pt grid means all spacing uses multiples of 8. Adherence ensures visual consistency. One exception is the start of a slippery slope.' },
      B: { story: 'The developer is initially frustrated but understands when you show them the component library built on 8pt spacing. The element uses 8px — it looks fine in context. The grid holds.', lesson: 'Systems thinking means seeing the individual decision in context of the whole.', principle: '8pt Grid System', principleDetail: 'The 8pt grid works because every device screen is divisible by 8 — grid-aligned values never produce sub-pixel rendering on any common screen density. 7px creates half-pixel boundaries on 2x screens.' },
      C: { story: '6px is still a break from an 8pt grid. If your grid is 8pt, 6px is off-system. The principle is about adherence, not approximate adherence.', lesson: 'Know what your grid actually is and maintain the actual system.', principle: '8pt Grid System', principleDetail: 'Exceptions to grids are sometimes necessary (hairline borders, 1px dividers). When they are, document them as intentional exceptions — not normalise them as new values.' },
    },
    reflection: { law: '8pt Grid System', summary: 'A grid is a covenant. It works because everyone follows it. The moment exceptions normalise, the grid becomes a suggestion — and suggestions compound into chaos.', realWorld: 'Google\'s Material Design 3 mandates an 8dp base grid. Every component, every icon, every spacing token is a multiple of 8. This is why Material UIs look coherent across products.', bestCall: 'B — hold the 8px and explain why the grid exists.', learnMore: 'Search: "8pt grid system design" + "Material Design spacing"' },
  },
  {
    id: 1016, chapter: 103,
    title: "The Suffocating Form",
    narration: "A developer builds Launchly's account settings form from your wireframe. Every field is 8px away from the next. The form has 12 fields. It looks like a wall.\n\nThe wireframe was meant to show layout order — you hadn\'t specified vertical spacing yet.",
    choices: [
      { id: 'A', text: 'Leave it — the data is all there, which is what matters.', delta: -10 },
      { id: 'B', text: 'Spec proper group spacing: 24-32px between field groups, 16px within groups, and a visual header for each section.', delta: 15 },
      { id: 'C', text: 'Add 16px between every field as a quick fix.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User testing: participants can\'t find the "notification preferences" section without scanning all 12 fields. Task completion for changing a specific setting drops to 45% in 90 seconds.', lesson: 'Forms are not lists of fields. They are structured tasks. Without grouping and breathing room, users can\'t navigate them mentally or physically.', principle: 'Form Spacing & Grouping', principleDetail: 'Gestalt Law of Proximity: elements close together are perceived as belonging together. Without group gaps, 12 fields feel like 12 equal tasks.' },
      B: { story: 'The settings form gets three labelled sections: Account, Notifications, Security. User navigation task completion rises to 87%. One participant: "Oh, it\'s actually organised."', lesson: 'White space is not empty space — it\'s structure.', principle: 'Form Spacing & Grouping', principleDetail: 'Baymard Institute research shows visually grouped form fields increase form completion rates by 20-40% compared to flat lists of fields.' },
      C: { story: 'Uniform 16px reduces the wall-of-fields feeling but doesn\'t create grouping. Users still have to read every label to find their target.', lesson: 'Uniform spacing distributes breathing room without creating structure. Varied spacing is the grammar of form layout.', principle: 'Gestalt Proximity in Forms', principleDetail: 'Proximity creates perceptual grouping. Uniform spacing treats all elements as equally related — which means no structure at all.' },
    },
    reflection: { law: 'Gestalt Law of Proximity', summary: 'Proximity is one of the most powerful tools in form design. Items near each other feel related. Items further apart feel separate. Use this deliberately.', realWorld: 'Stripe\'s checkout form groups card number, expiry, and CVC tightly — because they are conceptually one thing. Address fields form another group. Visual grouping matches the mental model.', bestCall: 'B — group fields with varied spacing and section headers.', learnMore: 'Search: "form design spacing best practice" + "Gestalt proximity in UI"' },
  },
  {
    id: 1017, chapter: 103,
    title: "The Inconsistent Cards",
    narration: "Launchly's dashboard has three types of cards: metric cards (16px padding), alert cards (20px padding), and profile cards (24px padding).\n\nAll three appear on the same page. No documented reason for the differences.",
    choices: [
      { id: 'A', text: 'Different card types can have different padding — each was designed for its content.', delta: -10 },
      { id: 'B', text: 'Standardise all cards to 16px padding and resolve content-specific needs within that constraint.', delta: 15 },
      { id: 'C', text: 'Document the three sizes as a card scale: Compact (16px), Standard (20px), Spacious (24px) with usage guidelines.', delta: 5 },
    ],
    consequences: {
      A: { story: 'A new designer adds a fourth card type with 18px padding. "Felt right," they say. There\'s no documentation to correct them. The dashboard now has four padding values. Developers ask which to use in code.', lesson: 'Undocumented inconsistency grows. What\'s a quirk today is a system in six months.', principle: 'Component Consistency', principleDetail: 'When similar components have different behaviour, users spend cognitive effort figuring out if the difference means something. Inconsistency is noise unless deliberately signalled.' },
      B: { story: 'Standardising to 16px requires some content restructuring but the visual coherence is immediately apparent. Users stop noticing the cards and start noticing the content. Which is the goal.', lesson: 'Consistency is a usability feature. Consistent components allow users to focus on content, not try to decode visual differences.', principle: 'Component Consistency', principleDetail: 'A card with more padding unconsciously suggests higher importance — even if not intended. Unintentional hierarchy is misleading hierarchy.' },
      C: { story: 'A documented scale is better than undocumented variation. The guidelines prevent further drift. It works — but three padding values for one component type is two more than most design systems recommend.', lesson: 'Documentation beats chaos. But the simplest system that solves the problem is better than a complex, documented one.', principle: 'Design System Simplicity', principleDetail: 'A card scale makes sense when content types genuinely have different density requirements. If the difference is aesthetic, collapse to one value.' },
    },
    reflection: { law: 'Component Consistency', summary: 'Inconsistency in UI is a tax on users\' attention. Consistent components allow users to stop thinking about the shell and start thinking about the content.', realWorld: 'Atlassian\'s Design System has one card component with padding defined at the token level — not per instance. Every card on every Atlassian product has the same spatial feel.', bestCall: 'B — standardise to one card padding.', learnMore: 'Search: "design system component consistency" + "Atlassian Design System"' },
  },
  {
    id: 1018, chapter: 103,
    title: "Margin or Padding?",
    narration: "A junior developer asks: \"Should the space between the button and the next element be margin on the button, or padding on its container?\"\n\nThis seems like a code question, but it has design implications.",
    choices: [
      { id: 'A', text: 'Tell them to do whatever is easiest in code — spacing decisions are the developer\'s call.', delta: -10 },
      { id: 'B', text: 'Explain the rule: padding belongs inside the component, margin belongs to layout. Components should not include external margins.', delta: 15 },
      { id: 'C', text: 'Specify margin on the button — it\'s simpler and achieves the same visual result.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The developer adds margin to the button component. When the button appears in a flex row, margin creates gaps in the wrong places. In full-width layout, margin creates unwanted side gaps. Three layout bugs in week one.', lesson: 'Spacing decisions are design decisions. Leaving them to developers without guidance produces inconsistency the design team then has to debug.', principle: 'Margin vs Padding', principleDetail: 'Margin is external: creates space outside the component, affecting layout context. Padding is internal: creates space inside the component. Components with built-in margins are difficult to reuse in different layout contexts.' },
      B: { story: 'The button is defined with only padding. The spacing between the button and other elements is the layout\'s responsibility — through flex gap, grid gap, or parent padding. The button works in every context without producing spacing bugs.', lesson: 'A component should be "context-blind" — it should work in any layout container without imposing itself.', principle: 'Margin vs Padding', principleDetail: 'Atomic design principle: components define their own interior space. Layouts define space between components. Mixing them creates inflexible, context-specific components.' },
      C: { story: 'Margin works for this specific context but when the button is reused in a card footer, modal footer, or toolbar, built-in margin creates layout problems.', lesson: 'What works in one context fails in another if the component carries external spatial assumptions.', principle: 'Margin vs Padding', principleDetail: 'CSS margin is the component\'s relationship with the world. That relationship changes with context. Internal padding is constant. Build constants into the component; manage variables in the layout.' },
    },
    reflection: { law: 'Component Spatial Responsibility', summary: 'The margin/padding distinction is where design meets code. A component that knows its own interior space but doesn\'t dictate its relationship to the world is reusable.', realWorld: 'Every major design system (Material, Fluent, Polaris, Carbon) defines components with zero external margin. Spacing between components is always specified at the layout level.', bestCall: 'B — padding is the component\'s responsibility; margin is the layout\'s.', learnMore: 'Search: "margin vs padding design systems" + "atomic design spacing"' },
  },
  {
    id: 1019, chapter: 103,
    title: "Freeform Spacing",
    narration: "Launchly's design file was worked on by three designers over six months. There is no grid. Some spacing is 7px, some 8px, some 10px, some 12px, some 14px. Visual differences are imperceptible — but in CSS, each is a separate magic number.\n\nYou've been asked to \"clean it up before the design system launch.\"",
    choices: [
      { id: 'A', text: 'Round everything to the nearest 4px — that\'s close enough.', delta: 5 },
      { id: 'B', text: 'Establish an 8pt grid, snap all existing values to it, and document why — starting with the most frequently used components.', delta: 15 },
      { id: 'C', text: 'Leave existing values and add a grid going forward — legacy components can stay as-is.', delta: -10 },
    ],
    consequences: {
      A: { story: 'Rounding to 4px reduces chaos from 12 values to 7. But without a documented grid principle, new designers continue adding nearby values. The chaos has a smaller range but persists.', lesson: 'Rounding is a fix, not a system. Without a principle behind it, the chaos regenerates.', principle: 'Spatial Scale', principleDetail: 'A grid system is not just a set of numbers — it\'s a rule (multiples of N) and a reason (visual rhythm, device-density compatibility). The reason prevents future drift.' },
      B: { story: 'You spend a week snapping the 40 most-used components to an 8pt grid. You document the scale: 4, 8, 12, 16, 24, 32, 48, 64. You write a one-page guide. Spatial debt: resolved.', lesson: 'Technical debt in spacing is real and accumulates. The best time to resolve it is before the design system launches.', principle: 'Spatial Scale', principleDetail: 'A spatial scale is a design system\'s skeleton. A coherent scale means any designer or developer on the team will produce consistent layouts without thinking about it.' },
      C: { story: 'Legacy components stay inconsistent. New components follow the grid. Within three months, the design file has two visual registers: "old messy" and "new clean." Users feel the seam.', lesson: 'A design system that doesn\'t clean up the past creates a two-tier product that users experience as unfinished.', principle: 'Design System Migration', principleDetail: 'The hardest part of design system launches is migration. Skip it and you ship a system with an asterisk: "applies to new work only."' },
    },
    reflection: { law: 'Spatial Scale / 8pt Grid', summary: 'Spacing debt is invisible to users but visible to anyone who builds on top of it. A clean spatial scale is the foundation everything else sits on.', realWorld: 'Shopify spent 18 months migrating Polaris components to a 4pt grid from a legacy freeform layout system. The migration was announced publicly — because it unlocked component predictability across all Shopify products.', bestCall: 'B — establish the grid, snap existing components, document it.', learnMore: 'Search: "design system spatial scale" + "Shopify Polaris spacing"' },
  },
  {
    id: 1020, chapter: 103,
    title: "Mobile Padding",
    narration: "Launchly's mobile app has the same 24px padding inside cards as desktop.\n\nOn a 375px screen, a card with 24px padding on both sides leaves only 327px for content. With a chart, icon, and title, the card is cramped.\n\nThe PM says \"reduce padding to 8px — we need space.\"",
    choices: [
      { id: 'A', text: 'Reduce to 8px as the PM suggests — give the content more room.', delta: -10 },
      { id: 'B', text: 'Reduce to 16px — a medium reduction that preserves breathing room while freeing more content space.', delta: 15 },
      { id: 'C', text: 'Keep 24px but redesign the card content to use space more efficiently.', delta: 5 },
    ],
    consequences: {
      A: { story: 'At 8px, content touches the edge too closely for comfortable tapping. Users accidentally trigger card actions when scrolling. Fitts\'s Law: tap targets at card edges are harder to hit without touching adjacent elements. Three finger-tap complaints in app reviews.', lesson: '8px is below the comfortable minimum for mobile padding. Content needs room to breathe — especially around tap targets.', principle: 'Mobile Spatial Minimums', principleDetail: 'Apple HIG recommends minimum 16px padding around interactive elements. At 8px, scroll momentum and touch imprecision cause accidental taps.' },
      B: { story: '16px padding finds the right balance. Content has room to breathe. Tap targets near edges are safely padded. User testing shows no accidental tap issues.', lesson: '16px is the mobile padding sweet spot for card-based content.', principle: 'Mobile Spatial Minimums', principleDetail: 'Context-appropriate spacing on mobile: 16px for most padding, 8px for compact list items, 24px for spacious sections. Never below 8px for padding around interactive content.' },
      C: { story: 'Redesigning card content to be denser is a significant undertaking. The content team pushes back. Three weeks of redesign to solve a padding problem that a CSS change could address.', lesson: 'The simplest solution to a spatial problem is often a spatial solution. Don\'t redesign content when a spacing adjustment would do.', principle: 'Proportionate Response', principleDetail: 'Design decisions should be proportionate to the problem. Over-engineering a solution to avoid the simpler fix is scope creep.' },
    },
    reflection: { law: 'Touch Target Spacing', summary: 'Mobile spacing isn\'t just about aesthetics — it\'s about ergonomics. The same padding that looks spacious on desktop is the bare minimum needed to make mobile tapping reliable.', realWorld: 'Google\'s Material Design defines 48dp as the minimum touch target size. Apple\'s HIG recommends 44×44pt. Both exist because human fingers are imprecise tools that need adequate space.', bestCall: 'B — 16px padding on mobile cards.', learnMore: 'Search: "mobile touch target size guidelines" + "Material Design spacing"' },
  },
  {
    id: 1021, chapter: 103,
    title: "The Button Without Breathing Room",
    narration: "Launchly's primary button has 8px top/bottom padding and 12px left/right padding.\n\nThe button label is \"Submit application.\" At 14px, the text fits — barely. The button looks small and feels hard to click.\n\nA developer says: \"It meets the minimum touch target size, so it\'s fine.\"",
    choices: [
      { id: 'A', text: 'Minimum is fine — meeting the spec is what matters.', delta: -10 },
      { id: 'B', text: 'Increase to 12px top/bottom, 24px left/right — comfortable padding, not just compliant padding.', delta: 15 },
      { id: 'C', text: 'Increase top/bottom to 12px only — the horizontal label text has enough room.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The button meets the 44px minimum height. But user testing reveals a 22% miss rate on tap — users tap the button but land below it and trigger the "forgot password" link. Minimum is necessary but not sufficient.', lesson: 'Meeting minimum specs is a floor, not a ceiling. Users deserve comfortable targets, not just technically compliant ones.', principle: 'Touch Target Comfort', principleDetail: 'Comfortable buttons have 12-16px vertical padding and 20-24px horizontal padding. The label floats in a field of white space that makes the tap feel easy.' },
      B: { story: 'With 12px × 24px padding, the button has presence and feels obviously clickable. Tap miss rate drops to 3%. The button also passes the "does this look important?" test on first glance.', lesson: 'Padding is a trust signal. A button with generous padding says "I matter, click me." A button with minimal padding says "I\'m optional."', principle: 'Touch Target Comfort', principleDetail: 'Research shows buttons with generous padding are identified as interactive and primary faster than tight-padded ones.' },
      C: { story: 'Vertical padding improvement helps hit rate slightly. Horizontal padding remains tight — for "Submit application" at 14px, the label crowds the edges. An asymmetrically comfortable button.', lesson: 'Button padding should feel comfortable in both dimensions. Fixing one side while leaving the other constrained produces an off-balance result.', principle: 'Touch Target Comfort', principleDetail: '24px horizontal padding is a common comfortable minimum for text buttons. This is especially important for longer labels.' },
    },
    reflection: { law: 'Fitts\'s Law + Touch Ergonomics', summary: 'The minimum target size is a legal floor. Comfortable design lives above the floor. Give your buttons room to breathe and they\'ll repay you with better conversion.', realWorld: 'Shopify\'s Polaris specifies button padding as 12px vertical, 24px horizontal for medium buttons — as default, not minimum. They found this produces the highest task success rates in checkout flows.', bestCall: 'B — 12px × 24px padding for a comfortable, accessible button.', learnMore: 'Search: "button padding best practice UI" + "Fitts\'s Law button size"' },
  },
  {
    id: 1022, chapter: 104,
    title: "The Flat Dashboard",
    narration: "Launchly's analytics dashboard has 12 widgets — all the same size, same card, same font weight, same colour. All equally prominent.\n\n\"Everything is important,\" the PM insists.",
    choices: [
      { id: 'A', text: 'Keep all widgets equal — the PM knows their users.', delta: -10 },
      { id: 'B', text: 'Establish a visual hierarchy: 2-3 hero metrics large at the top, secondary metrics smaller below, tertiary data in a compact table at the bottom.', delta: 15 },
      { id: 'C', text: 'Add colour-coding to differentiate metric categories — revenue green, engagement blue, health orange.', delta: 5 },
    ],
    consequences: {
      A: { story: 'User research: "I don\'t know where to start." Users spend 40 seconds scanning before taking any action. Heat maps show random scanning patterns. "Everything is important" means nothing is.', lesson: 'When everything is equally prominent, nothing is prominent. Hierarchy is not about hiding information — it\'s about directing attention to what matters first.', principle: 'Visual Hierarchy', principleDetail: 'Pre-attentive processing: the human visual system automatically identifies hierarchical differences in size, weight, and position before conscious attention kicks in. Remove hierarchy and users must consciously scan everything.' },
      B: { story: 'Revenue, active users, and churn at large. Secondary metrics in a 2-column grid. Tertiary data collapsed into a table. Average time to first productive action: 6 seconds. "Instantly clear," says a user.', lesson: 'Good hierarchy is discovered through understanding user priorities. The question isn\'t "what should be big?" but "what do users look for first?"', principle: 'Visual Hierarchy', principleDetail: 'Size, weight, position, and contrast are the four levers of visual hierarchy. Used together they create a reading order that matches the user\'s task priority.' },
      C: { story: 'Colour-coding creates categorical grouping but not priority hierarchy. Users can now find revenue metrics faster but can\'t tell which individual metric to look at first.', lesson: 'Colour communicates category. Size communicates priority. Both serve different goals.', principle: 'Visual Hierarchy', principleDetail: 'Two dimensions of hierarchy in dashboards: priority (what matters most) and category (what belongs together). Colour handles category. Size, weight, and position handle priority.' },
    },
    reflection: { law: 'Visual Hierarchy + Pre-attentive Processing', summary: 'A dashboard is a reading contract. The designer decides what the user reads first. When nothing has priority, users must supply their own — which takes effort, causes errors, and creates frustration.', realWorld: 'Stripe\'s Dashboard uses three large "hero" numbers at the top of every view — the one number you need to assess health at a glance. Every other metric is secondary.', bestCall: 'B — hero metrics at the top, secondary below, tertiary in table form.', learnMore: 'Search: "dashboard design hierarchy" + "pre-attentive visual processing"' },
  },
  {
    id: 1023, chapter: 104,
    title: "Z or F?",
    narration: "Launchly's homepage is being redesigned. It has a hero section, three feature sections, pricing, and social proof.\n\nThe current layout is F-pattern: all content left-aligned. A new designer proposes Z-pattern: alternating left-right image/text blocks.",
    choices: [
      { id: 'A', text: 'Keep the F-pattern — it\'s what users expect on content pages.', delta: 5 },
      { id: 'B', text: 'Use Z-pattern for the feature sections — it creates visual rhythm and directs the eye across the page.', delta: 15 },
      { id: 'C', text: 'Use neither — design for the content, not an eye-tracking pattern.', delta: -10 },
    ],
    consequences: {
      A: { story: 'F-pattern keeps the page coherent but all-left alignment makes the right side dead space. Images stack vertically in the left column. The page reads as a long text document, not a product showcase.', lesson: 'F-patterns work for content-heavy reading — articles, documentation. Marketing pages benefit from visual rhythm that a strict F-pattern denies.', principle: 'Eye-Tracking Patterns', principleDetail: 'F-pattern: users read the first line fully, then scan down the left edge. This fits text-heavy content. Z-pattern: users scan diagonally across alternating content blocks — better for visual, scannable marketing pages.' },
      B: { story: 'Alternating feature blocks create rhythm. Users\' eyes naturally travel from left headline → right image → left image → right description. The diagonal movement keeps them engaged longer. Time-on-page increases 28%.', lesson: 'Eye-tracking patterns are design tools. Use the pattern that serves the content and keeps attention engaged.', principle: 'Eye-Tracking Patterns', principleDetail: 'The Z-pattern creates movement — the eye follows a path, not a list. This momentum keeps users scrolling longer than a uniform left-aligned layout.' },
      C: { story: 'Without a guiding principle, the designer makes ad-hoc decisions about image placement. The result is inconsistent — two sections left-right, one full-width, one left-only. The page feels arbitrary.', lesson: 'Designing "for the content" without a layout principle is a recipe for inconsistency.', principle: 'Eye-Tracking Patterns', principleDetail: 'Eye-tracking research provides layout principles that predict user attention patterns. Ignoring them doesn\'t free you from them — users will still scan your page in predictable ways.' },
    },
    reflection: { law: 'Eye-Tracking Patterns (F and Z)', summary: 'Reading patterns are habits, not choices. Designing a layout without understanding how eyes move across a screen is like writing without understanding grammar.', realWorld: 'Nielsen Norman Group\'s eye-tracking research identified F and Z patterns in the early 2000s. Every major marketing site since (Stripe, Notion, Linear, Vercel) uses Z-pattern alternating blocks in their feature sections.', bestCall: 'B — Z-pattern for feature sections on marketing pages.', learnMore: 'Search: "F-pattern Z-pattern eye tracking Nielsen Norman" + "marketing page layout"' },
  },
  {
    id: 1024, chapter: 104,
    title: "Too Heavy on the Left",
    narration: "Launchly's onboarding modal has a large, colourful illustration on the left and a short text block + single button on the right.\n\nThe modal feels lopsided — users look at the illustration and then nothing guides them to the button.\n\nThe PM says: \"The illustration is expensive — we paid a lot for it.\"",
    choices: [
      { id: 'A', text: 'Keep the layout — the illustration adds value and the PM invested in it.', delta: -10 },
      { id: 'B', text: 'Reduce the illustration or move it to a supporting position. The primary action (button) should be the visual centre of gravity.', delta: 15 },
      { id: 'C', text: 'Add an animated arrow pointing from the illustration to the button to guide attention.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Onboarding completion rate: 38%. Users close the modal without clicking the button 62% of the time. A/B test with a text-only modal shows 67% completion. The expensive illustration actively distracts from the CTA.', lesson: 'Expensive design elements are not inherently effective. If they divert attention from the user\'s goal, they are obstacles — not assets.', principle: 'Visual Weight', principleDetail: 'Visual weight: the amount of attention an element commands. Large, colourful, detailed elements have high weight. When visual weight is misaligned with priority, users look at the wrong thing first.' },
      B: { story: 'You move the illustration to a smaller accent position — below the headline, above the button. The button is now the visual centre of the modal. Completion rate: 71%. The PM is won over by the data.', lesson: 'The purpose of every element in a modal is to support the primary action. Elements that compete with the CTA reduce its effectiveness regardless of their quality.', principle: 'Visual Weight', principleDetail: 'The CTA should have the highest weight — or at minimum, direct the eye toward the highest weight element. Every other element supports this.' },
      C: { story: 'The arrow helps somewhat — completion rate rises to 52%. But you\'re using an explicit signal to fix an implicit attention problem. And animated arrows feel patronising to experienced users.', lesson: 'Using explicit attention signals to compensate for poor layout is a sign that the layout is wrong. Fix the root cause.', principle: 'Implicit vs Explicit Attention Cues', principleDetail: 'Implicit cues (size, position, weight) guide attention subconsciously. Explicit cues (arrows, highlights) require conscious processing. Good design uses implicit cues.' },
    },
    reflection: { law: 'Visual Weight and Balance', summary: 'Every element in your design fights for attention. The goal is a choreographed performance where attention flows to the right place at the right time.', realWorld: 'Dropbox\'s onboarding team A/B tested illustration-heavy vs CTA-centred modals. CTA-centred consistently outperformed by 15-30%. They now use illustrations as supporting elements, never competing for primary focus.', bestCall: 'B — reposition illustration as supporting; the button should be the visual centre of gravity.', learnMore: 'Search: "visual weight UI design" + "CTA above fold conversion"' },
  },
  {
    id: 1025, chapter: 104,
    title: "Grid or Freeform?",
    narration: "Launchly's marketing team is redesigning the company blog. The current blog uses a 12-column grid. One designer wants to \"go freeform\" — varied sizing and overlapping elements inspired by editorial design.\n\n\"Grids are boring,\" they say.",
    choices: [
      { id: 'A', text: 'Go freeform — editorial design creates more visual interest.', delta: -10 },
      { id: 'B', text: 'Keep the 12-column grid but use it creatively — varied column spans, large typography, bold image placement — all within the structure.', delta: 15 },
      { id: 'C', text: 'Go freeform but audit each layout for alignment consistency before publishing.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The freeform blog looks striking in Figma. In the browser, overlapping elements break on tablet, font sizes render inconsistently across browsers, and content contributors can\'t maintain the style when adding new posts.', lesson: 'Freeform editorial design requires expert curation of every layout. Without a system, it collapses when the original designer isn\'t in the room.', principle: 'Grid Systems', principleDetail: 'Grids are not about rigidity — they\'re about consistency and scalability. A grid allows multiple contributors to produce layouts that feel coherent without individually curating every pixel.' },
      B: { story: 'Using the 12-column grid creatively: full-width images, pull quotes spanning 8 columns, featured articles at 8+4, compact articles at 4 columns. The result is varied, interesting, and consistent.', lesson: 'Creativity within constraints is more scalable than creativity without them. The grid is the structure — what you do within it is the art.', principle: 'Grid Systems', principleDetail: 'The best editorial design (The Guardian, NYT, The Verge) uses strict grids with creative column arrangements. The grid provides the skeleton; the art lives on top of it.' },
      C: { story: 'Manual auditing works for the first 10 posts. By post 50, the audit process is dropped. The blog has accumulated 12 different layout variants. Editorial consistency is gone.', lesson: 'Systems that require manual curation to function don\'t scale. The system should make the right thing automatic.', principle: 'Systemic Design', principleDetail: 'A scalable design system makes the correct choice the easy choice. A freeform audit process makes consistency dependent on vigilance — which eventually fails.' },
    },
    reflection: { law: 'Grid Systems', summary: 'Grids are not the enemy of creativity. They are the infrastructure of it. The most visually distinctive editorial designs use strict underlying grids — the creativity happens on top of the structure.', realWorld: 'The Guardian\'s website uses a strict grid system developed by Mark Porter. Every page is creative within that grid. The system allows 500 journalists to produce thousands of layouts that feel like one publication.', bestCall: 'B — use the grid creatively, varying column spans within the structure.', learnMore: 'Search: "12-column grid editorial design" + "Mark Porter The Guardian"' },
  },
  {
    id: 1026, chapter: 104,
    title: "The Lost CTA",
    narration: "Launchly's pricing page has three pricing tiers. The primary CTA — \"Start Free Trial\" — appears once, at the bottom of the page, after 800px of copy.\n\nConversion analytics: 70% of visitors leave the page before scrolling to the CTA.",
    choices: [
      { id: 'A', text: 'Trust the designer — informed decisions make for better customers.', delta: -10 },
      { id: 'B', text: 'Add CTAs at multiple points: above the fold, after each pricing tier, and at the bottom.', delta: 15 },
      { id: 'C', text: 'Move the single CTA to above the fold and remove the bottom one.', delta: 5 },
    ],
    consequences: {
      A: { story: 'The argument sounds reasonable but 70% of visitors never reach the decision point. They can\'t make an informed decision if they\'ve already left.', lesson: 'A philosophy of engagement that contradicts user behaviour data is a rationalisation, not a strategy.', principle: 'CTA Placement', principleDetail: 'Scroll depth data: most users don\'t scroll to the bottom of long pages. The CTA must appear where the user is ready to decide — and different users are ready at different scroll depths.' },
      B: { story: 'CTAs at three points: hero button, after each tier, and at the bottom. Conversion rises 34%. Different users find their decision point at different stages — the CTA meets them where they are.', lesson: 'CTAs are wayfinding. Every CTA says "you can decide here." Multiple decision points serve multiple decision styles.', principle: 'CTA Placement', principleDetail: 'Nielsen Norman Group found that pages with multiple strategically placed CTAs outperform single-CTA pages on complex decisions by 20-40%.' },
      C: { story: 'Above-the-fold CTA helps fast deciders but loses slow deliberators who need to read the full page before committing. Conversion improves slightly but misses the middle group.', lesson: 'There are multiple user decision modes. One CTA in one position serves one of them.', principle: 'CTA Placement', principleDetail: 'Fast deciders need a CTA before reading. Mid deciders need it after features. Deliberate readers need it at the bottom. Miss any group and you leave conversion on the table.' },
    },
    reflection: { law: 'Progressive Disclosure + CTA Placement', summary: 'The best CTA strategy meets users where they are — not where you want them to be.', realWorld: 'Linear\'s pricing page places "Start free" CTAs in the hero, after each feature section, and at the bottom. Vercel\'s pricing page uses a sticky CTA bar on mobile so the button is always in reach.', bestCall: 'B — CTAs at hero, after each pricing tier, and at the bottom.', learnMore: 'Search: "CTA placement conversion rate optimization" + "pricing page design"' },
  },
  {
    id: 1027, chapter: 104,
    title: "The Diagonal Element",
    narration: "A designer has added a diagonal decorative stripe across Launchly's feature card — cutting from bottom-left to top-right at a 30° angle, passing through the card title.\n\n\"It\'s dynamic and modern,\" they say.",
    choices: [
      { id: 'A', text: 'Approve it — a dynamic layout element differentiates Launchly.', delta: -10 },
      { id: 'B', text: 'Reject it — diagonal elements crossing text create scanning difficulty. Propose a background treatment instead.', delta: 15 },
      { id: 'C', text: 'Approve the diagonal but remove the text from the area where it crosses.', delta: 5 },
    ],
    consequences: {
      A: { story: 'In the first user test, three participants struggle to read the card title where the stripe overlaps. On mobile, the diagonal clips content at small screen sizes. Removed in the next sprint.', lesson: 'Decoration that competes with function isn\'t decoration — it\'s damage.', principle: 'Decoration vs Function', principleDetail: 'Any decorative element that overlaps, competes with, or reduces the legibility of functional content fails the basic design test: does this serve the user? Decoration should enhance, not obstruct.' },
      B: { story: 'The card is redesigned with a subtle background gradient instead — dynamic without crossing content. Legibility is maintained, the card has personality, and it scales to mobile.', lesson: 'The alternative to a bad idea is usually a better idea. Push back with a proposal, not just a "no."', principle: 'Decoration vs Function', principleDetail: 'Background treatments (gradients, textures) add visual interest without touching content. Foreground decoration (overlays, diagonals across text) competes with readability.' },
      C: { story: 'Without text in the diagonal zone, the card has more white space above the title. This actually improves the card — more breathing room, the diagonal acts as a divider rather than a competitor.', lesson: 'Constraint can generate creativity. Removing text from the diagonal zone forced a better layout.', principle: 'Decoration vs Function', principleDetail: 'Decorative and functional elements should occupy separate zones. When decoration must cross content areas, the content should move to a clear area.' },
    },
    reflection: { law: 'Figure-Ground (Gestalt)', summary: 'Decoration and function should be friends, not competitors. When a design element fights for attention with the content it\'s supposed to frame, design has failed at its basic job.', realWorld: 'Apple\'s product pages use white space as decoration — nothing crosses the content. Any visual element that required content to move around it wouldn\'t survive Apple\'s design review.', bestCall: 'B — reject the diagonal-over-text, propose a background treatment instead.', learnMore: 'Search: "figure-ground Gestalt design" + "decoration vs function UI"' },
  },
  {
    id: 1028, chapter: 104,
    title: "Fold Anxiety",
    narration: "Launchly's landing page has its most compelling value proposition — a testimonial from a Fortune 500 company — 600px below the fold.\n\nThe designer argues: \"Scroll is natural now. Users scroll.\"\n\nYour PM wants to move the testimonial above the fold, which means making the hero section smaller.",
    choices: [
      { id: 'A', text: 'Trust the designer — users do scroll. Leave the testimonial below.', delta: -10 },
      { id: 'B', text: 'Redesign the hero to fit the testimonial above the fold without sacrificing CTA prominence.', delta: 15 },
      { id: 'C', text: 'Add a teaser — show the client logo as a strip above the fold, full testimonial below.', delta: 5 },
    ],
    consequences: {
      A: { story: 'Scroll maps show 68% of mobile users leave without scrolling 600px. The testimonial is never seen by most visitors. "Users scroll" is true — when already engaged. First-time visitors who aren\'t convinced don\'t scroll past doubt.', lesson: '"Users scroll" is true for engaged users. Sceptical first-time visitors need a reason to scroll. If your best credibility signal is below the fold, most visitors never see it.', principle: 'Above the Fold', principleDetail: 'On mobile (the majority of web traffic), 60-70% of sessions end without scrolling past the initial view. Every piece of content requiring a scroll is seen by a fraction of visitors.' },
      B: { story: 'You redesign the hero with a 2-column layout: CTA left, testimonial right. Both are prominent. Conversion rate increases 22% — the testimonial gives first-time visitors the social proof they need to commit without scrolling.', lesson: 'Constraints are design problems. Solve them with layout thinking, not by accepting the constraint.', principle: 'Above the Fold', principleDetail: 'F-pattern scanning means the hero section is read most thoroughly. Pack it with what users need to convert: value proposition, CTA, and social proof.' },
      C: { story: 'The client logo teaser above the fold creates curiosity and increases scroll depth by 18%. Conversion improves modestly. A clever middle ground that works without a full redesign.', lesson: 'Teasers are a legitimate technique for drawing users past the fold. Show enough to create pull — but make sure the payoff is worth the scroll.', principle: 'Above the Fold', principleDetail: 'Teasing below-fold content works best when the teaser is visually distinctive (logos are ideal) and the content is genuinely compelling when reached.' },
    },
    reflection: { law: 'Above the Fold + Scroll Depth', summary: 'The fold still matters — especially on mobile, especially for first-time visitors. Your best conversion assets belong where the most eyes land.', realWorld: 'Basecamp has measured the above-the-fold section of their homepage obsessively for 20 years. Every element — headline, CTA, customer logos — is above the fold. They call it "the most important real estate on the internet."', bestCall: 'B — redesign the hero to include testimonial and CTA above the fold simultaneously.', learnMore: 'Search: "above the fold myth vs reality" + "scroll depth analytics"' },
  },
];

export const T1_UI_TASKS = {
  // ── Chapter 101: Colour — Contrast Audit ──────────────────────────────────
  // swatches: A = correct (dark charcoal passes AAA), B = fails AA, C = fails AA
  // deltasMap in App.jsx: A=+15, B=+5, C=−10  → A must be the best choice
  uitask_ch101: {
    id: 'uitask_ch101', chapter: 101, isUITask: true,
    type: 'contrast',
    title: 'Contrast Audit',
    law: 'WCAG Contrast',
    narration: "Launchly's designer produced three candidate text colours for use on a light grey background (#F5F5F5). Only one passes WCAG AA (4.5:1 minimum). Pick the correct one.",
    instruction: 'Select the text colour that passes WCAG AA contrast on #F5F5F5.',
    lawDetail: 'WCAG 2.2 Success Criterion 1.4.3 requires a minimum contrast ratio of 4.5:1 for normal text on its background.',
    // Custom swatches override ContrastTask defaults so A = correct here
    swatches: [
      { id: 'A', bg: '#F5F5F5', text: '#333333', note: '12.6:1 — passes AAA', label: 'Dark Charcoal' },
      { id: 'B', bg: '#F5F5F5', text: '#999999', note: '2.9:1 — fails AA',    label: 'Medium Grey'  },
      { id: 'C', bg: '#F5F5F5', text: '#6BA3CD', note: '3.1:1 — fails AA',    label: 'Light Blue'   },
    ],
    consequences: {
      A: { story: 'Correct — dark charcoal (#333333) achieves 12.6:1 on #F5F5F5 — well above WCAG AA (4.5:1) and AAA (7:1). Fast to read in any lighting condition.', lesson: 'High contrast is not just accessible — it is fast and effortless to read.', principle: 'WCAG Contrast', principleDetail: 'Contrast ratios above 7:1 meet WCAG AAA — the highest accessibility standard for text.' },
      B: { story: 'Medium grey (#999999) achieves only 2.9:1 on #F5F5F5. This fails WCAG AA (requires 4.5:1) for normal text. Users with low vision or bright-screen environments will struggle.', lesson: 'Medium greys almost always fail contrast checks on light backgrounds. Check the ratio, not the eye test.', principle: 'WCAG Contrast', principleDetail: '2.9:1 passes only for non-text UI components (3:1 minimum) — not for normal body text (4.5:1 minimum).' },
      C: { story: 'Light blue (#6BA3CD) achieves 3.1:1 on #F5F5F5 — passes for large text (3:1 minimum) only, fails for normal text (4.5:1 minimum). Brand colours frequently fail in UI contexts.', lesson: 'Brand colours look right on a white canvas but often fail in real UI backgrounds. Always test the actual pairing.', principle: 'WCAG Contrast', principleDetail: 'Test your brand palette against every background it will actually appear on — not just white. A colour that passes on one background fails on another.' },
    },
  },

  // ── Chapter 102: Typography — Type Scale Task ─────────────────────────────
  // type: 'type-scale' — user matches text samples to roles (H1/H2/Body/Label)
  // deltasMap: A=+15 (all 4 correct), B=+5 (2-3 correct), C=−10 (0-1 correct)
  uitask_ch102: {
    id: 'uitask_ch102', chapter: 102, isUITask: true,
    type: 'type-scale',
    title: 'Type Scale Audit',
    law: 'Visual Hierarchy — Typography',
    narration: "Launchly's new dashboard has four text elements but no type hierarchy spec. Match each text sample to its correct typographic role.",
    instruction: 'Tap a text sample, then tap the role it belongs to.',
    lawDetail: 'A type scale establishes visual hierarchy: H1 is the primary entry point, H2 for section headings, Body for readable content, Label for supporting metadata. Each tier must be visually distinct from the others.',
    consequences: {
      A: { story: 'Perfect — all four roles correctly identified. Dashboard (H1) → Monthly Overview (H2) → body paragraph (Body) → ACTIVE USERS (Label). The eye follows the hierarchy without needing to read every word.', lesson: 'A clear type scale gives every element a distinct role. No two tiers compete for the same attention level.', principle: 'Type Hierarchy', principleDetail: 'Consistent hierarchy allows users to scan a page in under 200ms and jump to the section they need. Without it, every element demands equal attention — which means no element gets priority.' },
      B: { story: 'Close — some roles mixed up. When H2 and Body are swapped, section headings lose their navigational function. Users must read every word instead of scanning by size.', lesson: 'Headings must always be larger than body text. They are navigation signals, not decorative labels.', principle: 'Type Hierarchy', principleDetail: 'If a heading and body text appear at similar sizes, the hierarchy collapses. Users cannot distinguish structure at a glance and must read linearly.' },
      C: { story: 'Most roles misidentified. The type scale collapses when small metadata labels (Label) are assigned the role of primary headings, or when body text is treated as the highest hierarchy. Readers cannot orient themselves.', lesson: 'The largest element defines the entry point for the eye. Put the most important, broadest-scope element there.', principle: 'Type Hierarchy', principleDetail: 'Visual hierarchy is both a reading guide and a priority signal. Inverted hierarchy communicates the wrong priorities — users will orient to the wrong starting point every time.' },
    },
  },

  // ── Chapter 103: Spacing & Grids — Proximity Task ─────────────────────────
  // layouts: A = correct (Grouped), B = ok (Boxed), C = wrong (Scattered/Uniform)
  // deltasMap: A=+15, B=+5, C=−10  → A must be Grouped (best)
  uitask_ch103: {
    id: 'uitask_ch103', chapter: 103, isUITask: true,
    type: 'proximity',
    title: 'Form Spacing Audit',
    law: 'Gestalt Proximity',
    narration: "Launchly's settings form has three field groups: Account, Notifications, and Security. Three layout options are shown. Pick the one that correctly communicates grouping through spacing alone — no borders added.",
    instruction: 'Select the layout where spacing clearly groups related fields and separates unrelated ones.',
    lawDetail: 'Gestalt Law of Proximity: elements placed close together are perceived as related. Spacing contrast between within-group and between-group distances communicates form structure without any added visual weight.',
    // Custom layouts override ProximityTask defaults so A = Grouped (correct)
    layouts: [
      { id: 'A', label: 'Grouped',   visualType: 'grouped',   desc: 'Related elements clustered, groups separated by space' },
      { id: 'B', label: 'Boxed',     visualType: 'boxed',     desc: 'Each group inside a bordered box'                     },
      { id: 'C', label: 'Scattered', visualType: 'scattered', desc: 'All elements spread with uniform spacing'              },
    ],
    consequences: {
      A: { story: 'Correct — tight spacing within each group (8px), large spacing between groups (32px). The grouping is immediately perceptible without any borders. Users understand the form structure before reading a single label.', lesson: 'Spacing contrast is the cleanest grouping tool. A 4:1 ratio between within-group and between-group spacing communicates structure invisibly.', principle: 'Gestalt Proximity', principleDetail: 'When spacing within a group is significantly tighter than spacing between groups, the brain groups the nearby elements automatically — before conscious reading begins. No borders or backgrounds needed.' },
      B: { story: 'Borders do create visible groups, but they add visual weight and compete with the content inside. Spacing alone would communicate the same grouping more cleanly, without adding any new visual elements.', lesson: 'Spacing groups invisibly. Borders declare groupings loudly. Use the lightest tool that achieves the result.', principle: 'Gestalt Proximity', principleDetail: 'Borders are effective for interactive components (cards, inputs) but heavy for structural grouping. When proximity can do the job, prefer it — the interface stays lighter and easier to scan.' },
      C: { story: 'Uniform spacing treats all fields identically. Without spacing variation, users cannot distinguish group structure from a distance — they must read every label to understand the layout. The form becomes a list, not a structured form.', lesson: 'Uniform spacing is the absence of structure. Varied spacing is the structure itself.', principle: 'Gestalt Proximity', principleDetail: 'A form with 16px spacing everywhere communicates no groupings. The brain needs contrast in spatial relationships to infer which elements belong together. No contrast, no grouping — just a list.' },
    },
  },

  // ── Chapter 104: Layout & Visual Hierarchy — Before/After Audit ───────────
  // type: 'before-after' — toggle between flat vs clear type hierarchy, identify the fix
  // deltasMap: A=+15 (correct: sees flat hierarchy), B=+5 (close), C=−10 (misidentifies)
  uitask_ch104: {
    id: 'uitask_ch104', chapter: 104, isUITask: true,
    type: 'before-after',
    title: 'Hierarchy Audit',
    law: 'Visual Hierarchy',
    narration: "A developer shipped Launchly's new dashboard section. Something feels off — it looks like a wall of text with no clear entry point. You open the design file and compare it to the approved spec.",
    instruction: 'Switch between Before and After. What visual design problem was fixed?',
    lawDetail: 'Visual hierarchy guides the eye through a layout by creating clear contrast in size, weight, and colour between elements. Without it, every element competes equally for attention.',
    panels: {
      beforeType: 'flat-type-hierarchy',
      afterType:  'clear-type-hierarchy',
      question:   'What visual design problem was fixed between the Before and After versions?',
      options: [
        {
          id: 'A', correct: true,
          text: 'All text elements had nearly identical size and weight — there was no visual hierarchy to guide the eye.',
          fb: 'Correct. The Before version uses 12–15px at similar weights throughout — every element competes equally. The After version establishes a clear 4-tier hierarchy: H1 (22px/700), Section (13px/600), Body (12px/400), Label (10px/600 uppercase). The eye now has a clear entry point and can scan the layout in under 200ms.',
        },
        {
          id: 'B', correct: false,
          text: 'The stat numbers in the bottom row were not aligned to a grid.',
          fb: 'Not this one. The stat cards are identical in both versions. The problem is with the text hierarchy above — compare the heading sizes, font weights, and label treatment between Before and After.',
        },
        {
          id: 'C', correct: false,
          text: 'The section was missing a border to separate it from the rest of the page.',
          fb: 'Not a border issue. The fundamental problem is that all the text elements in the Before version look the same — same size, same weight, no clear priority order. Flip between Before and After and focus on the heading vs body vs label sizes.',
        },
      ],
    },
    consequences: {
      A: { story: 'You identify the flat hierarchy immediately. The fix: a proper type scale (H1=22px/700, Section=13px/600, Body=12px/400, Label=10px/600 uppercase tracked). Users can now scan the dashboard in under 200ms and immediately understand what the most important number is.', lesson: 'Visual hierarchy is not decoration — it is the reading path. Without it, users must read every word linearly instead of scanning to what matters.', principle: 'Visual Hierarchy', principleDetail: 'F-pattern and Z-pattern eye-tracking research shows that users scan, not read. A clear type scale with 4:1 contrast between hierarchy levels lets users extract meaning from a page in milliseconds.' },
      B: { story: 'Grid alignment matters, but it\'s not the fundamental issue here. The stat row is structurally fine. The deeper problem is that the heading, sub-heading, body copy, and labels all read at the same weight — there\'s no clear entry point for the eye.', lesson: 'Fix the highest-impact problem first. Flat hierarchy means users can\'t orient themselves — that impacts every scan of the page.', principle: 'Visual Hierarchy', principleDetail: 'Grid alignment is a refinement. Hierarchy is structural. Build hierarchy first, then refine alignment within it.' },
      C: { story: 'Adding a border treats the symptom, not the cause. The issue isn\'t section separation — it\'s that every text element inside the section looks identical. A border around identical-weight elements creates a box of flat text, not a navigable layout.', lesson: 'Adding decoration doesn\'t fix hierarchy. Hierarchy comes from typographic contrast — size, weight, colour, and spacing — not from borders or backgrounds.', principle: 'Visual Hierarchy', principleDetail: 'Borders signal containment. They don\'t establish reading order. Use type scale and spacing to create hierarchy, then use structural elements (cards, dividers) to reinforce it.' },
    },
  },
};

export const T1_DNA_ADJ = {
  '1001_A': { stakeholderStyle: -5, riskTolerance: -5 },
  '1001_B': { stakeholderStyle: 10, userEmpathy: 10 },
  '1001_C': { riskTolerance: 5, userEmpathy: 5 },
  '1002_A': { riskTolerance: -5, researchLean: -5 },
  '1002_B': { researchLean: 10, stakeholderStyle: 5 },
  '1002_C': { stakeholderStyle: -5, researchLean: -5 },
  '1003_A': { riskTolerance: -5, userEmpathy: -10 },
  '1003_B': { userEmpathy: 10, researchLean: 5 },
  '1003_C': { riskTolerance: 5, userEmpathy: 5 },
  '1004_A': { userEmpathy: -15, riskTolerance: -5 },
  '1004_B': { userEmpathy: 15, researchLean: 5 },
  '1004_C': { userEmpathy: 5, riskTolerance: 5 },
  '1005_A': { riskTolerance: -5, researchLean: -10 },
  '1005_B': { researchLean: 10, riskTolerance: 5 },
  '1005_C': { riskTolerance: 5, researchLean: 5 },
  '1006_A': { stakeholderStyle: -10, userEmpathy: -5 },
  '1006_B': { userEmpathy: 15, riskTolerance: 5 },
  '1006_C': { userEmpathy: 5, riskTolerance: 5 },
  '1007_A': { riskTolerance: -5, userEmpathy: -5 },
  '1007_B': { researchLean: 10, userEmpathy: 10 },
  '1007_C': { userEmpathy: 5, researchLean: 5 },
  '1008_A': { stakeholderStyle: -5, researchLean: -5 },
  '1008_B': { researchLean: 10, riskTolerance: 5 },
  '1008_C': { riskTolerance: 5, researchLean: 5 },
  '1009_A': { userEmpathy: -10, riskTolerance: -5 },
  '1009_B': { userEmpathy: 10, riskTolerance: 5 },
  '1009_C': { userEmpathy: 5, riskTolerance: 5 },
  '1010_A': { userEmpathy: -5, researchLean: -5 },
  '1010_B': { researchLean: 10, userEmpathy: 10 },
  '1010_C': { userEmpathy: 5, researchLean: 5 },
  '1011_A': { riskTolerance: -5, researchLean: -5 },
  '1011_B': { researchLean: 10, riskTolerance: 10 },
  '1011_C': { riskTolerance: 5, researchLean: 5 },
  '1012_A': { stakeholderStyle: -5, userEmpathy: -5 },
  '1012_B': { userEmpathy: 10, researchLean: 10 },
  '1012_C': { userEmpathy: 5, researchLean: 5 },
  '1013_A': { userEmpathy: -10, riskTolerance: -5 },
  '1013_B': { userEmpathy: 10, riskTolerance: 5 },
  '1013_C': { userEmpathy: 5, riskTolerance: 5 },
  '1014_A': { userEmpathy: -10, stakeholderStyle: -5 },
  '1014_B': { userEmpathy: 10, riskTolerance: 5 },
  '1014_C': { riskTolerance: 5, userEmpathy: 5 },
  '1015_A': { riskTolerance: -5, stakeholderStyle: -5 },
  '1015_B': { stakeholderStyle: 10, riskTolerance: 5 },
  '1015_C': { riskTolerance: 5, stakeholderStyle: 5 },
  '1016_A': { userEmpathy: -10, researchLean: -5 },
  '1016_B': { userEmpathy: 10, researchLean: 10 },
  '1016_C': { userEmpathy: 5, researchLean: 5 },
  '1017_A': { researchLean: -5, riskTolerance: -5 },
  '1017_B': { researchLean: 10, userEmpathy: 5 },
  '1017_C': { researchLean: 5, userEmpathy: 5 },
  '1018_A': { researchLean: -5, stakeholderStyle: -5 },
  '1018_B': { researchLean: 10, riskTolerance: 5 },
  '1018_C': { riskTolerance: -5, researchLean: 5 },
  '1019_A': { researchLean: 5, riskTolerance: 5 },
  '1019_B': { researchLean: 10, riskTolerance: 10 },
  '1019_C': { researchLean: -5, riskTolerance: -5 },
  '1020_A': { userEmpathy: -10, riskTolerance: -5 },
  '1020_B': { userEmpathy: 10, riskTolerance: 5 },
  '1020_C': { userEmpathy: 5, riskTolerance: 5 },
  '1021_A': { userEmpathy: -5, riskTolerance: -5 },
  '1021_B': { userEmpathy: 10, riskTolerance: 5 },
  '1021_C': { userEmpathy: 5, riskTolerance: 5 },
  '1022_A': { userEmpathy: -10, researchLean: -5 },
  '1022_B': { researchLean: 10, userEmpathy: 10 },
  '1022_C': { researchLean: 5, userEmpathy: 5 },
  '1023_A': { researchLean: 5, riskTolerance: 5 },
  '1023_B': { riskTolerance: 10, researchLean: 10 },
  '1023_C': { researchLean: -5, riskTolerance: -5 },
  '1024_A': { stakeholderStyle: -10, userEmpathy: -5 },
  '1024_B': { userEmpathy: 10, researchLean: 5 },
  '1024_C': { userEmpathy: 5, researchLean: 5 },
  '1025_A': { riskTolerance: -5, researchLean: -5 },
  '1025_B': { riskTolerance: 10, researchLean: 5 },
  '1025_C': { riskTolerance: 5, researchLean: 5 },
  '1026_A': { userEmpathy: -5, researchLean: -5 },
  '1026_B': { researchLean: 10, userEmpathy: 10 },
  '1026_C': { researchLean: 5, userEmpathy: 5 },
  '1027_A': { riskTolerance: -5, userEmpathy: -5 },
  '1027_B': { userEmpathy: 10, riskTolerance: 5 },
  '1027_C': { riskTolerance: 5, userEmpathy: 5 },
  '1028_A': { userEmpathy: -5, researchLean: -5 },
  '1028_B': { researchLean: 10, userEmpathy: 10 },
  '1028_C': { researchLean: 5, userEmpathy: 5 },
};

const T1_MAX = 100 + T1_SCENARIOS.length * 15;

export function getT1Ending(score) {
  const pct = score / T1_MAX;
  if (pct >= 0.82) return {
    title: 'Visual Designer',
    subtitle: 'Sharp eye. Sound principles.',
    description: 'Your eye for design is precise and principled. You see what others miss and you know why it matters. Every pixel decision has a reason — and the reasons are right.',
    color: '#00D4FF',
  };
  if (pct >= 0.65) return {
    title: 'Craft-Minded Designer',
    subtitle: 'The foundation is solid.',
    description: 'You\'ve built a solid visual foundation. A few blind spots remain, but your instincts are increasingly reliable. Keep applying the principles and the gaps close fast.',
    color: '#7C3AED',
  };
  if (pct >= 0.45) return {
    title: 'Developing Eye',
    subtitle: 'The patterns are forming.',
    description: 'You\'re beginning to see what\'s wrong before being told. Keep going — the pattern recognition comes with practice. Every scenario you replay sharpens the eye.',
    color: '#F59E0B',
  };
  return {
    title: 'Visual Apprentice',
    subtitle: 'Every mistake had a lesson inside it.',
    description: 'The fundamentals are still forming. Every missed call is a lesson. Review your choices and try again — the principles don\'t change, and neither does what they teach.',
    color: '#EF4444',
  };
}
