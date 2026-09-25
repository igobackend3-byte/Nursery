// Browser geolocation + free reverse-geocoding (OpenStreetMap Nominatim, no
// API key required) so a checkout/address form can auto-fill from the
// user's current location instead of typing everything by hand. Used by
// both the Checkout page and the Account > Addresses form.
export function detectCurrentAddress() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Your browser doesn\'t support location detection.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { Accept: 'application/json' } }
          );
          if (!res.ok) throw new Error('Could not look up your address.');
          const data = await res.json();
          const a = data.address ?? {};

          const line1 = [a.house_number, a.road].filter(Boolean).join(' ') || a.neighbourhood || '';
          const line2 = a.suburb && a.suburb !== line1 ? a.suburb : '';
          const city = a.city || a.town || a.village || a.suburb || '';
          const state = a.state || '';
          const pincode = a.postcode || '';

          if (!line1 && !city) {
            reject(new Error('Couldn\'t determine a precise address for this location - please fill it in manually.'));
            return;
          }

          resolve({ line1, line2, city, state, pincode });
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location access was denied. Please allow it, or fill in the address manually.'));
        } else {
          reject(new Error('Could not detect your location. Please fill in the address manually.'));
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
