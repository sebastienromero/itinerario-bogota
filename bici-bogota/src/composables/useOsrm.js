/**
 * Routing vélo via OpenRouteService (ORS).
 * Profils : cycling-safe (sécurisé), cycling-regular (équilibré), cycling-road (court/rapide)
 * Clé API gratuite requise — 2000 req/jour
 * https://openrouteservice.org
 */

const ORS_URL = 'https://api.openrouteservice.org/v2/directions'
const ORS_KEY = import.meta.env.VITE_ORS_KEY

// Profils ORS par mode
// cycling-mountain : préfère les chemins et pistes hors route (le plus proche de "sécurisé")
// cycling-regular  : équilibre sécurité / distance
// cycling-road     : préfère les routes rapides (distance min)
// Note: cycling-safe est déprécié sur l'API publique ORS
export const ROUTE_MODES = {
  securise:  { profile: 'cycling-mountain' },
  equilibre: { profile: 'cycling-regular' },
  court:     { profile: 'cycling-road' },
}

/**
 * Décode un polyline encodé en précision 5 (format ORS/Google).
 * Retourne un tableau de [lon, lat].
 */
function decodePolyline5(encoded) {
  const coords = []
  let index = 0, lat = 0, lng = 0

  while (index < encoded.length) {
    let b, shift = 0, result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0; result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    coords.push([lng / 1e5, lat / 1e5])
  }
  return coords
}

/**
 * Calcule un itinéraire vélo entre deux points via ORS.
 * @param {{ lon: number, lat: number }} from
 * @param {{ lon: number, lat: number }} to
 * @param {'securise'|'equilibre'|'court'} mode
 */
export async function calculateRoute(from, to, mode = 'equilibre') {
  const { profile } = ROUTE_MODES[mode] ?? ROUTE_MODES.equilibre

  const body = {
    coordinates: [
      [from.lon, from.lat],
      [to.lon,   to.lat],
    ],
    units: 'km',
  }

  const res = await fetch(`${ORS_URL}/${profile}/json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ORS_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`ORS ${res.status}: ${err?.error?.message ?? res.statusText}`)
  }

  const data = await res.json()
  const route = data?.routes?.[0]
  if (!route) throw new Error('Aucun itinéraire trouvé')

  const coords = decodePolyline5(route.geometry)
  const summary = route.summary

  return {
    geojson: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    },
    distance: summary.distance * 1000, // km → mètres
    duration: summary.duration,        // secondes
  }
}
