/**
 * The Q&A questions, one per report theme. Each lists the Polis comment ids it
 * collects. Accepted statements that aren't listed anywhere fall into the topic
 * marked `catchAll`, so a new export never drops content.
 *
 * Topic ids match the theme `key` in the insights report, so insights can point
 * at the question they came from (see insights.ts).
 */
export type Topic = {
  id: string;
  /** Theme name from the insights report. */
  theme: string;
  question: string;
  /** Polis comment ids, in no particular order (answers are sorted by votes). */
  statements: number[];
  catchAll?: boolean;
};

export const topics: Topic[] = [
  {
    id: 'datacenters',
    theme: 'Data Centers & the Environment',
    question: 'What should new data centers owe Central Oregon?',
    statements: [0, 2, 35, 50, 79, 89, 100, 109, 115, 123, 128, 130, 131, 161],
  },
  {
    id: 'governance',
    theme: 'Governance & Decision-making',
    question: 'Who should have a say in how AI is governed here?',
    statements: [16, 18, 22, 24, 39, 42, 46, 51, 59, 64, 65, 74, 75, 80, 112, 122, 125, 141, 142, 143, 150, 151, 152, 153, 154, 155, 156, 157],
  },
  {
    id: 'education',
    theme: 'Education, Cognition & Children',
    question: 'How should AI show up in kids’ lives and schools?',
    statements: [5, 6, 7, 10, 49, 57, 58, 63, 67, 70, 71, 72, 73, 76, 103, 111, 114, 118],
  },
  {
    id: 'mentalhealth',
    theme: 'Mental Health & Social Connection',
    question: 'Is AI bringing us together or pulling us apart?',
    statements: [4, 44, 77],
  },
  {
    id: 'workforce',
    theme: 'Workforce & the Economy',
    question: 'Who should carry the cost when AI changes work?',
    statements: [12, 13, 38, 48, 53, 54, 55, 56, 81, 86, 88, 106, 119, 134, 135],
  },
  {
    id: 'agency',
    theme: 'Human Agency, Existential Risk & Moving Fast',
    question: 'How much should we let AI think and decide for us?',
    statements: [43, 52, 60, 61, 62, 68, 78, 101, 116, 117, 120, 121, 127, 147],
    catchAll: true,
  },
];
