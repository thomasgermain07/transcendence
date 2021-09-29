<template>
  <div class="app-home">
    <!-- <h2>App-Home</h2> -->
    <div class="leaderboard">
      <Leaderboard />
      <button @click="reset">reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Leaderboard from '../../components/game/Leaderboard.vue'

import getInvitationInteraction from '@/composables/Game/invitationInteraction'

export default defineComponent({
  name: 'app-home',
  components: { Leaderboard },

  setup() {
    return {
      reset: () => {
        getInvitationInteraction().deleteInvitation()
      },
    }
  },
})
</script>

<style scoped>
/* .app-home {
		background: rgb(230, 163, 64);
	} */
.leaderboard {
  width: 60vw;
  /* height: 80vh; */
  /* overflow: hidden; */
  margin: auto;
}
</style>
