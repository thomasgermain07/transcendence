<template>
  <div class="app">
    <NavigationBar />
    <router-view></router-view>
    <FriendList />
  </div>
</template>

<script lang="ts">
import NavigationBar from './components/NavigationBar.vue'
import FriendList from './components/FriendWindow.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
    FriendList,
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
