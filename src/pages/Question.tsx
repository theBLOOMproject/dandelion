import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { C, questions, resources } from '../data';
import { useApp, type Vote } from '../state';
import { Avatar, Sheet } from '../components/ui';
import { Icon, type IconName } from '../components/icons';
import { InsightCard, InsightSummary } from '../components/InsightCard';

export const VOTES: { id: Vote; label: string }[] = [
  { id: 'agree', label: 'Agree' },
  { id: 'disagree', label: 'Disagree' },
  { id: 'unsure', label: 'Unsure' },
];

export function VoteIcon({ id }: { id: Vote }) {
  const d = {
    agree: 'M3.5 8.5l3 3 6-7',
    disagree: 'M4.5 4.5l7 7M11.5 4.5l-7 7',
    unsure: 'M5.2 5.6a2.8 2.8 0 1 1 4 2.5c-.8.4-1.2 1-1.2 1.8v.5M8 13.2v.1',
  }[id];
  return (
    <svg className="vote-icon" viewBox="0 0 16 16" aria-hidden>
      <path d={d} />
    </svg>
  );
}

type Tab = 'answers' | 'resources' | 'summary';

export function Question() {
  const { qid } = useParams();
  const q = questions.find((x) => x.id === qid) ?? questions[0];
  const { votes, vote, resetVotes, showToast, requireAuth, userColor, account } = useApp();
  const join = (onDone: () => void) =>
    requireAuth({
      fields: ['email', 'zip'],
      title: 'Join the conversation',
      sub: 'Create an account to share and vote alongside your neighbors.',
      onDone,
    });
  const mine = votes[q.id] ?? [];
  const n = mine.length;
  const done = n >= q.answers.length;
  const [tab, setTab] = useState<Tab>('answers');
  const [draft, setDraft] = useState('');
  const related = resources.slice(0, 3);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setDraft('');
    showToast('Response shared.');
  };

  const tabs: { id: Tab; label: string; icon: IconName; count?: number }[] = [
    { id: 'answers', label: 'Answers', icon: 'canvas', count: q.answers.length },
    { id: 'resources', label: 'Resources', icon: 'library', count: related.length },
    { id: 'summary', label: 'Summary', icon: 'chart', count: q.insights.length || undefined },
  ];

  return (
    <Sheet
      color={C.navy}
      title={q.text}
      small
      bottom={
        <form className="compose-inline compose-header" onSubmit={submit}>
          <Avatar color={userColor} size={36} />
          <input
            placeholder="Share a standalone response…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => {
              if (account?.zip) return;
              const input = e.currentTarget;
              input.blur();
              join(() => window.setTimeout(() => input.focus(), 50));
            }}
          />
          <button className="compose-send" aria-label="Share response" disabled={!draft.trim()}>
            <svg viewBox="0 0 20 20" aria-hidden><path d="M4 10h12M11 5l5 5-5 5" /></svg>
          </button>
        </form>
      }
    >
      <div className="list-head qtabs-row">
        <div className="qtabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={`qtab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={18} />
              {t.label}
              {t.count !== undefined && <span className="qtab-count">({t.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {tab === 'answers' && (
        <>
          <ol className="answers">
            {q.answers.map((a, i) => {
              // Answered items collapse away so everything below shifts up.
              const state = i < n ? 'gone' : i === n ? 'active' : i === n + 1 ? 'next' : i === n + 2 ? 'later' : 'hidden';
              return (
                <li key={i} className={`answer ${state}`} aria-hidden={state === 'gone' || state === 'hidden'}>
                  <div className="answer-clip">
                    <div className="answer-row">
                      <Avatar color={a.color} size={36} />
                      <div className="answer-body">
                        <h3>{a.text}</h3>
                        <div className="answer-meta">{a.author} · {a.votes} votes</div>
                        {state === 'active' && (
                          <div className="vote-row">
                            {VOTES.map((x) => (
                              <button key={x.id} className={`vote vote-${x.id}`} onClick={() => join(() => vote(q.id, x.id))}>
                                <VoteIcon id={x.id} />
                                {x.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {done && (
            <div className="answers-done">
              <p>That’s everyone so far. Thanks for weighing in.</p>
              <button className="link-green text-btn" onClick={() => resetVotes(q.id)}>Start over</button>
            </div>
          )}
        </>
      )}

      {tab === 'resources' && (
        <div className="qtab-panel">
          <div className="cards3">
            {related.map((r) => (
              <a key={r.title} href="#" className="ocard" onClick={(e) => e.preventDefault()}>
                <span className="tag">{r.kind}</span>
                <h4>{r.title}</h4>
                <p>{r.desc}</p>
              </a>
            ))}
          </div>
          <Link to="/library" viewTransition className="link-green text-btn qtab-more">See the full library</Link>
        </div>
      )}

      {tab === 'summary' && (
        <div className="qtab-panel">
          {q.insights.length > 0 ? (
            <>
              <InsightSummary insights={q.insights} />
              <div className="insights">
                {q.insights.map((i) => <InsightCard key={i.id} insight={i} />)}
              </div>
            </>
          ) : (
            <div className="summary">
              <div className="label">Most agreed with</div>
              {q.summary.map((s) => (
                <div className="resp" key={s.text}>
                  <span className="pct">{s.pct}%</span>
                  <Avatar color={s.color} size={18} />
                  <span>“{s.text}”</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
