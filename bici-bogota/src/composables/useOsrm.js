/**
 * Routing vélo via Valhalla (instance publique OpenStreetMap).
 * Aucune clé API nécessaire.
 * Profil bicycle avec forte préférence pour les pistes cyclables (ciclorutas).
 */

const VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route'

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
 * @returns {{ geojson: GeoJSON.Feature, distance: number, duration: number }}
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
        use_roads: 0.1,           // 0 = éviter les routes, 1 = routes OK
        use_living_streets: 1.0,  // préférer les voies douces
        avoid_bad_surfaces: 0.5,
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
