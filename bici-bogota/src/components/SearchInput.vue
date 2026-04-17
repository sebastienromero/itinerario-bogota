<template>
  <div class="search-input-root" ref="rootEl">
    <div class="search-input-wrap">
      <span class="search-icon">{{ icon }}</span>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        autocomplete="off"
        @input="onInput"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        @keydown.enter.prevent="selectActive"
        @keydown.escape="close"
        @focus="onFocus"
      />
      <button v-if="query" class="clear-btn" @click="clear" title="Effacer">✕</button>
    </div>


    <ul v-if="open && suggestions.length" class="suggestions">
      <li
        v-for="(s, i) in suggestions"
        :key="s.place_id"
        :class="{ active: i === activeIdx }"
        @mousedown.prevent="select(s)"
      >
        <span class="sug-icon">📌</span>
        <span class="sug-label">{{ s.description }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getPlaceSuggestions, getPlaceCoords } from '../composables/useGooglePlaces.js'

const props = defineProps({
  icon: { type: String, default: '📍' },
  placeholder: { type: String, default: '' },
  modelValue: { type: Object, default: null }, // { label, lon, lat }
})

const emit = defineEmits(['update:modelValue'])

const query = ref(props.modelValue?.label ?? '')
const suggestions = ref([])
const open = ref(false)
const activeIdx = ref(-1)
const rootEl = ref(null)
let debounceTimer = null

watch(() => props.modelValue, (val) => {
  query.value = val?.label ?? ''
})

function onInput() {
  activeIdx.value = -1
  clearTimeout(debounceTimer)
  if (query.value.length < 3) {
    suggestions.value = []
    open.value = false
    return
  }
  debounceTimer = setTimeout(fetchSuggestions, 350)
}

async function fetchSuggestions() {
  suggestions.value = await getPlaceSuggestions(query.value)
  open.value = suggestions.value.length > 0
}

async function select(s) {
  query.value = s.description
  open.value = false
  suggestions.value = []
  try {
    const place = await getPlaceCoords(s.place_id)
    emit('update:modelValue', place)
  } catch (e) {
    console.error('[select]', e)
  }
}

function clear() {
  query.value = ''
  suggestions.value = []
  open.value = false
  emit('update:modelValue', null)
}

function close() {
  open.value = false
}

function onFocus() {
  if (suggestions.value.length) open.value = true
}

function moveDown() {
  if (!open.value) return
  activeIdx.value = Math.min(activeIdx.value + 1, suggestions.value.length - 1)
}

function moveUp() {
  activeIdx.value = Math.max(activeIdx.value - 1, 0)
}

function selectActive() {
  if (activeIdx.value >= 0) select(suggestions.value[activeIdx.value])
}
</script>

<style scoped>
.search-input-root {
  position: relative;
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

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
}

.clear-btn:hover {
  color: #555;
}

.suggestions {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 100;
  max-height: 220px;
  overflow-y: auto;
}

.suggestions li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  line-height: 1.3;
}

.suggestions li:hover,
.suggestions li.active {
  background: #f1f8e9;
}

.sug-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.sug-label {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
