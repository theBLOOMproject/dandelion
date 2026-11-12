import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { C } from './data';

export type Vote = 'agree' | 'disagree' | 'unsure';
export type ComposerKind = 'thought' | 'resource';

interface AppState {
  following: boolean;
  follow(): void;
  toggleFollowing(): void;
  heroColor: string;
  setHeroColor(c: string): void;
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
}

const Ctx = createContext<AppState | null>(null);

const toastFor: Record<ComposerKind, string> = {
  thought: 'Thanks — your thought was shared with neighbors.',
  resource: 'Resource sent to the hosts for review.',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState(false);
  const [heroColor, setHeroColor] = useState(C.navy);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});
  const [lastThought, setLastThought] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerKind | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});
  const [seenTask, setSeenTask] = useState<string | null>(null);
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
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}
