<template>
  <div>
    <GoogleAuth v-if="googleCode.visible"></GoogleAuth>

    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAuth } from '@/composables/auth'

import GoogleAuth from '@/components/auth/GoogleAuth.vue'
import { AxiosError } from 'axios'

export default defineComponent({
  name: 'auth-login-marvin-callback',
  components: {
    GoogleAuth,
  },
  setup() {
    const route = useRoute()

    const code: string =
      typeof route?.query?.code === 'string' ? route.query.code : ''
    const message = ref('Verifying your login...')

    const { loginMarvin, googleCode } = useAuth()

    loginMarvin(code).catch((err: AxiosError) => {
      message.value = err.response?.data?.message
    })

    return {
      googleCode,
      message,
    }
  },
})
</script>

<style scoped></style>
