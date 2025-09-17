const FILTERS = [
  { id: 'all', label: 'All Upcoming' },
  { id: 'today', label: 'Today' },
  { id: 'weekend', label: 'This Weekend' },
];

export default function Filters({ activeFilter, onChange }) {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Quick Filters</h2>
      <div style={styles.buttons}>
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            style={{ ...styles.button, ...(activeFilter === filter.id ? styles.buttonActive : {}) }}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  buttons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.4rem 0.85rem',
    borderRadius: '999px',
    border: '1px solid #cbd5f5',
    backgroundColor: '#fff',
    color: '#1e293b',
    cursor: 'pointer',
  },
  buttonActive: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
};