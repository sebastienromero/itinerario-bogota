/**
 * Routing vélo via GraphHopper.
 * Profils : bike (sécurisé/équilibré), racingbike (rapide)
 * Clé API gratuite requise — 500 req/jour
 * https://graphhopper.com/dashboard/
 */

const GH_URL = 'https://graphhopper.com/api/1/route'
const GH_KEY = import.meta.env.VITE_GH_KEY

// Véhicules GraphHopper par mode
// bike        : profil vélo standard, préfère les pistes cyclables (cycleways)
// mtb         : vélo tout-terrain, préfère les chemins (encore plus sur les pistes)
// racingbike  : vélo de route, distance minimale
export const ROUTE_MODES = {
  securise:  { vehicle: 'mtb' },
  equilibre: { vehicle: 'bike' },
  court:     { vehicle: 'racingbike' },
}

/**
 * Calcule un itinéraire vélo entre deux points via GraphHopper.
 * GraphHopper retourne des coordonnées GeoJSON directement (points: true).
 * @param {{ lon: number, lat: number }} from
 * @param {{ lon: number, lat: number }} to
 * @param {'securise'|'equilibre'|'court'} mode
 */
export async function calculateRoute(from, to, mode = 'equilibre') {
  const { vehicle } = ROUTE_MODES[mode] ?? ROUTE_MODES.equilibre

  const params = new URLSearchParams({
    point: `${from.lat},${from.lon}`,
    key: GH_KEY,
    vehicle,
    locale: 'fr',
    points_encoded: 'false', // coordonnées GeoJSON directement
  })
  // Deux points → deux paramètres 'point' (URLSearchParams n'accepte pas les doublons)
  params.append('point', `${to.lat},${to.lon}`)

  const res = await fetch(`${GH_URL}?${params}`)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`GraphHopper ${res.status}: ${err?.message ?? res.statusText}`)
  }

  const data = await res.json()
  const path = data?.paths?.[0]
  if (!path) throw new Error('Aucun itinéraire trouvé')

  // GraphHopper retourne déjà un GeoJSON LineString avec points_encoded=false
  const coords = path.points.coordinates // [[lon, lat], ...]

  return {
    geojson: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    },
    distance: path.distance,     // mètres
    duration: path.time / 1000,  // ms → secondes
  }
}
