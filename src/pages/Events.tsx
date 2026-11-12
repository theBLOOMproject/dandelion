import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { C, events } from '../data';
import { useApp } from '../state';
import { Avatar, Dot, Hero, Sheet } from '../components/ui';

export function Events() {
  const { rsvps } = useApp();
  return (
    <>
      <Hero title="Events" stats={[{ value: events.length, label: 'events' }]} />
      <div className="page">
        <div className="section-head">
          <div>
            <h3 className="h3">Attend an event on this topic.</h3>
            <a className="link-green underline" href="#">How do events work?</a>
          </div>
          <Link to="/events/new" viewTransition className="btn btn-lg btn-navy">Host an event</Link>
        </div>
        <div className="grid2">
          {events.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} viewTransition className="ocard">
              <h4>{e.title}</h4>
              <p>{e.date}<br />{e.time} · {e.place}</p>
              <div className="ocard-foot">
                <span className="avatar-row">
                  {e.attendees.map((a) => <Avatar key={a.name} color={a.color} size={20} />)}
                  {rsvps[e.id] && <Avatar color={C.orange} size={20} />}
                </span>
                {rsvps[e.id] && <span className="tag">Going</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function InfoRow({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="info-row">
      <Dot />
      <div>
        <div className="info-title">{title}</div>
        {sub && <div className="info-sub">{sub}</div>}
      </div>
    </div>
  );
}

export function EventDetail() {
  const { eid } = useParams();
  const e = events.find((x) => x.id === eid) ?? events[0];
  const { rsvps, toggleRsvp } = useApp();
  const going = !!rsvps[e.id];
  const attendees = going ? [{ name: 'You', color: C.orange }, ...e.attendees] : e.attendees;

  return (
    <Sheet
      color={C.orange}
      title={e.title}
      stats={[{ value: attendees.length, label: 'attendees' }]}
      top={
        <button className={`btn btn-sm ${going ? 'btn-navy' : 'btn-white'}`} onClick={() => toggleRsvp(e.id)}>
          {going ? 'Registered ✓' : 'Register'}
        </button>
      }
    >
      <p className="lede-lg">{e.blurb}</p>
      <div className="event-grid">
        <div>
          <h2 className="h2">The Basics</h2>
          <InfoRow title={e.date} />
          <InfoRow title={e.time} />
          <InfoRow title={e.place} sub={e.address} />
        </div>
        <div>
          <h2 className="h2">Attendees</h2>
          <ul className="attendees">
            {attendees.map((a) => (
              <li key={a.name} className={a.name === 'You' ? 'pop' : ''}>
                <Avatar color={a.color} size={20} /> {a.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  );
}

export function NewEvent() {
  const nav = useNavigate();
  const { showToast } = useApp();
  const [desc, setDesc] = useState('');
  const save = () => {
    showToast('Event saved (prototype — nothing was stored).');
    nav('/events', { viewTransition: true });
  };
  return (
    <Sheet color={C.orange} title="New Event" top={<button className="btn btn-sm btn-navy" onClick={save}>Save Event</button>}>
      <h3 className="h3 form-label">Basic Details</h3>
      <label className="info-row field"><Dot /><input placeholder="Event name" /></label>
      <div className="grid2 tight">
        <label className="info-row field"><Dot /><input type="date" /></label>
        <label className="info-row field"><Dot /><input placeholder="5:00PM – 7:00PM" /></label>
      </div>
      <label className="info-row field"><Dot /><input placeholder="Where is it? Add a place or address" /></label>

      <h3 className="h3 form-label" style={{ marginTop: 56 }}>Description</h3>
      <textarea
        className="textbox"
        rows={4}
        value={desc}
        onChange={(ev) => setDesc(ev.target.value)}
        placeholder="What will people talk about? Who should come?"
      />
    </Sheet>
  );
}
