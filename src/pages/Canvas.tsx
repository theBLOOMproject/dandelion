import { Link } from 'react-router';
import { C, campaign, questions, type Question } from '../data';
import { Avatar, Hero } from '../components/ui';

function QuestionRow({ q }: { q: Question }) {
  return (
    <Link to={`/canvas/${q.id}`} viewTransition className="qrow">
      <h4 className="qrow-title">
        <Avatar color={C.orange} size={36} />
        <span>{q.text}</span>
      </h4>
      {/* Collapsed until the row is hovered or focused (always open on touch screens). */}
      <div className="qrow-resps">
        <div>
          {q.summary.slice(0, 2).map((s) => (
            <div className="resp" key={s.text}>
              <span className="pct">{s.pct}%</span>
              <Avatar color={s.color} size={18} />
              <span>“{s.text}”</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

/** Community Q&A: the list of questions and their top statements. */
export function Canvas() {
  return (
    <>
      <Hero title="Community Q&A" stats={campaign.stats} />
      <div className="page">
        <div className="section-head">
          <h3 className="h3">Explore thoughts from {campaign.place} on this issue.</h3>
          <Link to="/share" viewTransition className="btn btn-lg btn-pink">Share your thoughts</Link>
        </div>
        <div className="qlist">
          {questions.map((q) => <QuestionRow key={q.id} q={q} />)}
        </div>
      </div>
    </>
  );
}
