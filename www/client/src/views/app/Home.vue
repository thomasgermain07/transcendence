<template>
  <div class="app-home">
    <p v-if="loading">Loading ...</p>
    <div v-else class="profile-ctn">
      <h1 class="info__name">Welcolme {{ currentUser.name }}</h1>
      <p class="info__general">From now you are available to play pong with others players and try to be on the Leaderboard's top. May the force of the pong be with you!!!</p>
      <router-link :to="{ name: 'game' }" class="link">
        <button class="link__game">Play Now</button>
      </router-link>
    </div>
    <div class="leaderboard">
      <Leaderboard />
      <button @click="reset">reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import Leaderboard from '../../components/game/Leaderboard.vue'
import getFetchUser from '@/composables/User/fetchUser'
import requestStatus from '@/composables/requestStatus'
import ErrorPage from '@/components/ErrorPage.vue'

import getInvitationInteraction from '@/composables/Game/invitationInteraction'
import { useAuth } from '../../composables/auth'
import { UserType } from '../../types/user/user'
import { useUsers } from '../../composables/users'

export default defineComponent({
  name: 'app-home',
  components: { Leaderboard, ErrorPage },

  setup() {
    const loading = ref(true)
    const { users, get } = useUsers()
    get().then(() => {
      loading.value = false
    })
        
    let currentUser = ref<UserType>()

    return {
      status,
      currentUser: users,
      loading,
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
  @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');


.app-home {
  display: flex;
  flex-direction: column;
}

.info__name {
  font-family: "Brush Script MT", cursive;
  font-size: 50px;
  font-weight: 800;
  letter-spacing: -1px;
  padding: 40px;
  text-align: left;
}
.info__general {
  font-family: 'Inconsolata', monospace;
  font-weight: bold;
  font-size: 25px;
  margin: 0 0 30px 40px;
  max-width: 450px;
  text-align: left;
}
.link__game {
  padding: 15px;
  margin: 0 0 20px 40px;
  font-size: 16px;
  font-family: "Press Start 2P", cursive;
  border-radius: 4%;
  cursor: pointer;
  text-align: left;
  float:left;

}

.leaderboard {
  width: 60vw;
  /* height: 80vh; */
  /* overflow: hidden; */
  padding-top: 50px;
  margin: auto;
}
</style>
