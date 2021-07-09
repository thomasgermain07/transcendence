<template>
  <div class="login">
    <h1>TRANSCENDENCE</h1>
    <br />
    <div>
      <a class="marvin" :href="url">Signin with 42</a>
    </div>
    <br />
    <h1>OR</h1>
    <h3>Login with email and password</h3>
    <div class="login-view">
      <form>
        <input type="text" placeholder="Email" v-model="user.email" />
        <br />
        <input type="password" placeholder="Password" v-model="user.password" />
        <br />
        <button type="button" @click="login()">Log in</button>
        <br />
      </form>
    </div>
    <p>Need an account?</p>
    <router-link to="/register">Register here</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    const query = {
      client_id: import.meta.env.VITE_FT_ID,
      redirect_uri: import.meta.env.VITE_FT_CALLBACK_URL,
      response_type: 'code',
      scope: 'public',
    }

    const url = ref(
      'https://api.intra.42.fr/oauth/authorize?' +
        Object.entries(query)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&'),
    )

    // For email/password login
    let user = reactive({
      id: 0,
      email: '',
      password: '',
    })

    const login = () => {
      const payload = {
        ...user,
      }
      store.dispatch('login', payload)
    }

    return { login, user, url }
  },
})
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
}
.form {
  width: 450px;
}

a.marvin {
  font-size: 1rem;
  background-color: #2c3e50;
  color: white;
  padding: 1em 1.5em;
  text-decoration: none;
}
a.marvin:hover {
  background-color: rgb(179, 178, 178);
  cursor: pointer;
}
</style>
