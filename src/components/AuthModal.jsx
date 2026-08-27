import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// mode: 'login' | 'signup' | 'forgot' | 'update'
export default function AuthModal({ open, onClose, initialMode = 'login' }) {
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (!open) return null;

  const reset = (nextMode) => {
    setError('');
    setNotice('');
    setPassword('');
    if (nextMode) setMode(nextMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode !== 'update' && !email.trim()) return setError('Please enter your email.');
    if (mode !== 'forgot' && password.length < 6)
      return setError('Password must be at least 6 characters.');

    setBusy(true);
    try {
      if (mode === 'update') {
        const { error } = await updatePassword(password);
        if (error) setError(error.message);
        else onClose();
      } else if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) setError(error.message);
        else onClose();
      } else if (mode === 'signup') {
        const { error, needsConfirmation } = await signUp(email.trim(), password);
        if (error) setError(error.message);
        else if (needsConfirmation)
          setNotice('Check your inbox, click the confirmation link to finish creating your account.');
        else onClose();
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email.trim());
        if (error) setError(error.message);
        else setNotice('If that email has an account, a password-reset link is on its way.');
      }
    } finally {
      setBusy(false);
    }
  };

  const titles = {
    login: 'Welcome back',
    signup: 'Create your account',
    forgot: 'Reset your password',
    update: 'Set a new password',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ color: 'var(--purple-dark)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 6 }}>
          {titles[mode]}
        </h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: 20 }}>
          {mode === 'login' && 'Log in to access your Nomad account.'}
          {mode === 'signup' && 'One account for all your devices.'}
          {mode === 'forgot' && "Enter your email and we'll send a reset link."}
          {mode === 'update' && 'Choose a new password for your account.'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode !== 'update' && (
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={inputStyle}
            />
          )}
          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              style={inputStyle}
            />
          )}

          {error && <div style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</div>}
          {notice && <div style={{ color: 'var(--purple)', fontSize: '0.85rem', marginBottom: 12 }}>{notice}</div>}

          <button type="submit" disabled={busy} style={btnStyle}>
            {busy
              ? 'Please wait…'
              : mode === 'login' ? 'Log in'
              : mode === 'signup' ? 'Sign up'
              : mode === 'update' ? 'Update password'
              : 'Send reset link'}
          </button>
        </form>

        <div style={{ marginTop: 18, fontSize: '0.85rem', color: 'var(--gray)', textAlign: 'center', lineHeight: 2 }}>
          {mode === 'login' && (
            <>
              <div>
                No account?{' '}
                <button style={linkStyle} onClick={() => reset('signup')}>Sign up</button>
              </div>
              <div>
                <button style={linkStyle} onClick={() => reset('forgot')}>Forgot password?</button>
              </div>
            </>
          )}
          {mode === 'signup' && (
            <div>
              Already have an account?{' '}
              <button style={linkStyle} onClick={() => reset('login')}>Log in</button>
            </div>
          )}
          {mode === 'forgot' && (
            <div>
              <button style={linkStyle} onClick={() => reset('login')}>← Back to log in</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', marginBottom: 12, borderRadius: 12,
  border: '1.5px solid rgba(91,45,142,0.25)', fontSize: '0.95rem', boxSizing: 'border-box',
};
const btnStyle = {
  width: '100%', padding: '13px', borderRadius: 50, border: 'none', cursor: 'pointer',
  background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
  color: 'white', fontWeight: 700, fontSize: '1rem',
};
const linkStyle = {
  background: 'none', border: 'none', color: 'var(--purple)', fontWeight: 600,
  cursor: 'pointer', fontSize: '0.85rem', padding: 0, textDecoration: 'underline',
};
