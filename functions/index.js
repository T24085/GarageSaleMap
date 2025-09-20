import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import admin from 'firebase-admin';
import { geohashForLocation } from 'geofire-common';
import crypto from 'node:crypto';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const { FieldValue } = admin.firestore;

const MAPTILER_BASE_URL = 'https://api.maptiler.com/geocoding';

export const onSaleCreate = onDocumentCreated('sales/{saleId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.warn('onSaleCreate triggered without snapshot data.');
    return;
  }

  const sale = snapshot.data();
  if (!sale) {
    console.warn('onSaleCreate: Document has no data.');
    return;
  }

  if (sale.loc?.lat != null && sale.loc?.lng != null) {
    return;
  }

  if (!sale.address) {
    console.warn(`onSaleCreate missing address for sale ${snapshot.id}`);
    return;
  }

  const result = await locateOrGeocode(sale.address);
  if (!result) {
    console.warn(`Geocoding failed for sale ${snapshot.id}`);
    return;
  }

  const update = {
    loc: { lat: result.lat, lng: result.lng },
    geohash: geohashForLocation([result.lat, result.lng]),
    geocodedAt: FieldValue.serverTimestamp(),
  };

  await snapshot.ref.update(update);
});

export const updateStatuses = onSchedule('every 15 minutes', async () => {
  const snapshot = await db.collection('sales').get();
  if (snapshot.empty) {
    return;
  }

  const now = new Date();
  const updates = [];

  snapshot.forEach((doc) => {
    const sale = doc.data();
    const startsAt = toDate(sale.startsAt);
    const endsAt = toDate(sale.endsAt);
    const desiredStatus = determineStatus(now, startsAt, endsAt);

    if (desiredStatus && desiredStatus !== sale.status) {
      updates.push({ ref: doc.ref, status: desiredStatus });
    }
  });

  if (updates.length === 0) {
    return;
  }

  await commitInChunks(updates, 400);
});

async function locateOrGeocode(address) {
  const cacheId = cacheKey(address);
  const cacheRef = db.collection('geocache').doc(cacheId);
  const cached = await cacheRef.get();

  if (cached.exists) {
    const data = cached.data();
    if (typeof data?.lat === 'number' && typeof data?.lng === 'number') {
      return { lat: data.lat, lng: data.lng, fromCache: true };
    }
  }

  const geocoded = await geocodeAddress(address);
  if (!geocoded) {
    return null;
  }

  await cacheRef.set(
    {
      address,
      lat: geocoded.lat,
      lng: geocoded.lng,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { ...geocoded, fromCache: false };
}

async function geocodeAddress(address) {
  const key = process.env.MAPTILER_KEY;
  if (!key) {
    console.warn('Missing MapTiler API key. Set MAPTILER_KEY in functions config.');
    return null;
  }

  const url = `${MAPTILER_BASE_URL}/${encodeURIComponent(address)}.json?key=${key}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`MapTiler geocoding failed: ${response.status} ${response.statusText}`);
    return null;
  }

  const payload = await response.json();
  const [lng, lat] = payload?.features?.[0]?.center ?? [];

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.warn(`MapTiler geocoding returned no usable center for ${address}`);
    return null;
  }

  return { lat, lng };
}

async function commitInChunks(updates, size) {
  for (let i = 0; i < updates.length; i += size) {
    const batch = db.batch();
    updates.slice(i, i + size).forEach((item) => {
      batch.update(item.ref, {
        status: item.status,
        statusUpdatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  }
}

function cacheKey(input) {
  return crypto.createHash('sha1').update(input.toLowerCase()).digest('hex');
}

function toDate(value) {
  if (!value) {
    return null;
  }
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  return new Date(value);
}

function determineStatus(now, startsAt, endsAt) {
  if (!startsAt || !endsAt) {
    return 'upcoming';
  }
  if (now < startsAt) {
    return 'upcoming';
  }
  if (now > endsAt) {
    return 'ended';
  }
  return 'live';
}