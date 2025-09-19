import { useState } from 'react';
import { useForm } from 'react-hook-form';

const defaultValues = {
  title: '',
  description: '',
  address: '',
  state: '',
  zip: '',
  startsAt: '',
  endsAt: '',
  approxUntilLive: false,
};

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const ZIP_CODE_PATTERN = /^\d{5}(?:-?\d{4})?$/;

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
      const result = await onCreate(values);
      let successMessage = 'Sale created! We\'ll add it to the map once the address is located.';
      if (result?.geocoded) {
        successMessage = 'Sale created! It should appear on the map right away.';
      }
      setStatus({ state: 'success', message: successMessage });
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
          Sign in to unlock the form. We only store your UID so you can edit your own sales.
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
          Street address & city
        </label>
        <input
          id="address"
          type="text"
          placeholder="123 Main St, Springfield"
          {...register('address', { required: 'Add a street address and city.' })}
          style={styles.input}
        />
        {errors.address ? <span style={styles.error}>{errors.address.message}</span> : null}
      </div>

      <div style={styles.inlineFields}>
        <div style={{ ...styles.fieldGroup, flex: '1 1 160px' }}>
          <label htmlFor="state" style={styles.label}>
            State
          </label>
          <select
            id="state"
            {...register('state', { required: 'Select a state.' })}
            style={styles.input}
          >
            <option value="">Select a state</option>
            {US_STATES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.state ? <span style={styles.error}>{errors.state.message}</span> : null}
        </div>
        <div style={{ ...styles.fieldGroup, flex: '0 0 140px', minWidth: '120px' }}>
          <label htmlFor="zip" style={styles.label}>
            ZIP code
          </label>
          <input
            id="zip"
            type="text"
            inputMode="numeric"
            placeholder="12345"
            {...register('zip', {
              required: 'Enter a ZIP code.',
              pattern: { value: ZIP_CODE_PATTERN, message: 'Enter a valid ZIP code.' },
            })}
            style={styles.input}
          />
          {errors.zip ? <span style={styles.error}>{errors.zip.message}</span> : null}
        </div>
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
