<template>
  <div class="game-stats">
    <!-- <h1 class="title">GAME STATS</h1> -->
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <!-- <p>{{ user.id }}</p> -->
      <hr class="separator">

      <div class="stats-summary-total">
        <div class="matches">
          <p class="stats-header">MATCHES</p>
          <div class="stats-value total-played">{{ stats.total_played }}</div>
        </div>
        <div class="wins">
          <p class="stats-header">WINS</p>
          <div class="stats-value total-wins">{{ stats.total_wins }}</div>
        </div>
        <div class="losses">
          <p class="stats-header">LOSSES</p>
          <div class="stats-value total-losses">{{ stats.total_losses }}</div>
        </div>
        <div class="win-rate">
          <p class="stats-header">WINRATE</p>
          <div class="stats-value win-rate-percent"> {{ stats.total_wins / stats.total_played * 100 | 0 }}%</div>
        </div>
      </div>

      <hr class="separator">

      <h3>Details per mode</h3>
      <div class="stats-summary-per-mode">
        <div class="stats-duel">
          <h4>Duel</h4>
          <div>wins: {{ stats.duel.wins }} - losses: {{ stats.duel.losses }}</div>
        </div>
        <div class="stats-ladder">
          <h4>Ladder</h4>
          <div>wins: {{ stats.ladder.wins }} - losses: {{ stats.ladder.losses }}</div>
        </div>
      </div>
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

<style scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap");

* {
  box-sizing: border-box;
  font-family: "Inconsolata", monospace;
} */

/* .title {
  font-size: 26px;
  font-weight: 800;
  padding-bottom: 40px;
} */

.stats-summary-total {
  display: flex;
  justify-content: space-evenly;
  line-height: 40px;
}

.stats-header {
  font-weight: 800;
  letter-spacing: 1px;
}

.stats-value {
  font-size: 40px;
  font-weight: 800;
}

.total-played {
  color: #f6d55c;
}

.total-wins {
  color: #3caea3;
}

.total-losses {
  color: #ed553b;
}

h3 {
  font-weight: 800;
  margin-top: 50px;
  text-transform: uppercase;
}

.stats-summary-per-mode {
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
}

hr {
  border-top: 0.5px solid white;
  margin: 20px;
}
</style>
