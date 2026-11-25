import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { C, campaign, posts, ticker, type Post } from '../data';
import { useApp } from '../state';
import { Avatar, Hero } from '../components/ui';
import { Icon } from '../components/icons';
import { authorOf, insights, type Insight } from '../content/insights';
import { DirectionIcon, directionLabel, level } from '../components/InsightCard';

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

type FeedItem = { kind: 'insight'; insight: Insight } | { kind: 'post'; post: Post };

/** Insights in report order, with host posts dropped in at uneven intervals. */
function buildFeed(): FeedItem[] {
  const feed: FeedItem[] = insights.map((insight) => ({ kind: 'insight', insight }));
  const slots = [2, 8, 15];
  posts.forEach((post, i) => feed.splice(Math.min(slots[i] ?? feed.length, feed.length), 0, { kind: 'post', post }));
  return feed;
}

/** Rough rendered height, just to balance the two columns (quotes are hidden until hover). */
const estimate = (item: FeedItem) => (item.kind === 'post' ? 300 : 150 + item.insight.claim.length * 0.6);

/**
 * Split into two columns, each item going to the shorter one. Fixed columns (rather
 * than CSS columns) mean a tile growing on hover only pushes down its own column.
 */
function balance(feed: FeedItem[]) {
  const cols: { item: FeedItem; index: number }[][] = [[], []];
  const h = [0, 0];
  feed.forEach((item, index) => {
    const c = h[0] <= h[1] ? 0 : 1;
    cols[c].push({ item, index });
    h[c] += estimate(item);
  });
  return cols;
}

const PLACE_MS = 3000;

/** Top-left place tag: cycles through the campaign's places. */
function PlaceTag() {
  const [i, setI] = useState(0);
  const n = campaign.places.length;
  useEffect(() => {
    if (n < 2) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % n), PLACE_MS);
    return () => window.clearInterval(t);
  }, [n]);
  return (
    <span className="place-slot" aria-label={`Places: ${campaign.places.join(', ')}`}>
      {/* A fresh pill per place, so it always hugs the name. */}
      <span className="place-tag" key={i} aria-hidden>
        <Icon name="pin" size={18} />
        {campaign.places[i]}
      </span>
    </span>
  );
}

function JoinLine() {
  const people = campaign.stats.find((s) => s.label === 'participants')?.value ?? 0;
  return (
    <p className="hero-join">
      Join <b>{people.toLocaleString()} people</b> in {campaign.location} to figure out this issue.
    </p>
  );
}

const QUOTE_MS = 5000;

/** Cycles through the insight's statements every 5s. All quotes share one grid cell so the tile never changes height. */
function RotatingQuote({ insight, offset }: { insight: Insight; offset: number }) {
  const n = insight.statements.length;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (n < 2) return;
    // Stagger tiles so the whole feed doesn't flip at once.
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      setI((x) => (x + 1) % n);
      interval = window.setInterval(() => setI((x) => (x + 1) % n), QUOTE_MS);
    }, QUOTE_MS + (offset % 5) * 700);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [n, offset]);

  return (
    // Hidden until the tile is hovered or focused (always shown on touch screens).
    <div className="feed-quotes-wrap">
      <div className="feed-quotes">
        {insight.statements.map((s, k) => (
          <p key={s.id} className={`feed-quote ${k === i ? 'on' : ''}`} aria-hidden={k !== i}>
            “{s.text}” <span className={`lvl-text ${level(s.votes.agreePct)}`}>({s.votes.agreePct}%)</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function InsightTile({ insight, index }: { insight: Insight; index: number }) {
  const n = insight.statements.length;
  return (
    <Link to={`/canvas/${insight.question}#insight-${insight.id}`} viewTransition className={`feed-tile feed-tile-${insight.direction}`}>
      <span className={`feed-type dir-text-${insight.direction}`}>
        <DirectionIcon direction={insight.direction} size={18} />
        {directionLabel[insight.direction]}
      </span>
      <h3>{insight.claim}</h3>
      <RotatingQuote insight={insight} offset={index} />
      <span className="feed-foot">
        <span className="feed-count">
          {n} statement{n === 1 ? '' : 's'}
        </span>
        <span className="avatar-row">
          {insight.statements.map((s) => <Avatar key={s.id} color={authorOf(s).color} size={20} />)}
        </span>
        <span className="feed-more">Learn more →</span>
      </span>
    </Link>
  );
}

function PostTile({ post }: { post: Post }) {
  return (
    <a href="#" className={`feed-post tone-${post.tone}`} onClick={(e) => e.preventDefault()}>
      <span className="feed-kicker">{post.kicker}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="feed-byline">
        <Avatar color="#fff" size={18} className="on-dark" /> {post.author} · {post.date}
      </span>
    </a>
  );
}

export function Home() {
  const feed = buildFeed();
  return (
    <>
      <Hero
        eyebrow="Issue campaign"
        title={campaign.title}
        sub={<JoinLine />}
        top={
          <div className="header-top-split">
            <PlaceTag />
          </div>
        }
        big
        photo
        keepStatsMobile
        action={<Link to="/share" viewTransition className="btn btn-lg btn-pink">Share your thoughts</Link>}
      />
      <Ticker />
      <div className="page">
        <section className="about-box">
          <p>
            {campaign.about}{' '}
            <Link to="/about" viewTransition className="link-green">Read more</Link>
          </p>
        </section>

        <section className="feed-section">
          <div className="feed-head">
            <h2 className="h2">Learnings and updates</h2>
          </div>
          <div className="feed">
            {balance(feed).map((col, c) => (
              <div className="feed-col" key={c}>
                {col.map(({ item, index }) => (
                  // `order` restores the original sequence when the columns collapse into one on mobile.
                  <div className="feed-cell" key={index} style={{ order: index }}>
                    {item.kind === 'insight' ? (
                      <InsightTile insight={item.insight} index={index} />
                    ) : (
                      <PostTile post={item.post} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
