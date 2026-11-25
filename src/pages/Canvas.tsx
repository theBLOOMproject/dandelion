import { Link } from 'react-router';
import { C, questions, type Question } from '../data';
import { Avatar, Hero } from '../components/ui';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function QuestionRow({ q }: { q: Question }) {
  return (
    <Link to={`/canvas/${q.id}`} viewTransition className="qrow">
      <Avatar color={C.orange} size={36} />
      <div className="qrow-body">
        <h4 className="qrow-title">{q.text}</h4>
        <div className="qrow-meta">
          {plural(q.answers.length, 'response')}, {plural(q.insights.length, 'insight')}
        </div>
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
      </div>
      <span className="qrow-arrow" aria-hidden>
        <svg viewBox="0 0 20 20"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
      </span>
    </Link>
  );
}

/** Community Q&A: the list of questions and their top statements. */
export function Canvas() {
  return (
    <>
      <Hero
        title="Community Q&A"
        sub={<p className="hero-sub">Explore what people have to say on the following questions, or propose your own.</p>}
        action={<Link to="/share" viewTransition className="btn btn-lg btn-pink">Share your thoughts</Link>}
      />
      <div className="page">
        <div className="list-head qlist-head">
          <h3>
            Questions <span className="count">({questions.length})</span>
          </h3>
        </div>
        <div className="qlist">
          {questions.map((q) => <QuestionRow key={q.id} q={q} />)}
        </div>
      </div>
    </>
  );
}
