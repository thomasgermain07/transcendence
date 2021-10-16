<template>
  <div>
    <span> Cleaning your session... </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useAuth } from '@/composables/auth'
import { useSocket } from '@/composables/socket'

export default defineComponent({
  name: 'auth-logout',

  setup() {
    const { logout } = useAuth()

    useSocket('dm').close()
    useSocket('chat').close()
    useSocket('user').close()

    logout()

    return {}
  },
})
</script>

<style scoped>
</style>
