<template>
  <div class="login">
    <h1>Login with email and password</h1>
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
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    let user = reactive({
      id: 0,
      email: '',
      password: '',
    })

    const store = useStore()

    const login = () => {
      const payload = {
        ...user,
      }
      store.dispatch('login', payload)
    }

    return { login, user }
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
</style>
