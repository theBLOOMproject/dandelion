import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { C, questions } from '../data';
import { useApp, type Vote } from '../state';
import { Avatar, Sheet } from '../components/ui';

const VOTES: { id: Vote; label: string }[] = [
  { id: 'agree', label: 'Agree' },
  { id: 'disagree', label: 'Disagree' },
  { id: 'unsure', label: 'Unsure' },
];

function VoteIcon({ id }: { id: Vote }) {
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

export function Question() {
  const { qid } = useParams();
  const q = questions.find((x) => x.id === qid) ?? questions[0];
  const { votes, vote, resetVotes, showToast } = useApp();
  const mine = votes[q.id] ?? [];
  const n = mine.length;
  const done = n >= q.answers.length;
  const [summary, setSummary] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setDraft('');
    showToast('Response shared.');
  };

  return (
    <Sheet
      color={C.navy}
      eyebrow="Question"
      title={q.text}
      small
      stats={[{ value: q.participants, label: 'participants' }]}
      top={
        <>
          <Link to="/library" viewTransition className="btn btn-sm btn-green">View Resources</Link>
          <button className="btn btn-sm btn-white" onClick={() => setSummary((s) => !s)}>
            {summary ? 'Hide Summary' : 'View Summary'}
          </button>
        </>
      }
    >
      <div className={`collapse ${summary ? 'open' : ''}`}>
        <div>
          <div className="summary">
            <div className="label">Where people land</div>
            {q.summary.map((s) => (
              <div className="resp" key={s.text}>
                <span className="pct">{s.pct}%</span>
                <Avatar color={s.color} size={18} />
                <span>“{s.text}”</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className="compose-inline" onSubmit={submit}>
        <Avatar color={C.orange} size={36} />
        <input placeholder="Share a standalone response…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        {draft && <button className="btn btn-sm btn-navy">Share</button>}
      </form>

      <div className="list-head bordered">
        <h3>
          {done ? 'All answers' : 'Answers'} <span className="count">({q.answers.length})</span>
        </h3>
        <p>{done ? 'You’ve responded to every answer.' : 'Respond to each to see the next person’s answer.'}</p>
      </div>

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
                    <div className="answer-meta">{a.author}</div>
                    {state === 'active' && (
                      <div className="vote-row">
                        {VOTES.map((x) => (
                          <button key={x.id} className={`vote vote-${x.id}`} onClick={() => vote(q.id, x.id)}>
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
    </Sheet>
  );
}
