<template>
  <div class="game-stats">
    <h1>GAME STATS</h1>
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <p>{{ user.id }}</p>
      <br />
      <h4>Duel</h4>
      <p>wins: {{ stats.duel.wins }} - losses: {{ stats.duel.losses }}</p>
      <br />
      <h4>Ladder</h4>
      <p>wins: {{ stats.ladder.wins }} - losses: {{ stats.ladder.losses }}</p>
      <br />
      <h4>Total</h4>
      <p>wins: {{ stats.total_wins }}</p>
      <p>losses: {{ stats.total_losses }}</p>
      <p>played: {{ stats.total_played }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useAxios } from '../../composables/axios'

export default defineComponent({
  name: 'GameStats',
  props: ['user'],

  setup(props) {
    const { axios } = useAxios()
    const loading = ref(true)
    const user = ref(props.user)
    const stats = ref(null)

    const fetchUserStats = async () => {
      loading.value = true
      const response = await axios
        .get(`users/${user.value.id}/stats`)
        .catch((err) => {
          console.log(err)
        })

      if (response) {
        console.log('Fetching stats from user: ' + response.data.user_id)
        loading.value = false
        stats.value = response.data.user_stats
      }
    }

    fetchUserStats()

    watch(
      () => props.user,
      () => {
        user.value = props.user
        fetchUserStats()
      },
    )

    return {
      loading,
      user,
      stats,
    }
  },
})
</script>

<style scoped></style>
