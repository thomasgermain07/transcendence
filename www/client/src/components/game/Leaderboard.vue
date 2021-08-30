<template>
  <div class="leaderboard">
    <h1>LEADERBOARD</h1>
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <!-- {{ leaderboard }} -->
      <div v-for="user in leaderboard" v-bind:key="user.rank">
        <p>
          <!-- <img :src="user.user_avatar" alt="avatar" /> -->
          Rank: {{ user.rank }}, User: {{ user.user_name }}, Avatar:
          {{ user.user_avatar }}, Ladder: {{ user.user_ladderLevel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAxios } from '../../composables/axios'

export default defineComponent({
  name: 'Leaderboard',

  setup() {
    const { axios } = useAxios()
    const loading = ref(true)
    const leaderboard = ref([])
    const offset = 0
    const limit = 20

    // http://localhost:8080/api/users/leaderboard?offset=0&limit=20
    const fetchLeaderboard = async () => {
      loading.value = true
      const response = await axios
        .get(`users/leaderboard?offset=${offset}&limit=${limit}`)
        .catch((err) => {
          console.log(err)
        })

      if (response) {
        console.log(`Fetching leaderboard, offset: ${offset}, limit: ${limit}`)
        loading.value = false
        leaderboard.value = response.data
      }
    }

    fetchLeaderboard()

    return {
      loading,
      leaderboard,
    }
  },
})
</script>

<style scoped>
.leaderboard {
  background: white;
}
</style>
