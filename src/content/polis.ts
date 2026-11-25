/**
 * Polis comment export → typed statements.
 *
 * To swap in a new conversation, replace `polis/comments.csv` with a Polis
 * "comments" export that includes `author-id` (and optionally `moderated`).
 * Any number of opinion groups is supported: every `group-<x>-votes` column
 * becomes a group.
 */
import raw from './polis/comments.csv?raw';

export type Tally = { votes: number; agrees: number; disagrees: number; passes: number };
export type Group = { id: string; label: string };

export type Statement = {
  id: number;
  authorId: number;
  /** 1 = accepted, 0 = unmoderated, -1 = rejected. */
  moderated: number;
  text: string;
  total: Tally;
  /** Per opinion group, keyed by group id ('a', 'b', …). */
  groups: Record<string, Tally>;
};

/** Minimal RFC 4180 CSV parser: quoted fields, escaped quotes, newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

function parse(text: string) {
  const [header, ...body] = parseCsv(text);
  const col = (name: string) => header.indexOf(name);
  const groupIds = header
    .map((h) => /^group-([a-z]+)-votes$/.exec(h)?.[1])
    .filter((g): g is string => !!g);

  const tally = (row: string[], prefix: string): Tally => ({
    votes: Number(row[col(`${prefix}-votes`)]) || 0,
    agrees: Number(row[col(`${prefix}-agrees`)]) || 0,
    disagrees: Number(row[col(`${prefix}-disagrees`)]) || 0,
    passes: Number(row[col(`${prefix}-passes`)]) || 0,
  });

  const statements: Statement[] = body.map((row) => ({
    id: Number(row[col('comment-id')]),
    authorId: col('author-id') >= 0 ? Number(row[col('author-id')]) : 0,
    moderated: col('moderated') >= 0 ? Number(row[col('moderated')]) : 1,
    text: row[col('comment')].replace(/\s+/g, ' ').trim(),
    total: tally(row, 'total'),
    groups: Object.fromEntries(groupIds.map((g) => [g, tally(row, `group-${g}`)])),
  }));

  const groups: Group[] = groupIds.map((g) => ({ id: g, label: `Group ${g.toUpperCase()}` }));
  return { statements, groups };
}

const parsed = parse(raw);

/** Opinion groups found in the export. */
export const groups = parsed.groups;
/** Every statement in the export, including rejected ones. */
export const allStatements = parsed.statements;
/** Statements a moderator accepted: what the prototype shows. */
export const statements = allStatements.filter((s) => s.moderated === 1);

/** Share of voters who agreed, 0–100. */
export const agreePct = (t: Tally) => (t.votes ? Math.round((t.agrees / t.votes) * 100) : 0);
