import { resources } from '../data';
import { useApp } from '../state';
import { Hero } from '../components/ui';

export function Library() {
  const { openComposer } = useApp();
  return (
    <>
      <Hero
        title="Library"
        sub={
          <p className="hero-sub">
            Articles, videos, and guides to help you understand the issue.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>How did these sources get chosen?</a>
          </p>
        }
        action={<button className="btn btn-lg btn-hero" onClick={() => openComposer('resource')}>Share a resource</button>}
      />
      <div className="page">
        <div className="cards3">
          {resources.map((r) => (
            <a key={r.title} href="#" className="ocard" onClick={(e) => e.preventDefault()}>
              <span className="tag">{r.kind}</span>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
