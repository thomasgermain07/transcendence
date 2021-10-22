<template>
  <div class="auth-login-form">
    <GoogleAuth v-if="googleCode.visible" @submit="submit"> </GoogleAuth>

    <h3>Authentication</h3>

    <div v-if="message" class="form__error">
      {{ message }}
    </div>
    <form @submit.prevent="submit">
      <div class="form__field">
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          id="email__login"
          v-model="credentials.email"
        />
      </div>
      <div class="form__field">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password__login"
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
import { AxiosErrType } from '@/composables/axios'

export default defineComponent({
  name: 'auth-login-form',
  components: {
    GoogleAuth,
  },
  setup() {
    const message = ref('')
    const credentials = reactive<LoginType>({
      email: '',
      password: '',
    })

    const { login, googleCode } = useAuth()
    const submit = (): void => {
      login(readonly(credentials)).catch((err: AxiosErrType) => {
        message.value = err.response?.data.message
      })
    }

    watch(
      () => googleCode.visible,
      () => {},
    )

    return {
      credentials,
      message,
      googleCode,
      submit,
    }
  },
})
</script>

<style scoped>
.auth-login-form {
  padding: 2em;
  text-align: left;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
}
h3 {
  font-size: 1.5rem;
  margin-bottom: 1em;
}
.form__error {
  color: var(--primary-color);
}
.form__error:last-of-type {
  margin-bottom: 1em;
}
.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  margin-bottom: 1em;
}
</style>
