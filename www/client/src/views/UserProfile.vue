<template>
  <h1>UserProfile</h1>
  <router-link to="/users">Back</router-link>

  <p v-if="loading">Loading profile ...</p>

  <div v-if="!loading" id="user-profile">
    <h2>{{ user.name }}</h2>
    <h3>Point : {{ user.point }}</h3>
    <img v-bind:src="user.profile_picture" class="profile_picture" />
  </div>

  <button @click="addFriend">add friend</button>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUser } from '../composables/User/fetchUser'

export default {
  setup() {
    let route = useRoute()
    let loading = ref(true)

    const { user, getUser } = fetchUser(route.params.id as string, loading)

    const addFriend = () => {
      console.log('sending friend request')
    }

    onMounted(getUser)

    return {
      user,
      loading,
      getUser,
      addFriend,
    }
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
