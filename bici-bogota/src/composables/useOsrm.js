/**
 * Routing via Valhalla (instance publique OpenStreetMap, sans clé API).
 * Profil bicycle avec forte préférence pour les pistes cyclables (ciclorutas).
 */

const VALHALLA_BASE = 'https://valhalla1.openstreetmap.de/route'

/**
 * Décode un polyline encodé Valhalla (précision 6).
 * Retourne un tableau de [lon, lat].
 */
function decodePolyline6(encoded) {
  const coords = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b, shift = 0, result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0
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
 * Calcule un itinéraire vélo entre deux points via Valhalla.
 * Priorité maximale aux pistes cyclables (use_roads: 0.1).
 *
 * @param {{ lon: number, lat: number }} from
 * @param {{ lon: number, lat: number }} to
 * @returns {{ geojson: object, distance: number, duration: number }}
 *   distance en mètres, duration en secondes
 */
export async function calculateRoute(from, to) {
  const body = {
    locations: [
      { lon: from.lon, lat: from.lat },
      { lon: to.lon,   lat: to.lat   },
    ],
    costing: 'bicycle',
    costing_options: {
      bicycle: {
        bicycle_type: 'Hybrid',
        use_roads: 0.1,          // 0 = jamais de route, 1 = routes normales OK
        use_living_streets: 1.0, // préférer les voies douces
        avoid_bad_surfaces: 0.5,
      },
    },
    units: 'km',
  }

  const res = await fetch(VALHALLA_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Valhalla error: ${res.status}`)

  const data = await res.json()
  const leg = data.trip?.legs?.[0]
  if (!leg) throw new Error('No route found')

  const coords = decodePolyline6(leg.shape)

  return {
    geojson: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    },
    distance: data.trip.summary.length * 1000, // km → m
    duration: data.trip.summary.time,           // secondes
  }
}
