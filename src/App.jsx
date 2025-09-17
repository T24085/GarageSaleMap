import { useMemo, useState } from 'react';
import { isToday, isWithinInterval, nextSaturday, nextSunday, startOfDay, endOfDay } from 'date-fns';
import Filters from './components/Filters.jsx';
import MapView from './components/Map.jsx';
import SaleCard from './components/SaleCard.jsx';

const now = new Date();
const sampleTodayStart = startOfDay(now);
sampleTodayStart.setHours(9, 0, 0, 0);
const sampleTodayEnd = endOfDay(now);
sampleTodayEnd.setHours(15, 0, 0, 0);

const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const sampleTomorrowStart = startOfDay(tomorrow);
sampleTomorrowStart.setHours(8, 30, 0, 0);
const sampleTomorrowEnd = endOfDay(tomorrow);
sampleTomorrowEnd.setHours(14, 0, 0, 0);

const mockSales = [
  {
    id: 'sample-1',
    title: 'Sample Neighborhood Sale',
    address: '123 Main St, Springfield, IL',
    startsAt: sampleTodayStart,
    endsAt: sampleTodayEnd,
    status: 'upcoming',
    loc: { lat: 39.7817, lng: -89.6501 },
  },
  {
    id: 'sample-2',
    title: 'Citywide Garage Treasure Hunt',
    address: '456 Elm St, Austin, TX',
    startsAt: sampleTomorrowStart,
    endsAt: sampleTomorrowEnd,
    status: 'upcoming',
    loc: { lat: 30.2672, lng: -97.7431 },
  },
];

export default function App() {
  const [sales] = useState(mockSales);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState(null);

  const filteredSales = useMemo(() => {
    if (activeFilter === 'today') {
      return sales.filter((sale) => sale.startsAt && isToday(sale.startsAt));
    }

    if (activeFilter === 'weekend') {
      const saturday = startOfDay(nextSaturday(now));
      const sunday = endOfDay(nextSunday(now));
      return sales.filter((sale) => {
        if (!sale.startsAt) {
          return false;
        }
        return isWithinInterval(sale.startsAt, { start: saturday, end: sunday });
      });
    }

    return sales;
  }, [activeFilter, sales]);

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Garage Sales Map</h1>
          <p style={styles.subtitle}>A community map for discovering garage sales nearby.</p>
        </div>
        <div style={styles.authPlaceholder}>Sign in (coming soon)</div>
      </header>
      <main style={styles.main}>
        <section style={styles.leftPane}>
          <Filters activeFilter={activeFilter} onChange={setActiveFilter} />
          <div style={styles.formPlaceholder}>
            <p style={styles.formTitle}>Add Sale</p>
            <p style={styles.formCopy}>
              We will connect this form to Firebase Auth and Firestore in the next milestone. Expect
              inputs for title, description, address, schedule, categories, and privacy.
            </p>
          </div>
          <div style={styles.salesList}>
            {filteredSales.length === 0 ? (
              <p style={styles.emptyState}>No sales match this filter yet.</p>
            ) : (
              filteredSales.map((sale) => (
                <SaleCard key={sale.id} sale={sale} onSelect={() => setSelectedSale(sale)} />
              ))
            )}
          </div>
        </section>
        <section style={styles.mapPane}>
          <MapView sales={filteredSales} selectedSale={selectedSale} />
        </section>
      </main>
    </div>
  );
}

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e2e8f0',
  },
  header: {
    padding: '1.25rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  subtitle: {
    margin: '0.35rem 0 0',
    color: '#cbd5f5',
  },
  authPlaceholder: {
    padding: '0.5rem 0.85rem',
    borderRadius: '999px',
    backgroundColor: '#1e293b',
    fontSize: '0.9rem',
  },
  main: {
    display: 'grid',
    flex: 1,
    gridTemplateColumns: 'minmax(320px, 420px) 1fr',
    minHeight: 0,
  },
  leftPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#fff',
    overflowY: 'auto',
  },
  formPlaceholder: {
    border: '1px dashed #94a3b8',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    backgroundColor: '#f8fafc',
  },
  formTitle: {
    margin: '0 0 0.5rem',
    fontWeight: 600,
  },
  formCopy: {
    margin: 0,
    color: '#475569',
    fontSize: '0.95rem',
  },
  salesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyState: {
    margin: 0,
    color: '#64748b',
    fontStyle: 'italic',
  },
  mapPane: {
    position: 'relative',
    backgroundColor: '#0f172a',
  },
};