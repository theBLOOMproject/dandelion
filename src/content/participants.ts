/**
 * Stable identities for Polis participants. The same author id always gets the
 * same name and avatar color, on every page. Author 0 is the host (seed statements).
 */
export const HOST_ID = 0;

const HOST_COLOR = '#00A779';

/** Participant colors (no host green, so host statements stand out). */
const PALETTE = ['#FF7337', '#FFAA52', '#2E3BB5', '#F82C9F', '#4FE6C4', '#31387D', '#8B5CF6', '#E0A800', '#0EA5E9', '#C2410C'];

/** Integer hash so neighboring ids don't get neighboring colors. */
function mix(n: number) {
  let h = (n + 1) * 2654435761;
  h ^= h >>> 15;
  return Math.abs(h);
}

export type Participant = { id: number; name: string; color: string; isHost: boolean };

export function participant(id: number): Participant {
  if (id === HOST_ID) return { id, name: 'Host', color: HOST_COLOR, isHost: true };
  return { id, name: `Participant ${id}`, color: PALETTE[mix(id) % PALETTE.length], isHost: false };
}
