<template>
  <div class="app">
    <NavigationBar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavigationBar from './components/NavigationBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavigationBar,
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
