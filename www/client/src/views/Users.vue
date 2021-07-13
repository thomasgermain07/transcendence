<template>
  <div class="users-view">
    <h1>Users List</h1>

    <div v-if="loading">Loading content ...</div>

    <div class="users-list">
      <div class="users-item" v-for="user in users" :key="user">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

export default {
  setup() {
    let users = ref([])
    let loading = ref(true)

    const getUsers = async () => {
      const { data } = await axios.get('users')
      users.value = data
      loading.value = false
    }

    onMounted(getUsers)

    return {
      users,
      loading,
      getUsers,
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
