let loadPromise = null

function loadGoogleMaps() {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve()
      return
    }
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=es&region=CO`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return loadPromise
}

export async function getPlaceSuggestions(input) {
  if (!input || input.length < 3) return []

  try {
    await loadGoogleMaps()
    const service = new window.google.maps.places.AutocompleteService()

    return new Promise((resolve) => {
      service.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'co' },
          location: new window.google.maps.LatLng(4.711, -74.0721),
          radius: 30000,
        },
        (predictions, status) => {
          const OK = window.google.maps.places.PlacesServiceStatus.OK
          if (status !== OK || !predictions) {
            resolve([])
            return
          }
          resolve(predictions)
        }
      )
    })
  } catch (e) {
    console.error('[Places] erreur:', e)
    return []
  }
}

export async function getPlaceCoords(placeId) {
  await loadGoogleMaps()
  const div = document.createElement('div')
  const service = new window.google.maps.places.PlacesService(div)
  const OK = window.google.maps.places.PlacesServiceStatus.OK

  return new Promise((resolve, reject) => {
    service.getDetails(
      { placeId, fields: ['geometry', 'formatted_address'] },
      (place, status) => {
        if (status !== OK || !place) {
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
}
