import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouteStore = defineStore('route', () => {
  const depart = ref(null)        // { label, lon, lat }
  const arrivee = ref(null)       // { label, lon, lat }
  const routeGeojson = ref(null)  // GeoJSON Feature LineString
  const distance = ref(null)      // mètres
  const duration = ref(null)      // secondes
  const loading = ref(false)

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

  return { depart, arrivee, routeGeojson, distance, duration, loading, setDepart, setArrivee, swap, clearRoute }
})
