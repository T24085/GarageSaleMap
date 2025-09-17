export function encodeGeohash(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  return `${lat.toFixed(3)}:${lng.toFixed(3)}`;
}

export function geohashBounds() {
  throw new Error('Implement geohash bounds with geofire-common in a later milestone.');
}