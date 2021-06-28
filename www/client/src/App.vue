<template>
  <div id="app">
    <NavigationBar
      v-if="!unprotectedRoutes.includes(route.path)"
    ></NavigationBar>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import NavigationBar from './components/NavigationBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavigationBar,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const unprotectedRoutes = ['/login', '/register']

    onBeforeMount(() => {
      store.dispatch('checkAuth')
    })

    return { route, unprotectedRoutes }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
