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
  </div>
</template>

<script setup>
import SearchInput from './SearchInput.vue'
import { useRouteStore } from '../stores/route.js'

const store = useRouteStore()
</script>

<style scoped>
.search-bar {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  padding: 8px 12px;
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
</style>
