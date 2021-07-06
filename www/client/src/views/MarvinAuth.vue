<template>
  <div class="marvin">
    <h1>MARVIN</h1>
    <div>
      <p v-if="state === 'verifying'">Verifying your login...</p>

      <p v-if="state === 'loggedIn'">Welcome! :)</p>

      <p v-if="state === 'error'">Failed to log in :(</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Marvin',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = computed(() => store.state.auth.marvinAuthState)

    onMounted(async () => {
      if (!route.query.code) {
        router.push('/')
        return
      }
      await store.dispatch('loginWith42', route.query.code)
    })

    return { state }
  },
})
</script>