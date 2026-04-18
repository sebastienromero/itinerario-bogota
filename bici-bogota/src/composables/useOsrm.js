/**
 * Routing vélo via Valhalla (instance publique OpenStreetMap).
 * Aucune clé API nécessaire.
 * 3 modes : securise (ciclorutas max), equilibre (compromis), court (distance min)
 */

const VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route'

// Paramètres Valhalla par mode
export const ROUTE_MODES = {
  securise:  { use_roads: 0.1, use_living_streets: 1.0, avoid_bad_surfaces: 0.75 },
  equilibre: { use_roads: 0.4, use_living_streets: 0.8, avoid_bad_surfaces: 0.5  },
  court:     { use_roads: 0.8, use_living_streets: 0.5, avoid_bad_surfaces: 0.25 },
}

/**
 * Décode un polyline encodé en précision 6 (format Valhalla).
 * Retourne un tableau de [lon, lat].
 */
function decodePolyline6(encoded) {
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

    coords.push([lng / 1e6, lat / 1e6])
  }
  return coords
}

/**
 * Calcule un itinéraire vélo entre deux points.
 * @param {{ lon: number, lat: number }} from
 * @param {{ lon: number, lat: number }} to
 * @param {'securise'|'equilibre'|'court'} mode
 */
export async function calculateRoute(from, to, mode = 'equilibre') {
  const modeParams = ROUTE_MODES[mode] ?? ROUTE_MODES.equilibre
  const body = {
    locations: [
      { lon: from.lon, lat: from.lat },
      { lon: to.lon,   lat: to.lat   },
    ],
    costing: 'bicycle',
    costing_options: {
      bicycle: {
        bicycle_type: 'Hybrid',
        ...modeParams,
      },
    },
    units: 'km',
  }

  const res = await fetch(VALHALLA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Valhalla ${res.status}`)

  const data = await res.json()
  const leg = data?.trip?.legs?.[0]
  if (!leg) throw new Error('Aucun itinéraire trouvé')

  const coords = decodePolyline6(leg.shape)

  return {
    geojson: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    },
    distance: data.trip.summary.length * 1000, // km → mètres
    duration: data.trip.summary.time,           // secondes
  }
}
