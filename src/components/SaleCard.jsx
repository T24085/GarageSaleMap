function formatDateTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function buildDirectionsUrl(sale) {
  if (sale?.loc?.lat != null && sale?.loc?.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${sale.loc.lat},${sale.loc.lng}`;
  }
  if (sale?.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sale.address)}`;
  }
  return null;
}

const statusLabel = {
  upcoming: 'Upcoming',
  live: 'Live',
  ended: 'Ended',
};

export default function SaleCard({ sale, onSelect }) {
  if (!sale) {
    return null;
  }

  const start = formatDateTime(sale.startsAt);
  const end = formatDateTime(sale.endsAt);
  const directionsUrl = buildDirectionsUrl(sale);
  const label = statusLabel[sale.status] ?? 'Upcoming';

  return (
    <article style={styles.card}>
      <header style={styles.header}>
        <h3 style={styles.title}>{sale.title}</h3>
        <span style={{ ...styles.badge, ...styles[sale.status ?? 'upcoming'] }}>{label}</span>
      </header>
      <p style={styles.address}>{sale.address ?? 'Address coming soon'}</p>
      {start && end ? (
        <p style={styles.times}>
          {start} – {end}
        </p>
      ) : (
        <p style={styles.times}>Schedule pending.</p>
      )}
      <div style={styles.actions}>
        <button type="button" style={styles.button} onClick={onSelect}>
          View on map
        </button>
        {directionsUrl ? (
          <a href={directionsUrl} target="_blank" rel="noreferrer" style={styles.link}>
            Directions
          </a>
        ) : null}
      </div>
    </article>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
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
  actions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  button: {
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    border: '1px solid #ef4444',
    backgroundColor: '#fff',
    color: '#ef4444',
    fontWeight: 600,
    cursor: 'pointer',
  },
  link: {
    fontSize: '0.9rem',
    color: '#1d4ed8',
    textDecoration: 'none',
    fontWeight: 600,
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