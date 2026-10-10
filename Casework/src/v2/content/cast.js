// The recurring cast of Launchly. Every case is delivered by one of these people —
// giving players someone to persuade, disappoint, or win over.

export const CAST = {
  rhea: {
    name: 'Rhea Kapoor',
    role: 'CEO & co-founder',
    initials: 'RK',
    hue: 14,
    trait: 'Fast, numbers-first, allergic to "it depends".',
  },
  priya: {
    name: 'Priya Nair',
    role: 'User Researcher',
    initials: 'PN',
    hue: 165,
    trait: 'Your strongest ally. Has a recording for everything.',
  },
  marcus: {
    name: 'Marcus Webb',
    role: 'Product Manager',
    initials: 'MW',
    hue: 220,
    trait: 'Lives by the sprint board. Fair, but the deadline always wins.',
  },
  jonas: {
    name: 'Jonas Berg',
    role: 'Staff Engineer',
    initials: 'JB',
    hue: 265,
    trait: 'Blunt. Says "no" first, then helps you find a yes.',
  },
  ana: {
    name: 'Ana Souza',
    role: 'Head of Brand',
    initials: 'AS',
    hue: 330,
    trait: 'Guards the brand like a hawk. Has strong opinions about orange.',
  },
  kofi: {
    name: 'Kofi Mensah',
    role: 'Head of Sales',
    initials: 'KM',
    hue: 40,
    trait: 'Every feature request comes with a deal attached.',
  },
  lena: {
    name: 'Lena Fischer',
    role: 'ML Engineer',
    initials: 'LF',
    hue: 190,
    trait: 'Knows exactly how the model fails. Wishes more people asked.',
  },
  sam: {
    name: 'Sam Ortiz',
    role: 'Junior Designer',
    initials: 'SO',
    hue: 95,
    trait: 'Talented, eager, and about to learn some things the hard way.',
  },
  dana: {
    name: 'Dana Park',
    role: 'Head of Design',
    initials: 'DP',
    hue: 290,
    trait: 'Your manager. Gives you rope and expects you to use it well.',
  },
  client: {
    name: 'Tom Hale',
    role: 'Founder, Brewly (client)',
    initials: 'TH',
    hue: 30,
    trait: 'Paying the invoice. Has a nephew who "does design".',
  },
};

export function getPerson(id) {
  return CAST[id] || { name: 'Unknown', role: '', initials: '?', hue: 200 };
}
