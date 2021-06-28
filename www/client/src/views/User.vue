<template>
  <div class="about">
    <h1>This is the User page</h1>
    <p>isAuth? {{ auth }}</p>
    <p>Hello {{ userStore.name }}</p>
    <p>Email {{ userStore.email }}</p>
    <p>Id {{ userStore.id }}</p>
    <button type="button" @click="getUsers()">Get Users</button>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    const auth = computed(() => store.state.auth.authenticated)
    const userStore = computed(() => store.state.user)

    // Just for tests - Remove later
    const getUsers = () => {
      axios
        .get(`users`)
        .then((response) => {
          console.log(response)
        })
        .catch(() => {
          console.log(err.response.data)
        })
    }

    return { getUsers, userStore, auth }
  },
})
</script>
