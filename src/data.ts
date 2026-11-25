import { agreePct, groups as polisGroups, statements, type Statement } from './content/polis';
import { HOST_ID, participant } from './content/participants';
import { topics, type Topic } from './content/topics';
import { insights, insightsFor, type Insight } from './content/insights';

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
  title: 'AI in Central Oregon',
  place: '@CentralOregon',
  location: 'Central Oregon',
  slug: 'central-oregon-ai',
  about:
    'AI is already showing up in our schools, our jobs, and our power bills, and new data centers are being proposed across the region. Before state and local leaders decide how to respond, we want to hear from people who live here. Tap in to help Central Oregon figure out where it stands.',
  stats: [
    // Polis exports don't include a participant count; the most-voted statement is a floor for it.
    { value: Math.max(...statements.map((s) => s.total.votes)), label: 'participants' },
    { value: statements.length, label: 'statements' },
    { value: statements.reduce((n, s) => n + s.total.votes, 0), label: 'votes' },
  ],
};

export type Person = { name: string; color: string };

export const hosts: Person[] = [
  { name: 'Organization 1', color: C.green },
  { name: 'Organization 2', color: C.green },
  { name: 'Organization 3', color: C.green },
];

export type Answer = { id: number; author: string; color: string; text: string; votes: number; agreePct: number };
export type GroupPct = { id: string; label: string; pct: number };
export type SummaryItem = { pct: number; color: string; text: string; groups: GroupPct[] };
export type Question = {
  id: string;
  /** Report theme this question is framed around. */
  theme: string;
  text: string;
  askedBy: string;
  askedColor: string;
  participants: number;
  answers: Answer[];
  summary: SummaryItem[];
  /** Report insights drawn from this question's statements. */
  insights: Insight[];
};

const byId = new Map(statements.map((s) => [s.id, s]));
const assigned = new Set(topics.flatMap((t) => t.statements));
const maxVotes = Math.max(...statements.map((s) => s.total.votes));
/** Ignore thinly-voted statements when ranking (late additions with only a few votes). */
const MIN_VOTES = Math.max(10, Math.round(maxVotes * 0.08));
const voted = (s: Statement) => s.total.votes >= MIN_VOTES;

function groupPcts(s: Statement): GroupPct[] {
  return polisGroups.map((g) => ({ ...g, pct: agreePct(s.groups[g.id]) }));
}

function toAnswer(s: Statement): Answer {
  const p = participant(s.authorId);
  return { id: s.id, author: p.name, color: p.color, text: s.text, votes: s.total.votes, agreePct: agreePct(s.total) };
}

function toSummary(s: Statement): SummaryItem {
  return { pct: agreePct(s.total), color: participant(s.authorId).color, text: s.text, groups: groupPcts(s) };
}

function topicStatements(t: Topic): Statement[] {
  const listed = t.statements.map((id) => byId.get(id)).filter((s): s is Statement => !!s);
  const extra = t.catchAll ? statements.filter((s) => !assigned.has(s.id)) : [];
  return [...listed, ...extra];
}

const host = participant(HOST_ID);

export const questions: Question[] = topics.map((t) => {
  const st = topicStatements(t);
  return {
    id: t.id,
    theme: t.theme,
    text: t.question,
    askedBy: host.name,
    askedColor: host.color,
    participants: Math.max(0, ...st.map((s) => s.total.votes)),
    answers: [...st].sort((a, b) => b.total.votes - a.total.votes).map(toAnswer),
    summary: st
      .filter(voted)
      .sort((a, b) => agreePct(b.total) - agreePct(a.total))
      .slice(0, 3)
      .map(toSummary),
    insights: insightsFor(t.id),
  };
});

if (import.meta.env.DEV) {
  const known = new Set(topics.map((t) => t.id));
  const orphans = insights.filter((i) => !known.has(i.question));
  if (orphans.length) console.warn('Insights point at unknown questions:', orphans.map((i) => `${i.id} → ${i.question}`));
}

export { polisGroups as groups };

export type Quote = { text: string; color: string; groups: GroupPct[] };
const toQuote = (s: Statement): Quote => ({ text: s.text, color: participant(s.authorId).color, groups: groupPcts(s) });
const minGroup = (s: Statement) => Math.min(...polisGroups.map((g) => agreePct(s.groups[g.id])));
const groupGap = (s: Statement) => {
  const p = polisGroups.map((g) => agreePct(s.groups[g.id]));
  return Math.max(...p) - Math.min(...p);
};
const short = (s: Statement) => s.text.length <= 140;

/** Participant (non-host) statements most people agreed with, for the home ticker. */
export const ticker: Quote[] = statements
  .filter((s) => s.authorId !== HOST_ID && voted(s) && short(s))
  .sort((a, b) => agreePct(b.total) - agreePct(a.total))
  .slice(0, 6)
  .map(toQuote);

/** Common ground: statements every opinion group agreed with. */
export const commonGround: Quote[] = statements
  .filter((s) => voted(s) && short(s))
  .sort((a, b) => minGroup(b) - minGroup(a))
  .slice(0, 3)
  .map(toQuote);

/** Where opinion groups split the most. */
export const divides: Quote[] = statements
  .filter((s) => voted(s) && short(s))
  .sort((a, b) => groupGap(b) - groupGap(a))
  .slice(0, 3)
  .map(toQuote);

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
    place: 'Deschutes Public Library',
    address: '507 NW Wall St, Bend, OR 97703',
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
    address: 'Redmond, OR',
    blurb: 'A small, facilitated conversation with neighbors. Snacks provided, opinions welcome.',
    attendees: [
      { name: 'Cassidy', color: C.pink },
      { name: 'Tomas', color: C.blue },
      { name: 'Ade', color: C.orangeLight },
    ],
  },
];

export const resources = [
  { title: 'Oregon’s data center water reporting rules', desc: 'What large facilities now have to disclose, and what they don’t.', kind: 'Document' },
  { title: 'How data centers use water and power', desc: 'A plain-language explainer on cooling and the grid.', kind: 'Article' },
  { title: 'AI in the classroom: a guide for parents', desc: 'What schools are doing and questions to ask.', kind: 'Guide' },
  { title: 'Listening session, Sisters', desc: 'Recording of a community conversation on AI.', kind: 'Video' },
  { title: 'Jobs: promises vs. reality', desc: 'What happened to employment in three other data center towns.', kind: 'Report' },
  { title: 'Tax incentives 101', desc: 'How Oregon’s enterprise zones work, and who decides.', kind: 'Guide' },
  { title: 'Map of proposed sites', desc: 'Where new facilities are planned across the region.', kind: 'Map' },
  { title: 'Ask a researcher', desc: 'Q&A with an AI policy researcher.', kind: 'Podcast' },
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
