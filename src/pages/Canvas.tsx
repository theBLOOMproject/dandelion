import { Link } from 'react-router';
import { C, campaign, questions, type Question } from '../data';
import { Avatar, AvatarStack, Hero } from '../components/ui';

function QuestionCard({ q, className = '' }: { q: Question; className?: string }) {
  return (
    <Link to={`/canvas/${q.id}`} viewTransition className={`tcard xq ${className}`} style={{ background: '#1E2A9A' }}>
      <h4 className="xq-title">Q: {q.text}</h4>
      <div className={`xq-meta ${className.includes('tall') ? 'stacked' : ''}`}>
        <span><AvatarStack /> {q.participants} participants</span>
        <span><Avatar color={q.askedColor} size={12} /> Asked by {q.askedBy}</span>
      </div>
    </Link>
  );
}

function Statement({ tone, text, by = '@wizard' }: { tone: string; text: string; by?: string }) {
  return (
    <div className={`tcard statement ${tone}`}>
      <p className="quote">“{text}”</p>
      <span className="byline"><Avatar color={C.greenDark} size={12} /> Asked by {by}</span>
    </div>
  );
}

/** Community Q&A: the explore grid of questions and statements. */
export function Canvas() {
  const [q1, q2, q3] = questions;
  return (
    <>
      <Hero title="Community Q&A" stats={campaign.stats} />
      <div className="page">
        <div className="section-head">
          <h3 className="h3">Explore thoughts from {campaign.place} on this issue.</h3>
          <Link to="/share" viewTransition className="btn btn-lg btn-pink">Share your thoughts</Link>
        </div>
        <div className="explore">
          <QuestionCard q={q1} className="span2" />
          <Statement tone="mint" text="I’m not against it, I just want to know what we get out of it as a neighborhood." by="@cassidy" />
          <Statement tone="mint" text="If they’re using our water, the least they can do is tell us exactly how much — every month, in public, for every single site." by="@marisol" />
          <Statement tone="peach" text="Something about this just bothers me. I don’t trust the real estate folks." />
          <QuestionCard q={q2} className="tall" />
          <Statement tone="blush" text="Oakland should take every dollar of tax revenue it can get." />
          <Statement tone="mint" text="My uncle worked construction on one of these in Nevada. The jobs lasted eighteen months and then everybody was gone, and the town was left with the bill." by="@tomas" />
          <QuestionCard q={q3} className="span2" />
          <Statement tone="lav" text="Who actually benefits from this?" by="@deshawn" />
        </div>
      </div>
    </>
  );
}
