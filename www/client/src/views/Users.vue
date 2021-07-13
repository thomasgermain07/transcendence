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
import { fetchUsers } from '../composables/Users/fetchUsers'

export default {
  setup() {
    let loading = ref(true)
    let { users, getUsers } = fetchUsers(loading)

    onMounted(getUsers)

    return {
      users,
      loading,
    }
  },
}
</script>

<style>
.users-list {
  list-style-type: none;
  align-items: center;
}
</style>
