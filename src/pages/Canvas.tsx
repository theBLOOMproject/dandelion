import { Link } from 'react-router';
import { C, campaign, questions, type Question } from '../data';
import { useApp } from '../state';
import { Avatar, AvatarStack, Hero } from '../components/ui';

function QuestionCard({ q, className = '' }: { q: Question; className?: string }) {
  return (
    <Link to={`/canvas/${q.id}`} viewTransition className={`tcard xq ${className}`} style={{ background: C.navy }}>
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

/** Community Canvas: the explore grid of questions and statements. */
export function Canvas() {
  const { openComposer, lastThought } = useApp();
  const [q1, q2, q3] = questions;
  const share = (
    <button className="tcard" style={{ background: C.greenDark }} onClick={() => openComposer('thought')}>
      <h4>Share your thoughts.</h4>
      <p>With neighbors who are thinking about this issue.</p>
    </button>
  );
  return (
    <>
      <Hero title="Community Canvas" stats={campaign.stats} />
      <div className="page">
        <div className="section-head">
          <h3 className="h3">Explore thoughts from {campaign.place} on this issue.</h3>
          <button className="btn btn-lg btn-pink" onClick={() => openComposer('thought')}>Share your thoughts</button>
        </div>
        <div className="explore">
          <QuestionCard q={q1} className="span2" />
          <div className="tcard" style={{ background: C.greenDark }}>
            <div className="you-line"><Avatar color={C.orangeLight} size={20} /> You</div>
            <p className="quote">“{lastThought ?? 'Something something'}”</p>
          </div>
          {share}
          <Statement tone="peach" text="Something about this just bothers me. I don’t trust the real estate folks." />
          <QuestionCard q={q2} className="tall" />
          <Statement tone="blush" text="Oakland should take every dollar of tax revenue it can get." />
          {share}
          <QuestionCard q={q3} className="span2" />
          <Statement tone="lav" text="Who actually benefits from this?" by="@deshawn" />
        </div>
      </div>
    </>
  );
}
