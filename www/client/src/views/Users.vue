<template>
  <div class="users-view">
    <h1>Users List</h1>

    <div v-if="loading">Loading content ...</div>

    <div class="users-list">
      <div class="users-item" v-for="user in users" :key="user">
        <router-link :to="{ name: 'UserProfile', params: { id: user.id } }">
          {{ user.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import getFetchUsers from '../composables/Users/fetchUsers'

export default {
  setup() {
    let loading = ref(true)
    let { users, fetchUsers } = getFetchUsers(loading)

    onMounted(fetchUsers)

    return { users, loading }
  },
}
</script>

<style scoped>
.users-list {
  list-style-type: none;
  align-items: center;
}
</style>
