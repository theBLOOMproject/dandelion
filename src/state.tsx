import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { C } from './data';

export type Vote = 'agree' | 'disagree' | 'unsure';
export type ComposerKind = 'thought' | 'resource';
export type HeroPhoto = { src: string; credit?: string; creditUrl?: string };

const defaultPhoto: HeroPhoto = {
  src: '/images/tribune-tower.jpg',
  credit: 'Photo: Eugene Zelenko, CC BY-SA 4.0',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:USA-Oakland-Tribune_Building_and_Tower-8.jpg',
};

interface AppState {
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

  const value: AppState = {
    following,
    follow: () => !following && setFollow(true),
    toggleFollowing: () => setFollow(!following),
    heroColor,
    setHeroColor,
    heroPhoto,
    setHeroPhoto,
    votes,
    vote: (qid, v) => setVotes((s) => ({ ...s, [qid]: [...(s[qid] ?? []), v] })),
    resetVotes: (qid) => setVotes((s) => ({ ...s, [qid]: [] })),
    rsvps,
    toggleRsvp: (id) => {
      const next = !rsvps[id];
      setRsvps((s) => ({ ...s, [id]: next }));
      showToast(next ? 'You’re registered. See you there!' : 'Registration removed.');
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
