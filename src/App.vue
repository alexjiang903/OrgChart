<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import OrgChart from './OrgChart.vue'

// I got this from: https://vuejs.org/guide/scaling-up/routing#simple-routing-from-scratch
// Import *.vue components here, acts as root of application. (skeleton)

const routes = {
  '/': Home,
  '/orgchart': OrgChart
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="#/" style="background-color: aquamarine;">Home </a> |
  <a href="#/orgchart" style="background-color: aquamarine;">View Org Chart</a>
  <component :is="currentView" />
</template>