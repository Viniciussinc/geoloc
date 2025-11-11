import * as Location from "expo-location";

// Geocode an address string to { latitude, longitude } using expo-location.
// If expo's geocodeAsync is unavailable or fails (some SDKs removed geocoding),
// we fall back to OpenStreetMap Nominatim (no API key required).
export async function geocodeAddress(address) {
  // try expo-location first
  try {
    if (Location && typeof Location.geocodeAsync === "function") {
      const locations = await Location.geocodeAsync(address);
      if (locations && locations.length > 0) {
        const loc = locations[0];
        return { latitude: loc.latitude, longitude: loc.longitude };
      }
    }
  } catch (err) {
    console.warn("expo Location.geocodeAsync failed:", err?.message || err);
  }

  // Fallback: use OpenStreetMap Nominatim (no API key)
  try {
    const input = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${input}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": "ExpoApp/1.0 (+http://localhost)" } });
    const json = await resp.json();
    if (Array.isArray(json) && json.length > 0) {
      const item = json[0];
      return { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) };
    }
    console.warn("Nominatim returned no results for address:", address);
    return null;
  } catch (err) {
    console.warn("Nominatim fallback failed:", err?.message || err);
    return null;
  }
}

export default geocodeAddress;
