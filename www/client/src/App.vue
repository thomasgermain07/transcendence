<template>
  <div id="app">
    <NavigationBar
      v-if="!unprotectedRoutes.includes(route.path)"
    ></NavigationBar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import Menu from './components/Menu/MenuWindow.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
    Menu,
  },
  setup() {
    const route = useRoute()
    const unprotectedRoutes = ['/login', '/register', '/auth/marvin/callback']

    return { route, unprotectedRoutes }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  position: relative;
}
</style>
