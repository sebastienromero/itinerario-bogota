/**
 * Calcul d'itinéraire vélo via BRouter (profil shortest = distance minimale).
 * Secours : OSRM si BRouter est indisponible.
 */

const BROUTER_URL = 'https://brouter.de/brouter'
const OSRM_URL = 'https://router.project-osrm.org/route/v1/bike'
const BROUTER_PROFILE = 'shortest'

async function routeWithBRouter(from, to) {
  const lonlats = `${from.lon},${from.lat}|${to.lon},${to.lat}`
  const url = `${BROUTER_URL}?lonlats=${encodeURIComponent(lonlats)}&profile=${BROUTER_PROFILE}&format=geojson&alternativeidx=0`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`BRouter ${res.status}`)

  const data = await res.json()
  const feature = data.features?.[0]
  const coords = feature?.geometry?.coordinates
  if (!coords?.length) throw new Error('Aucun itinéraire trouvé')

  return {
    geojson: {
      type: 'Feature',
      geometry: feature.geometry,
      properties: { engine: 'brouter', profile: BROUTER_PROFILE },
    },
    distance: Number(feature.properties['track-length']),
    duration: Number(feature.properties['total-time']),
  }
}

async function routeWithOSRM(from, to) {
  const coords = `${from.lon},${from.lat};${to.lon},${to.lat}`
  const url = `${OSRM_URL}/${coords}?overview=full&geometries=geojson`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`OSRM ${res.status}`)

  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error(data.message || 'Aucun itinéraire trouvé')
  }

  const route = data.routes[0]
  return {
    geojson: {
      type: 'Feature',
      geometry: route.geometry,
      properties: { engine: 'osrm' },
    },
    distance: route.distance,
    duration: route.duration,
  }
}

/**
 * Calcule l'itinéraire vélo le plus court entre deux points.
 * @param {{ lon: number, lat: number }} from
 * @param {{ lon: number, lat: number }} to
 */
export async function calculateRoute(from, to) {
  if (from?.lon == null || from?.lat == null || to?.lon == null || to?.lat == null) {
    throw new Error('Coordonnées départ/arrivée manquantes — choisis une adresse dans la liste')
  }

  try {
    return await routeWithBRouter(from, to)
  } catch (e) {
    console.warn('[Route] BRouter indisponible, secours OSRM:', e.message)
    return routeWithOSRM(from, to)
  }
}
