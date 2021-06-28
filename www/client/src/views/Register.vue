<template>
  <div class="register">
    <h1>Register</h1>
    <br />
    <div class="register-view">
      <form>
        <input type="text" placeholder="Name" v-model="user.name" />
        <br />
        <input type="text" placeholder="Email" v-model="user.email" />
        <br />
        <input type="password" placeholder="Password" v-model="user.password" />
        <br />
        <!-- <input type="submit" value="login" /> -->
        <button type="button" @click="register()">Register</button>
        <br />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    let user = reactive({
      name: '',
      email: '',
      password: '',
    })

    const store = useStore()

    const register = () => {
      const payload = {
        ...user,
      }
      store.dispatch('register', payload)
    }

    return { register, user }
  },
})
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
}
.form {
  width: 450px;
}
</style>
