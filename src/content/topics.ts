/**
 * How Polis statements are grouped into the questions shown in the Q&A.
 * Each topic lists Polis comment ids. Accepted statements that aren't listed
 * anywhere fall into the topic marked `catchAll`, so a new export never drops content.
 */
export type Topic = {
  id: string;
  question: string;
  /** Polis comment ids, in no particular order (answers are sorted by votes). */
  statements: number[];
  catchAll?: boolean;
};

export const topics: Topic[] = [
  {
    id: 'data-centers',
    question: 'Should Central Oregon welcome new data centers?',
    statements: [0, 2, 35, 50, 51, 79, 89, 100, 109, 115, 123, 128, 130, 131, 161],
  },
  {
    id: 'kids-schools',
    question: 'How should AI show up in kids’ lives and schools?',
    statements: [4, 5, 6, 7, 10, 48, 49, 57, 58, 67, 71, 72, 103, 111],
  },
  {
    id: 'work',
    question: 'Who should carry the cost when AI changes work?',
    statements: [12, 13, 38, 53, 54, 55, 56, 81, 86, 88, 106, 119, 134, 135],
  },
  {
    id: 'oversight',
    question: 'What should government and AI companies be held to?',
    statements: [16, 18, 22, 24, 39, 42, 46, 59, 60, 61, 62, 65, 74, 75, 80, 122, 125, 141, 142, 143, 150, 153, 154, 155, 156, 157],
  },
  {
    id: 'everyday',
    question: 'How do we feel about AI in our everyday lives?',
    statements: [43, 44, 52, 63, 64, 68, 70, 73, 76, 77, 78, 101, 112, 114, 116, 117, 118, 120, 121, 127, 147, 151, 152],
    catchAll: true,
  },
];
