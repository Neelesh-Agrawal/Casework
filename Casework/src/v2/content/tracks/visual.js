// Track: Visual Foundations: "See like a designer"
// Scene schema: see docs/content-guide.md.
// Contrast ratios quoted here were computed with the WCAG 2.x relative-luminance formula.

export default {
  id: 'visual',
  number: '03',
  title: 'Visual Foundations',
  subtitle: 'See like a designer',
  blurb:
    'Your first months at Launchly, turning a brand deck full of orange into a visual language. Colour, type, spacing and layout, and almost every choice can be measured.',
  color: '#5B6CF0',
  chapters: [
    // ═══ CHAPTER 1: COLOUR ═══════════════════════════════════════════════
    {
      id: 'visual-ch1',
      title: 'The Orange',
      tagline: 'Everyone loves the colour. Nobody has measured it.',
      intro:
        'Week two at Launchly. Ana has a brand deck full of orange, Rhea wants everything to pop, and the product has no colour rules at all, just 214 hex values and good intentions. Your job: turn a palette into a system people can actually read.',
      briefing: [
        { who: 'ana', mood: 'excited', says: 'The brand deck is final. Forty pages, and most of them are orange. I want the product to feel exactly like this.' },
        { who: 'jonas', mood: 'annoyed', says: 'I counted 214 hex values in the code. Some of them are almost orange.' },
        { who: 'rhea', mood: 'happy', says: 'Then let\'s make it pop. Customers should know it\'s Launchly from across the room.' },
        { who: 'priya', mood: 'thinking', says: 'Happy to help, as long as we test it with people who don\'t see colour the way we do.' },
      ],
      retro: [
        { who: 'ana', mood: 'thinking', says: 'I came in thinking orange should go everywhere. Turns out it\'s strongest when it isn\'t carrying text.' },
        { who: 'jonas', mood: 'neutral', says: 'My lesson: contrast is a number. 4.5 for text, 3 for big text and borders. Less arguing, more measuring.' },
        { who: 'priya', mood: 'happy', says: 'And colour is never the only signal. Words first; colour helps people find them.' },
        { who: 'sam', mood: 'excited', says: 'I\'m keeping \'name colours by their job\'. Dark mode became a mapping job, not a rescue mission.' },
        { who: 'ana', mood: 'happy', says: 'Fine. Fewer colours per chart, and red never means success. I\'m putting both in the brand book.' },
      ],
      cases: [
        // ─── 01 ──────────────────────────────────────────────────────────
        {
          id: 'visual-01',
          kind: 'decision',
          takeaway:
            'Before putting text on a brand colour, measure it: 4.5:1 for normal text, 3:1 for large. Give bright colours shapes, not text.',
          sayIt:
            'The orange can own the screen, just not the text. White on it is 2.86:1, which fails even the large-text rule. Let\'s give it a big panel and keep the form on white.',
          title: 'The Brand Orange',
          principle: 'Text contrast (WCAG 1.4.3)',
          place: 'ceo-office',
          time: 'Mon 09:30',
          cast: ['ana', 'rhea'],
          situation:
            "Ana, the head of brand, has redesigned the login screen: full brand orange #FF6B00 behind the whole form, with all the text in white. Rhea, the CEO, loves it and wants Jonas to ship it today. Sam ran a contrast check and got a number Ana doesn't understand. To her, it looks perfectly readable.",
          scene: [
            { who: 'ana', mood: 'excited', says: 'The new login screen. Full Launchly orange, #FF6B00, with the whole form in white text on top. It finally looks like us.' },
            { who: 'rhea', mood: 'happy', says: 'Love it. It pops. Can Jonas ship it today?' },
            { who: 'ana', mood: 'thinking', says: 'Sam ran it through a contrast checker and got a number. I don\'t know what it means. It looks perfectly readable to me.' },
          ],
          evidence: [
            { label: 'White text on #FF6B00', value: '2.86:1' },
            { label: 'WCAG AA minimum', value: '4.5:1 (large text 3:1)' },
            { label: 'Error red #DC2626 on darker #CC4400', value: '1.01:1' },
          ],
          ask: 'Ana and Rhea are waiting. What do you recommend?',
          choices: [
            {
              id: 'A',
              text: 'Keep white on orange, but set all the text at 24px bold so the large-text minimum applies.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'ana', mood: 'happy', says: 'Big and bold. Even better. I\'ll tell Rhea.' },
              outcome:
                'Large text needs 3:1, and 2.86:1 still fails. Links and error messages couldn\'t be 24px anyway. The enterprise accessibility audit flagged the login page first, and Jonas rebuilt it a month later.',
            },
            {
              id: 'B',
              text: 'Darken the background to #CC4400: white text reaches 4.78:1 and the screen stays orange.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: -1, speed: 1 },
              reaction: { who: 'ana', mood: 'worried', says: 'It\'s… browner. But fine, if it passes.' },
              outcome:
                'White text passed. Then the first wrong password showed red error text on dark orange at 1.01:1, practically invisible. And Ana now had two oranges to keep apart in every file.',
            },
            {
              id: 'C',
              text: 'Use the orange as a big brand panel beside the form, and put the form itself on white.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 0 },
              reaction: { who: 'ana', mood: 'thinking', says: 'So the orange gets the big moment, and the form gets to be readable.' },
              outcome:
                'The orange panel became the most recognisable part of the login screen, and every piece of text on white passed with room to spare. Ana used the same split for signup and password reset.',
            },
          ],
          debrief: {
            principle: 'Text contrast (WCAG 1.4.3)',
            insight:
              'Contrast is a ratio you can measure, not a feeling. Bright brand colours are often too light to carry white text, so give them big shapes and surfaces, and put text where it can be read.',
            trap:
              'Large text lowers the bar to 3:1, but it doesn\'t remove it, and 2.86:1 fails both. Darkening the colour fixes one pair of colours and breaks every other colour you put on top of it.',
            inTheWild:
              'WCAG 2.x SC 1.4.3 (AA) asks for 4.5:1 for normal text and 3:1 for large text (24px, or 18.66px bold). Many brands with a bright colour also keep a darker, text-safe shade of it for UI.',
          },
        },

        // ─── 02 ──────────────────────────────────────────────────────────
        {
          id: 'visual-02',
          kind: 'decision',
          takeaway:
            'When colours look alike, compare them on checks: label contrast, contrast with body text, and room for hover and pressed shades.',
          sayIt:
            'They do look similar, so let\'s pick on numbers. Royal blue passes with white labels at 6.89:1 and leaves room for a darker hover state. Electric fails at 2.12:1.',
          title: 'Five Shades of Blue',
          principle: 'Choosing colour by criteria',
          place: 'design-desk',
          time: 'Mon 14:10',
          cast: ['sam', 'marcus'],
          situation:
            "Orange can't carry white button labels, so Ana, the head of brand, agreed that product buttons will be blue. Sam, the junior designer, made five options: sky, royal, cornflower, navy and electric. Ana likes electric best for its energy next to the orange. Marcus, the PM, thinks they all look the same and needs a pick now, because the button blocks three tickets.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'Since orange can\'t carry white labels, Ana agreed product buttons go blue. I made five: sky, royal, cornflower, navy, electric.' },
            { who: 'marcus', mood: 'annoyed', says: 'Honestly they all look the same to me. Just pick one. The button is blocking three tickets.' },
            { who: 'sam', mood: 'thinking', says: 'Ana likes the electric one best. She says it has the most energy next to the orange.' },
          ],
          evidence: [
            { label: 'White label contrast', value: 'Sky 3.24 · Royal 6.89 · Cornflower 3.29 · Navy 11.85 · Electric 2.12' },
            { label: 'Navy vs body text #1F2937', value: '1.24:1' },
            { label: 'States each button needs', value: 'Hover, pressed, focus' },
          ],
          ask: 'Marcus wants an answer now. Which blue?',
          choices: [
            {
              id: 'A',
              text: 'Go with electric blue: it\'s Ana\'s favourite and has the most energy next to the orange.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'sam', mood: 'happy', says: 'Ana will be thrilled. I\'ll update the file.' },
              outcome:
                'White labels on electric blue measured 2.12:1. Jonas caught it in code review and the button was recoloured in week two, after Ana had used it in three marketing screenshots.',
            },
            {
              id: 'B',
              text: 'Royal blue: white labels pass at 6.89:1, and there\'s still room for a darker hover shade.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 1 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Royal. Done. Tickets unblocked.' },
              outcome:
                'Labels were easy to read, the hover and pressed shades were easy to make, and the button stood apart from both the text and the orange. Marcus closed three tickets that afternoon.',
            },
            {
              id: 'C',
              text: 'Navy: at 11.85:1 it has the highest contrast of the five, so it\'s the safest pick.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: 'Navy it is. Hard to argue with the biggest number.' },
              outcome:
                'Labels passed easily, but navy sat at 1.24:1 against body text, so buttons looked like black blocks. And there was no darker shade left for hover, so Sam ended up faking it with an outline.',
            },
          ],
          debrief: {
            principle: 'Choosing colour by criteria',
            insight:
              'When options look alike, decide with things you can check: does the label pass contrast, does the colour stand apart from text and other UI, and is there room for hover, pressed and focus shades?',
            trap:
              'The highest contrast feels like the safest choice. But a colour can be so dark it blends into the text, and a primary colour needs room on both sides for its states.',
            inTheWild:
              'IBM Carbon gives each interactive colour its own hover and active tokens, and Material Design specifies hover and pressed state layers for every interactive colour, not a single value.',
          },
        },

        // ─── 03 ──────────────────────────────────────────────────────────
        {
          id: 'visual-03',
          kind: 'decision',
          takeaway:
            'Before choosing a colour for a message, check what that colour already means in your product, and match it.',
          sayIt:
            'It definitely gets noticed: five of eight testers noticed it and thought signup had failed. Let\'s use our green success style so it stands out with the right meaning.',
          title: 'Red for Success',
          principle: 'Colour conventions',
          place: 'meeting-room',
          time: 'Tue 10:00',
          cast: ['sam', 'rhea', 'priya'],
          situation:
            "Sam, the junior designer, made the new signup confirmation: a big red banner that says \"Account created successfully!\" Rhea, the CEO, likes how much it stands out. But in this morning's test by Priya, the researcher, five of eight people stopped and asked what went wrong, and two tried to sign up again.",
          scene: [
            { who: 'sam', mood: 'happy', says: 'New signup confirmation: a big red banner that says "Account created successfully!" Red really stands out.' },
            { who: 'rhea', mood: 'excited', says: 'It does pop. I noticed it from across the room.' },
            { who: 'priya', mood: 'worried', says: 'In this morning\'s test, five of eight people stopped and asked what went wrong. Two tried to sign up again.' },
          ],
          evidence: [
            { label: 'Testers who read it as an error', value: '5 of 8' },
            { label: 'Tried to sign up a second time', value: '2 of 8' },
            { label: 'Launchly\'s other banners', value: 'Red error · Green success · Orange warning' },
          ],
          ask: 'Sam is proud of it and Rhea likes it. What do you say?',
          choices: [
            {
              id: 'A',
              text: 'Use the brand orange instead: it still stands out, and it feels more like Launchly.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 2, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: 'Orange is very us. I\'ll swap it.' },
              outcome:
                'Fewer people panicked, but orange was already Launchly\'s warning colour. In the next test three of eight asked what they still needed to fix. Better, not solved.',
            },
            {
              id: 'B',
              text: 'Keep red. It gets noticed, and the word "successfully" is right there in the banner.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'rhea', mood: 'happy', says: 'Good. People need to notice it.' },
              outcome:
                'Duplicate signups rose 9% in the first week, and support got tickets asking "did my account work?". Colour arrives before words: people saw red and stopped reading.',
            },
            {
              id: 'C',
              text: 'Use the green success style and a check icon, like every other success banner.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 1 },
              reaction: { who: 'priya', mood: 'happy', says: 'I\'ll re-run the test tomorrow with the new version.' },
              outcome:
                'In the re-test all eight testers read it as success and moved on. Sam\'s banner still stood out. It just stood out with the right meaning.',
            },
          ],
          debrief: {
            principle: 'Colour conventions',
            insight:
              'People read colour before they read words. Red means error in almost every interface they have used, so a red "success" message makes them doubt the text. Stand out with the right colour, not the loudest one.',
            trap:
              '"It gets noticed" is only half the job. A message that is noticed and misread is worse than a quiet one, because people act on the wrong meaning.',
            inTheWild:
              'IBM Carbon, Atlassian and Shopify Polaris all use red (or "critical") for errors and green for success, so users carry the meaning from product to product.',
          },
        },

        // ─── 04 ──────────────────────────────────────────────────────────
        {
          id: 'visual-04',
          kind: 'decision',
          takeaway:
            'For every state shown in colour, ask: could someone who can\'t see colour still tell what happened and what to do next?',
          sayIt:
            'Colour is a good second signal, but about 1 in 12 men can\'t rely on it. A short message under the field that says what\'s wrong fixes it for everyone, screen readers too.',
          title: 'Red Fields Only',
          principle: 'Use of colour (WCAG 1.4.1)',
          place: 'research-lab',
          time: 'Tue 15:20',
          cast: ['priya', 'jonas'],
          situation:
            "Priya, the researcher, shows you a test session. A man with red-green colour blindness submits the signup form, the email field border turns red, and he waits forty seconds, then closes the tab. On error, the form only turns the border red: no text, no icon. Jonas, the staff engineer, can build one fix tonight.",
          scene: [
            { who: 'priya', mood: 'thinking', says: 'Watch this. He submits the form, the email field turns red, and he just sits there. He has red-green colour blindness.' },
            { who: 'jonas', mood: 'neutral', says: 'That\'s all the form does on error: the border goes red. No text, no icon. I can add something tonight.' },
            { who: 'priya', mood: 'worried', says: 'He waited forty seconds, then closed the tab.' },
          ],
          evidence: [
            { label: 'Men with colour vision deficiency', value: '~8% (about 1 in 12)' },
            { label: 'Error states with any text', value: '0 of 9' },
            { label: 'Most common signup error', value: 'Email already in use' },
          ],
          ask: 'Jonas can build one thing tonight. What?',
          choices: [
            {
              id: 'A',
              text: 'Add a short message under each field saying what\'s wrong and how to fix it, with an icon.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 1, speed: 0 },
              reaction: { who: 'jonas', mood: 'thinking', says: 'Message plus icon. I\'ll link the text to the field so screen readers get it too.' },
              outcome:
                'Priya\'s next tester saw "This email already has an account. Log in instead?" and clicked straight through. Failed signups after an error dropped by half.',
            },
            {
              id: 'B',
              text: 'Swap the red for a colour-blind-safe blue so everyone can see the field change state.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 1, speed: 2 },
              reaction: { who: 'jonas', mood: 'happy', says: 'Blue it is. Easy change.' },
              outcome:
                'Some colour-blind users could now see the change. But it was still colour only, it meant nothing to screen readers, and nobody knew the email was taken. Errors kept ending in closed tabs.',
            },
            {
              id: 'C',
              text: 'Add a warning icon next to each field in error, so there\'s a second signal besides colour.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'jonas', mood: 'neutral', says: 'One icon, coming up.' },
              outcome:
                'People now knew something was wrong, but not what. "Email already in use" still looked like a typo, and many retyped the same email three times before giving up.',
            },
          ],
          debrief: {
            principle: 'Use of colour (WCAG 1.4.1) & error identification (3.3.1)',
            insight:
              'Colour can support a message, but it can\'t be the message. A good error state says in words what\'s wrong and how to fix it. Then colour and an icon help people find it fast.',
            trap:
              'Switching to a "colour-blind-safe" colour feels inclusive, but it is still colour alone. An icon tells people that something is wrong, not what.',
            inTheWild:
              'WCAG 1.4.1 says colour must not be the only way information is shown, and 3.3.1 says input errors must be described in text. GOV.UK\'s design system pairs a red border with a written message on every field error.',
          },
        },

        // ─── 05 (spot) ────────────────────────────────────────────────────
        {
          id: 'visual-05',
          kind: 'spot',
          takeaway:
            'In a contrast review, check everything that carries meaning: text, borders, icons, status. Skip disabled and purely decorative parts.',
          sayIt:
            'I want to keep this calm feel. But the link, the field edge and the billing date are too faint, and payment status is colour only. Small changes fix all four.',
          title: 'Light and Airy',
          principle: 'Contrast for text and UI components',
          place: 'design-desk',
          time: 'Wed 11:15',
          cast: ['sam', 'jonas'],
          situation:
            "Sam, the junior designer, has finished the billing settings page in a light, airy style with lots of soft greys, and wants your sign-off before Jonas builds it. Jonas, the staff engineer, reminds you that a big customer's accessibility audit is next month, and billing is on their list.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'Billing settings is done! I went light and airy, lots of soft greys. Can you sign it off before Jonas builds it?' },
            { who: 'jonas', mood: 'thinking', says: 'A big customer\'s accessibility audit is next month, and billing is on their list. Check the numbers, not just the look.' },
          ],
          ask: 'Tap the 4 contrast and colour problems on the page.',
          mock: 'billing-settings',
          taps: 6,
          mockSpec:
            'A light-mode settings page on white (#FFFFFF), desktop width. Top to bottom: page heading "Billing" in 28px bold #111827 (fine). Intro line "Manage your plan and payment details." in 16px #374151, 10.3:1 (fine). A plan card: small label "Current plan" in 13px #6B7280, 4.83:1 (fine); plan name "Team" in 32px bold #111827 (fine); and an "Upgrade plan →" link in 14px brand orange #FF6B00 on white, 2.86:1 [orange-link]. "Payment method" section: a card-number input drawn only with a very pale 1px #E5E7EB border on white and no background fill, 1.24:1 [input-border]; under it helper text "We charge this card on the 1st of each month." in 13px #9CA3AF, 2.54:1 [helper-text]. An invoices table with columns Date, Amount, Status. The Status column shows only a small green or red dot, no words (paid vs failed) [status-dot]. A greyed-out, disabled "Download all" button with a tooltip "Select invoices first". Low contrast is allowed for disabled controls (fine). Footer row, right-aligned: a "Cancel" text button in #2563EB, 5.17:1 (fine), and a primary "Save changes" button with white text on royal blue #0057B7, 6.89:1 (fine).',
          hotspots: [
            {
              id: 'orange-link',
              label: 'Orange link text fails contrast',
              explain:
                'Brand orange on white is 2.86:1, and small link text needs 4.5:1. Use the link blue or a darker, text-safe orange, and keep #FF6B00 for large surfaces and decoration.',
            },
            {
              id: 'input-border',
              label: 'Input border is almost invisible',
              explain:
                'At 1.24:1 the field\'s edge disappears, and there is no fill to show where to click. A border that identifies a control needs 3:1 against its background (WCAG 1.4.11).',
            },
            {
              id: 'helper-text',
              label: 'Helper text too pale',
              explain:
                '#9CA3AF on white is 2.54:1. This line tells people when they will be charged. That is real information, not decoration, so it needs 4.5:1. #6B7280 passes at 4.83:1.',
            },
            {
              id: 'status-dot',
              label: 'Paid vs failed shown by colour only',
              explain:
                'A green or red dot is the only sign of a failed payment, which many colour-blind users can\'t tell apart. Add the words "Paid" and "Failed" (WCAG 1.4.1).',
            },
          ],
          debrief: {
            principle: 'Contrast for text (1.4.3) and UI components (1.4.11)',
            insight:
              'Soft greys look calm in a mockup, but every piece of information needs enough contrast: 4.5:1 for normal text, 3:1 for large text, and 3:1 for the edges and icons people need to find and use a control.',
            trap:
              'Not everything pale is a bug. Disabled controls and pure decoration are exempt, so the greyed-out button was fine. Audit what carries meaning, not everything that looks light.',
            inTheWild:
              'WCAG 2.1 added SC 1.4.11 Non-text Contrast, which covers input borders, focus indicators and meaningful icons. Free tools such as WebAIM\'s Contrast Checker give the ratio in seconds.',
          },
        },

        // ─── 06 ──────────────────────────────────────────────────────────
        {
          id: 'visual-06',
          kind: 'decision',
          takeaway:
            'Before building a theme, name every colour by its job. If colours are hard-coded hex values, fix that first.',
          sayIt:
            'The filter ships today, but it turns photos into negatives and we\'d rebuild it anyway. Two sprints of tokens gives us a real dark mode and makes every future colour change one edit.',
          title: 'Just Invert It',
          principle: 'Semantic colour tokens & dark mode',
          place: 'eng-pod',
          time: 'Wed 16:40',
          cast: ['marcus', 'jonas'],
          situation:
            "The dark mode request has 40 likes and 12 support tickets, and Rhea, the CEO, has seen it. Marcus, the PM, wants it this sprint. Jonas, the staff engineer, can do it in an hour with one CSS filter that inverts everything and rotates the hues back. The proper way means replacing 214 hard-coded hex values across 60 files, about two sprints.",
          scene: [
            { who: 'marcus', mood: 'excited', says: 'The dark mode request has 40 likes and 12 support tickets. Rhea saw it. Can we have it this sprint?' },
            { who: 'jonas', mood: 'neutral', says: 'I can do it in an hour. One CSS filter: invert everything, rotate the hues back. Done.' },
            { who: 'jonas', mood: 'thinking', says: 'The proper way is longer. Right now we have 214 hard-coded hex values across 60 files.' },
          ],
          evidence: [
            { label: 'Hard-coded colours in the code', value: '214' },
            { label: 'Distinct colour jobs actually needed', value: '~30' },
            { label: 'Photos and avatars after an invert filter', value: 'Look like film negatives' },
          ],
          ask: 'Marcus needs a plan for Rhea. What do you propose?',
          choices: [
            {
              id: 'A',
              text: 'Ship the invert filter this sprint: it\'s fast, and we can refine the dark theme later.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'jonas', mood: 'happy', says: 'One line of CSS. Shipping before lunch.' },
              outcome:
                'Profile photos turned into film negatives, shadows became glowing halos and chart colours shifted. The top comment on the feature request was a screenshot. "Refine later" became a rewrite.',
            },
            {
              id: 'B',
              text: 'Use a prefers-color-scheme media query to darken the backgrounds and main text colours.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'jonas', mood: 'neutral', says: 'Media query it is. I\'ll catch the big ones.' },
              outcome:
                'Backgrounds and body text went dark. The other 180 hex values didn\'t. White cards, bright borders and light-grey text glowed on the dark page. Users called it "dark-ish mode".',
            },
            {
              id: 'C',
              text: 'Swap hard-coded colours for named tokens, and give each one a light and a dark value.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: -1 },
              reaction: { who: 'marcus', mood: 'worried', says: 'Two sprints instead of one hour. I\'ll explain it to Rhea.' },
              outcome:
                'Dark mode shipped two sprints later with every colour mapped. When Ana adjusted the orange a month after that, it was one change in one file, in both themes.',
            },
          ],
          debrief: {
            principle: 'Semantic colour tokens',
            insight:
              'Name colours by their job, not their value: "text-primary", "surface", "border". A theme is then just a second set of values for the same names, and dark mode becomes a mapping exercise instead of a hunt through 60 files.',
            trap:
              'Dark mode is not the opposite of light mode. Dark surfaces need softer whites, less saturated colours and different shadows. And photos should never be inverted.',
            inTheWild:
              'Material Design and Apple\'s Human Interface Guidelines both define colours by role (surface, label, background) with separate light and dark values. Material recommends dark grey surfaces rather than pure black.',
          },
        },

        // ─── 07 ──────────────────────────────────────────────────────────
        {
          id: 'visual-07',
          kind: 'decision',
          takeaway:
            'Before using the brand colour on sensitive data, check what that colour already means elsewhere in the product.',
          sayIt:
            'Let\'s keep orange in the header and buttons so it feels like us. But six of nine testers read orange scores as warnings, because that\'s what orange means in Launchly.',
          title: 'The Wellbeing Check-in',
          principle: 'Colour meaning in context',
          place: 'video-call',
          time: 'Thu 10:30',
          cast: ['ana', 'priya'],
          situation:
            "The team wellbeing check-in launches next month, and people will log their stress and workload every week. Ana, the head of brand, wants it orange top to bottom so it feels like Launchly. In a test by Priya, the researcher, a bright orange \"Stress: 8\" made two people think their manager had been alerted.",
          scene: [
            { who: 'ana', mood: 'excited', says: 'The team wellbeing check-in launches next month. I want it orange top to bottom. It\'s a Launchly feature, it should feel like one.' },
            { who: 'priya', mood: 'worried', says: 'People will log stress and workload every week. In my test, a bright orange "Stress: 8" made two people think their manager had been alerted.' },
            { who: 'ana', mood: 'thinking', says: 'It\'s our colour, though. People should know it\'s us.' },
          ],
          evidence: [
            { label: 'Testers who read orange scores as a warning', value: '6 of 9' },
            { label: 'Orange elsewhere in Launchly', value: 'Warnings & overdue tasks' },
          ],
          ask: 'What palette does the check-in get?',
          choices: [
            {
              id: 'A',
              text: 'A calm neutral palette for the scores, with orange only in the header and the buttons.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 0 },
              reaction: { who: 'ana', mood: 'thinking', says: 'So it\'s still ours, just quieter where it counts.' },
              outcome:
                'In Priya\'s next test nobody read their own score as an alarm, and the header still felt like Launchly. Check-in completion was 71% in the first month.',
            },
            {
              id: 'B',
              text: 'Orange throughout, as Ana wants. A consistent brand look builds trust in a new feature.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 2, speed: 1 },
              reaction: { who: 'ana', mood: 'happy', says: 'Good. It should look like us everywhere.' },
              outcome:
                'Users read their scores as warnings and asked support who could see their data. Completion fell to 38% by week three. The feature looked very on-brand and felt like a report card.',
            },
            {
              id: 'C',
              text: 'Keep orange for the scores, but pair it with soft greys and blues to calm the screen.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'priya', mood: 'thinking', says: 'Softer around it, but the score itself is still orange.' },
              outcome:
                'The screen felt calmer, but the number people cared about was still in the warning colour. Four of nine testers still read high scores as an alert. Half a fix.',
            },
          ],
          debrief: {
            principle: 'Colour meaning in context',
            insight:
              'A colour\'s meaning comes from how your product already uses it. Launchly uses orange for warnings, so orange scores read as warnings. Keep the brand in the frame and give sensitive data a calm, neutral treatment.',
            trap:
              'Brand consistency sounds like a rule, but a brand lives in the whole experience, not in every pixel. Using the brand colour against its own meaning makes the product feel less consistent, not more.',
            inTheWild:
              'Mood and wellbeing tools commonly show self-reported feelings in neutral or soft colours, and keep alert colours like red and orange for things that genuinely need action.',
          },
        },

        // ─── 08 ──────────────────────────────────────────────────────────
        {
          id: 'visual-08',
          kind: 'decision',
          takeaway:
            'Give distinct colours to the few categories that matter most, group the rest, and label lines directly instead of using a legend.',
          sayIt:
            'The colour is great in a demo, but four of seven testers matched lines to the wrong label. Five colours cover 88% of the activity, a grey \'Other\' holds the rest, and people read it first time.',
          title: 'Eleven Colours',
          principle: 'Limiting categorical colours',
          place: 'meeting-room',
          time: 'Fri 13:00',
          cast: ['kofi', 'sam'],
          situation:
            "Kofi, the head of sales, loves the new activity chart: eleven categories, eleven colours. But in yesterday's demo the client asked twice which line was Design and which was Docs, and Kofi couldn't tell either. Ana, the head of brand, suggested eleven shades of orange instead, and Sam, the junior designer, has mocked up both.",
          scene: [
            { who: 'kofi', mood: 'excited', says: 'The new activity chart is gorgeous: eleven categories, eleven colours. Customers love colour in a demo.' },
            { who: 'sam', mood: 'thinking', says: 'Ana suggested eleven shades of orange instead, to keep it on brand. I\'ve mocked both.' },
            { who: 'kofi', mood: 'worried', says: 'In yesterday\'s demo the client asked twice which line was "Design" and which was "Docs". I couldn\'t tell either.' },
          ],
          evidence: [
            { label: 'Categories in the chart', value: '11' },
            { label: 'Share of activity in the top 5', value: '88%' },
            { label: 'Testers who matched a line to the wrong legend item', value: '4 of 7' },
          ],
          ask: 'What does the chart ship with?',
          choices: [
            {
              id: 'A',
              text: 'Keep all eleven colours, but check each one passes 3:1 contrast against the background.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'kofi', mood: 'neutral', says: 'Brighter colours, same chart. Fine by me.' },
              outcome:
                'Every line was now visible, but eleven visible colours are still too many to tell apart and match to a legend. Testers kept mixing up teal, green and blue.',
            },
            {
              id: 'B',
              text: 'Colour the top five, group the other six as a grey "Other", and label each line directly.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 0 },
              reaction: { who: 'kofi', mood: 'thinking', says: 'Only five colours? Let\'s see how it demos.' },
              outcome:
                'Testers matched every line on the first try, and "Other" could be expanded when someone needed it. Kofi\'s next demo spent its time on the data, not the legend.',
            },
            {
              id: 'C',
              text: 'Use eleven shades of the brand orange: on-brand and calm, and the legend shows the order.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'worried', says: 'Eleven oranges… I\'ll try to space them out.' },
              outcome:
                'Shades of one colour say "more or less of the same thing". These were separate categories, and neighbouring shades looked identical. Testers gave up on the legend entirely.',
            },
          ],
          debrief: {
            principle: 'Limiting categorical colours',
            insight:
              'People can reliably tell apart only a handful of colours in one chart. Give distinct colours to what matters most, group the rest, and label lines directly so nobody has to bounce to a legend.',
            trap:
              '"Make every colour pass contrast" sounds rigorous but solves a different problem. And shades of one hue are for ordered data, like low to high, not for separate categories.',
            inTheWild:
              'Data-visualisation guides commonly recommend about six to eight categorical colours at most, grouping small categories as "Other" and labelling lines directly instead of relying on a legend.',
          },
        },
      ],
    },

    // ═══ CHAPTER 2: TYPOGRAPHY ═══════════════════════════════════════════
    {
      id: 'visual-ch2',
      title: 'Words on Screens',
      tagline: 'Type is most of the interface.',
      intro:
        'With colour on track, you turn to type. Launchly\'s fonts were chosen for the marketing site and copied everywhere else. Sam has ideas, Jonas has a font budget, and Priya has recordings of people leaning towards their screens.',
      briefing: [
        { who: 'sam', mood: 'excited', says: 'Type week! I have a moodboard of thirty fonts and I love every one of them.' },
        { who: 'jonas', mood: 'annoyed', says: 'We already load seven weights of one font. I am not loading thirty more.' },
        { who: 'priya', mood: 'neutral', says: 'Help centre readers stop after the first paragraph. I\'d like to know why before we pick anything.' },
        { who: 'rhea', mood: 'neutral', says: 'Just make it readable and on brand. Both. Today.' },
      ],
      retro: [
        { who: 'priya', mood: 'happy', says: 'What surprised me: the \'wall of text\' was one CSS value. Check line height before anyone rewrites anything.' },
        { who: 'jonas', mood: 'neutral', says: 'Three weights, three jobs. Faster to load, and nobody guesses any more.' },
        { who: 'sam', mood: 'thinking', says: 'Display fonts are for big moments. At 13px in a table, Playfair and the script just slow people down.' },
        { who: 'rhea', mood: 'thinking', says: 'And reading text stays around 16px, even on phones. Shrink the headings, not the sentences.' },
        { who: 'marcus', mood: 'neutral', says: 'Noted for next time: capitals don\'t make people act. Size and placement do.' },
      ],
      cases: [
        // ─── 09 ──────────────────────────────────────────────────────────
        {
          id: 'visual-09',
          kind: 'decision',
          takeaway:
            'Before using a brand font in the product, test it at your real UI sizes, 12 to 14px, not in a headline mockup.',
          sayIt:
            'Playfair is gorgeous at headline size, so let\'s keep it there. But 83% of our product text is under 16px, where its thin strokes break up. A plain UI font is easier to read.',
          title: 'Playfair Everywhere',
          principle: 'Display vs. UI typefaces',
          place: 'ceo-office',
          time: 'Mon 09:45',
          cast: ['ana', 'rhea', 'jonas'],
          situation:
            "The marketing site uses Playfair Display for headings, and people love it. Ana, the head of brand, and Rhea, the CEO, want it everywhere in the product too: buttons, tables, menus and forms, starting today. Jonas, the staff engineer, says that's easy, but most product text is 12 to 14px and Playfair has very thin strokes.",
          scene: [
            { who: 'ana', mood: 'excited', says: 'The marketing site uses Playfair Display for headings, and people love it. I want the product to feel the same.' },
            { who: 'rhea', mood: 'neutral', says: 'So: Playfair for buttons, tables, menus, forms. One font, one brand. Can we do it today?' },
            { who: 'jonas', mood: 'thinking', says: 'Technically easy. But most of our product text is 12 to 14 pixels, and Playfair has very thin strokes.' },
          ],
          evidence: [
            { label: 'Product text set below 16px', value: '83%' },
            { label: 'What Playfair Display was drawn for', value: 'Large headline sizes' },
          ],
          ask: 'Ana and Rhea want one font. What do you recommend?',
          choices: [
            {
              id: 'A',
              text: 'Use Playfair across the product, but raise small UI text to 15px so its thin strokes survive.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'jonas', mood: 'neutral', says: '15px everywhere. The tables are going to get wide.' },
              outcome:
                'Text got slightly easier to read, but tables lost two columns of space and numbers were still slow to scan. Six weeks later the team moved UI text to a sans-serif anyway.',
            },
            {
              id: 'B',
              text: 'A clear sans-serif for all product UI; Playfair stays for marketing and big brand moments.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 0 },
              reaction: { who: 'ana', mood: 'thinking', says: 'So the brand shows up in headlines, not in table cells.' },
              outcome:
                'The product read cleanly at every size, and Playfair on the marketing site and in onboarding headlines kept the brand voice. Ana called it "the brand at the right volume".',
            },
            {
              id: 'C',
              text: 'Use Playfair everywhere, as Ana and Rhea want: one typeface makes one consistent brand.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 2, speed: 2 },
              reaction: { who: 'rhea', mood: 'happy', says: 'One font. Clean. Ship it.' },
              outcome:
                'Headlines looked great. Tables, menus and form labels became tiring to read, and the thin strokes broke up on standard screens. Support called the redesign "fancy but hard to use".',
            },
          ],
          debrief: {
            principle: 'Display vs. UI typefaces',
            insight:
              'Display typefaces are built for size: strong thick-thin contrast looks elegant at 48px and falls apart at 13px. UI text needs open shapes, even strokes and clear numbers. Use each face where it was designed to work.',
            trap:
              '"One font, one brand" sounds like consistency, but a brand is voice and recognition, not one file. Pairing a display face for personality with a workhorse for reading is how most brands do it.',
            inTheWild:
              'Many brands pair a distinctive display face for marketing headlines with a neutral sans-serif, such as Inter or the system font, for product UI.',
          },
        },

        // ─── 10 ──────────────────────────────────────────────────────────
        {
          id: 'visual-10',
          kind: 'decision',
          takeaway:
            'For any text people must actually read, start at 16px. Use smaller sizes only for short labels people glance at.',
          sayIt:
            'I like the clean look, and we can keep it with spacing. But four of six testers leaned in or zoomed to read the refund terms. 16px for reading text fixes that.',
          title: 'Tiny Type',
          principle: 'Readable body text size',
          place: 'design-desk',
          time: 'Mon 15:00',
          cast: ['sam', 'priya'],
          situation:
            "Sam, the junior designer, set all the text on the pricing page draft at 11px to keep it clean and minimal. That text includes the plan details, the refund terms and the setup steps, which people really need to read. In a test by Priya, the researcher, people leaned towards the screen, and one zoomed the browser to 150%.",
          scene: [
            { who: 'sam', mood: 'happy', says: 'Pricing page draft! I set all the text at 11px. It keeps everything clean and minimal. No clutter.' },
            { who: 'priya', mood: 'thinking', says: 'The plan details, the refund terms and the setup steps are all in that 11px text. People need to actually read those.' },
            { who: 'priya', mood: 'worried', says: 'In my test, three of six people leaned towards the screen. One more zoomed the browser to 150%.' },
          ],
          evidence: [
            { label: 'Reading text on the page', value: '~900 words' },
            { label: 'Browser default text size', value: '16px' },
            { label: 'Testers who leaned in or zoomed', value: '4 of 6' },
          ],
          ask: 'Sam asks what size you want. What do you say?',
          choices: [
            {
              id: 'A',
              text: 'Reading text at 16px, small sizes only for short labels, and let the layout grow.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: -1 },
              reaction: { who: 'priya', mood: 'happy', says: 'I\'ll run the same test on Thursday.' },
              outcome:
                'Nobody zoomed in the re-test, and people read the refund terms instead of asking about them. The page got a little longer, and nobody minded.',
            },
            {
              id: 'B',
              text: 'Keep 11px, but make it pure black and add line height so the small text reads clearly.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'sam', mood: 'happy', says: 'Darker and airier. I like that.' },
              outcome:
                'Darker helped a little, but the letters were still too small to read comfortably. Visitors kept zooming, which broke the layout, and the refund terms became a support topic.',
            },
            {
              id: 'C',
              text: 'Raise everything to 14px: readable enough, and the layout stays compact and minimal.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: '14 still feels minimal. I\'ll update it.' },
              outcome:
                'Better: fewer people leaned in. But 900 words at 14px was still tiring, and Priya\'s testers skimmed the refund terms instead of reading them.',
            },
          ],
          debrief: {
            principle: 'Readable body text size',
            insight:
              'Size reading text for the reader, not the layout. 16px, the browser default, is a sensible baseline for paragraphs people must read. Smaller sizes are fine for short labels and details people only glance at.',
            trap:
              'Minimal is not the same as small. Tiny text hides clutter instead of removing it, and moves the work onto the reader\'s eyes.',
            inTheWild:
              'WCAG sets no minimum font size, but SC 1.4.4 requires text to resize to 200% without losing content. Most browsers default to 16px, and GOV.UK uses 19px body text on large screens.',
          },
        },

        // ─── 11 ──────────────────────────────────────────────────────────
        {
          id: 'visual-11',
          kind: 'decision',
          takeaway:
            'When text feels heavy, check line height before rewriting anything. Body text usually wants about 1.4 to 1.6.',
          sayIt:
            'Before we ask for a six-week rewrite, let\'s try one CSS change. Line height is 1.0, so the lines nearly touch. At 1.5 we\'ll know within two weeks if people read further.',
          title: 'Wall of Text',
          principle: 'Line height',
          place: 'research-lab',
          time: 'Tue 11:30',
          cast: ['priya', 'marcus'],
          situation:
            "Help centre feedback this month calls the articles \"a wall\" that is hard on the eyes. The text is 16px, so size is not the problem. Marcus, the PM, thinks the articles are too long and wants the content team to cut them. Priya, the researcher, checked the CSS: line height is 1.0, and the lines almost touch.",
          scene: [
            { who: 'priya', mood: 'thinking', says: 'Help centre feedback this month: "suffocating", "a wall", "my eyes slide off". The text is 16px, so size isn\'t the problem.' },
            { who: 'marcus', mood: 'neutral', says: 'I think the articles are just too long. Can we ask the content team to cut them?' },
            { who: 'priya', mood: 'neutral', says: 'I checked the CSS. Line height is 1.0. The lines are practically touching.' },
          ],
          evidence: [
            { label: 'Body text', value: '16px, line height 1.0' },
            { label: 'Readers who reach the end of an article', value: '23%' },
          ],
          ask: 'What do you change first?',
          choices: [
            {
              id: 'A',
              text: 'Set body line height to about 1.5, so each line has room and the eye finds the next one.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 2 },
              reaction: { who: 'marcus', mood: 'thinking', says: 'One CSS value? That\'s a cheap test.' },
              outcome:
                'Readers reaching the end of articles rose to 41% in two weeks, and the "wall of text" comments stopped. The content team didn\'t change a word.',
            },
            {
              id: 'B',
              text: 'Ask the content team to cut every article in half: shorter text will feel less heavy.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: -2, speed: -2 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Shorter is always better. I\'ll talk to them.' },
              outcome:
                'Rewriting took six weeks. The shorter articles still had touching lines, still felt heavy, and some lost steps people needed. Completion barely moved.',
            },
            {
              id: 'C',
              text: 'Add more space between paragraphs, so the long blocks of text are broken up visually.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 2 },
              reaction: { who: 'priya', mood: 'neutral', says: 'That should make the blocks feel smaller.' },
              outcome:
                'Paragraphs separated nicely, but inside each one the lines still touched. Readers still lost their place moving from line to line. A real change, aimed at the wrong gap.',
            },
          ],
          debrief: {
            principle: 'Line height (leading)',
            insight:
              'Line height is the space the eye travels through to find the next line. Around 1.4 to 1.6 suits most body text; at 1.0 lines crowd together and readers lose their place. Fix the gap inside the paragraph first.',
            trap:
              'When text feels heavy, it\'s tempting to blame the writing. Sometimes the writing is the problem, but check the typography first. It\'s one line of CSS, not six weeks of rewriting.',
            inTheWild:
              'WCAG 1.4.8 (AAA) recommends line spacing of at least 1.5 within paragraphs, and 1.4.12 (AA) requires content to keep working when users set it to 1.5.',
          },
        },

        // ─── 12 ──────────────────────────────────────────────────────────
        {
          id: 'visual-12',
          kind: 'decision',
          takeaway:
            'Keep two or three font weights, and give each one a single job you can describe in one sentence.',
          sayIt:
            'Seven weights cost us 210 KB, and nobody can say when to use 500 versus 600. Three weights with one job each load faster and make headings stand out more.',
          title: 'Seven Weights',
          principle: 'Typographic hierarchy',
          place: 'eng-pod',
          time: 'Wed 10:15',
          cast: ['jonas', 'sam'],
          situation:
            "Jonas, the staff engineer, points out that the app loads seven weights of one font, from 100 to 800, before a single word appears. Sam, the junior designer, uses them all: Light for body text because it looks elegant, Thin for big numbers. Nobody has written down when to use which, so Jonas guesses between 500 and 600.",
          scene: [
            { who: 'jonas', mood: 'annoyed', says: 'We load seven weights of one font: 100, 300, 400, 500, 600, 700, 800. That\'s 210 KB before a single word appears.' },
            { who: 'sam', mood: 'thinking', says: 'I use them all, though. Light for body text looks really elegant, and Thin is great for big numbers.' },
            { who: 'jonas', mood: 'neutral', says: 'Nobody can tell me when to use 500 versus 600. I just guess.' },
          ],
          evidence: [
            { label: 'Weights loaded', value: '7 (210 KB)' },
            { label: 'Screens with Light (300) body text at 14px', value: '40' },
            { label: 'Weights with a written rule', value: '0' },
          ],
          ask: 'What does the type system keep?',
          choices: [
            {
              id: 'A',
              text: 'Three weights with one job each: Regular for body, SemiBold for labels, Bold for headings.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 0 },
              reaction: { who: 'jonas', mood: 'happy', says: 'Three files instead of seven. I\'m listening.' },
              outcome:
                'Font loading fell to about 90 KB, and every designer could explain the hierarchy in one sentence. Headings stood out more, because fewer weights were competing with them.',
            },
            {
              id: 'B',
              text: 'Cut to three weights, but keep Light as the body weight. Sam\'s right that it looks elegant.',
              verdict: 'okay',
              meters: { users: -1, business: 0, team: 2, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: 'Three weights, and my Light stays.' },
              outcome:
                'Fonts loaded faster, but thin 14px body text was still hard to read on standard screens. Light was swapped for Regular a month later, after Priya\'s tests.',
            },
            {
              id: 'C',
              text: 'Keep all seven and write a guide giving each weight a clear job: more range for designers.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 1, speed: -1 },
              reaction: { who: 'jonas', mood: 'annoyed', says: 'A seven-row table of rules. Great.' },
              outcome:
                'The guide was thorough and nobody remembered it. Designers still couldn\'t see a 100-unit difference, Jonas kept guessing, and the page still loaded 210 KB of fonts.',
            },
          ],
          debrief: {
            principle: 'Typographic hierarchy',
            insight:
              'Hierarchy comes from clear differences. Two or three weights, each with one job, plus size and spacing, give stronger contrast than seven weights only 100 units apart, and they load faster.',
            trap:
              'Documenting everything feels like a system, but a system\'s job is to reduce choices. And thin weights look elegant in big mockups; at 14px body size they are hard to read.',
            inTheWild:
              'Material Design 3\'s whole type scale uses just two weights, Regular (400) and Medium (500), and builds its hierarchy mostly with size.',
          },
        },

        // ─── 13 (spot) ────────────────────────────────────────────────────
        {
          id: 'visual-13',
          kind: 'spot',
          takeaway:
            'Review an article by reading it top to bottom: check line length, alignment, heading styles, and that key text isn\'t the faintest.',
          sayIt:
            'The structure is right. Four style choices make it harder to read: very long lines, justified text, mixed headings and a faint note. Each one is a quick fix.',
          title: 'The Help Article',
          principle: 'Readable, consistent typography',
          place: 'design-desk',
          time: 'Wed 16:00',
          cast: ['sam', 'priya'],
          situation:
            "Sam, the junior designer, has written the first help article in the new style, \"Setting up recurring tasks\", and wants your review before it goes live. Priya, the researcher, reminds you that readers in the old help centre stopped after the first paragraph.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'First help article in the new style: "Setting up recurring tasks". Can you review it before it goes live?' },
            { who: 'priya', mood: 'neutral', says: 'Readers in the old help centre stopped after the first paragraph. Let\'s not repeat that.' },
          ],
          ask: 'Tap the 4 typography problems in the article.',
          mock: 'help-article',
          taps: 6,
          mockSpec:
            'A help-centre article on a wide 1440px desktop screen, white background. Top to bottom: breadcrumb "Help › Tasks" in 13px grey #6B7280, 4.83:1 (fine). Title "Setting up recurring tasks" in 32px bold #111827 (fine). Intro paragraph in 16px Regular with 1.5 line height, but the text column runs the full page width, about 140 characters per line [measure]. Second paragraph fully justified, with large uneven gaps between words that form white "rivers" down the block [justify]. Three subheadings of the same level ("Create a repeat rule", "Edit a series", "Stop repeating"), each styled differently: 22px Bold dark grey, 20px SemiBold Italic, and 24px Medium in orange #FF6B00 [subheads]. A numbered list of 4 steps in 16px Regular with 8px between items (fine). An inline code snippet "every 2 weeks on Monday" in a grey monospace box (fine). A "Note" paragraph about time zones set in 13px Light italic in pale grey #9CA3AF [note]. Footer: "Was this helpful?" with Yes and No buttons (fine).',
          hotspots: [
            {
              id: 'measure',
              label: 'Lines are far too long',
              explain:
                'At about 140 characters per line, the eye struggles to find the start of the next line. Keep body text to roughly 45 to 75 characters by giving the text column a max-width.',
            },
            {
              id: 'justify',
              label: 'Justified text with rivers',
              explain:
                'Browsers justify text by stretching the spaces, which leaves uneven gaps that slow reading, especially for people with dyslexia. Use left-aligned text.',
            },
            {
              id: 'subheads',
              label: 'Same-level headings, three styles',
              explain:
                'These headings have the same rank, so they should look identical. Three styles make readers wonder which is more important. And orange #FF6B00 at 2.86:1 fails even the 3:1 large-text minimum.',
            },
            {
              id: 'note',
              label: 'Key note in thin, pale italic',
              explain:
                'The time-zone note is what people most often get wrong, and it\'s in the hardest style to read: small, Light, italic, at 2.54:1. Important text should never be the faintest on the page.',
            },
          ],
          debrief: {
            principle: 'Readable, consistent typography',
            insight:
              'Readable typography is mostly restraint: a comfortable line length, left-aligned text, one style per heading level, and important text that is never the faintest thing on the page.',
            trap:
              'Each choice looks deliberate on its own: justified text looks tidy, varied headings look lively. The problems only appear when you read the page like a user, top to bottom.',
            inTheWild:
              'WCAG 1.4.8 (AAA) recommends lines no wider than 80 characters and text that isn\'t justified. Robert Bringhurst\'s The Elements of Typographic Style gives 45 to 75 characters as a comfortable line.',
          },
        },

        // ─── 14 ──────────────────────────────────────────────────────────
        {
          id: 'visual-14',
          kind: 'decision',
          takeaway:
            'Use expressive type where people pause and look, and plain type where they scan and hunt for something.',
          sayIt:
            'The script deserves a better stage than a column header. In testing it more than doubled the time to find a column. On the report cover, people will actually look at it.',
          title: 'Script in the Table',
          principle: 'Functional typography',
          place: 'meeting-room',
          time: 'Thu 11:00',
          cast: ['sam', 'ana'],
          situation:
            "Sam, the junior designer, wants the column headers in the reports table set in the brand script, to make the most boring screen feel special. Ana, the head of brand, is excited, because the script almost never gets used. The table has twelve columns, like Acquisition date and Conversion rate, and in the script the headers wrap to two lines.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'What if the column headers in the reports table used our brand script? It would make the most boring screen feel special.' },
            { who: 'ana', mood: 'happy', says: 'We almost never use the script. This could be its moment.' },
            { who: 'sam', mood: 'thinking', says: 'There are twelve columns: "Acquisition date", "Revenue", "Conversion rate"… In the script, the headers wrap to two lines.' },
          ],
          evidence: [
            { label: 'Columns in the reports table', value: '12' },
            { label: 'Time to find a named column', value: 'Script 6.1s · Sans 2.4s' },
            { label: 'Users who open reports weekly', value: '64%' },
          ],
          ask: 'Ana is excited. What do you decide?',
          choices: [
            {
              id: 'A',
              text: 'UI font at SemiBold for the headers, and give the script its moment on the report cover.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 0 },
              reaction: { who: 'ana', mood: 'thinking', says: 'The cover is a better stage for it anyway.' },
              outcome:
                'Finding a column was back to 2.4 seconds, and the script on report covers got more compliments than the table ever would have. The brand showed up where people paused, not where they worked.',
            },
            {
              id: 'B',
              text: 'Use the script, but larger at 18px so it reads well. Reports need personality too.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 2, speed: 1 },
              reaction: { who: 'ana', mood: 'excited', says: 'Bigger script. Even better.' },
              outcome:
                'Headers grew to three lines and pushed the first row of data down the screen. Finding a column still took twice as long, and power users started exporting to spreadsheets to avoid it.',
            },
            {
              id: 'C',
              text: 'UI font for the headers, coloured in the brand orange to keep some personality.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: 'Orange headers. Fun.' },
              outcome:
                'Scanning was fast again, but #FF6B00 text on white is 2.86:1 and failed contrast. Jonas caught it in review, and the headers went back to dark grey a week later.',
            },
          ],
          debrief: {
            principle: 'Functional typography',
            insight:
              'In a data table, people scan the headers to find one column fast. That needs a plain, compact, highly legible face. Put expressive type where people pause and look, not where they hunt.',
            trap:
              'Making decorative type bigger feels like a fix, but it costs space without changing the slow letter shapes. Colouring headers in a bright brand colour adds personality and a contrast failure.',
            inTheWild:
              'Spreadsheets and analytics tools almost always set column headers in the same plain UI face as the data, using weight, not a different typeface, to set them apart.',
          },
        },

        // ─── 15 ──────────────────────────────────────────────────────────
        {
          id: 'visual-15',
          kind: 'decision',
          takeaway:
            'On small screens, scale headings down and keep body text around 16px. Never shrink reading text to make things fit.',
          sayIt:
            'Shrinking everything fits the headline but drops body text to about 13px, and iPhones will zoom into the form. Let headings scale with the screen and keep body text at 16px.',
          title: 'Same Size Everywhere',
          principle: 'Responsive type scale',
          place: 'video-call',
          time: 'Thu 16:30',
          cast: ['marcus', 'jonas'],
          situation:
            "On his phone, Marcus, the PM, sees the homepage headline wrap to five lines and the Start free trial button pushed off-screen. Every screen uses the same sizes: 56px headline, 16px body. Jonas, the staff engineer, can make mobile smaller if you tell him what. Marcus suggests scaling the whole page down on small screens, so everything stays in proportion.",
          scene: [
            { who: 'marcus', mood: 'worried', says: 'On my phone the homepage headline wraps to five lines and the "Start free trial" button is off-screen.' },
            { who: 'jonas', mood: 'neutral', says: 'Same sizes on every screen: 56px headline, 16px body. I can make mobile smaller. Tell me what.' },
            { who: 'marcus', mood: 'thinking', says: 'Could we just scale the whole page down on small screens? Everything stays in proportion.' },
          ],
          evidence: [
            { label: 'Headline on a 375px phone', value: '5 lines' },
            { label: 'Homepage visitors on mobile', value: '58%' },
            { label: 'iOS Safari zooms into inputs with text under', value: '16px' },
          ],
          ask: 'What do you give Jonas?',
          choices: [
            {
              id: 'A',
              text: 'Scale the whole page down 20% on phones, body text included, so everything stays in proportion.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'jonas', mood: 'neutral', says: 'Proportional. Easy enough to do.' },
              outcome:
                'The headline fit, but body text fell to about 13px and got hard to read. And iOS Safari zoomed in every time someone tapped the email field, because its text was under 16px.',
            },
            {
              id: 'B',
              text: 'Add one mobile breakpoint that drops the headline to 32px, and leave every other size as is.',
              verdict: 'okay',
              meters: { users: 1, business: 0, team: 1, speed: 1 },
              reaction: { who: 'jonas', mood: 'happy', says: 'One breakpoint. Done by lunch.' },
              outcome:
                'Phones looked fine. But tablets and narrow laptop windows, just above the breakpoint, still got the 56px headline wrapping to four lines. A step where you needed a slope.',
            },
            {
              id: 'C',
              text: 'Let headings scale smoothly with screen width, and keep body text at 16px on every screen.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 1, speed: 0 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Big on desktop, sensible on phones. Nice.' },
              outcome:
                'The headline fit in two lines on phones and stayed bold on desktop, with no jumps in between. Body text stayed comfortable everywhere, and mobile trial starts rose 11%.',
            },
          ],
          debrief: {
            principle: 'Responsive type scale',
            insight:
              'Big type should shrink on small screens; reading text shouldn\'t. Headings can scale smoothly with the viewport (CSS clamp()), while body text stays around 16px. People hold phones closer, but not that much closer.',
            trap:
              'Scaling everything "in proportion" sounds principled, but reading text pays the price. Small screens need a smaller gap between heading and body sizes, not a shrunken copy of the desktop page.',
            inTheWild:
              'CSS clamp() makes fluid type easy. Apple\'s default iOS body text style is 17pt, and iOS Safari zooms into form fields whose text is smaller than 16px.',
          },
        },

        // ─── 16 ──────────────────────────────────────────────────────────
        {
          id: 'visual-16',
          kind: 'decision',
          takeaway:
            'To make text stand out, change its size, weight, colour or position, not its case. Keep full sentences in sentence case.',
          sayIt:
            'I want this prompt noticed too. Capitals slow people down and read as shouting. A bold headline at the top grabs attention, and people still read all 24 words.',
          title: 'All Caps Urgency',
          principle: 'Case and legibility',
          place: 'kitchen',
          time: 'Fri 09:20',
          cast: ['marcus', 'rhea'],
          situation:
            "Only 31% of users finish setup, and most dismiss the current prompt almost at once. Marcus, the PM, has written a new two-sentence onboarding prompt in all capitals to make it feel urgent, and wants it live today. Rhea, the CEO, is fine with shouting a bit if it gets people moving.",
          scene: [
            { who: 'marcus', mood: 'excited', says: 'New onboarding prompt: "COMPLETE YOUR PROFILE TO GET THE MOST OUT OF LAUNCHLY. ADD YOUR TEAM, CONNECT YOUR TOOLS…" All caps. Urgent.' },
            { who: 'rhea', mood: 'neutral', says: 'Only 31% finish setup. If capitals get people moving, I\'m fine with shouting a bit.' },
            { who: 'marcus', mood: 'thinking', says: 'It\'s two sentences. Can we have it live today?' },
          ],
          evidence: [
            { label: 'Users who finish setup', value: '31%' },
            { label: 'Prompt length', value: '2 sentences, 24 words' },
            { label: 'Current prompt dismissed in under 2s', value: '58%' },
          ],
          ask: 'How should the prompt get attention?',
          choices: [
            {
              id: 'A',
              text: 'Sentence case; make it stand out with a bold headline, top placement and a clear button.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 0, speed: 0 },
              reaction: { who: 'rhea', mood: 'thinking', says: 'Bold, but not shouting. Okay, show me.' },
              outcome:
                'Setup completion rose to 39%. The prompt stood out through size and position, and people read all of it, including which tools they could connect.',
            },
            {
              id: 'B',
              text: 'All caps, but with wider letter spacing so the capitals breathe and read more smoothly.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Spaced-out caps look premium. Ship it.' },
              outcome:
                'Letter spacing helps short caps labels, not 24 words. People read the first line and skipped the rest, and completion barely moved, to 32%. Two users told support Launchly was "yelling at them".',
            },
            {
              id: 'C',
              text: 'Just the headline in caps, "COMPLETE YOUR PROFILE", and the rest in sentence case.',
              verdict: 'okay',
              meters: { users: 0, business: 1, team: 1, speed: 1 },
              reaction: { who: 'marcus', mood: 'neutral', says: 'Caps headline, normal body. Fair.' },
              outcome:
                'The body was readable now, but the headline still felt like shouting to some users and completion reached only 34%. Size and placement were doing more work than the caps.',
            },
          ],
          debrief: {
            principle: 'Case and legibility',
            insight:
              'People are far less practised at reading capitals, so long all-caps text slows them down, and it reads as shouting. Get attention with size, weight, colour and position, and keep the words easy to read.',
            trap:
              'Caps do grab attention for a word or two, and wider spacing helps short labels. For full sentences they slow reading and sound rude: the wrong tone when you\'re asking users for something.',
            inTheWild:
              'Readability studies going back to Miles Tinker found all-caps text is read more slowly than lowercase. GOV.UK\'s style guide advises against block capitals for blocks of text.',
          },
        },
      ],
    },

    // ═══ CHAPTER 3: SPACING & GRIDS ══════════════════════════════════════
    {
      id: 'visual-ch3',
      title: 'The Space Between',
      tagline: 'Spacing is a language too.',
      intro:
        'Three designers, six months, no spacing rules. Jonas is building the component library and needs numbers he can trust. Every gap on every screen is about to become a decision, and it\'s yours.',
      briefing: [
        { who: 'jonas', mood: 'neutral', says: 'The component library starts Monday. I need spacing numbers I can put in code and never argue about again.' },
        { who: 'sam', mood: 'worried', says: 'Our files have 7, 10, 14px… I think some of those are mine.' },
        { who: 'marcus', mood: 'thinking', says: 'The design system launches in five weeks. Whatever we decide has to fit in that.' },
        { who: 'jonas', mood: 'annoyed', says: 'And nobody say \'just eyeball it\'. I\'ve been eyeballing for six months.' },
      ],
      retro: [
        { who: 'jonas', mood: 'happy', says: 'Best thing we did: named tokens. I haven\'t typed a raw pixel value all week.' },
        { who: 'sam', mood: 'thinking', says: 'For me it\'s that space says what belongs together. Small gaps inside a group, big gaps between groups.' },
        { who: 'marcus', mood: 'neutral', says: 'I\'ll admit it: minimums are floors. Our 36px button passed the rule and still caused mis-taps.' },
        { who: 'jonas', mood: 'neutral', says: 'Also: components own their padding, layouts own the gaps. And the grid is about where things land, borders included.' },
        { who: 'sam', mood: 'happy', says: 'And on phones we shrink spacing, but not to nothing. Sixteen is the new twenty-four.' },
      ],
      cases: [
        // ─── 17 ──────────────────────────────────────────────────────────
        {
          id: 'visual-17',
          kind: 'decision',
          takeaway:
            'Check the grid against what you see on screen, not the CSS number. Borders take space, so subtract them from padding.',
          sayIt:
            'Sam\'s right to protect the grid, and this does protect it. With the 1px border, 7px padding puts the content exactly at 8, so the text lines up with the row beside it.',
          title: 'The 7px Padding',
          principle: '8pt spacing grid',
          place: 'eng-pod',
          time: 'Mon 10:20',
          cast: ['jonas', 'sam'],
          situation:
            "The task card has a 1px border and the row next to it doesn't, so with 8px padding the card's text sits 1px right of the row's text. Jonas, the staff engineer, wants 7px padding on the card: seven plus the border makes eight. Sam, the junior designer, says that breaks the 8px grid: \"If we allow 7 here, where does it stop?\"",
          scene: [
            { who: 'jonas', mood: 'thinking', says: 'Quick one. The task card has a 1px border; the row next to it doesn\'t. With 8px padding, the card\'s text sits 1px right of the row\'s text.' },
            { who: 'jonas', mood: 'neutral', says: 'So I want 7px padding on the card. Seven plus the border makes eight. Sam says that breaks the grid.' },
            { who: 'sam', mood: 'worried', says: 'We said multiples of 8. If we allow 7 here, where does it stop?' },
          ],
          evidence: [
            { label: 'Grid unit', value: '8px' },
            { label: 'Card border', value: '1px' },
            { label: 'Text offset with 8px padding', value: '1px' },
          ],
          ask: 'Both are looking at you. Your call?',
          choices: [
            {
              id: 'A',
              text: 'Use 7px here. With the 1px border it totals 8, the text lines up, and the grid holds.',
              verdict: 'strong',
              meters: { users: 1, business: 0, team: 2, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: 'So the grid is about where things land, not the number in the CSS?' },
              outcome:
                'Text in cards and rows lined up exactly. Jonas added a "minus the border" note to the card spec, and it became a design-system rule: measure the result, not the property.',
            },
            {
              id: 'B',
              text: 'Keep 8px. The grid is the rule, and 1px of misalignment is too small for anyone to see.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 0, speed: 1 },
              reaction: { who: 'jonas', mood: 'annoyed', says: 'Fine. It\'ll be 1px off forever.' },
              outcome:
                'On its own, 1px was invisible. Stacked in a list of 40 tasks, the jagged left edge was the first thing Ana noticed in review. The grid was obeyed and the alignment was broken.',
            },
            {
              id: 'C',
              text: 'Use 4px: it\'s on the grid as a half-step, so it\'s still a clean value in the system.',
              verdict: 'costly',
              meters: { users: -1, business: 0, team: -1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: '4 is on the grid. Works for me.' },
              outcome:
                'Now the text sat 3px off instead of 1px, and the card looked cramped next to its neighbours. The number was on the grid; the layout wasn\'t.',
            },
          ],
          debrief: {
            principle: '8pt grid: measure the visible result',
            insight:
              'A spacing grid exists to make things line up and feel consistent. Borders take up space, so a bordered element often needs its padding reduced by the border width to land on the grid.',
            trap:
              'Holding the rule feels disciplined, but the rule serves alignment, not the other way round. And choosing another "approved" number that misaligns more isn\'t keeping the system.',
            inTheWild:
              'Front-end teams often compensate for borders, for example with padding: calc(8px - 1px), or use an inset box-shadow, which draws a border without taking up space.',
          },
        },

        // ─── 18 ──────────────────────────────────────────────────────────
        {
          id: 'visual-18',
          kind: 'decision',
          takeaway:
            'In long forms, keep gaps inside a group small and gaps between groups clearly bigger, with a heading for each group.',
          sayIt:
            'A wizard calms each screen, but most people come here to change one field. Three titled sections let them jump straight to Billing, which is what the tickets ask for.',
          title: 'Twelve Fields',
          principle: 'Proximity & grouping in forms',
          place: 'design-desk',
          time: 'Mon 14:45',
          cast: ['sam', 'marcus'],
          situation:
            "Jonas, the staff engineer, built account settings from a wireframe by Sam, the junior designer: twelve fields, 8px apart, in one long column. The wireframe only showed the order, with no spacing or sections. Support says people can't find the billing email. Marcus, the PM, suggests a three-step wizard with four fields per step.",
          scene: [
            { who: 'sam', mood: 'worried', says: 'Jonas built account settings from my wireframe. Twelve fields, 8px apart, one long column. It looks like a wall.' },
            { who: 'sam', mood: 'thinking', says: 'The wireframe only showed the order. We never specified spacing or sections.' },
            { who: 'marcus', mood: 'thinking', says: 'Support says people can\'t find the billing email. Could we split it into a three-step wizard? Four fields per step.' },
          ],
          evidence: [
            { label: 'Fields', value: '12 (profile, contact, billing)' },
            { label: 'Space between every field', value: '8px' },
            { label: 'Typical visit', value: 'Change one field, then leave' },
          ],
          ask: 'What do you spec?',
          choices: [
            {
              id: 'A',
              text: 'Split it into a three-step wizard, four fields per step, so no screen feels like a wall.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 0 },
              reaction: { who: 'marcus', mood: 'happy', says: 'A wizard. Very tidy.' },
              outcome:
                'Each screen looked calm, but changing the billing email now meant clicking through two steps to find it. Settings visits took twice as long, and "where is my billing email" tickets rose.',
            },
            {
              id: 'B',
              text: 'Increase the gap between every field to 16px, so the whole form has room to breathe.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 2 },
              reaction: { who: 'sam', mood: 'thinking', says: 'Even spacing. Easy to spec.' },
              outcome:
                'The form breathed, but it was still one long, even list. Without groups, people still read every label to find billing details. Nicer to look at, not much easier to use.',
            },
            {
              id: 'C',
              text: 'Three titled sections, with 16px between fields and 40px between the sections.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: 'Sections with headings. I\'ll spec it tonight.' },
              outcome:
                'People found the billing email in seconds, because the "Billing" heading led them there. The "can\'t find it" tickets stopped within a week.',
            },
          ],
          debrief: {
            principle: 'Proximity & grouping',
            insight:
              'Space communicates. Things close together read as related; a bigger gap reads as a new group. Use small gaps inside a group and clearly larger gaps, plus a heading, between groups.',
            trap:
              'Even spacing feels fair, but it says every field relates equally to every other. A wizard fixes how a form looks by making it harder to use, which is bad for a page people visit to change one thing.',
            inTheWild:
              'This is the Gestalt law of proximity. Long settings pages in most mature products are split into titled sections, often with side navigation, rather than into steps.',
          },
        },

        // ─── 19 ──────────────────────────────────────────────────────────
        {
          id: 'visual-19',
          kind: 'decision',
          takeaway:
            'Before documenting a variant, ask: is there a real need, or are we making an accident official?',
          sayIt:
            'We could name three sizes, but nobody chose them; three people made different calls. One padding for cards in a row lines up the titles and lets Jonas delete two components.',
          title: 'Three Card Paddings',
          principle: 'Component consistency',
          place: 'lounge',
          time: 'Tue 11:10',
          cast: ['sam', 'jonas'],
          situation:
            "Dashboard cards were designed by three different people: metric cards have 16px padding, alert cards 20px and profile cards 24px, and they sit in the same row. Jonas, the staff engineer, says their titles don't line up and he maintains three card components. Sam, the junior designer, asks whether to document them as Compact, Standard and Spacious.",
          scene: [
            { who: 'sam', mood: 'neutral', says: 'Dashboard cards: metric cards have 16px padding, alert cards 20px, profile cards 24px. Three different people designed them.' },
            { who: 'jonas', mood: 'annoyed', says: 'And they sit in the same row. Their titles don\'t line up, and I maintain three card components.' },
            { who: 'sam', mood: 'thinking', says: 'Should I write them up as three official sizes? Compact, Standard, Spacious?' },
          ],
          evidence: [
            { label: 'Card types in the same row', value: '3' },
            { label: 'Title misalignment across the row', value: 'Up to 8px' },
            { label: 'Documented reason for the differences', value: 'None' },
          ],
          ask: 'What do you tell Sam?',
          choices: [
            {
              id: 'A',
              text: 'Make one card component with one padding from the spacing scale, used by all three cards.',
              verdict: 'strong',
              meters: { users: 1, business: 1, team: 2, speed: 0 },
              reaction: { who: 'jonas', mood: 'happy', says: 'One component. I\'ll delete two.' },
              outcome:
                'Titles lined up across the row, the dashboard looked calmer, and Jonas deleted two components. When a denser card was needed later, it was added as a deliberate variant.',
            },
            {
              id: 'B',
              text: 'Document them as Compact, Standard and Spacious sizes, with guidance for when to use each.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: 'Three sizes, all official. I\'ll write it up.' },
              outcome:
                'Now the mismatch was documented. Titles still didn\'t line up, 20px stayed off the grid, and new designers picked sizes by mood. The documentation made the accident permanent.',
            },
            {
              id: 'C',
              text: 'Leave them. Each card was tuned for its own content by the designer who knew it best.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: -1, speed: 2 },
              reaction: { who: 'jonas', mood: 'annoyed', says: 'So, three components forever.' },
              outcome:
                'A fourth card type arrived next month with 18px padding. The dashboard looked slightly broken in a way nobody could name, and every card bug had to be fixed three times.',
            },
          ],
          debrief: {
            principle: 'Component consistency',
            insight:
              'Differences in a system should be intentional and explainable. Cards that sit side by side should share padding so their edges and titles line up. Add a variant only for a real need.',
            trap:
              'Documenting what exists feels like building a system, but it can turn accidents into rules. Before naming three sizes, ask whether anyone actually needs three.',
            inTheWild:
              'Design systems such as Atlassian\'s and Shopify Polaris define spacing as a fixed set of tokens, so component padding comes from a short, shared list instead of one-off numbers.',
          },
        },

        // ─── 20 ──────────────────────────────────────────────────────────
        {
          id: 'visual-20',
          kind: 'decision',
          takeaway:
            'Keep outer margins off components. Let the parent layout set the space between them.',
          sayIt:
            'Consistent spacing is the right goal, but the button can\'t know where it sits. If the layout sets the gaps, it works in forms, toolbars and dialogs with no overrides.',
          title: 'Margin or Padding',
          principle: 'Components own padding, layouts own spacing',
          place: 'eng-pod',
          time: 'Tue 15:30',
          cast: ['jonas', 'sam'],
          situation:
            "Jonas, the staff engineer, is building the Button component for the library. He wants to build 24px of margin into Button, so every page gets the same space after a button for free. Sam, the junior designer, notes that buttons also sit in toolbars, dialogs and table rows, and one already looks odd in a toolbar.",
          scene: [
            { who: 'jonas', mood: 'thinking', says: 'Button component question. The space between a button and whatever comes after it: should that live on the button?' },
            { who: 'jonas', mood: 'neutral', says: 'If I build 24px of margin into Button, every page gets consistent spacing for free. Seems tidy.' },
            { who: 'sam', mood: 'thinking', says: 'Buttons also sit in toolbars, dialogs and table rows. One already looks odd in a toolbar.' },
          ],
          evidence: [
            { label: 'Places Button is used', value: '140' },
            { label: 'Space needed after it', value: '0 to 32px, depending on context' },
          ],
          ask: 'Jonas wants a rule for the component library. What is it?',
          choices: [
            {
              id: 'A',
              text: 'Build 24px of margin into the Button component so the space after it is the same everywhere.',
              verdict: 'costly',
              meters: { users: -1, business: 0, team: -1, speed: 1 },
              reaction: { who: 'jonas', mood: 'happy', says: 'Consistent everywhere. Love it.' },
              outcome:
                'Forms looked right. Toolbars, dialogs and table rows got stray 24px gaps, and engineers wrote "margin: 0" overrides in 40 places. The consistent button was fought on every page.',
            },
            {
              id: 'B',
              text: 'No outer margin on Button; the parent layout sets the gaps between items, like a stack gap.',
              verdict: 'strong',
              meters: { users: 1, business: 1, team: 2, speed: 0 },
              reaction: { who: 'jonas', mood: 'thinking', says: 'So the button is a box, and the layout decides where the boxes go.' },
              outcome:
                'Button dropped into any context without surprises. Spacing lived in a few layout components (Stack, Toolbar, Form), and changing a page\'s rhythm became a one-line edit.',
            },
            {
              id: 'C',
              text: 'Add margin to this one button on this page, and deal with the other places when they come up.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 0, speed: 2 },
              reaction: { who: 'jonas', mood: 'neutral', says: 'One-off margin. Fine for now.' },
              outcome:
                'The form looked right today. Six weeks later there were 30 different one-off margins around buttons, and nobody knew which ones were intentional.',
            },
          ],
          debrief: {
            principle: 'Padding inside, spacing from the layout',
            insight:
              'A component should control its inside, its padding, and not the space around it. The parent layout knows the context, so the layout should set the gaps between components.',
            trap:
              'Margin built into a component looks like consistency, but the right space after a button depends on where it sits. The component can\'t know that; the layout can.',
            inTheWild:
              'CSS gap on flex and grid layouts makes this easy. Component libraries such as Chakra UI provide a Stack component that sets the spacing between its children.',
          },
        },

        // ─── 21 (spot) ────────────────────────────────────────────────────
        {
          id: 'visual-21',
          kind: 'spot',
          takeaway:
            'When reviewing spacing, ask of every gap: what does this distance say belongs together? Then check the shared edges.',
          sayIt:
            'The build matches the file perfectly, so these are on me. Labels, one edge, the section gap and the button heights each need a small change, and the form will read much more clearly.',
          title: 'Pixel for Pixel',
          principle: 'Proximity & alignment',
          place: 'design-desk',
          time: 'Wed 11:40',
          cast: ['sam', 'jonas'],
          situation:
            "Profile settings is built and on staging. Sam, the junior designer, is proud that it matches the design file pixel for pixel. Jonas, the staff engineer, makes the point clear: if something looks off, it was in the file. You review the live page.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'Profile settings is built and on staging! Jonas matched my file pixel for pixel.' },
            { who: 'jonas', mood: 'neutral', says: 'Pixel for pixel. So if something looks off, it was in the file. Just saying.' },
          ],
          ask: 'Tap the 4 spacing and alignment problems.',
          mock: 'profile-settings',
          taps: 6,
          mockSpec:
            'A desktop settings page, white background, 32px page padding (fine). Top to bottom: heading "Profile" in 24px bold. An avatar circle with a "Change photo" link 16px to its right, vertically centred on the avatar (fine). Three stacked text fields (Name, Email, Job title), where each label sits exactly 16px below the field above it and 16px above its own field, so the labels float halfway between two fields [label-gap]. Under Email, helper text "We\'ll send login links here." sits 4px below the input (fine). A "Bio" textarea whose left edge starts 6px further right than the left edge of every other field [indent]. Then a "Notifications" heading only 16px below the Bio field, the same gap as between fields, so the two sections run together [section-gap]. Three notification toggles, each with its label on the left and its switch right-aligned, all switches in one straight column (fine). Bottom right: a "Cancel" button 40px tall and, 8px to its right, a "Save" button only 28px tall with cramped 4px vertical padding [button-height].',
          hotspots: [
            {
              id: 'label-gap',
              label: 'Labels float between fields',
              explain:
                'A label 16px from its own field and 16px from the field above belongs to neither. Put each label close to its field (about 4 to 8px) and leave a larger gap between fields.',
            },
            {
              id: 'indent',
              label: 'Bio field breaks the left edge',
              explain:
                'Every other field shares one left edge. A 6px shift is small, but it breaks the line the eye follows down the form and looks like a mistake, because it is.',
            },
            {
              id: 'section-gap',
              label: 'No gap between sections',
              explain:
                'Notifications starts as close to Bio as the fields are to each other, so two groups look like one list. Sections need a clearly larger gap (say 40px) than the fields inside them.',
            },
            {
              id: 'button-height',
              label: 'Buttons of different heights',
              explain:
                'Side-by-side buttons should share a height. The 28px Save button looks secondary and cramped next to the 40px Cancel button, even though Save is the main action.',
            },
          ],
          debrief: {
            principle: 'Proximity & alignment',
            insight:
              'Spacing groups things before anyone reads a word: small gaps join, large gaps separate, and shared edges make a page feel ordered. For each gap, ask: what does this distance say belongs together?',
            trap:
              'Matching the file pixel for pixel only helps if the file was right. Spacing errors pass review because each looks tiny on its own. Review the relationships, not the individual numbers.',
            inTheWild:
              'These are the Gestalt principles of proximity and alignment at work. Form guidance in Material Design and GOV.UK places each label close to its own field, with more space between fields.',
          },
        },

        // ─── 22 ──────────────────────────────────────────────────────────
        {
          id: 'visual-22',
          kind: 'decision',
          takeaway:
            'Turn spacing values into named tokens first, then move the most-used components to them before anything else.',
          sayIt:
            'Leaving old screens means the mess never leaves, and one giant rounding PR is too big to review. Tokens plus the ten busiest components covers 70% of spacing in five weeks.',
          title: 'Twenty-Three Values',
          principle: 'Spacing scale & tokens',
          place: 'meeting-room',
          time: 'Thu 10:00',
          cast: ['marcus', 'jonas'],
          situation:
            "The design system launches in five weeks, and Rhea, the CEO, wants spacing cleaned up before then. Jonas, the staff engineer, says three designers worked for six months with no scale, so 7, 8, 10, 12 and 14px all do the same job. Marcus, the PM, asks if the new scale could apply to new work only and leave old screens alone.",
          scene: [
            { who: 'marcus', mood: 'neutral', says: 'The design system launches in five weeks. Rhea wants spacing "cleaned up" before then. How bad is it?' },
            { who: 'jonas', mood: 'annoyed', says: 'Three designers, six months, no scale. 7, 8, 10, 12 and 14px all doing the same job. 1,300 spacing values in the code.' },
            { who: 'marcus', mood: 'thinking', says: 'Could we apply the new scale to new work and just leave the old screens alone?' },
          ],
          evidence: [
            { label: 'Spacing values in the code', value: '1,300' },
            { label: 'Distinct values', value: '23' },
            { label: 'Values inside the 10 busiest components', value: '70%' },
          ],
          ask: 'Five weeks. What\'s the plan?',
          choices: [
            {
              id: 'A',
              text: 'Define named spacing tokens, map old values onto them, and move the busiest components first.',
              verdict: 'strong',
              meters: { users: 1, business: 1, team: 2, speed: 0 },
              reaction: { who: 'jonas', mood: 'happy', says: 'Tokens first, then the top ten components. That I can review.' },
              outcome:
                'In five weeks, 70% of spacing ran through tokens like space-2 and space-4. The rest moved over during normal work, and nobody had to remember a number again.',
            },
            {
              id: 'B',
              text: 'Apply the new scale to new work only, and leave the existing screens as they are for now.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 1, speed: 2 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Nothing breaks. I like it.' },
              outcome:
                'New screens used the scale; old ones kept 23 values. Each new screen sat beside an old one, so the mess became more visible, not less. A year later the cleanup was still "for now".',
            },
            {
              id: 'C',
              text: 'Round every value to the nearest multiple of 4px in one big find-and-replace pull request.',
              verdict: 'okay',
              meters: { users: -1, business: 0, team: -1, speed: 1 },
              reaction: { who: 'jonas', mood: 'thinking', says: 'One giant pull request. Brave.' },
              outcome:
                'Nobody could review 1,300 changes. 10px became 8 in some places and 12 in others, dozens of layouts shifted, and the PR was reverted after two days of bug reports.',
            },
          ],
          debrief: {
            principle: 'Spacing scale & tokens',
            insight:
              'A scale is not just a list of allowed numbers; it\'s named tokens the code uses, so things can\'t drift again. Moving the most-used components first gets most of the benefit for a fraction of the effort.',
            trap:
              '"New work only" looks safe but keeps the mess alive forever. Mechanical rounding looks thorough but changes layouts nobody reviewed, and one huge change is the hardest kind to check.',
            inTheWild:
              'Atlassian and Shopify Polaris publish spacing as named tokens built on a small base unit, so code refers to a token name instead of a raw pixel value.',
          },
        },

        // ─── 23 ──────────────────────────────────────────────────────────
        {
          id: 'visual-23',
          kind: 'decision',
          takeaway:
            'On phones, shrink spacing in proportion, to about 16px side padding, rather than cutting it to almost nothing.',
          sayIt:
            'You\'re right that the chart needs room. At 8px the text touches the edges and cards blur together. 16px gives the chart more space and keeps the cards clearly separate.',
          title: 'Cramped on Mobile',
          principle: 'Proportional spacing on small screens',
          place: 'video-call',
          time: 'Thu 15:15',
          cast: ['marcus', 'sam'],
          situation:
            "On a 375px phone, the dashboard cards have 24px padding each side, which squeezes the chart. Marcus, the PM, wants the padding cut to 8px and needs the cards readable by the next release. Sam, the junior designer, worries that at 8px the text almost touches the card edge and might look broken.",
          scene: [
            { who: 'marcus', mood: 'annoyed', says: 'Mobile cards are cramped. 24px padding each side on a 375px phone squeezes the chart. Just cut it to 8px.' },
            { who: 'sam', mood: 'worried', says: 'At 8px the text almost touches the card edge. It might look broken.' },
            { who: 'marcus', mood: 'neutral', says: 'Then what? I need these cards readable by the next release.' },
          ],
          evidence: [
            { label: 'Content width at 24px padding', value: '327px' },
            { label: 'At 16px padding', value: '343px' },
            { label: 'At 8px padding', value: '359px' },
          ],
          ask: 'What padding do phones get?',
          choices: [
            {
              id: 'A',
              text: 'Cut the padding to 8px as Marcus says: on a small screen every pixel should go to content.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Room to breathe. For the chart, anyway.' },
              outcome:
                'The chart gained 32px and text nearly touched the card edges. Cards blurred into each other, and testers twice tapped the wrong card.',
            },
            {
              id: 'B',
              text: 'Reduce padding to 16px on phones: 16px more room for content, with space still around it.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: '16 feels right on a phone.' },
              outcome:
                'The chart got the room it needed, text still had space around it, and the cards still looked like separate cards. It shipped in the next release as a mobile spacing token.',
            },
            {
              id: 'C',
              text: 'Keep 24px and stack the chart below the title, so the card gets taller instead of wider.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 0, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: 'Taller cards. Let me try it.' },
              outcome:
                'The chart had room, but each card doubled in height and the dashboard became a long scroll. Users saw two cards per screen instead of four.',
            },
          ],
          debrief: {
            principle: 'Proportional spacing',
            insight:
              'Spacing should shrink on small screens, but proportionally, not to nothing. 16px side padding is a common mobile standard: enough to separate content from the edge, without wasting a narrow screen.',
            trap:
              '"Every pixel to content" sounds efficient, but white space is what makes content readable and shows where one card ends and the next begins. Cut it too far and content gets bigger and harder to use.',
            inTheWild:
              'Material Design uses 16dp margins on phone-sized screens, and iOS standard layout margins are 16 or 20 points depending on the device.',
          },
        },

        // ─── 24 ──────────────────────────────────────────────────────────
        {
          id: 'visual-24',
          kind: 'decision',
          takeaway:
            'Treat accessibility minimums as the floor. Aim for primary buttons about 44px tall, with side padding about twice the vertical.',
          sayIt:
            'It does pass the 24px minimum, but 7% of tablet submits are mis-taps, and people have saved drafts by accident. A 44px button costs almost nothing and fixes that.',
          title: 'Cramped Button',
          principle: 'Target size & comfortable padding',
          place: 'eng-pod',
          time: 'Fri 11:00',
          cast: ['priya', 'jonas'],
          situation:
            "Priya, the researcher, sees people on tablets mis-tap the Submit application button; twice someone hit Save draft next to it instead. Jonas, the staff engineer, says the button is 36px tall, with 8px padding top and bottom and 12px each side, so it passes the WCAG minimum. He will change it if you give him numbers.",
          scene: [
            { who: 'priya', mood: 'worried', says: 'On tablets people mis-tap "Submit application". Twice someone hit "Save draft" next to it instead.' },
            { who: 'jonas', mood: 'neutral', says: 'The button is 8px top and bottom, 12px each side, 36px tall. That passes WCAG\'s 24px minimum.' },
            { who: 'jonas', mood: 'thinking', says: 'Compliant is compliant. But give me numbers and I\'ll change it.' },
          ],
          evidence: [
            { label: 'Button height', value: '36px (8px padding, 14px text)' },
            { label: 'WCAG 2.5.8 minimum target (AA)', value: '24 × 24px' },
            { label: 'Mis-taps on tablet', value: '7% of submits' },
          ],
          ask: 'What numbers do you give Jonas?',
          choices: [
            {
              id: 'A',
              text: 'Keep it as is. At 36px it\'s well above WCAG\'s 24px minimum, so it\'s already compliant.',
              verdict: 'costly',
              meters: { users: -2, business: -1, team: 1, speed: 2 },
              reaction: { who: 'jonas', mood: 'happy', says: 'Compliant. Moving on.' },
              outcome:
                'Mis-taps stayed at 7%. Two applications were saved as drafts instead of submitted and missed their deadline. A minimum is where "broken" ends, not where "good" begins.',
            },
            {
              id: 'B',
              text: 'Keep the padding, but raise the label to 16px so the button grows a bit and reads better.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'jonas', mood: 'neutral', says: 'Bigger label, same padding.' },
              outcome:
                'The button grew to 40px and mis-taps fell slightly. But the label now nearly touched the edges, and the button looked cramped rather than confident.',
            },
            {
              id: 'C',
              text: '12px top and bottom, 24px each side: a 44px-tall button with real room around its label.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 1 },
              reaction: { who: 'priya', mood: 'happy', says: 'I\'ll check the tablet numbers next week.' },
              outcome:
                'Mis-taps fell to 1%, and the primary action finally looked like the most important thing on the screen.',
            },
          ],
          debrief: {
            principle: 'Target size & padding',
            insight:
              'A minimum target size is a floor, not a goal. Primary actions deserve comfortable targets, around 44px tall, and horizontal padding of roughly twice the vertical, so the label has room.',
            trap:
              '"It passes the spec" feels like the end of the argument. But WCAG\'s 24px minimum exists so small targets aren\'t unusable; it doesn\'t promise a button is easy to hit.',
            inTheWild:
              'WCAG 2.2 SC 2.5.8 (AA) sets a 24×24 CSS px minimum and 2.5.5 (AAA) asks for 44×44. Apple recommends at least 44×44 points, and Material Design 48×48dp.',
          },
        },
      ],
    },

    // ═══ CHAPTER 4: LAYOUT & HIERARCHY ═══════════════════════════════════
    {
      id: 'visual-ch4',
      title: 'Where the Eye Goes',
      tagline: 'Hierarchy is a promise about what matters.',
      intro:
        'The visual language is almost ready. Now the pages themselves: the dashboard, pricing, the homepage. Everyone wants their thing to be the biggest thing, and launch is in three weeks.',
      briefing: [
        { who: 'marcus', mood: 'worried', says: 'Three weeks to launch. Dashboard, pricing and homepage all still need a final layout.' },
        { who: 'kofi', mood: 'excited', says: 'And everything I sell needs to be big. Customers buy what they see first.' },
        { who: 'ana', mood: 'thinking', says: 'Everyone wants their thing to be the biggest. That can\'t all be true at once.' },
        { who: 'priya', mood: 'neutral', says: 'I have last month\'s eye-tracking. Let\'s see where people actually look before we argue.' },
      ],
      retro: [
        { who: 'priya', mood: 'happy', says: 'The eye-tracking said it all: people look at the heaviest thing first. So make that the thing we want them to do.' },
        { who: 'marcus', mood: 'thinking', says: 'And if everything is important, nothing is. Rank by what people come to do.' },
        { who: 'kofi', mood: 'happy', says: 'My takeaway: a bigger button only helps people who reach it. Put it where they decide.' },
        { who: 'ana', mood: 'neutral', says: 'Decoration is fine, just not across the words. And grids aren\'t boring if you use them boldly.' },
        { who: 'priya', mood: 'neutral', says: 'Last one: people scroll, but they look at the top most. Put the short version of your best proof there.' },
      ],
      cases: [
        // ─── 25 ──────────────────────────────────────────────────────────
        {
          id: 'visual-25',
          kind: 'decision',
          takeaway:
            'Before designing a dashboard, list the three questions most people come to answer. Make those the biggest things on the page.',
          sayIt:
            'Every widget stays; we\'re just ranking them. Nine of ten admins come for the same three answers, and right now \'what\'s overdue?\' takes 34 seconds to find.',
          title: 'Everything Is Important',
          principle: 'Visual hierarchy',
          place: 'meeting-room',
          time: 'Mon 10:00',
          cast: ['marcus', 'priya'],
          situation:
            "The analytics dashboard has 12 widgets, all the same size. Marcus, the PM, did that on purpose, because each one matters to someone, and he worries that making some bigger will hide the rest. In interviews by Priya, the researcher, most admins said they open it for the same three questions: are we on track, what's overdue, and who's overloaded.",
          scene: [
            { who: 'marcus', mood: 'neutral', says: 'The analytics dashboard has 12 widgets, all the same size. That\'s on purpose. Each one matters to someone.' },
            { who: 'priya', mood: 'thinking', says: 'In interviews, nine of ten admins open it for the same three questions: are we on track, what\'s overdue, who\'s overloaded.' },
            { who: 'marcus', mood: 'annoyed', says: 'If I make three of them big, people will say the other nine are hidden.' },
          ],
          evidence: [
            { label: 'Widgets', value: '12, all the same size' },
            { label: 'Admins asking the same 3 questions', value: '9 of 10' },
            { label: 'Time to answer "what\'s overdue?"', value: '34s' },
          ],
          ask: 'What does the dashboard become?',
          choices: [
            {
              id: 'A',
              text: 'Colour-code widgets by category (money green, work blue, team purple) so people can scan.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: 1 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Colour-coded. Very organised.' },
              outcome:
                'The dashboard got colourful but stayed flat: nothing said where to look first. Time to answer "what\'s overdue?" only fell to 29 seconds.',
            },
            {
              id: 'B',
              text: 'Three large widgets for the three key questions on top, and the other nine smaller below.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 0, speed: 0 },
              reaction: { who: 'marcus', mood: 'thinking', says: 'The other nine are still there… just quieter.' },
              outcome:
                'Time to answer "what\'s overdue?" fell to 6 seconds. Nobody complained about the smaller nine. The people who used them found them right where they expected.',
            },
            {
              id: 'C',
              text: 'Keep them all equal, but let each user drag the widgets into their own preferred order.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 2, speed: -1 },
              reaction: { who: 'priya', mood: 'worried', says: 'I can run a test, but most people never rearrange anything.' },
              outcome:
                'Fewer than 5% of admins ever dragged a widget. Everyone else kept the flat default, and "what\'s overdue?" still took more than half a minute.',
            },
          ],
          debrief: {
            principle: 'Visual hierarchy',
            insight:
              'Hierarchy tells people what to look at first. When everything is the same size, nothing is important. Rank by what people actually come to do, and use size and position to show it.',
            trap:
              '"Everything matters to someone" is true, and that\'s why it\'s a trap. A ranking doesn\'t hide the rest; it gives a starting point. Customisation sounds generous, but most people never change defaults.',
            inTheWild:
              'Most analytics and finance dashboards open with a few headline numbers in large type at the top, with the detailed charts and tables smaller below.',
          },
        },

        // ─── 26 ──────────────────────────────────────────────────────────
        {
          id: 'visual-26',
          kind: 'decision',
          takeaway:
            'Don\'t pick a layout pattern first. Write headings so their first two or three words carry the meaning.',
          sayIt:
            'The zigzag looks lively, but testers read only two or three words per heading, and ours all start with \'Introducing our powerful new\'. Let\'s fix the words first and measure.',
          title: 'Z or F',
          principle: 'Scanning patterns',
          place: 'research-lab',
          time: 'Mon 15:30',
          cast: ['sam', 'priya'],
          situation:
            "Sam, the junior designer, wants the homepage to alternate image and text left and right, a Z-pattern Sam says has more rhythm than the current F-pattern. Priya, the researcher, has eye-tracking from the last test: people read only the first few words of each feature heading, then skip the section. Every feature heading starts with \"Introducing our powerful new\".",
          scene: [
            { who: 'sam', mood: 'excited', says: 'Homepage idea: alternate image and text left and right down the page, a Z-pattern. It has rhythm. Way better than our F-pattern.' },
            { who: 'priya', mood: 'thinking', says: 'Eye-tracking from our last test: people read the first two or three words of each feature heading, then skipped the section.' },
            { who: 'priya', mood: 'neutral', says: 'And every feature heading starts with "Introducing our powerful new…".' },
          ],
          evidence: [
            { label: 'Words read per feature heading (median)', value: '2 to 3' },
            { label: 'Headings starting "Introducing our…"', value: '4 of 4' },
            { label: 'Visitors who reach pricing', value: '22%' },
          ],
          ask: 'What do you change on the homepage?',
          choices: [
            {
              id: 'A',
              text: 'Switch to alternating left-right blocks. The zigzag guides the eye across the whole page.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 1, speed: -1 },
              reaction: { who: 'sam', mood: 'happy', says: 'Zigzag! I\'ll mock it today.' },
              outcome:
                'It looked lively, but the eye now jumped side to side to find each heading, and the headings still said "Introducing our powerful new…". Reach to pricing stayed at 22%.',
            },
            {
              id: 'B',
              text: 'Keep the left-aligned layout, because eye-tracking shows people read pages in an F-pattern.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 0, speed: 2 },
              reaction: { who: 'priya', mood: 'neutral', says: 'Same layout, then.' },
              outcome:
                'Nothing broke and nothing improved. The F-pattern isn\'t a goal. It\'s what people do when headings give them nothing, and these headings still gave them nothing.',
            },
            {
              id: 'C',
              text: 'Rewrite each heading to lead with the benefit, and keep the layout simple to scan down.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 0, speed: 1 },
              reaction: { who: 'priya', mood: 'happy', says: 'Let\'s test the new headings next week.' },
              outcome:
                'Headings like "Plan a sprint in 5 minutes" made sense in two words. Visitors reaching pricing rose to 31%, without touching the layout.',
            },
          ],
          debrief: {
            principle: 'Scanning patterns (the F-pattern)',
            insight:
              'People scan, reading the first few words of headings and lines. The F-pattern is what happens when those words carry nothing. Put the meaning first and keep a clear left edge, and scanning starts to work.',
            trap:
              'F and Z get treated as templates to choose between. But the F-pattern describes scanning when content fails, and a zigzag adds eye travel without fixing the words people actually skim.',
            inTheWild:
              'Nielsen Norman Group\'s eye-tracking research describes the F-pattern as a sign of unhelpful formatting, and recommends starting headings with the most important words.',
          },
        },

        // ─── 27 ──────────────────────────────────────────────────────────
        {
          id: 'visual-27',
          kind: 'decision',
          takeaway:
            'Squint at the screen: the heaviest thing on it should be the action you want people to take.',
          sayIt:
            'The illustration is lovely and it stays. Right now 78% of first looks go to it and only 31% click. As a banner it\'s still there, and the button becomes the strongest thing on screen.',
          title: 'Heavy on the Left',
          principle: 'Visual weight',
          place: 'design-desk',
          time: 'Tue 11:20',
          cast: ['sam', 'rhea'],
          situation:
            "Sam, the junior designer, shows you the onboarding modal: a big colourful illustration on the left, short text and a Get started button on the right. Few people click the button. Heatmaps show they look at the illustration, then close the modal. Rhea, the CEO, says the illustration cost €4,000, is the best thing in the modal, and stays.",
          scene: [
            { who: 'sam', mood: 'worried', says: 'Onboarding modal: big colourful illustration on the left, short text and a "Get started" button on the right. People don\'t click it.' },
            { who: 'rhea', mood: 'annoyed', says: 'That illustration cost us €4,000. It\'s the best thing in the modal. It stays.' },
            { who: 'sam', mood: 'thinking', says: 'Heatmaps show people look at the illustration, then close the modal.' },
          ],
          evidence: [
            { label: 'Clicks on "Get started"', value: '31%' },
            { label: 'First look lands on the illustration', value: '78% of sessions' },
            { label: 'Modal closed with ×', value: '52%' },
          ],
          ask: 'Rhea wants to keep the illustration. What do you do?',
          choices: [
            {
              id: 'A',
              text: 'Add an animated arrow pointing from the illustration across to the "Get started" button.',
              verdict: 'okay',
              meters: { users: 0, business: 1, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'happy', says: 'An arrow, like a little guide.' },
              outcome:
                'Clicks rose to 38%. But now two things competed for attention, and the arrow looked like an ad. It patched the path without fixing the balance.',
            },
            {
              id: 'B',
              text: 'Shrink the illustration into a header band, so the headline and button carry the most weight.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 0, speed: 0 },
              reaction: { who: 'rhea', mood: 'thinking', says: 'Smaller. But it\'s still in there?' },
              outcome:
                'The illustration stayed, across the top. The headline and button became the heaviest elements, and clicks on "Get started" rose to 47%.',
            },
            {
              id: 'C',
              text: 'Keep the layout as it is. The illustration was expensive and makes a strong first impression.',
              verdict: 'costly',
              meters: { users: -1, business: -2, team: 2, speed: 2 },
              reaction: { who: 'rhea', mood: 'happy', says: 'Good. It\'s a lovely piece of work.' },
              outcome:
                'The illustration kept winning and the button kept losing. Two months later clicks were still 31%, and the €4,000 drawing was the most-seen thing nobody acted on.',
            },
          ],
          debrief: {
            principle: 'Visual weight',
            insight:
              'Size, colour, contrast and detail all add visual weight, and the eye goes to the heaviest thing first. Make sure the heaviest thing on the screen is the thing you want people to do.',
            trap:
              'What something cost is no reason for it to be the biggest thing on screen. That\'s the sunk-cost trap. And an arrow pointing at a button admits the layout isn\'t doing its job.',
            inTheWild:
              'Onboarding screens in many mature products keep illustrations small or in a banner, and make the headline and a single primary button the strongest elements.',
          },
        },

        // ─── 28 ──────────────────────────────────────────────────────────
        {
          id: 'visual-28',
          kind: 'decision',
          takeaway:
            'To make a layout bolder, change how you use the grid (spans, scale, full-bleed images) before leaving the grid.',
          sayIt:
            'We can get the magazine feel without hand-building every post. Five bold templates on the grid look designed, work on phones, and take marketing ten minutes instead of six hours.',
          title: 'Grids Are Boring',
          principle: 'Grid systems',
          place: 'lounge',
          time: 'Wed 14:00',
          cast: ['ana', 'sam'],
          situation:
            "Ana, the head of brand, wants the blog redesign to feel like a magazine, with overlapping images, huge type and things breaking out, not the boring 12-column grid. Sam, the junior designer, points out that marketing publishes three posts a week through the CMS, and nobody has time to hand-design each one.",
          scene: [
            { who: 'ana', mood: 'excited', says: 'The blog redesign. I want it to feel like a magazine: overlapping images, huge type, things breaking out. Not this boring 12-column grid.' },
            { who: 'sam', mood: 'thinking', says: 'Marketing publishes three posts a week through the CMS. Nobody has time to hand-design each one.' },
            { who: 'ana', mood: 'neutral', says: 'So how do we get the magazine feel without designing every post by hand?' },
          ],
          evidence: [
            { label: 'Posts per week', value: '3' },
            { label: 'Designer time per hand-built layout', value: '~6 hours' },
            { label: 'Screen sizes to support', value: '3 breakpoints' },
          ],
          ask: 'What do you propose to Ana?',
          choices: [
            {
              id: 'A',
              text: 'Go freeform: give each post its own hand-built layout, like a real magazine spread.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 1, speed: -2 },
              reaction: { who: 'ana', mood: 'happy', says: 'Like a real magazine. Yes.' },
              outcome:
                'The first three posts looked stunning on desktop. On phones, overlapping images covered text. By week three marketing published plain posts, because nobody had 18 hours a week to hand-build layouts.',
            },
            {
              id: 'B',
              text: 'Keep the 12-column grid and use it boldly: varied spans, big type, images that bleed to the edge.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 1 },
              reaction: { who: 'ana', mood: 'thinking', says: 'Bold, but on rails. Show me three templates.' },
              outcome:
                'Sam built five bold templates on the grid. Every post looked designed, worked at all three breakpoints, and took marketing ten minutes to lay out.',
            },
            {
              id: 'C',
              text: 'Go freeform, but have a designer check each new post\'s alignment before it\'s published.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: 1, speed: -1 },
              reaction: { who: 'sam', mood: 'worried', says: 'So I review three posts a week. Okay.' },
              outcome:
                'Alignment was fine, but every post still needed hand layout plus a review. Sam spent a day a week on the blog, and posts started queuing for review slots.',
            },
          ],
          debrief: {
            principle: 'Grid systems',
            insight:
              'A grid isn\'t a style; it\'s a shared structure that makes layouts fast to build, responsive and consistent. Bold layouts come from how you use the columns (spans, scale, contrast), not from leaving the grid.',
            trap:
              '"Grids are boring" blames the tool for timid use of it. Freeform works for a one-off cover; for content published every week, it turns every post into a design project.',
            inTheWild:
              'Josef Müller-Brockmann\'s book Grid Systems in Graphic Design (1981) shows how strict grids produce bold, varied layouts, the basis of most editorial and web grids today.',
          },
        },

        // ─── 29 ──────────────────────────────────────────────────────────
        {
          id: 'visual-29',
          kind: 'decision',
          takeaway:
            'Put the main action where the decision happens, and repeat it where long reading ends.',
          sayIt:
            'A bigger button only helps the 30% who reach it. A trial button in each plan card catches people the moment they choose, and one at the end catches the careful readers.',
          title: 'The Lost Button',
          principle: 'Call-to-action placement',
          place: 'ceo-office',
          time: 'Wed 17:00',
          cast: ['rhea', 'kofi'],
          situation:
            "The pricing page has one Start free trial button, at the very bottom after about 800px of copy, and most visitors never get there. Rhea, the CEO, wants a fix live by Friday. Kofi, the head of sales, wants the button made huge and animated so nobody can miss it.",
          scene: [
            { who: 'rhea', mood: 'annoyed', says: 'The pricing page has one "Start free trial" button, at the very bottom, after 800px of copy. Seventy percent of visitors never get there.' },
            { who: 'kofi', mood: 'excited', says: 'Make that button huge and animated. Nobody will miss it then.' },
            { who: 'rhea', mood: 'thinking', says: 'Whatever we do, it goes live Friday.' },
          ],
          evidence: [
            { label: 'Visitors who reach the button', value: '30%' },
            { label: 'Trial starts from the pricing page', value: '3.1%' },
            { label: 'Copy above the button', value: '~800px' },
          ],
          ask: 'What goes live Friday?',
          choices: [
            {
              id: 'A',
              text: 'Move the single button up to the top of the page, under the headline, and drop the bottom one.',
              verdict: 'okay',
              meters: { users: 1, business: 1, team: 1, speed: 2 },
              reaction: { who: 'rhea', mood: 'neutral', says: 'Top of the page. Simple.' },
              outcome:
                'Trial starts rose to 4.0%. But people who read all the way to the FAQ, the most serious buyers, reached the end with nothing to click and had to scroll back up.',
            },
            {
              id: 'B',
              text: 'Make the bottom button bigger and animated, so it stands out for everyone who reaches it.',
              verdict: 'costly',
              meters: { users: -1, business: -1, team: 2, speed: 2 },
              reaction: { who: 'kofi', mood: 'happy', says: 'Big and bouncing. They\'ll see it.' },
              outcome:
                'The 30% who reached it already wanted to start; the animation never reached the 70% who left above it. Trial starts stayed at 3.1%.',
            },
            {
              id: 'C',
              text: 'A trial button in each pricing tier near the top, and one more at the end of the page.',
              verdict: 'strong',
              meters: { users: 2, business: 2, team: 1, speed: 1 },
              reaction: { who: 'kofi', mood: 'thinking', says: 'One button per plan, so people pick and click in one go.' },
              outcome:
                'Trial starts rose to 4.6%. People who were ready clicked from their plan card, and people who read everything found a button waiting at the end.',
            },
          ],
          debrief: {
            principle: 'Call-to-action placement',
            insight:
              'Put the action where the decision happens. On a pricing page people decide at the plan card, so the button belongs there, and those who read everything should find another one at the end.',
            trap:
              'Making a button louder only helps the people who see it. When most visitors never reach it, the problem is position, not prominence.',
            inTheWild:
              'Most SaaS pricing pages put a call-to-action button inside each plan card, so people can act the moment they choose, and many repeat it after the FAQ.',
          },
        },

        // ─── 30 ──────────────────────────────────────────────────────────
        {
          id: 'visual-30',
          kind: 'decision',
          takeaway:
            'If decoration crosses text, move it before you fade it or remove it.',
          sayIt:
            'I love the energy and want to keep it. It just crosses the title, which more than doubles reading time. Moving the stripe to the top corner keeps the movement and frees the text.',
          title: 'The Diagonal Stripe',
          principle: 'Figure-ground: decoration vs. content',
          place: 'design-desk',
          time: 'Thu 10:40',
          cast: ['sam', 'ana'],
          situation:
            "Sam, the junior designer, has designed feature cards with a diagonal orange stripe from bottom left to top right. Ana, the head of brand, loves the energy: it feels very Launchly. But the stripe passes behind each card title, and in testing people took longer to read the titles.",
          scene: [
            { who: 'sam', mood: 'excited', says: 'Feature cards with a diagonal orange stripe from bottom left to top right. Dynamic and modern!' },
            { who: 'ana', mood: 'happy', says: 'Very Launchly. I love the energy.' },
            { who: 'sam', mood: 'thinking', says: 'The stripe does pass behind the card title, though. Testers took longer to read the titles.' },
          ],
          evidence: [
            { label: 'Time to read a card title', value: 'With stripe 1.9s · Without 0.8s' },
            { label: 'Title letters crossed by the stripe\'s edge', value: '9 of 17' },
          ],
          ask: 'Ana loves it. What do you ask Sam to do?',
          choices: [
            {
              id: 'A',
              text: 'Keep the stripe behind the title but fade it to 30% opacity so the title reads more easily.',
              verdict: 'costly',
              meters: { users: -1, business: 0, team: 2, speed: 1 },
              reaction: { who: 'ana', mood: 'neutral', says: 'Softer, but still there.' },
              outcome:
                'The stripe got paler, but its edges still cut through letters, and the pale orange made titles look smudged. Reading time only fell to 1.6 seconds.',
            },
            {
              id: 'B',
              text: 'Keep the stripe, but move it to the card\'s top corner, where it never crosses any text.',
              verdict: 'strong',
              meters: { users: 2, business: 1, team: 1, speed: 1 },
              reaction: { who: 'ana', mood: 'happy', says: 'Same energy, out of the way.' },
              outcome:
                'Titles read as fast as on a plain card, and the stripe still gave the cards movement. Ana reused the corner stripe in the launch social graphics.',
            },
            {
              id: 'C',
              text: 'Drop the stripe and give each card a plain orange top border: clean and safe.',
              verdict: 'okay',
              meters: { users: 1, business: 0, team: -1, speed: 1 },
              reaction: { who: 'sam', mood: 'worried', says: 'Clean… but it loses the energy.' },
              outcome:
                'Titles were perfectly readable, but the cards lost their character and Ana felt the brand had gone flat. It solved the problem by removing the idea, not by placing it well.',
            },
          ],
          debrief: {
            principle: 'Figure-ground: decoration vs. content',
            insight:
              'Text needs a calm, steady background to be read quickly. Decoration can bring energy, but only where it doesn\'t cross what people need to read. Move it before you remove it.',
            trap:
              'Lowering opacity feels like a compromise, but a faded edge through letters is still an edge through letters. Deleting the idea is safe, but gives up the brand energy for nothing.',
            inTheWild:
              'WCAG 1.4.3 applies wherever text sits on images or patterns, and contrast must hold behind every part of the text. Many brand guidelines also define clear space that graphics may not enter.',
          },
        },

        // ─── 31 ──────────────────────────────────────────────────────────
        {
          id: 'visual-31',
          kind: 'decision',
          takeaway:
            'When something important sits below the fold, bring its shortest form, a logo and one line, up next to the action.',
          sayIt:
            'People do scroll, but only 38% reach the quote, and they convert twice as well. A one-line quote and logo by the button gives everyone the proof without shrinking the hero.',
          title: 'Fold Anxiety',
          principle: 'Above the fold: priority, not cramming',
          place: 'video-call',
          time: 'Thu 16:00',
          cast: ['marcus', 'sam'],
          situation:
            "Your best proof, a quote from a 3,000-person customer company, sits 600px below the fold on the homepage. Marcus, the PM, wants it at the top, even if the hero shrinks. Sam, the junior designer, says people scroll now, so the fold doesn't matter, and a smaller hero hurts the sign-up button. Marcus wants to be convinced with numbers.",
          scene: [
            { who: 'marcus', mood: 'thinking', says: 'Our best proof, a quote from a 3,000-person customer, sits 600px below the fold. I want it at the top, even if the hero shrinks.' },
            { who: 'sam', mood: 'annoyed', says: 'People scroll now. The fold doesn\'t matter. And shrinking the hero hurts the sign-up button.' },
            { who: 'marcus', mood: 'neutral', says: 'Then convince me. I have the numbers right here.' },
          ],
          evidence: [
            { label: 'Visitors who scroll to the testimonial', value: '38%' },
            { label: 'Sign-up rate after seeing it', value: '2.1× higher' },
            { label: 'Viewing time above the fold (NN/g, 2018)', value: '57%' },
          ],
          ask: 'Where does the proof go?',
          choices: [
            {
              id: 'A',
              text: 'Put a one-line quote and the customer\'s logo by the sign-up button; keep the full story lower.',
              verdict: 'strong',
              meters: { users: 1, business: 2, team: 1, speed: 1 },
              reaction: { who: 'sam', mood: 'thinking', says: 'So the hero gets proof without losing the button.' },
              outcome:
                'Every visitor saw the logo and a line of proof right next to the button. Sign-ups rose 14%, and people who wanted the full story scrolled down to it.',
            },
            {
              id: 'B',
              text: 'Leave it below. People do scroll, and the hero needs all its space for the sign-up button.',
              verdict: 'costly',
              meters: { users: 0, business: -2, team: 1, speed: 2 },
              reaction: { who: 'sam', mood: 'happy', says: 'The hero stays intact. Thank you.' },
              outcome:
                'Scrolling did happen, for 38% of visitors. The other 62% never saw your strongest proof, and sign-ups stayed flat.',
            },
            {
              id: 'C',
              text: 'Move the full testimonial block to the top, shrinking the hero headline and image to fit.',
              verdict: 'okay',
              meters: { users: 0, business: 0, team: -1, speed: 1 },
              reaction: { who: 'marcus', mood: 'happy', says: 'Proof first. Good.' },
              outcome:
                'The testimonial got seen, but the cramped hero lost its clear message and the sign-up button dropped lower. Sign-ups barely moved: one gain cancelled the other.',
            },
          ],
          debrief: {
            principle: 'Above the fold: priority, not cramming',
            insight:
              'People do scroll, but most attention goes to the top. Put your strongest proof there in its shortest form (a logo and a line) next to the action, and let the full version wait below.',
            trap:
              '"Users scroll" is true and still misleading: scrolling isn\'t attention. And moving a whole block up to beat the fold often crowds out the very thing the top was for.',
            inTheWild:
              'Nielsen Norman Group\'s 2018 eye-tracking analysis found 57% of page-viewing time was spent above the fold. Many SaaS homepages place a strip of customer logos right under the hero.',
          },
        },

        // ─── 32 (triage) ──────────────────────────────────────────────────
        {
          id: 'visual-32',
          kind: 'triage',
          takeaway:
            'Rank visual issues by who they block and how badly: unreadable text and broken errors first, polish last.',
          sayIt:
            'Ana, the icons go in the next polish pass, I promise. Before launch, unreadable hero text and missing error messages stop people from using the product, so they come first.',
          title: 'Launch Week Review',
          principle: 'Prioritising visual issues by impact',
          place: 'meeting-room',
          time: 'Fri 09:30',
          cast: ['marcus', 'jonas', 'ana'],
          situation:
            "The new visual language goes live Monday. Sam, the junior designer, found six issues in the final review, and Jonas, the staff engineer, has time to fix three; the rest wait a month. Ana, the head of brand, hopes the uneven icon strokes make the list, because they bother her every time she opens the app. Marcus, the PM, needs your three picks.",
          scene: [
            { who: 'marcus', mood: 'neutral', says: 'The new visual language goes live Monday. Sam\'s final review found six issues. Jonas has time for three.' },
            { who: 'jonas', mood: 'annoyed', says: 'Three. Not four. Whatever you don\'t pick waits a month.' },
            { who: 'ana', mood: 'worried', says: 'Please tell me the icon strokes are on the list. They bother me every time I open the app.' },
          ],
          ask: 'Choose the 3 issues to fix before launch.',
          pick: 3,
          submitLabel: 'Send to Jonas',
          items: [
            {
              id: 'hero',
              text: 'The homepage hero puts white text over a bright photo: 1.9:1 at its lightest point.',
              tier: 'must',
              note: 'Fails WCAG 1.4.3 on the first thing every visitor reads. A dark overlay or moving the text fixes it.',
            },
            {
              id: 'errors',
              text: 'The restyled signup form shows errors as a red border only. The text messages were lost.',
              tier: 'must',
              note: 'A regression that fails 1.4.1 and 3.3.1. People can\'t tell what went wrong, and every signup passes through it.',
            },
            {
              id: 'measure',
              text: 'Help articles run to about 120 characters per line on wide screens.',
              tier: 'should',
              note: 'A real reading cost for every help visitor, and a one-line max-width fix. A strong third pick.',
            },
            {
              id: 'cards',
              text: 'Pricing card titles don\'t line up: the "Popular" badge pushes one title down 12px.',
              tier: 'should',
              note: 'Visible on the page that makes money, and it looks careless. Also a fair third pick.',
            },
            {
              id: 'icons',
              text: 'Sidebar icons mix 1.5px and 2px stroke weights.',
              tier: 'nice',
              note: 'Ana is right that it\'s untidy, but nobody fails a task over it. Polish pass.',
            },
            {
              id: 'footer',
              text: 'Footer link columns use 12px gaps in one column and 16px in another.',
              tier: 'nice',
              note: 'A real inconsistency, barely visible, with no effect on users. Fix it with the spacing tokens later.',
            },
          ],
          debrief: {
            principle: 'Prioritise by impact on people',
            insight:
              'In a visual review, rank issues by who they block and how badly. Unreadable text and broken error states stop people; misalignment looks careless; stroke weights are polish.',
            trap:
              'The issues that bother designers most are often the most visible to designers, not the most harmful to users. Ana\'s icons are real. They just wait.',
            inTheWild:
              'Many teams treat WCAG failures on key flows as launch blockers, because they can stop a task completely and enterprise contracts increasingly require conformance.',
          },
        },
      ],
    },
  ],
};
