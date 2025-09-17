export default function SaleCard({ sale, onSelect }) {
  if (!sale) {
    return null;
  }

  return (
    <article style={styles.card}>
      <header style={styles.header}>
        <h3 style={styles.title}>{sale.title}</h3>
        <span style={{ ...styles.badge, ...styles[sale.status ?? 'upcoming'] }}>{sale.status ?? 'upcoming'}</span>
      </header>
      <p style={styles.address}>{sale.address ?? 'Address coming soon'}</p>
      {sale.startsAt && sale.endsAt ? (
        <p style={styles.times}>
          {new Date(sale.startsAt).toLocaleString()} — {new Date(sale.endsAt).toLocaleString()}
        </p>
      ) : (
        <p style={styles.times}>Schedule will appear after we sync to Firestore.</p>
      )}
      <button type="button" style={styles.button} onClick={onSelect}>
        View on map
      </button>
    </article>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    backgroundColor: '#f1f5f9',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  title: {
    margin: 0,
    fontSize: '1.05rem',
  },
  address: {
    margin: 0,
    color: '#475569',
  },
  times: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#334155',
  },
  button: {
    alignSelf: 'flex-start',
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    border: '1px solid #ef4444',
    backgroundColor: '#fff',
    color: '#ef4444',
    fontWeight: 600,
    cursor: 'pointer',
  },
  badge: {
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  upcoming: {
    backgroundColor: '#fef3c7',
    color: '#ca8a04',
  },
  live: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  ended: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
};