export const C = {
  navy: '#31387D',
  navyDeep: '#0D1452',
  green: '#00A779',
  greenDark: '#008A62',
  orange: '#FF7337',
  orangeLight: '#FFAA52',
  pink: '#F82C9F',
  blue: '#2E3BB5',
  teal: '#4FE6C4',
  white: '#FFFFFF',
};

export const campaign = {
  title: 'Data Centers in Oakland',
  place: '@Oakland',
  location: 'Oakland, CA',
  slug: 'data-centers-oakland',
  about:
    'Since the start of the AI boom, a few different corporations have proposed new data center developments in Oakland. There are broad concerns about this stuff. Tap in to help the community figure out where we should stand on this issue.',
  stats: [
    { value: 120, label: 'participants' },
    { value: 70, label: 'statements' },
    { value: 3, label: 'events' },
  ],
};

export type Person = { name: string; color: string };

export const hosts: Person[] = [
  { name: 'Organization 1', color: C.green },
  { name: 'Organization 2', color: C.green },
  { name: 'Organization 3', color: C.green },
];

export type Answer = { author: string; color: string; text: string };
export type Question = {
  id: string;
  text: string;
  askedBy: string;
  askedColor: string;
  participants: number;
  answers: Answer[];
  summary: { pct: number; color: string; text: string }[];
};

const answerPeople = [
  { author: '@wizard', color: C.orange },
  { author: '@marisol', color: C.green },
  { author: '@deshawn', color: C.blue },
  { author: '@kenji', color: C.pink },
  { author: '@cassidy', color: C.orangeLight },
  { author: '@tomas', color: C.greenDark },
  { author: '@ade', color: C.navy },
];

function answersFrom(texts: string[]): Answer[] {
  return texts.map((text, i) => ({ ...answerPeople[i % answerPeople.length], text }));
}

export const questions: Question[] = [
  {
    id: 'city-role',
    text: 'What role should the city play in this industry?',
    askedBy: 'Host',
    askedColor: C.orange,
    participants: 67,
    answers: answersFrom([
      'Require community benefit agreements before any permits.',
      'Stay out of it and let the market decide.',
      'Tax them and fund our schools with the revenue.',
      'Hold public hearings in every affected neighborhood.',
      'Cap how much water any one facility can use.',
      'Make them hire locally, and put it in writing.',
      'Zone them away from homes and schools.',
      'Ask the state for help — this is bigger than Oakland.',
      'Require them to run on clean energy from day one.',
      'Let residents vote on each project directly.',
    ]),
    summary: [
      { pct: 95, color: C.green, text: 'Require community benefit agreements first' },
      { pct: 81, color: C.orangeLight, text: 'Hold hearings in affected neighborhoods' },
      { pct: 42, color: C.blue, text: 'Tax them and fund our schools' },
    ],
  },
  {
    id: 'ai-general',
    text: 'How do we feel about AI in general y’all?',
    askedBy: '@wizard',
    askedColor: C.orangeLight,
    participants: 67,
    answers: answersFrom([
      'Curious, but nervous about who gets left behind.',
      'It’s a tool. Depends who’s holding it.',
      'I use it every day at work and it helps.',
      'Honestly, it feels like it’s moving too fast.',
      'I worry about what it does to jobs here.',
      'It could help small businesses compete.',
      'I don’t trust the companies building it.',
      'My kids already use it for homework.',
      'We should slow down until there are rules.',
      'I haven’t made up my mind yet.',
    ]),
    summary: [
      { pct: 88, color: C.green, text: 'Curious, but nervous' },
      { pct: 64, color: C.orange, text: 'Depends who’s holding it' },
      { pct: 30, color: C.blue, text: 'Helps me every day' },
    ],
  },
  {
    id: 'water',
    text: 'Should data centers pay more for water and power?',
    askedBy: '@marisol',
    askedColor: C.green,
    participants: 54,
    answers: answersFrom([
      'Yes — they should pay what it actually costs us.',
      'Only if the money goes back to residents.',
      'Higher rates will just push them to another city.',
      'Charge more during droughts and heat waves.',
      'They should pay to upgrade the grid they strain.',
      'Same rates as everyone — fair is fair.',
      'Give discounts if they recycle their water.',
      'Make the rates public so we can see them.',
      'Use the extra money to lower bills for families.',
      'Tie the price to how many local jobs they create.',
    ]),
    summary: [
      { pct: 91, color: C.green, text: 'Pay what it actually costs' },
      { pct: 77, color: C.orange, text: 'Money goes back to residents' },
      { pct: 25, color: C.pink, text: 'It will push them elsewhere' },
    ],
  },
];

export const ticker = [
  { color: C.orange, text: 'We should all be careful about large corporations getting in.' },
  { color: C.blue, text: 'Where is all the water going to come from?' },
  { color: C.green, text: 'Jobs matter, but so does the air we breathe.' },
  { color: C.pink, text: 'Who actually benefits from this?' },
  { color: C.orangeLight, text: 'I want to hear from people who live near the sites.' },
];

export const insightQuotes = [
  { color: C.navy, text: 'What the heck is up with that? Where is all the water going?', by: '@wizard', dot: '#1F2560' },
  { color: C.greenDark, text: 'We’re in a drought half the year. This feels backwards.', by: '@marisol', dot: '#05573F' },
  { color: C.pink, text: 'Cooling towers next to a school? Come on.', by: '@kenji', dot: '#B5146F' },
];

export const reportQuotes = [
  { color: C.orangeLight, text: 'Nobody in the room had heard about the proposal before tonight.', by: '@cassidy', dot: C.navy },
  { color: C.orange, text: 'We want a seat at the table before the permits go through.', by: '@deshawn', dot: C.pink },
  { color: C.greenDark, text: 'Let’s do this again with folks from East Oakland.', by: '@tomas', dot: '#05573F' },
];

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  address: string;
  blurb: string;
  attendees: Person[];
};

export const events: Event[] = [
  {
    id: 'forum-1',
    title: 'Community Forum #1',
    date: 'Thursday, October 23, 2027',
    time: '5:00PM – 7:00PM',
    place: 'Smokehouse Grill',
    address: '1782 Telegraph Ave, Berkeley, CA 94609',
    blurb: campaign.about,
    attendees: [
      { name: 'Humphrey', color: C.orange },
      { name: 'Stuart', color: C.green },
    ],
  },
  {
    id: 'living-room',
    title: 'Living Room Conversation',
    date: 'Saturday, November 8, 2027',
    time: '2:00PM – 4:00PM',
    place: 'Cassidy’s place',
    address: 'Fruitvale, Oakland, CA',
    blurb: 'A small, facilitated conversation with neighbors. Snacks provided, opinions welcome.',
    attendees: [
      { name: 'Cassidy', color: C.pink },
      { name: 'Tomas', color: C.blue },
      { name: 'Ade', color: C.orangeLight },
    ],
  },
];

export const resources = [
  { title: 'The city’s draft proposal', desc: 'The full planning document submitted to the council.', kind: 'Document' },
  { title: 'How data centers use water', desc: 'A plain-language explainer on cooling systems.', kind: 'Article' },
  { title: 'Council meeting, Sept 12', desc: 'Recording of the public comment session.', kind: 'Video' },
  { title: 'Grid capacity in the East Bay', desc: 'What PG&E says the grid can actually handle.', kind: 'Report' },
  { title: 'Jobs: promises vs. reality', desc: 'What happened in three other cities.', kind: 'Article' },
  { title: 'Community benefit agreements 101', desc: 'How other neighborhoods negotiated.', kind: 'Guide' },
  { title: 'Map of proposed sites', desc: 'Where the three developments would go.', kind: 'Map' },
  { title: 'Ask a researcher', desc: 'Q&A with a UC Berkeley energy researcher.', kind: 'Podcast' },
];

export type IdentityQuestion = { id: string; title: string; options: string[]; icon?: 'person' | 'flag' | 'cake' | 'laptop' };

export const identityQuestions: IdentityQuestion[] = [
  { id: 'race', title: 'Race / Ethnicity', options: ['White', 'Black / African American', 'Asian American', 'Latino / Hispanic', 'Middle Eastern', 'Native American', 'Pacific Islander', 'Multiracial'] },
  { id: 'gender', title: 'Gender', options: ['Woman', 'Man', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say'] },
  { id: 'party', icon: 'flag', title: 'Political Party', options: ['Democrat', 'Republican', 'Independent', 'Green', 'Other', 'None'] },
  { id: 'age', icon: 'cake', title: 'Age', options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'] },
  { id: 'tech', icon: 'laptop', title: 'Do you work in the tech industry?', options: ['Yes', 'No', 'I used to'] },
];

export const heroSwatches = [C.navy, C.orangeLight, C.orange, C.pink, C.greenDark, C.white, C.teal];

export function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}
