import { useEffect, useState } from 'react';
import { authorOf, insightGroups, type Direction, type Insight, type InsightStatement } from '../content/insights';
import { Avatar } from './ui';

const ROTATE_MS = 7000;

export const directionLabel: Record<Direction, string> = {
  agree: 'Common ground',
  divided: 'Divided',
  mixed: 'Mixed',
};

/** Shape + color per direction, so the type never relies on color alone. */
export function DirectionIcon({ direction, size = 20 }: { direction: Direction; size?: number }) {
  const path = {
    agree: 'M6 10.4l2.6 2.6L14 7.5', // check
    divided: 'M10 4.5v11M5.5 8 3 10.5 5.5 13M14.5 8l2.5 2.5-2.5 2.5', // split apart
    mixed: 'M4.5 11.5c1.8-3 3.6-3 5.5 0s3.7 3 5.5 0', // wave
  }[direction];
  return (
    <svg className={`dir-icon dir-${direction}`} width={size} height={size} viewBox="0 0 20 20" role="img" aria-label={directionLabel[direction]}>
      <circle cx="10" cy="10" r="10" />
      <path d={path} />
    </svg>
  );
}

/** Bar color tracks the agree level: green > 66%, red < 33%, yellow between. */
const level = (pct: number) => (pct > 66 ? 'high' : pct < 33 ? 'low' : 'mid');

function GroupBars({ s }: { s: InsightStatement }) {
  return (
    <div className="gbars" role="list" aria-label="Agreement by opinion group">
      {insightGroups.map((g) => {
        const t = s.votes.groups[g];
        if (!t) return null;
        return (
          <div
            className="gbar"
            role="listitem"
            key={g}
            title={`Group ${g}: ${t.agree} agree, ${t.disagree} disagree, ${t.pass} pass (${t.total} votes)`}
          >
            <span className="gbar-label">Group {g}</span>
            <span className="gbar-track">
              <span className={`gbar-fill ${level(t.agreePct)}`} style={{ width: `${t.agreePct}%` }} />
            </span>
            <span className="gbar-pct">{t.agreePct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/** One supporting statement at a time; advances every 7s, pauses while hovered or focused. */
function StatementCarousel({ statements }: { statements: InsightStatement[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = statements.length > 1;

  useEffect(() => {
    if (!many || paused) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % statements.length), ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [i, many, paused, statements.length]);

  const s = statements[i];
  const who = authorOf(s);
  return (
    <div
      className="insight-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="insight-slide" key={s.id} aria-live="polite">
        <Avatar color={who.color} size={22} />
        <div>
          <p className="insight-quote">“{s.text}”</p>
          <div className="insight-meta">
            {who.name} · <b>{s.votes.agreePct}% agree</b> of {s.votes.total} votes
          </div>
          <GroupBars s={s} />
        </div>
      </div>
      {many && (
        <div className="insight-dots" role="tablist" aria-label="Supporting statements">
          {statements.map((x, n) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={n === i}
              aria-label={`Statement ${n + 1} of ${statements.length}`}
              className={`insight-dot ${n === i ? 'on' : ''}`}
              onClick={() => setI(n)}
            >
              {n === i && !paused && <span className="insight-dot-timer" style={{ animationDuration: `${ROTATE_MS}ms` }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className={`insight insight-${insight.direction}`} id={`insight-${insight.id}`}>
      <span className="insight-dir">
        <DirectionIcon direction={insight.direction} size={16} />
        {directionLabel[insight.direction]}
      </span>
      <h3 className="insight-claim">{insight.claim}</h3>
      <StatementCarousel statements={insight.statements} />
    </article>
  );
}

/** Quick list of every insight with its type icon; each jumps to its card. */
export function InsightSummary({ insights }: { insights: Insight[] }) {
  const jump = (id: string) => document.getElementById(`insight-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <ul className="insight-summary">
      {insights.map((i) => (
        <li key={i.id}>
          <button onClick={() => jump(i.id)}>
            <DirectionIcon direction={i.direction} size={22} />
            <span>{i.claim}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
