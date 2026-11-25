import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { C } from './data';

export type Vote = 'agree' | 'disagree' | 'unsure';
export type ComposerKind = 'thought' | 'resource';
export type AuthField = 'email' | 'zip';
export type Account = { email: string; zip?: string };
/** What the sign-in modal should ask for, and what to do once it's done. */
export type AuthRequest = { fields: AuthField[]; title: string; sub: string; cta?: string; onDone(): void };
export type HeroPhoto = { src: string; credit?: string; creditUrl?: string };

const defaultPhoto: HeroPhoto = {
  src: '/images/three-sisters.jpg',
  credit: 'Photo: Ken Lund, CC BY-SA 2.0',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:The_Three_Sisters,_Oregon_(1291724866).jpg',
};

interface AppState {
  account: Account | null;
  userColor: string;
  setUserColor(c: string): void;
  auth: AuthRequest | null;
  /** Run `onDone` now if the account already has these fields; otherwise ask for them first. */
  requireAuth(req: AuthRequest): void;
  completeAuth(data: Partial<Account>): void;
  cancelAuth(): void;
  signOut(): void;
  following: boolean;
  follow(): void;
  toggleFollowing(): void;
  heroColor: string;
  setHeroColor(c: string): void;
  heroPhoto: HeroPhoto | null;
  setHeroPhoto(p: HeroPhoto | null): void;
  votes: Record<string, Vote[]>;
  vote(qid: string, v: Vote): void;
  resetVotes(qid: string): void;
  rsvps: Record<string, boolean>;
  toggleRsvp(id: string): void;
  lastThought: string | null;
  composer: ComposerKind | null;
  openComposer(k: ComposerKind): void;
  closeComposer(): void;
  submitComposer(text: string): void;
  toast: string | null;
  showToast(msg: string): void;
  doneTasks: Record<string, boolean>;
  completeTask(id: string): void;
  /** The task the home page last showed as active, so it can animate the advance on return. */
  seenTask: string | null;
  setSeenTask(id: string | null): void;
  /** Identity questions the host has turned on (asked in the share flow). */
  identityOn: string[];
  toggleIdentity(id: string): void;
  /** The participant's demographic answers, by identity question id. */
  demographics: Record<string, string>;
  setDemographic(id: string, value: string | null): void;
}

const Ctx = createContext<AppState | null>(null);

const toastFor: Record<ComposerKind, string> = {
  thought: 'Thanks — your thought was shared with neighbors.',
  resource: 'Resource sent to the hosts for review.',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [userColor, setUserColor] = useState(C.orange);
  const [auth, setAuth] = useState<AuthRequest | null>(null);
  const [following, setFollowing] = useState(false);
  const [heroColor, setHeroColor] = useState(C.navy);
  const [heroPhoto, setHeroPhoto] = useState<HeroPhoto | null>(defaultPhoto);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});
  const [lastThought, setLastThought] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerKind | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});
  const [seenTask, setSeenTask] = useState<string | null>(null);
  const [identityOn, setIdentityOn] = useState<string[]>(['party', 'tech']);
  const [demographics, setDemographics] = useState<Record<string, string>>({});
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const setFollow = (next: boolean) => {
    setFollowing(next);
    showToast(next ? 'You’re following this campaign.' : 'You unfollowed this campaign.');
  };

  const requireAuth = (req: AuthRequest) => {
    const missing = req.fields.filter((f) => !account?.[f]);
    if (account && missing.length === 0) req.onDone();
    else setAuth({ ...req, fields: account ? missing : req.fields });
  };

  const followGated = () =>
    requireAuth({
      fields: ['email'],
      title: 'Follow this campaign',
      sub: 'Get updates when there’s news, a new question, or an event near you.',
      cta: 'Follow',
      onDone: () => setFollow(true),
    });

  const value: AppState = {
    account,
    userColor,
    setUserColor,
    auth,
    requireAuth,
    completeAuth: (data) => {
      const req = auth;
      setAccount((a) => ({ ...a, ...data }) as Account);
      setAuth(null);
      req?.onDone();
    },
    cancelAuth: () => setAuth(null),
    signOut: () => {
      setAccount(null);
      showToast('Signed out.');
    },
    following,
    follow: () => !following && followGated(),
    toggleFollowing: () => (following ? setFollow(false) : followGated()),
    heroColor,
    setHeroColor,
    heroPhoto,
    setHeroPhoto,
    votes,
    vote: (qid, v) => setVotes((s) => ({ ...s, [qid]: [...(s[qid] ?? []), v] })),
    resetVotes: (qid) => setVotes((s) => ({ ...s, [qid]: [] })),
    rsvps,
    toggleRsvp: (id) => {
      const set = (next: boolean) => {
        setRsvps((s) => ({ ...s, [id]: next }));
        showToast(next ? 'You’re registered. See you there!' : 'Registration removed.');
      };
      if (rsvps[id]) return set(false);
      requireAuth({
        fields: ['email'],
        title: 'Register for this event',
        sub: 'We’ll send you a confirmation and a reminder the day before.',
        cta: 'Register',
        onDone: () => set(true),
      });
    },
    lastThought,
    composer,
    openComposer: setComposer,
    closeComposer: () => setComposer(null),
    submitComposer: (text) => {
      if (composer === 'thought') setLastThought(text);
      if (composer) showToast(toastFor[composer]);
      setComposer(null);
    },
    toast,
    showToast,
    doneTasks,
    completeTask: (id) => setDoneTasks((s) => ({ ...s, [id]: true })),
    seenTask,
    setSeenTask,
    identityOn,
    toggleIdentity: (id) => setIdentityOn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    demographics,
    setDemographic: (id, value) =>
      setDemographics((s) => {
        const next = { ...s };
        if (value) next[id] = value;
        else delete next[id];
        return next;
      }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}
