<template>
  <div class="app-home">
    <p v-if="loading">Loading ...</p>
    <div v-else class="profile-ctn">
      <link href='https://fonts.googleapis.com/css?family=Sacramento:400' rel='stylesheet' type='text/css'>
      <h1 class="neonText">
        Welcolme {{ currentUser.name }}
      </h1>
      <!-- <h1 class="info__name">{{ currentUser.name }}</h1> -->
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
.profile-ctn {
  background: linear-gradient(
    to bottom,
    rgba(25, 24, 26, 0.562),
    rgba(17, 17, 19, 0.5)
  ),
  url(../../assets/images/logo_size_invert.jpg) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: column;
  margin-bottom: 20px;
}
.neonText {
  text-align: left;
  color: #fff;
  letter-spacing: -1px;
  padding: 40px;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px hsl(224, 99%, 54%),
    0 0 82px hsl(224, 99%, 54%),
    0 0 92px hsl(224, 99%, 54%),
    0 0 102px hsl(224, 99%, 54%),
    0 0 151px hsl(224, 99%, 54%);
    
}
  
body {
  font-size: 18px;
  font-family: "Sacramento", sans-serif;
  background-color: #010a01;
  display: column;
  /* justify-content: center; */
  /* align-items: left;   */
  text-align: left;
}  

h1, h2 {
  /* text-align: center; */
  text-align: left;
  font-weight: 400;
}
  
h1 {
  font-size: 50px;
  animation: pulsate 1.5s infinite alternate;  
  /* border: 0.2rem solid #fff;
  border-radius: 2rem; */
  /* padding: 0.4em; */
  /* padding-right: 50%; */
  /* box-shadow: 0 0 .2rem #fff,
            0 0 .2rem #fff,
            0 0 2rem #bc13fe,
            0 0 0.8rem #bc13fe,
            0 0 2.8rem #bc13fe,
            inset 0 0 1.3rem #bc13fe;  */
}

@keyframes pulsate {
    
  100% {

      text-shadow:
      0 0 4px rgb(49, 45, 45),
      0 0 11px rgb(49, 45, 45),
      0 0 19px rgb(49, 45, 45),
      0 0 40px hsl(224, 99%, 54%),
      0 0 80px hsl(224, 99%, 54%),
      0 0 90px hsl(224, 99%, 54%),
      0 0 100px hsl(224, 99%, 54%),
      0 0 150px hsl(224, 99%, 54%);
  
  }
  
  0% {

    text-shadow:
    0 0 2px #fff,
    0 0 4px #fff,
    0 0 6px #fff,
    0 0 10px hsl(224, 99%, 54%),
    0 0 45px hsl(224, 99%, 54%),
    0 0 55px hsl(224, 99%, 54%),
    0 0 70px hsl(224, 99%, 54%),
    0 0 80px hsl(224, 99%, 54%);
  }
}
.info__general {
  font-family: 'Inconsolata', monospace;
  font-weight: bold;
  font-size: 25px;
  margin: 0 0 30px 40px;
  max-width: 450px;
  text-align: left;
  color: var(--secondary-color);
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
  text-decoration: none;
  background-color: hsla(240, 100%, 4%, 0.718);
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--secondary-color);
  text-shadow: 0 0 7px #005678, 0 0 10px #005678, 0 0 21px #005678, 0 0 42px #005678, 0 0 82px #005678; 
  border: 3px double #005678;
  border-radius: 4px;
  -webkit-box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000, 5px 5px 15px 5px rgba(255,139,253,0); 
  box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000, 5px 5px 15px 5px rgba(255,139,253,0);

}
.link__game:hover {
  border-color: var(--secondary-color);
  transform: translate(0.25em, 5%);
  box-shadow: 0 0 0 2px pink, 0 0 pink;
  text-shadow: none;
}

.leaderboard {
  width: 60vw;
  /* height: 80vh; */
  /* overflow: hidden; */
  padding-top: 50px;
  margin: auto;
}
</style>
