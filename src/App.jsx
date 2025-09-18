import { useEffect, useMemo, useState } from 'react';
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { isToday, isWithinInterval, nextSaturday, nextSunday, startOfDay, endOfDay } from 'date-fns';
import Filters from './components/Filters.jsx';
import MapView from './components/Map.jsx';
import SaleCard from './components/SaleCard.jsx';
import SaleForm from './components/SaleForm.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import { auth, db } from './firebase';

function toDate(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  return new Date(value);
}

const ZIP_CODE_PATTERN = /^\d{5}(?:-?\d{4})?$/;

export default function App() {
  const [user, setUser] = useState(null);
  const [authBusy, setAuthBusy] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthBusy(false);
    });
    return unsubscribe;
  }, []);

  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);

  useEffect(() => {
    const now = new Date();
    const salesRef = collection(db, 'sales');
    const q = query(
      salesRef,
      where('endsAt', '>=', Timestamp.fromDate(now)),
      orderBy('endsAt', 'asc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextSales = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startsAt: toDate(data.startsAt),
            endsAt: toDate(data.endsAt),
          };
        });
        setSales(nextSales);
        setSalesLoading(false);
        setSalesError(null);
      },
      (error) => {
        setSalesError(error.message ?? 'Unable to load sales.');
        setSalesLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const filteredSales = useMemo(() => {
    const base = sales.filter((sale) => sale.status !== 'ended');
    if (activeFilter === 'today') {
      return base.filter((sale) => sale.startsAt && isToday(sale.startsAt));
    }
    if (activeFilter === 'weekend') {
      const now = new Date();
      const saturday = startOfDay(nextSaturday(now));
      const sunday = endOfDay(nextSunday(now));
      return base.filter((sale) => {
        if (!sale.startsAt) {
          return false;
        }
        return isWithinInterval(sale.startsAt, { start: saturday, end: sunday });
      });
    }
    return base;
  }, [activeFilter, sales]);

  const selectedSale = useMemo(
    () => filteredSales.find((sale) => sale.id === selectedSaleId) ?? null,
    [filteredSales, selectedSaleId],
  );

  const handleCreateSale = async (values) => {
    if (!user) {
      throw new Error('You must sign in before posting a sale.');
    }

    const startsAtDate = values.startsAt ? new Date(values.startsAt) : null;
    const endsAtDate = values.endsAt ? new Date(values.endsAt) : null;
    const addressLine = values.address ? values.address.trim() : '';
    const state = typeof values.state === 'string' ? values.state.trim().toUpperCase() : '';
    const zipInput = values.zip ? values.zip.trim() : '';

    if (!startsAtDate || Number.isNaN(startsAtDate.getTime())) {
      throw new Error('Select a valid start date/time.');
    }
    if (!endsAtDate || Number.isNaN(endsAtDate.getTime())) {
      throw new Error('Select a valid end date/time.');
    }
    if (endsAtDate <= startsAtDate) {
      throw new Error('End time must be after the start time.');
    }

    if (!addressLine) {
      throw new Error('Add a street address and city.');
    }

    if (!state) {
      throw new Error('Select a state.');
    }

    if (!zipInput || !ZIP_CODE_PATTERN.test(zipInput)) {
      throw new Error('Enter a valid ZIP code.');
    }

    const normalizedZip = zipInput.replace(/\s+/g, '');
    const cleanedAddress = addressLine.replace(/,\s*$/, '');
    const locationLine = `${state} ${normalizedZip}`.trim();
    const fullAddress = cleanedAddress
      ? `${cleanedAddress}, ${locationLine}`.trim()
      : locationLine;

    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      address: fullAddress,
      state,
      zip: normalizedZip,
      startsAt: Timestamp.fromDate(startsAtDate),
      endsAt: Timestamp.fromDate(endsAtDate),
      approxUntilLive: Boolean(values.approxUntilLive),
      status: 'upcoming',
      categories: [],
      photos: [],
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
      loc: null,
      geohash: null,
    };

    await addDoc(collection(db, 'sales'), payload);
  };

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Garage Sales Map</h1>
          <p style={styles.subtitle}>A community map for discovering garage sales nearby.</p>
        </div>
        <AuthPanel user={user} disabled={authBusy} />
      </header>
      <main style={styles.main}>
        <section style={styles.leftPane}>
          <Filters activeFilter={activeFilter} onChange={setActiveFilter} />
          <SaleForm disabled={!user} onCreate={handleCreateSale} />
          <div style={styles.salesSection}>
            <h2 style={styles.sectionHeading}>Upcoming sales</h2>
            {salesError ? <p style={styles.error}>{salesError}</p> : null}
            {salesLoading ? <p style={styles.muted}>Loading sales…</p> : null}
            {!salesLoading && filteredSales.length === 0 ? (
              <p style={styles.muted}>No sales match this filter yet.</p>
            ) : null}
            {filteredSales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                onSelect={() => setSelectedSaleId(sale.id)}
              />
            ))}
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
  main: {
    display: 'grid',
    flex: 1,
    gridTemplateColumns: 'minmax(340px, 420px) 1fr',
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
  mapPane: {
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  salesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.1rem',
  },
  muted: {
    margin: 0,
    color: '#64748b',
    fontStyle: 'italic',
  },
  error: {
    margin: 0,
    color: '#b91c1c',
  },
};