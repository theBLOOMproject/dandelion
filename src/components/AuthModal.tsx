import { useEffect, useState, type FormEvent } from 'react';
import { C } from '../data';
import { useApp, type AuthField } from '../state';
import { Avatar } from './ui';

const USER_COLORS = [C.orange, C.orangeLight, C.green, C.teal, C.blue, C.pink, C.navy];

type Mode = 'create' | 'login' | 'more';

/**
 * Sign-in / create-account modal. Asks only for the fields the triggering action needs
 * (e.g. Follow → email; Share → email + zip). Demo only: nothing is verified or stored.
 */
export function AuthModal() {
  const { auth, account, completeAuth, cancelAuth, userColor, setUserColor } = useApp();
  const [mode, setMode] = useState<Mode>('create');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (!auth) return;
    // Already signed in but missing a field (e.g. zip) → just ask for that.
    setMode(account ? 'more' : 'create');
    setEmail('');
    setZip('');
    const h = (e: KeyboardEvent) => e.key === 'Escape' && cancelAuth();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  if (!auth) return null;

  // Logging in only needs your email; we'd already have the rest.
  const fields: AuthField[] = mode === 'login' ? ['email'] : auth.fields;
  const creating = mode === 'create';

  const cycleColor = () => setUserColor(USER_COLORS[(USER_COLORS.indexOf(userColor) + 1) % USER_COLORS.length]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    completeAuth({
      ...(fields.includes('email') ? { email: email.trim() } : {}),
      ...(fields.includes('zip') ? { zip: zip.trim() } : {}),
    });
  };

  const cta = mode === 'login' ? 'Log in' : mode === 'more' ? auth.cta ?? 'Continue' : auth.cta ? `Create account & ${auth.cta.toLowerCase()}` : 'Create account';

  return (
    <div className="modal-scrim" onClick={cancelAuth}>
      <form className="modal auth-modal" role="dialog" aria-label={auth.title} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="demo-close auth-close" onClick={cancelAuth} aria-label="Close">
          <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>

        <div className="auth-avatar">
          {creating ? (
            <button type="button" className="auth-avatar-btn" onClick={cycleColor} aria-label="Change your color">
              <Avatar color={userColor} size={104} />
              <span className="auth-avatar-hint">Tap to change color</span>
            </button>
          ) : (
            <Avatar color={mode === 'login' ? '#c9cce6' : userColor} size={104} />
          )}
        </div>

        <h2 className="auth-title">{mode === 'login' ? 'Welcome back' : mode === 'more' ? 'One more thing' : auth.title}</h2>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Log in with the email you used before.'
            : mode === 'more'
              ? 'Add your zip code so hosts can see which neighborhoods are weighing in.'
              : auth.sub}
        </p>

        <div className="auth-fields">
          {fields.includes('email') && (
            <label className="auth-field">
              <span>Email</span>
              <input type="email" required autoFocus autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          )}
          {fields.includes('zip') && (
            <label className="auth-field">
              <span>Zip code</span>
              <input
                required
                autoFocus={!fields.includes('email')}
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="\d{5}"
                maxLength={5}
                placeholder="94612"
                title="5-digit zip code"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              />
            </label>
          )}
        </div>

        <button type="submit" className="btn btn-navy auth-submit">{cta}</button>

        {mode !== 'more' && (
          <p className="auth-switch">
            {creating ? 'Already have an account?' : 'New here?'}{' '}
            <button type="button" className="link-green text-btn" onClick={() => setMode(creating ? 'login' : 'create')}>
              {creating ? 'Log in' : 'Create an account'}
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
