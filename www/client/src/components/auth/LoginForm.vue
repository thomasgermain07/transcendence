<template>
  <div class="auth-login-form">
    <GoogleAuth v-if="googleCode.visible" @submit="submit"> </GoogleAuth>
    <h3>Connect with credentials:</h3>

    <div v-if="message">
      {{ message }}
    </div>
    <form @submit.prevent="submit">
      <div>
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          v-model="credentials.email"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="credentials.password"
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { ref, reactive, readonly } from 'vue'

import { LoginType } from '@/composables/auth'
import { useAuth } from '@/composables/auth'
import GoogleAuth from '@/components/auth/GoogleAuth.vue'

export default defineComponent({
  name: 'auth-login-form',
  components: {
    GoogleAuth,
  },
  setup() {
    const message = ref()
    const credentials = reactive<LoginType>({
      email: '',
      password: '',
    })

    const { login, googleCode } = useAuth()
    const submit = () => {
      login(readonly(credentials)).catch((err) => {
        message.value = err.response?.data.message
      })
    }

    watch(
      () => googleCode.visible,
      () => {},
    )

    return {
      // Datas
      credentials,
      message,
      googleCode,
      // Functions
      submit,
    }
  },
})
</script>

<style scoped>
.auth-login-form {
  background: rgb(63, 187, 125);
}
</style>
