<template>
  <div class="users-view">
    <h1>Users List</h1>
    <button @click="printUsers">PrintUsers</button>
    <ul class="users-list">
      <li v-for="user in users" :key="user">
        {{ user.first_name }} - {{ user.last_name }} - {{ user.phone_number }}
      </li>
    </ul>
  </div>
</template>

// https://random-data-api.com/api/users/random_user?size=
<script lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    let users = ref([])
    const getUsers = async () => {
      axios
        .get('https://random-data-api.com/api/users/random_user?size=3') // TODO : Change to our api
        .then((res) => {
          users.value = res.data
        })
    }

    onMounted(getUsers)

    return {
      users,
      getUsers,
    }
  },
}
</script>

<style>
.users-list {
  list-style-type: none;
}
</style>
