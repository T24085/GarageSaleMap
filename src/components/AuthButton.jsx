import { useCallback } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function AuthButton({ user, disabled }) {
  const handleSignIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign-in failed', error);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  }, []);

  if (disabled) {
    return <div style={styles.disabled}>Loading…</div>;
  }

  if (!user) {
    return (
      <button type="button" style={styles.button} onClick={handleSignIn}>
        Sign in with Google
      </button>
    );
  }

  return (
    <div style={styles.userRow}>
      <div style={styles.userDetails}>
        <span style={styles.welcome}>Hi, {user.displayName ?? 'garage seller'}!</span>
        <span style={styles.email}>{user.email}</span>
      </div>
      <button type="button" style={styles.signOut} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}

const styles = {
  button: {
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    backgroundColor: '#22c55e',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.1rem',
  },
  welcome: {
    fontWeight: 600,
  },
  email: {
    fontSize: '0.8rem',
    color: '#cbd5f5',
  },
  signOut: {
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    border: '1px solid #cbd5f5',
    background: 'transparent',
    color: '#cbd5f5',
    fontWeight: 500,
    cursor: 'pointer',
  },
  disabled: {
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    backgroundColor: '#1e293b',
    color: '#cbd5f5',
    fontSize: '0.9rem',
  },
};