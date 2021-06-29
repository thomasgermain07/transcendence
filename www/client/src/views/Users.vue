<template>
  <div class="users-view">
    <h1>Users List</h1>

    <p v-if="loading">Loading content ...</p>

    <ul class="users-list">
      <li v-for="user in users" :key="user">
        <router-link :to="{ name: 'UserProfile', params: { id: user.id } }">
          {{ user.nickname }}
        </router-link>
      </li>
    </ul>
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
      axios
        .get('https://60d5fd1b943aa60017768d55.mockapi.io/api/users') // TODO : Link api
        .then((res) => {
          users.value = res.data
          loading.value = false
        })
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
