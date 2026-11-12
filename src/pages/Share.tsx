import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { C, isLight, questions } from '../data';
import { useApp, type Vote } from '../state';
import { Avatar, Sheet } from '../components/ui';
import { VOTES, VoteIcon } from './Question';

const REQUIRED_VOTES = 5;

/** Neighbors' statements to react to: interleave answers across questions so topics vary. */
function buildStatements() {
  const out: { text: string; author: string; color: string; question: string }[] = [];
  const longest = Math.max(...questions.map((q) => q.answers.length));
  for (let i = 0; i < longest; i++) {
    for (const q of questions) {
      const a = q.answers[i];
      if (a) out.push({ ...a, question: q.text });
    }
  }
  return out;
}

type Phase = { kind: 'open'; index: number } | { kind: 'vote' } | { kind: 'done' };

/**
 * Full-screen "Share your thoughts" flow in the theme color:
 * three open questions (each skippable), then react to statements (at least 5).
 */
export function Share() {
  const { heroColor, completeTask, showToast } = useApp();
  const nav = useNavigate();
  const statements = useMemo(buildStatements, []);
  const [phase, setPhase] = useState<Phase>({ kind: 'open', index: 0 });
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [votes, setVotes] = useState<Vote[]>([]);

  const close = () => {
    if ((window.history.state?.idx ?? 0) > 0) nav(-1);
    else nav('/canvas', { viewTransition: true });
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const fg = isLight(heroColor) ? C.navy : '#fff';
  const openQs = questions.slice(0, 3);
  const answered = answers.filter((a) => a.trim()).length;
  const canFinish = votes.length >= REQUIRED_VOTES;

  // Progress: 3 open steps + the required votes.
  const totalSteps = openQs.length + REQUIRED_VOTES;
  const doneSteps =
    phase.kind === 'open' ? phase.index : phase.kind === 'vote' ? openQs.length + Math.min(votes.length, REQUIRED_VOTES) : totalSteps;

  const nextOpen = () => {
    if (phase.kind !== 'open') return;
    if (phase.index < openQs.length - 1) setPhase({ kind: 'open', index: phase.index + 1 });
    else setPhase({ kind: 'vote' });
  };

  const vote = (v: Vote) => {
    const next = [...votes, v];
    setVotes(next);
    if (next.length >= statements.length) finish();
  };

  const finish = () => {
    completeTask('share');
    setPhase({ kind: 'done' });
  };

  const done = () => {
    showToast('Thanks — your thoughts were shared with neighbors.');
    nav('/canvas', { viewTransition: true });
  };

  return (
    <Sheet color={heroColor}>
      <div className="share" style={{ ['--share-fg' as string]: fg, ['--share-bg' as string]: heroColor }}>
      <div className="share-progress" aria-label={`Step ${doneSteps + 1} of ${totalSteps}`}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <span key={i} className={i < doneSteps ? 'on' : ''} />
        ))}
      </div>

      <div className="share-body">
        {phase.kind === 'open' && (
          <section className="share-step" key={`open-${phase.index}`}>
            <div className="share-eyebrow">Question {phase.index + 1} of {openQs.length}</div>
            <h1 className="share-q">{openQs[phase.index].text}</h1>
            <textarea
              className="share-input"
              autoFocus
              rows={4}
              placeholder="Type your answer…"
              value={answers[phase.index]}
              onChange={(e) => setAnswers((a) => a.map((x, i) => (i === phase.index ? e.target.value : x)))}
            />
            <div className="share-actions">
              <button className="btn btn-share-ghost" onClick={nextOpen}>Skip</button>
              <button className="btn btn-share" onClick={nextOpen} disabled={!answers[phase.index].trim()}>
                Next
              </button>
            </div>
          </section>
        )}

        {phase.kind === 'vote' && (
          <section className="share-step" key={`vote-${votes.length}`}>
            <div className="share-eyebrow">
              {canFinish
                ? `You’ve reacted to ${votes.length}. Keep going, or finish whenever.`
                : `React to your neighbors · ${votes.length} of ${REQUIRED_VOTES}`}
            </div>
            <div className="share-context">On “{statements[votes.length].question}”</div>
            <h1 className="share-statement">“{statements[votes.length].text}”</h1>
            <div className="share-author">
              <Avatar color={statements[votes.length].color} size={22} /> {statements[votes.length].author}
            </div>
            <div className="share-actions">
              {VOTES.map((v) => (
                <button key={v.id} className="btn btn-share-ghost share-vote" onClick={() => vote(v.id)}>
                  <VoteIcon id={v.id} /> {v.label}
                </button>
              ))}
            </div>
            <div className="share-finish">
              <button className="btn btn-share" onClick={finish} disabled={!canFinish}>
                {canFinish ? 'Finish' : `${REQUIRED_VOTES - votes.length} more to finish`}
              </button>
            </div>
          </section>
        )}

        {phase.kind === 'done' && (
          <section className="share-step">
            <div className="share-eyebrow">All done</div>
            <h1 className="share-q">Thanks for weighing in.</h1>
            <p className="share-summary">
              {answered > 0 ? `You answered ${answered} question${answered === 1 ? '' : 's'} and` : 'You'} reacted to{' '}
              {votes.length} of your neighbors’ statements. Your responses help everyone see where Oakland stands.
            </p>
            <div className="share-actions">
              <button className="btn btn-share" onClick={done}>See the Community Q&amp;A</button>
              <Link to="/" viewTransition className="btn btn-share-ghost">Back home</Link>
            </div>
          </section>
        )}
      </div>
      </div>
    </Sheet>
  );
}
