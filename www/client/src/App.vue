<template>
  <div class="root">
    <Navigation />

    <span v-if="starting">
      {{ message }}
    </span>
    <router-view v-else />
    <Menu v-if="is_authenticated" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

import Navigation from '@/components/Navigation.vue'
import Menu from '@/components/Menu/MenuWindow.vue'

import { useApp } from '@/composables/app'
import { useAuth } from '@/composables/auth'

export default defineComponent({
  name: 'root',
  components: {
    Navigation,
    Menu,
  },

  setup() {
    const starting = ref(true)
    const message = ref('Starting the application...')

    // Csrf
    const { csrf } = useApp()

    const {
      refresh,
      autoRefresh,
      isPreviouslyAuthenticated,
      is_authenticated,
    } = useAuth()

    csrf().then(async () => {
      // Authentication
      if (isPreviouslyAuthenticated()) {
        message.value = 'Recovering your session...'
        await refresh()
      }

      autoRefresh()

      message.value = 'Done.'
      starting.value = false
    })

    return {
      starting,
      message,
      is_authenticated,
    }
  },
})
</script>

<style>
.root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
</style>
