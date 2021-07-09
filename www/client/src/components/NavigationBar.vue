<template>
  <div>
    <ul class="navigation">
      <li class="section">
        <router-link to="/" class="link">Home</router-link>
      </li>
      <li class="section">
        <router-link to="/game" class="link">Game</router-link>
      </li>
      <li class="section">
        <router-link to="/user" class="link">User</router-link>
      </li>
      <li class="section">
        <router-link to="/chat" class="link">Chat</router-link>
      </li>
      <li class="section">
        <div class="link" @click="logout">Logout</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'NavigationBar',
  setup() {
    const store = useStore()

    const logout = () => {
      // console.log("in logout");
      store.dispatch('logout')
    }
    return { logout }
  },
})
</script>

<style>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-color: grey;
}

.section {
  float: left;
}

.link {
  display: block;
  color: white;
  padding: 8px;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.link:hover {
  background-color: black;
}
</style>
