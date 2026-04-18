import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useRouteStore = defineStore('route', () => {
  const depart = ref(null)        // { label, lon, lat }
  const arrivee = ref(null)       // { label, lon, lat }
  const routeGeojson = ref(null)  // GeoJSON Feature LineString
  const distance = ref(null)      // mètres
  const duration = ref(null)      // secondes
  const loading = ref(false)
  const mode = ref('equilibre')   // 'securise' | 'equilibre' | 'court'

  function setDepart(place) { depart.value = place }
  function setArrivee(place) { arrivee.value = place }

  function swap() {
    const tmp = depart.value
    depart.value = arrivee.value
    arrivee.value = tmp
  }

  function clearRoute() {
    routeGeojson.value = null
    distance.value = null
    duration.value = null
  }

  // Effacer l'itinéraire dès qu'une adresse est supprimée
  watch([depart, arrivee], ([d, a]) => {
    if (!d || !a) clearRoute()
  })

  return { depart, arrivee, routeGeojson, distance, duration, loading, mode, setDepart, setArrivee, swap, clearRoute }
})
