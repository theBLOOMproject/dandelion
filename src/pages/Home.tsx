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

function WhatYouCanDo() {
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
      <Hero eyebrow="Issue campaign" title={campaign.title} stats={campaign.stats} />
      <Ticker />
      <div className="page">
        <section>
          <div className="label">About this campaign</div>
          <p className="lede">
            {campaign.about}…{' '}
            <Link to="/about" viewTransition className="link-green">Read more</Link>
          </p>
        </section>

        <WhatYouCanDo />

        <section className="panel">
          <h3 className="panel-title">Your Tasks</h3>
          <div className="cards3">
            <Link to="/canvas" viewTransition className="tcard" style={{ background: C.orange }}>
              <h4>Share your thoughts.</h4>
              <p>With neighbors who are thinking about this issue.</p>
            </Link>
            <Link to="/library" viewTransition className="tcard" style={{ background: C.greenDark }}>
              <h4>Read about it.</h4>
              <p>Materials compiled and reviewed by your hosts.</p>
            </Link>
            <Link to="/events" viewTransition className="tcard" style={{ background: C.navy }}>
              <h4>Attend an Event.</h4>
              <p>Meet neighbors who are thinking about this issue.</p>
            </Link>
          </div>
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
