import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouteStore = defineStore('route', () => {
  const depart = ref(null)   // { label, lon, lat }
  const arrivee = ref(null)  // { label, lon, lat }

  function setDepart(place) {
    depart.value = place
  }

  function setArrivee(place) {
    arrivee.value = place
  }

  function swap() {
    const tmp = depart.value
    depart.value = arrivee.value
    arrivee.value = tmp
  }

  return { depart, arrivee, setDepart, setArrivee, swap }
})
