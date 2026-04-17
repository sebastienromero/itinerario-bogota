<template>
  <div class="app-layout">
    <MapView />
    <div class="panel-overlay">
      <SearchPanel />
    </div>
  </div>
</template>

<script setup>
import MapView from './components/MapView.vue'
import SearchPanel from './components/SearchPanel.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

.app-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* Panneau flottant en haut à gauche */
.panel-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  width: calc(100% - 32px);
  max-width: 360px;
}

/* Desktop : panneau plus compact, carte visible */
@media (min-width: 768px) {
  .panel-overlay {
    top: 20px;
    left: 20px;
    width: 340px;
  }
}
</style>
