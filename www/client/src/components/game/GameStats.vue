<template>
  <div class="game-stats">
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <div class="stats-summary-total">
        <div class="matches">
          <p class="stats-header">MATCHES</p>
          <div class="stats-value total-played">{{ stats?.total_played }}</div>
        </div>
        <div class="wins">
          <p class="stats-header">WINS</p>
          <div class="stats-value total-wins">{{ stats?.total_wins }}</div>
        </div>
        <div class="losses">
          <p class="stats-header">LOSSES</p>
          <div class="stats-value total-losses">{{ stats?.total_losses }}</div>
        </div>
        <div class="win-rate">
          <p class="stats-header">WINRATE</p>
          <div class="stats-value win-rate-percent">{{ winsPercent }}%</div>
        </div>
      </div>

      <hr class="separator" />

      <h6>Details per mode</h6>
      <div class="stats-summary-per-mode">
        <div class="stats-duel">
          <h4>Duel</h4>
          <div>
            wins: {{ stats?.duel.wins }} - losses: {{ stats?.duel.losses }}
          </div>
        </div>
        <div class="stats-ladder">
          <h4>Ladder</h4>
          <div>
            wins: {{ stats?.ladder.wins }} - losses: {{ stats?.ladder.losses }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserType } from '@/types/user/user'
import { defineComponent, watch, ref, computed } from 'vue'
import { AxiosErrType, useAxios } from '../../composables/axios'
import { StatsType } from '../../types/game/stats'

export default defineComponent({
  name: 'GameStats',
  props: ['user'],

  setup(props) {
    const { axios } = useAxios()
    const loading = ref<boolean>(true)
    const user = ref<UserType>(props.user)
    const stats = ref<StatsType>({
      user_id: 0,
      duel: {
        wins: 0,
        losses: 0,
      },
      ladder: {
        wins: 0,
        losses: 0,
      },
      total_wins: 0,
      total_losses: 0,
      total_played: 0,
    })

    const winsPercent = computed(() => {
      const percent =
        Math.round((stats?.value?.total_wins / stats?.value?.total_played) * 100)
      if (percent) {
        return percent
      }
      return 0
    })
    const fetchUserStats = async () => {
      loading.value = true
      const response = await axios
        .get(`users/${user.value.id}/stats`)
        .catch((err: AxiosErrType) => {
          console.log(err.response?.data)
        })

      if (response) {
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
      winsPercent,
    }
  },
})
</script>

<style scoped>
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

h6 {
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
