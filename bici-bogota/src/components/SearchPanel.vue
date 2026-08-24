<template>
  <div class="search-bar">
    <div class="search-inputs">
      <div class="inputs-col">
        <SearchInput
          icon="📍"
          placeholder="Départ"
          v-model="store.depart"
        />
        <div class="search-divider"></div>
        <SearchInput
          icon="🏁"
          placeholder="Arrivée"
          v-model="store.arrivee"
        />
      </div>
      <button class="swap-btn" @click="store.swap()" title="Inverser départ et arrivée">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
          <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      </button>
    </div>

    <button class="location-btn" :disabled="locating" @click="useMyLocation">
      <span>{{ locating ? '⏳ Recherche de la position…' : '📍 Utiliser ma position comme départ' }}</span>
    </button>

    <!-- Bouton calculer (toujours visible, désactivé si incomplet) -->
    <button
      class="go-btn"
      :disabled="store.loading || !store.depart || !store.arrivee"
      @click="onCalculer"
    >
      <span v-if="store.loading">⏳ Calcul en cours…</span>
      <span v-else>🚴 Calculer l'itinéraire</span>
    </button>

    <!-- Résultat distance + durée -->
    <div v-if="store.distance !== null" class="route-info">
      <span>📏 {{ formatDistance(store.distance) }}</span>
      <span class="sep">·</span>
      <span>⏱ {{ formatDuration(store.duration) }}</span>
    </div>
  </div>
</template>

<script setup>
import SearchInput from './SearchInput.vue'
import { useRouteStore } from '../stores/route.js'
import { calculateRoute } from '../composables/useOsrm.js'
import { reverseGeocode } from '../composables/useGooglePlaces.js'
import { ref } from 'vue'

const store = useRouteStore()
const locating = ref(false)

function useMyLocation() {
  if (!navigator.geolocation) {
    alert('La géolocalisation n’est pas disponible sur cet appareil.')
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const label = await reverseGeocode(coords.longitude, coords.latitude)
    store.setDepart({ label, lat: coords.latitude, lon: coords.longitude })
    locating.value = false
  }, (error) => {
    console.error('[Geolocation]', error)
    alert('Impossible d’obtenir ta position. Autorise la géolocalisation puis réessaie.')
    locating.value = false
  }, { enableHighAccuracy: true, timeout: 10000 })
}

async function onCalculer() {
  if (!store.depart || !store.arrivee) return
  store.loading = true
  store.clearRoute()
  try {
    const result = await calculateRoute(store.depart, store.arrivee)
    store.routeGeojson = result.geojson
    store.distance = result.distance
    store.duration = result.duration
  } catch (e) {
    console.error('[Route]', e)
    alert('Impossible de calculer l\'itinéraire. Réessaie.')
  } finally {
    store.loading = false
  }
}

function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}

function formatDuration(s) {
  const min = Math.round(s / 60)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const r = min % 60
  return r ? `${h}h${r.toString().padStart(2, '0')}` : `${h}h`
}
</script>

<style scoped>
.search-bar {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inputs-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.search-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  width: 100%;
  background: transparent;
  color: #222;
}

.search-input::placeholder {
  color: #aaa;
}

.search-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 28px;
}

.location-btn {
  width: 100%;
  padding: 8px;
  border: 1px solid #c8e6c9;
  border-radius: 9px;
  background: #f1f8e9;
  color: #2e7d32;
  font-size: 13px;
  cursor: pointer;
}

.location-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.swap-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #e0e0e0;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: background 0.15s, color 0.15s;
}

.swap-btn:hover {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #a5d6a7;
}

.swap-btn:active {
  background: #c8e6c9;
}

.go-btn {
  width: 100%;
  padding: 10px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.go-btn:hover:not(:disabled) { background: #1b5e20; }
.go-btn:disabled { opacity: 0.6; cursor: default; }

.route-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #f1f8e9;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #2e7d32;
}

.sep { color: #aaa; }
</style>
