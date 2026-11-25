#!/usr/bin/env node
/**
 * Normalize a report insights export into src/content/insights.json.
 *
 *   node scripts/import-insights.mjs [input.json] [output.json]
 *
 * Input shape (report export): { report, themes: [{ key, name, insights: [{ claim, direction, statements }] }] }
 * Output: insights are the top-level items; each carries the question (theme key) it
 * belongs to and the statements that support it.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [input = 'references/central-oregon-insights.json', output = 'src/content/insights.json'] = process.argv.slice(2);
const report = JSON.parse(readFileSync(input, 'utf8'));

const SOURCES = { p: 'poll', s: 'session' };

const tally = (g) => ({ total: g.n, agree: g.a, disagree: g.d, pass: g.p, agreePct: g.pct });

function statement(s) {
  const m = /^([a-z]*)(\d+)$/.exec(s.id);
  return {
    id: m ? Number(m[2]) : s.id,
    source: (m && SOURCES[m[1]]) || 'unknown',
    text: s.text, // verbatim from the report
    votes: {
      total: s.vote.total,
      agree: s.vote.agree,
      disagree: s.vote.disagree,
      pass: s.vote.pass,
      agreePct: s.vote.agreePct,
      groups: Object.fromEntries(Object.entries(s.vote.byGroup ?? {}).map(([k, g]) => [k, tally(g)])),
    },
  };
}

const groups = new Set();
const insights = report.themes.flatMap((theme) =>
  theme.insights.map((ins, i) => {
    const statements = ins.statements.map(statement);
    statements.forEach((s) => Object.keys(s.votes.groups).forEach((g) => groups.add(g)));
    return {
      id: `${theme.key}-${i + 1}`,
      claim: ins.claim, // verbatim from the report
      direction: ins.direction,
      question: theme.key,
      theme: theme.name,
      statements,
    };
  }),
);

const out = { report: report.report, groups: [...groups].sort(), insights };
writeFileSync(output, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${insights.length} insights (${report.themes.length} questions, groups ${out.groups.join('/')}) to ${output}`);
