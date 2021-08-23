<template>
  <div class="match-history">
    <h1>MATCH HISTORY</h1>
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <p>{{ user.id }}</p>
      <!-- {{ matchHistory }} -->
      <div class="match" v-for="match in matchHistory" v-bind:key="match.id">
        <br />
        <h1>-------- MATCH --------</h1>
        <p>mode: {{ match.room.mode }}</p>
        <div
          class="match-players"
          v-for="player in match.room.players"
          v-bind:key="player.id"
        >
          <p>---</p>
          <p>PLAYER: {{ player.position }}</p>
          <p>Score: {{ player.score }}</p>
          <p>Winner: {{ player.winner }}</p>
          <p>User: {{ player.user }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useAxios } from '../../composables/axios'

export default defineComponent({
  name: 'MatchHistory',
  props: ['user'],

  setup(props) {
    const { axios } = useAxios()
    const loading = ref(true)
    const user = ref(props.user)
    const matchHistory = ref([])

    const fetchUserMatchHistory = async () => {
      loading.value = true
      const response = await axios
        .get(`game/players/history/${user.value.id}`)
        .catch((err) => {
          console.log(err)
        })

      if (response) {
        console.log('Fetching match history from user: ' + user.value.id)
        loading.value = false
        matchHistory.value = response.data
      }
    }

    fetchUserMatchHistory()

    watch(
      () => props.user,
      () => {
        user.value = props.user
        fetchUserMatchHistory()
      },
    )

    return {
      loading,
      user,
      matchHistory,
    }
  },
})
</script>

<style scoped></style>
