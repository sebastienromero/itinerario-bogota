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
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const showCycling = ref(false)
let mapInstance = null

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
