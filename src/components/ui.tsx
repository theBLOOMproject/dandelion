import type { CSSProperties, ReactNode } from 'react';
import { C, isLight } from '../data';
import { useApp } from '../state';

/** User avatar placeholder: colored circle with a simple person glyph. */
export function Avatar({ color = C.orange, size = 20, className = '' }: { color?: string; size?: number; className?: string }) {
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size, background: color }} aria-hidden>
      {size >= 16 && (
        <svg viewBox="0 0 20 20">
          <circle cx="10" cy="8.2" r="3.3" />
          <path d="M3.6 19c.9-3.7 3.5-5.6 6.4-5.6s5.5 1.9 6.4 5.6z" />
        </svg>
      )}
    </span>
  );
}

/** Icon placeholder: a plain dot. */
export function Dot({ color = C.navy, size = 20, style }: { color?: string; size?: number; style?: CSSProperties }) {
  return <span className="dot" style={{ width: size, height: size, background: color, ...style }} aria-hidden />;
}

export function AvatarStack({ colors = [C.orange, C.orangeLight, C.green] }: { colors?: string[] }) {
  return (
    <span className="avatar-stack">
      {colors.map((c, i) => (
        <Avatar key={i} color={c} size={12} />
      ))}
    </span>
  );
}

type Stat = { value: number; label: string };

/** 999 → "999", 2431 → "2.4k" */
export function formatStat(n: number) {
  return n > 999 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

type HeaderProps = {
  eyebrow?: string;
  title: string;
  stats?: Stat[];
  top?: ReactNode;
  small?: boolean;
};

/** The colored header card. `vt` marks it as the persistent page hero for view transitions. */
function Header({ eyebrow, title, stats, top, small, color, vt, className = '' }: HeaderProps & { color: string; vt?: boolean; className?: string }) {
  const fg = isLight(color) ? C.navy : '#fff';
  return (
    <div className={`header ${className}`} style={{ background: color, color: fg }}>
      {top && <div className="header-top">{top}</div>}
      <div className="header-row">
        <div className="header-text" style={vt ? { viewTransitionName: 'hero-text' } : undefined}>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className={small ? 'small' : ''}>{title}</h1>
        </div>
        {stats && (
          <div className="stats" style={vt ? { viewTransitionName: 'hero-stats' } : undefined}>
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{formatStat(s.value)}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero(props: HeaderProps) {
  const { heroColor } = useApp();
  return <Header {...props} color={heroColor} vt className="hero" />;
}

/** A subpage card that slides up over the (slightly shrunk) page hero. */
export function Sheet({ color, children, ...head }: HeaderProps & { color: string; children: ReactNode }) {
  const { heroColor } = useApp();
  return (
    <div className="sheet-wrap">
      <div className="sheet-peek" style={{ background: heroColor }} />
      <div className="sheet">
        <Header {...head} color={color} />
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  return (
    <div className={`toast ${toast ? 'show' : ''}`} role="status">
      {toast}
    </div>
  );
}
