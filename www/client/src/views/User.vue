<template>
  <div class="user">
    <h1>This is the User page</h1>
    <p>loading? {{ loading }}</p>
    <div v-if="!loading">
      <p>isAuth? {{ auth }}</p>
      <p>Hello {{ userStore.name }}</p>
      <p>Email {{ userStore.email }}</p>
      <p>Id {{ userStore.id }}</p>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()

    const loading = computed(() => store.state.auth.loading)
    const auth = computed(() => localStorage.getItem('auth'))
    const userStore = computed(() => store.state.user)

    return { userStore, auth, loading }
  },
})
</script>
