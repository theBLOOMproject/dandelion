import { campaign, resources } from '../data';
import { useApp } from '../state';
import { Hero } from '../components/ui';

export function Library() {
  const { openComposer } = useApp();
  return (
    <>
      <Hero title="Library" stats={[{ value: resources.length, label: 'resources' }]} />
      <div className="page">
        <div className="section-head">
          <div>
            <h3 className="h3">Explore resources from {campaign.place} on this issue.</h3>
            <a className="link-green underline" href="#">How did these sources get chosen?</a>
          </div>
          <button className="btn btn-lg btn-green" onClick={() => openComposer('resource')}>Share a resource</button>
        </div>
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
