<template>
  <div class="users-view">
    <h1>Users List</h1>

    <div v-if="status == 'loading'">Loading content ...</div>

    <div class="users-list">
      <div class="users-item" v-for="user in users" :key="user">
        <router-link :to="{ name: 'user-profile', params: { id: user.id } }">
          {{ user.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'

import getFetchUsers from '@/composables/Users/fetchUsers'
import requestStatus from '@/composables/requestStatus'

export default {
  setup() {
    let status = ref(requestStatus.loading)
    let { users, fetchUsers } = getFetchUsers(status)

    onMounted(fetchUsers)

    return { users, status }
  },
}
</script>

<style scoped>
.users-list {
  list-style-type: none;
  align-items: center;
}
</style>
