import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { C, campaign, heroSwatches, identityQuestions, questions, ticker } from '../data';
import { useApp } from '../state';
import { Avatar, Hero } from '../components/ui';
import { Icon } from '../components/icons';

export function Edit() {
  const { heroColor, setHeroColor, showToast } = useApp();
  const { hash } = useLocation();
  const [desc, setDesc] = useState(campaign.about);
  const [on, setOn] = useState<Set<string>>(new Set(['party', 'tech']));
  const [tab, setTab] = useState<'statements' | 'questions'>('questions');

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const toggle = (id: string) =>
    setOn((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <>
      <Hero
        title={campaign.title}
        stats={campaign.stats}
        top={
          <div className="swatches">
              <button className="btn btn-sm btn-dark" onClick={() => showToast('Photo upload coming soon.')}>Change Photo</button>
              {heroSwatches.map((c) => (
                <button
                  key={c}
                  className={`swatch ${heroColor === c ? 'on' : ''}`}
                  style={{ background: c }}
                  onClick={() => setHeroColor(c)}
                  aria-label={`Hero color ${c}`}
                />
              ))}
          </div>
        }
      />
      <div className="page">
        <h3 className="h3 form-label" id="basics">Campaign Description</h3>
        <textarea className="textbox medium" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />

        <div className="section-head" style={{ marginTop: 56 }}>
          <h3 className="h3">Identity Questions</h3>
          <p className="muted-r">These will be asked to all participants.</p>
        </div>
        <div className="grid2 tight">
          {identityQuestions.map((q) => (
            <button key={q.id} className={`idq ${on.has(q.id) ? 'on' : ''}`} onClick={() => toggle(q.id)}>
              <Icon name={q.icon ?? 'person'} size={24} />
              <span>
                <b>{q.title}</b>
                <small>{q.options.join(' • ')}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 64 }} id="moderation">
          <h3 className="h3">Canvas Moderation</h3>
          <div className="tabs">
            <button className={tab === 'statements' ? 'on' : ''} onClick={() => setTab('statements')}>Statements</button>
            <button className={tab === 'questions' ? 'on' : ''} onClick={() => setTab('questions')}>Questions</button>
          </div>
        </div>
        <ul className="mod-list" key={tab}>
          {(tab === 'questions' ? questions.map((q) => ({ color: C.orange, text: q.text })) : ticker).map((x) => (
            <li key={x.text}>
              <Avatar color={x.color} size={26} />
              <span>{x.text}</span>
              <span className="mod-actions">
                <button onClick={() => showToast('Approved.')}>Approve</button>
                <button onClick={() => showToast('Hidden from canvas.')}>Hide</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
