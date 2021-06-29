<template>
  <h1>UserProfile</h1>
  <router-link to="/users">Back</router-link>

  <p v-if="loading">Loading profile ...</p>

  <div v-if="!loading" id="user-profile">
    <h2>{{ user.nickname }}</h2>
    <h3>Point : {{ user.point }}</h3>
    <img v-bind:src="user.profile_picture" class="profile_picture" />
  </div>

  <button @click="add_friend">add friend</button>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    let route = useRoute()
    let user = ref()
    let loading = ref(true)

    const getUser = async () => {
      axios
        .get(
          `https://60d5fd1b943aa60017768d55.mockapi.io/api/users/${route.params.id}`, // TODO : link api
        )
        .then((res) => {
          user.value = res.data
          loading.value = false
        })
    }

    onMounted(getUser)

    return {
      user,
      loading,
      getUser,
    }
  },
  methods: {
    add_friend() {
      // Todo : send request to api
      console.log('sending friend request')
    },
  },
}
</script>

<style>
.profile_picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}
</style>
