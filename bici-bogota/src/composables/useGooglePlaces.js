/**
 * Recherche d'adresses gratuite via le géocodeur public ArcGIS.
 */

const ARCGIS_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
const BOGOTA_BOUNDS = '-74.25,4.55,-73.95,4.85'
const resultsCache = new Map()

export async function getPlaceSuggestions(input) {
  const query = input?.trim()
  if (!query) return []
  if (resultsCache.has(query)) return resultsCache.get(query)

  const params = new URLSearchParams({
    SingleLine: `${query}, Bogotá, Colombia`,
    searchExtent: BOGOTA_BOUNDS,
    countryCode: 'COL',
    category: 'Address,POI',
    maxLocations: '5',
    f: 'json',
  })
  const response = await fetch(`${ARCGIS_URL}/findAddressCandidates?${params}`)
  if (!response.ok) throw new Error(`ArcGIS ${response.status}`)

  const results = (await response.json()).candidates
    .filter((result) => result.location && result.score >= 70)
    .map((result, index) => ({
      place_id: `${result.location.x},${result.location.y},${index}`,
      description: result.address,
      lat: result.location.y,
      lon: result.location.x,
  }))
  resultsCache.set(query, results)
  return results
}

export async function getPlaceCoords(placeId) {
  for (const results of resultsCache.values()) {
    const result = results.find((item) => item.place_id === String(placeId))
    if (result) {
      return { label: result.description, lat: result.lat, lon: result.lon }
    }
  }
  throw new Error('Adresse introuvable')
}

export async function reverseGeocode(lon, lat) {
  try {
    const params = new URLSearchParams({
      location: `${lon},${lat}`,
      f: 'json',
    })
    const response = await fetch(`${ARCGIS_URL}/reverseGeocode?${params}`)
    if (!response.ok) throw new Error(`ArcGIS ${response.status}`)
    const result = await response.json()
    return result.address?.LongLabel || `Point (${lat.toFixed(5)}, ${lon.toFixed(5)})`
  } catch (error) {
    console.warn('[Geocode] ArcGIS:', error.message)
    return `Point (${lat.toFixed(5)}, ${lon.toFixed(5)})`
  }
}
