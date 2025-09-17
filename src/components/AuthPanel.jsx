import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signOut } from 'firebase/auth';
import { auth, registerWithEmail, signInWithEmail } from '../firebase';

const defaultValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function AuthPanel({ user, disabled }) {
  const [mode, setMode] = useState('signin');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues });

  if (disabled) {
    return <div style={styles.disabled}>Loading…</div>;
  }

  if (user) {
    return (
      <div style={styles.signedInBox}>
        <div style={styles.userMeta}>
          <span style={styles.welcome}>Hi, {user.displayName ?? 'garage seller'}!</span>
          <span style={styles.email}>{user.email}</span>
        </div>
        <button
          type="button"
          style={styles.signOut}
          onClick={async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Sign-out failed', error);
            }
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: 'loading', message: 'Processing…' });
    clearErrors('confirmPassword');

    try {
      if (mode === 'register') {
        if (values.password.length < 6) {
          setError('password', { message: 'Password must be at least 6 characters.' });
          setStatus({ state: 'idle', message: '' });
          return;
        }
        if (values.password !== values.confirmPassword) {
          setError('confirmPassword', { message: 'Passwords do not match.' });
          setStatus({ state: 'idle', message: '' });
          return;
        }
        await registerWithEmail(values.email, values.password, values.displayName);
        setStatus({ state: 'success', message: 'Account created! You are signed in.' });
      } else {
        await signInWithEmail(values.email, values.password);
        setStatus({ state: 'success', message: 'Signed in successfully.' });
      }
      reset(defaultValues);
    } catch (error) {
      setStatus({ state: 'error', message: error.message ?? 'Unable to authenticate.' });
    }
  });

  return (
    <div style={styles.authCard}>
      <div style={styles.modeToggle}>
        <button
          type="button"
          style={{ ...styles.modeButton, ...(mode === 'signin' ? styles.modeButtonActive : {}) }}
          onClick={() => {
            setMode('signin');
            setStatus({ state: 'idle', message: '' });
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          style={{ ...styles.modeButton, ...(mode === 'register' ? styles.modeButtonActive : {}) }}
          onClick={() => {
            setMode('register');
            setStatus({ state: 'idle', message: '' });
          }}
        >
          Register
        </button>
      </div>

      <form style={styles.form} onSubmit={onSubmit}>
        {mode === 'register' ? (
          <div style={styles.fieldGroup}>
            <label htmlFor="displayName" style={styles.label}>
              Name
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Jane Seller"
              {...register('displayName')}
              style={styles.input}
            />
          </div>
        ) : null}

        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required.' })}
            style={styles.input}
          />
          {errors.email ? <span style={styles.error}>{errors.email.message}</span> : null}
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required.' })}
            style={styles.input}
          />
          {errors.password ? <span style={styles.error}>{errors.password.message}</span> : null}
        </div>

        {mode === 'register' ? (
          <div style={styles.fieldGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              {...register('confirmPassword', { required: 'Confirm your password.' })}
              style={styles.input}
            />
            {errors.confirmPassword ? (
              <span style={styles.error}>{errors.confirmPassword.message}</span>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          style={styles.submit}
          disabled={status.state === 'loading'}
        >
          {mode === 'register' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      {status.state === 'error' ? <p style={styles.error}>{status.message}</p> : null}
      {status.state === 'success' ? <p style={styles.success}>{status.message}</p> : null}
    </div>
  );
}

const styles = {
  disabled: {
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    backgroundColor: '#1e293b',
    color: '#cbd5f5',
    fontSize: '0.9rem',
  },
  signedInBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  userMeta: {
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
  authCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1.25rem',
    borderRadius: '0.75rem',
    backgroundColor: '#1e293b',
    color: '#fff',
    gap: '0.85rem',
  },
  modeToggle: {
    display: 'flex',
    gap: '0.5rem',
  },
  modeButton: {
    flex: 1,
    padding: '0.4rem 0.75rem',
    borderRadius: '999px',
    border: '1px solid #334155',
    backgroundColor: 'transparent',
    color: '#cbd5f5',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modeButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
    color: '#0f172a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e2e8f0',
  },
  input: {
    padding: '0.55rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #475569',
    fontSize: '0.95rem',
    color: '#0f172a',
  },
  submit: {
    padding: '0.55rem 1.1rem',
    alignSelf: 'flex-start',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#22c55e',
    color: '#0f172a',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    color: '#fca5a5',
    fontSize: '0.85rem',
    margin: 0,
  },
  success: {
    color: '#bbf7d0',
    fontSize: '0.85rem',
    margin: 0,
  },
};