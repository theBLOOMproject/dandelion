import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { C, campaign, hosts } from '../data';
import { useApp, type ComposerKind } from '../state';
import { Avatar, Toast } from './ui';
import { Icon, type IconName } from './icons';

type NavItem = { to: string; label: string; icon: IconName; end?: boolean };

const mainNav: NavItem[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/about', label: 'About', icon: 'about' },
  { to: '/canvas', label: 'Community Q&A', icon: 'canvas' },
  { to: '/events', label: 'Events', icon: 'events' },
  { to: '/library', label: 'Library', icon: 'library' },
];

const editNav: NavItem[] = [
  { to: '/', label: 'Go Home', icon: 'home', end: true },
  { to: '/edit#basics', label: 'Basics & Description', icon: 'edit' },
  { to: '/edit#moderation', label: 'Q&A Moderation', icon: 'shield' },
  { to: '/events', label: 'Events', icon: 'events' },
  { to: '/library', label: 'Library', icon: 'library' },
];

function Sidebar({ edit, open, onClose }: { edit: boolean; open: boolean; onClose(): void }) {
  const nav = edit ? editNav : mainNav;
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="side-label">{campaign.title}</div>
        <nav className="side-nav">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} viewTransition className={edit && n.to.includes('#') ? 'no-active' : ''}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-divider" />
        <div className="side-label">
          Hosts {edit && <button className="mini-pill">Add</button>}
        </div>
        <div className="side-nav side-hosts">
          {hosts.map((h) => (
            <Link key={h.name} to="/about" viewTransition>
              <Avatar color={h.color} size={26} />
              <span>{h.name}</span>
            </Link>
          ))}
        </div>
        <div className="side-divider" />
        <div className="side-label">{edit ? 'Places & People' : 'Places'}</div>
        <div className="map" aria-label="Map placeholder">
          <svg viewBox="0 0 320 190" preserveAspectRatio="none">
            <path d="M-10 140 C 60 120, 110 160, 180 120 S 290 60, 340 80" />
            <path d="M40 -10 C 60 60, 90 110, 70 200" />
            <path d="M200 -10 C 190 50, 230 120, 260 200" />
          </svg>
          <span className="map-pin" />
        </div>
      </aside>
    </>
  );
}

function YouMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div className="you" ref={ref}>
      <button className="you-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Avatar color={C.orange} size={20} />
        <span className="you-label">You</span>
      </button>
      {open && (
        <div className="menu">
          <div className="menu-head">
            <Avatar color={C.orange} size={36} />
            <div>
              <b>You</b>
              <span>Oakland, CA</span>
            </div>
          </div>
          <Link to="/edit" viewTransition>Edit campaign <small>Host view</small></Link>
          <button onClick={() => setOpen(false)}>Settings</button>
        </div>
      )}
    </div>
  );
}

/** Subpages show their own name and a back button instead of the campaign title. */
function subpageFor(pathname: string): { name: string; back: string } | null {
  if (pathname.startsWith('/edit')) return { name: 'Edit Campaign', back: '/' };
  if (pathname === '/events/new') return { name: 'New Event', back: '/events' };
  if (/^\/events\/./.test(pathname)) return { name: 'Event', back: '/events' };
  if (/^\/canvas\/./.test(pathname)) return { name: 'Question', back: '/canvas' };
  return null;
}

function TopBar({ onMenu }: { onMenu(): void }) {
  const { pathname } = useLocation();
  const { following, toggleFollowing } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const sub = subpageFor(pathname);
  const hosting = pathname.startsWith('/edit');

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <button className="menu-btn" onClick={onMenu} aria-label="Open navigation">
        <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <div className="tb-left">
        {sub ? (
          <>
            <Link to={sub.back} viewTransition className="tb-back" aria-label="Back">
              <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
            </Link>
            <span className="tb-title">{sub.name}</span>
            {hosting && <span className="tb-url">bloomproject.us/{campaign.slug}</span>}
          </>
        ) : (
          <Link to="/" viewTransition className="tb-title">{campaign.title}</Link>
        )}
      </div>
      {hosting ? (
        <Link to="/" viewTransition className="btn btn-sm btn-pink">Hosting</Link>
      ) : (
        <button className={`btn btn-sm ${following ? 'btn-green' : 'btn-outline-green'}`} onClick={toggleFollowing}>
          {following ? 'Following' : 'Follow'}
        </button>
      )}
      <YouMenu />
    </header>
  );
}

const composerCopy: Record<ComposerKind, { title: string; sub: string; placeholder: string; cta: string; tone: string }> = {
  thought: {
    title: 'Share your thoughts.',
    sub: 'With neighbors who are thinking about this issue.',
    placeholder: 'What’s on your mind about data centers in Oakland?',
    cta: 'Share',
    tone: 'green',
  },
  resource: {
    title: 'Share a resource.',
    sub: 'Articles, videos, documents — anything that helps people understand.',
    placeholder: 'Paste a link, or tell us what it is',
    cta: 'Send to hosts',
    tone: 'green',
  },
};

function Composer() {
  const { composer, closeComposer, submitComposer } = useApp();
  const [text, setText] = useState('');
  useEffect(() => {
    setText('');
    if (!composer) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && closeComposer();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [composer, closeComposer]);
  if (!composer) return null;
  const c = composerCopy[composer];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    submitComposer(text.trim() || 'Something something');
  };
  return (
    <div className="modal-scrim" onClick={closeComposer}>
      <form className={`modal tone-${c.tone}`} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{c.title}</h2>
          <p>{c.sub}</p>
        </div>
        <div className="modal-body">
          <div className="modal-author">
            <Avatar color={C.orange} size={24} /> <b>You</b>
          </div>
          <textarea autoFocus rows={4} placeholder={c.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={closeComposer}>Cancel</button>
            <button type="submit" className={`btn btn-${c.tone}`}>{c.cta}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function Shell() {
  const { pathname } = useLocation();
  const edit = pathname.startsWith('/edit');
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="app">
      <Sidebar edit={edit} open={drawer} onClose={() => setDrawer(false)} />
      <div className="main">
        <TopBar onMenu={() => setDrawer(true)} />
        <main className="stage">
          <Outlet />
        </main>
      </div>
      <Composer />
      <Toast />
      <ScrollRestoration />
    </div>
  );
}
