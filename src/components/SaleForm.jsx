import { useState } from 'react';
import { useForm } from 'react-hook-form';

const defaultValues = {
  title: '',
  description: '',
  address: '',
  startsAt: '',
  endsAt: '',
  approxUntilLive: false,
};

export default function SaleForm({ disabled, onCreate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ state: 'loading', message: 'Submitting…' });
    try {
      await onCreate(values);
      setStatus({ state: 'success', message: 'Sale created! It will appear after geocoding runs.' });
      reset(defaultValues);
    } catch (error) {
      setStatus({ state: 'error', message: error.message || 'Something went wrong.' });
    }
  });

  if (disabled) {
    return (
      <div style={styles.disabledBox}>
        <p style={styles.disabledTitle}>Sign in to post a sale</p>
        <p style={styles.disabledCopy}>
          Sign in with Google to unlock the form. We only store your UID so you can edit your own sales.
        </p>
      </div>
    );
  }

  return (
    <form style={styles.form} onSubmit={onSubmit}>
      <div style={styles.fieldGroup}>
        <label htmlFor="title" style={styles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Neighborhood block sale"
          {...register('title', { required: 'Add a name for your sale.' })}
          style={styles.input}
        />
        {errors.title ? <span style={styles.error}>{errors.title.message}</span> : null}
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="description" style={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          placeholder="Optional details, featured items, etc."
          rows={3}
          {...register('description')}
          style={{ ...styles.input, resize: 'vertical' }}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="address" style={styles.label}>
          Address
        </label>
        <input
          id="address"
          type="text"
          placeholder="123 Main St, Springfield, IL"
          {...register('address', { required: 'Add an address so shoppers can find you.' })}
          style={styles.input}
        />
        {errors.address ? <span style={styles.error}>{errors.address.message}</span> : null}
      </div>

      <div style={styles.inlineFields}>
        <div style={styles.fieldGroup}>
          <label htmlFor="startsAt" style={styles.label}>
            Starts
          </label>
          <input
            id="startsAt"
            type="datetime-local"
            {...register('startsAt', { required: 'Pick a start date & time.' })}
            style={styles.input}
          />
          {errors.startsAt ? <span style={styles.error}>{errors.startsAt.message}</span> : null}
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="endsAt" style={styles.label}>
            Ends
          </label>
          <input
            id="endsAt"
            type="datetime-local"
            {...register('endsAt', { required: 'Pick an end date & time.' })}
            style={styles.input}
          />
          {errors.endsAt ? <span style={styles.error}>{errors.endsAt.message}</span> : null}
        </div>
      </div>

      <label style={styles.toggleRow}>
        <input type="checkbox" {...register('approxUntilLive')} />
        <span>Hide exact location until the sale goes live</span>
      </label>

      <button type="submit" style={styles.submit} disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Submitting…' : 'Post sale'}
      </button>

      {status.state === 'success' ? <p style={styles.success}>{status.message}</p> : null}
      {status.state === 'error' ? <p style={styles.error}>{status.message}</p> : null}
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    border: '1px solid #cbd5f5',
    backgroundColor: '#f8fafc',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1,
  },
  label: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#1e293b',
  },
  input: {
    padding: '0.55rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5f5',
    fontSize: '0.95rem',
  },
  inlineFields: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  submit: {
    alignSelf: 'flex-start',
    padding: '0.55rem 1.1rem',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    color: '#b91c1c',
    fontSize: '0.85rem',
  },
  success: {
    color: '#16a34a',
    fontSize: '0.85rem',
  },
  disabledBox: {
    border: '1px dashed #cbd5f5',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    backgroundColor: '#f8fafc',
  },
  disabledTitle: {
    margin: '0 0 0.35rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  disabledCopy: {
    margin: 0,
    color: '#475569',
    fontSize: '0.95rem',
  },
};