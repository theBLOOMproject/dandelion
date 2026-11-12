import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { C, campaign, insightQuotes, reportQuotes, ticker } from '../data';
import { useApp } from '../state';
import { Avatar, Hero } from '../components/ui';

function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="ticker" aria-label="Recent statements">
      <div className="ticker-track">
        {items.map((t, i) => (
          <Link to="/canvas" viewTransition className="ticker-item" key={i} aria-hidden={i >= ticker.length}>
            <Avatar color={t.color} size={18} />
            <span>“{t.text}”</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function WhatYouCanDo() {
  const { following, follow, lastThought } = useApp();
  const nav = useNavigate();
  const steps = [
    { label: 'Sign up for updates.', done: following, act: follow, color: C.orangeLight },
    { label: 'Share your thoughts and questions.', done: !!lastThought, act: () => nav('/canvas', { viewTransition: true }), color: C.green },
    { label: 'Join a facilitated conversation.', done: false, act: () => nav('/events', { viewTransition: true }), color: C.navy },
  ];
  const active = Math.max(0, steps.findIndex((s) => !s.done));
  return (
    <section className="wycd">
      <div className="wycd-art">
        <span className="wycd-blob" style={{ background: steps[active].color }} />
      </div>
      <div className="wycd-body">
        <div className="label">What you can do</div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                className={`step ${i === active ? 'active' : s.done ? 'done' : 'todo'}`}
                onClick={s.act}
                style={{ ['--step' as string]: s.color }}
              >
                <span className="step-dot">{s.done && <svg viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Task = {
  id: string;
  title: string;
  sub: string;
  cta: string;
  doneTitle: string;
  to?: string;
  tone: 'lav' | 'orange' | 'green' | 'navy';
};

const TASKS: Task[] = [
  {
    id: 'follow',
    title: 'Follow this campaign',
    sub: 'Sign up with your email to receive updates, resources, and more.',
    cta: 'Follow',
    doneTitle: 'You’re following this campaign.',
    tone: 'lav',
  },
  {
    id: 'share',
    title: 'Share your thoughts.',
    sub: 'With neighbors who are thinking about this issue.',
    cta: 'Start',
    doneTitle: 'Thoughts shared.',
    to: '/share',
    tone: 'orange',
  },
  {
    id: 'read',
    title: 'Read about it.',
    sub: 'Materials compiled and reviewed by your hosts.',
    cta: 'Open the Library',
    doneTitle: 'Read up.',
    to: '/library',
    tone: 'green',
  },
  {
    id: 'attend',
    title: 'Attend an Event.',
    sub: 'Meet neighbors who are thinking about this issue.',
    cta: 'See events',
    doneTitle: 'Event found.',
    to: '/events',
    tone: 'navy',
  },
];

/**
 * Horizontal row of tasks. The next undone task is wide and dark; the rest are light.
 * Completing a task holds briefly, then the next one grows/darkens and scrolls into view.
 */
function TaskRow() {
  const { following, follow, doneTasks, completeTask, seenTask, setSeenTask } = useApp();
  const nav = useNavigate();
  const rowRef = useRef<HTMLDivElement>(null);
  const isDone = (id: string) => (id === 'follow' ? following : !!doneTasks[id]);
  const active = TASKS.find((t) => !isDone(t.id))?.id ?? null;
  // What we display as active lags behind the real one so the change is visible.
  const [shown, setShown] = useState<string | null>(seenTask ?? active);

  useEffect(() => {
    if (shown === active) {
      setSeenTask(active);
      return;
    }
    const t = window.setTimeout(() => {
      setShown(active);
      setSeenTask(active);
    }, 450);
    return () => window.clearTimeout(t);
  }, [active, shown, setSeenTask]);

  // After the resize settles, bring the active card to the start of the row.
  useEffect(() => {
    const row = rowRef.current;
    const card = row?.querySelector<HTMLElement>('.task.active');
    if (!row || !card) return;
    const t = window.setTimeout(() => {
      row.scrollTo({ left: card.offsetLeft - row.offsetLeft - parseFloat(getComputedStyle(row).paddingLeft), behavior: 'smooth' });
    }, 480);
    return () => window.clearTimeout(t);
  }, [shown]);

  const act = (t: Task) => {
    if (t.id === 'follow') return follow();
    // Sharing only counts once the flow is finished; the others count on click.
    if (!isDone(t.id) && t.id !== 'share') completeTask(t.id);
    if (t.to) nav(t.to, { viewTransition: true });
  };

  return (
    <div className="task-scroll" ref={rowRef}>
      {TASKS.map((t) => {
        const done = isDone(t.id);
        const state = t.id === shown ? 'active' : done ? 'done' : 'todo';
        return (
          <button key={t.id} className={`tcard task ${state} tone-${t.tone}`} onClick={() => act(t)}>
            <h4>{done ? t.doneTitle : t.title}</h4>
            <p>{t.sub}</p>
            <span className="task-cta">
              {done ? (
                <>
                  <svg viewBox="0 0 12 12" aria-hidden><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg> Done
                </>
              ) : (
                t.cta
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuoteCard({ color, text, by, dot }: { color: string; text: string; by: string; dot: string }) {
  return (
    <Link to="/canvas" viewTransition className="tcard qcard" style={{ background: color }}>
      <p>“{text}”</p>
      <span className="byline">
        <Avatar color={dot} size={12} /> Asked by {by}
      </span>
    </Link>
  );
}

export function Home() {
  return (
    <>
      <Hero
        eyebrow="Issue campaign"
        title={campaign.title}
        stats={campaign.stats}
        big
        photo
        keepStatsMobile
        bottom={
          <Link to="/share" viewTransition className="btn btn-lg btn-pink">Share your thoughts</Link>
        }
      />
      <Ticker />
      <div className="page">
        <section>
          <div className="label">About this campaign</div>
          <p className="lede">
            {campaign.about}…{' '}
            <Link to="/about" viewTransition className="link-green">Read more</Link>
          </p>
        </section>

        {/* Hidden for now: <WhatYouCanDo /> */}

        <section className="panel">
          <h3 className="panel-title">What you can do</h3>
          <TaskRow />
        </section>

        <div className="label" style={{ marginTop: 48 }}>From the community</div>

        <section className="panel" style={{ marginTop: 24 }}>
          <div className="panel-eyebrow">Insight</div>
          <h2 className="panel-heading">People don’t believe that data centers should consume more of our natural resources.</h2>
          <div className="cards3">
            {insightQuotes.map((q) => <QuoteCard key={q.text} {...q} />)}
          </div>
        </section>

        <section className="panel">
          <div className="panel-eyebrow">Report back</div>
          <h2 className="panel-heading">From @cassidy’s living room conversation</h2>
          <div className="cards3">
            {reportQuotes.map((q) => <QuoteCard key={q.text} {...q} />)}
          </div>
        </section>
      </div>
    </>
  );
}
