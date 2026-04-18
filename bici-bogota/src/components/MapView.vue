<template>
  <div id="map">
    <div class="toggle-wrap">
      <span class="toggle-label">Ciclorutas</span>
      <button class="toggle-switch" :class="{ on: showCycling }" @click="toggleCycling">
        <span class="toggle-thumb"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useRouteStore } from '../stores/route.js'

const showCycling = ref(false)
let mapInstance = null

const store = useRouteStore()
let markerDepart = null
let markerArrivee = null

function makeMarker(color) {
  const el = document.createElement('div')
  el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);`
  return el
}

watch(() => store.depart, (place) => {
  if (!mapInstance) return
  markerDepart?.remove()
  if (!place) return
  markerDepart = new maplibregl.Marker({ element: makeMarker('#2e7d32') })
    .setLngLat([place.lon, place.lat])
    .addTo(mapInstance)
  mapInstance.flyTo({ center: [place.lon, place.lat], zoom: 15, duration: 800 })
})

watch(() => store.arrivee, (place) => {
  if (!mapInstance) return
  markerArrivee?.remove()
  if (!place) return
  markerArrivee = new maplibregl.Marker({ element: makeMarker('#c62828') })
    .setLngLat([place.lon, place.lat])
    .addTo(mapInstance)
  mapInstance.flyTo({ center: [place.lon, place.lat], zoom: 15, duration: 800 })
})

// Tracé de l'itinéraire
watch(() => store.routeGeojson, (geojson) => {
  if (!mapInstance) return

  // Supprimer tracé précédent si existe
  if (mapInstance.getLayer('route-layer')) mapInstance.removeLayer('route-layer')
  if (mapInstance.getSource('route')) mapInstance.removeSource('route')
  if (!geojson) return

  mapInstance.addSource('route', { type: 'geojson', data: geojson })
  mapInstance.addLayer({
    id: 'route-layer',
    type: 'line',
    source: 'route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#1565c0', 'line-width': 5, 'line-opacity': 0.85 },
  })

  // Recentrer la carte sur le tracé
  const coords = geojson.geometry.coordinates
  const lngs = coords.map(c => c[0])
  const lats = coords.map(c => c[1])
  mapInstance.fitBounds(
    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
    { padding: 80, duration: 1000 }
  )
})

function toggleCycling() {
  if (!mapInstance.getLayer('cycling-layer')) return
  showCycling.value = !showCycling.value
  mapInstance.setLayoutProperty('cycling-layer', 'visibility', showCycling.value ? 'visible' : 'none')
}

onMounted(async () => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: [-74.0721, 4.711],
    zoom: 13,
    antialias: true,
    fadeDuration: 0,
    localIdeographFontFamily: 'sans-serif',
    maxZoom: 18,
  })
  mapInstance = map

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    // Ciclorutas
    map.addSource('cycling', {
      type: 'geojson',
      data: '/ciclorutas.geojson',
    })
    map.addLayer({
      id: 'cycling-layer',
      type: 'line',
      source: 'cycling',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
      paint: { 'line-color': '#000000', 'line-width': 1.5, 'line-opacity': 0.85 },
    })

    // Labels de rues plus lisibles (une seule fois)
    map.getStyle().layers.forEach((layer) => {
      if (layer.type !== 'symbol') return
      const id = layer.id.toLowerCase()
      const sourceLayer = (layer['source-layer'] ?? '').toLowerCase()
      const isStreetLabel =
        id.includes('road') || id.includes('street') || id.includes('transport') ||
        sourceLayer.includes('road') || sourceLayer.includes('transport')
      if (isStreetLabel) {
        map.setLayerZoomRange(layer.id, 10, 24)
        map.setLayoutProperty(layer.id, 'text-size', 13)
        map.setPaintProperty(layer.id, 'text-color', '#1a1a1a')
        map.setPaintProperty(layer.id, 'text-halo-color', '#ffffff')
        map.setPaintProperty(layer.id, 'text-halo-width', 2)
      }
    })
  })
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
  height: 100dvh; /* exclut les barres UI sur iOS Safari */
  position: relative;
  /* Force GPU compositing sur Safari iOS */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;
}

.toggle-wrap {
  position: absolute;
  top: 10px;
  right: 50px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Mobile : juste sous le panneau de recherche */
@media (max-width: 767px) {
  .toggle-wrap {
    top: 120px;
    right: 10px;
    bottom: auto;
  }
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  white-space: nowrap;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.25s;
  padding: 0;
}

.toggle-switch.on {
  background: #16a34a;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: left 0.25s;
}

.toggle-switch.on .toggle-thumb {
  left: 23px;
}
</style>
