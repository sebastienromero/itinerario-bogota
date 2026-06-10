/**
 * Autocomplétion d'adresses via Google Places.
 * Charge l'API avec @googlemaps/js-api-loader (importLibrary fiable).
 * Secours : ancienne API si la nouvelle échoue.
 */

import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

let configured = false

function ensureGoogleOptions() {
  if (configured) return
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY
  if (!key) throw new Error('VITE_GOOGLE_MAPS_KEY manquante — crée bici-bogota/.env')
  setOptions({ key, language: 'es', region: 'CO', v: 'weekly' })
  configured = true
}

async function loadPlacesLibrary() {
  ensureGoogleOptions()
  return importLibrary('places')
}

const BOGOTA_BOUNDS = {
  west: -74.25,
  south: 4.55,
  east: -73.95,
  north: 4.85,
}

async function getSuggestionsNew(input) {
  const { AutocompleteSuggestion } = await loadPlacesLibrary()
  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    includedRegionCodes: ['co'],
    locationRestriction: BOGOTA_BOUNDS,
  })
  return suggestions
    .filter((s) => s.placePrediction)
    .map((s) => ({
      place_id: s.placePrediction.placeId,
      description: s.placePrediction.text?.text ?? String(s.placePrediction.text),
    }))
}

async function getSuggestionsLegacy(input) {
  await loadPlacesLibrary()
  const service = new google.maps.places.AutocompleteService()
  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'co' },
        locationBias: {
          west: BOGOTA_BOUNDS.west,
          south: BOGOTA_BOUNDS.south,
          east: BOGOTA_BOUNDS.east,
          north: BOGOTA_BOUNDS.north,
        },
      },
      (predictions, status) => {
        const OK = google.maps.places.PlacesServiceStatus.OK
        resolve(status === OK && predictions ? predictions : [])
      }
    )
  })
}

export async function getPlaceSuggestions(input) {
  if (!input) return []
  try {
    const results = await getSuggestionsNew(input)
    if (results.length) return results
    return getSuggestionsLegacy(input)
  } catch (e) {
    console.warn('[Places] nouvelle API:', e.message)
    try {
      return await getSuggestionsLegacy(input)
    } catch (e2) {
      console.error('[Places] erreur:', e2)
      return []
    }
  }
}

async function getCoordsNew(placeId) {
  const { Place } = await loadPlacesLibrary()
  const place = new Place({ id: placeId })
  await place.fetchFields({ fields: ['location', 'formattedAddress'] })
  if (!place.location) throw new Error('Place details failed')
  return {
    label: place.formattedAddress,
    lat: place.location.lat(),
    lon: place.location.lng(),
  }
}

async function getCoordsLegacy(placeId) {
  await loadPlacesLibrary()
  const div = document.createElement('div')
  div.style.display = 'none'
  document.body.appendChild(div)
  const service = new google.maps.places.PlacesService(div)
  const OK = google.maps.places.PlacesServiceStatus.OK
  try {
    return await new Promise((resolve, reject) => {
      service.getDetails(
        { placeId, fields: ['geometry', 'formatted_address'] },
        (place, status) => {
          if (status !== OK || !place?.geometry?.location) {
            reject(new Error('Place details failed'))
            return
          }
          resolve({
            label: place.formatted_address,
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng(),
          })
        }
      )
    })
  } finally {
    div.remove()
  }
}

export async function getPlaceCoords(placeId) {
  try {
    return await getCoordsNew(placeId)
  } catch (e) {
    console.warn('[Places] détails (nouvelle API):', e.message)
    return getCoordsLegacy(placeId)
  }
}
