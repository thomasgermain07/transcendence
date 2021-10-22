<template>
  <div class="app-home">
    <div class="profile-ctn">
      <h1 class="neonText">Welcome {{ user.name }}</h1>
      <div class="info__general">
        <p>
          Play pong against others players and try to be on the Leaderboard's
          top.
        </p>
        <p>May the force of the pong be with you!!!</p>
      </div>
      <router-link :to="{ name: 'game' }" class="link">
        <button class="link__game">Play Now</button>
      </router-link>
    </div>
    <div v-if="user.first_log" class="user-edit">
      <edit-profile-window v-on:closeWindow="closeEdit" />
    </div>
    <div class="leaderboard">
      <Leaderboard v-if="is_authenticated" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Leaderboard from '../../components/game/Leaderboard.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import EditProfileWindow from '@/components/edit/EditProfileWindow.vue'

import { useAuth } from '../../composables/auth'

export default defineComponent({
  name: 'app-home',
  components: { Leaderboard, ErrorPage, EditProfileWindow },

  setup() {
    const { user, is_authenticated, edit } = useAuth()

    const closeEdit = async (): Promise<void> => await edit({ first_log: false });

    return {
      user,
      is_authenticated,
      closeEdit,
    }
  },
})
</script>

<style scoped>
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
  font-family: 'Electrolize', sans-serif;
  text-transform: capitalize;
  text-align: left;
  color: #fff;
  letter-spacing: 1px;
  padding: 40px;
  text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff,
    0 0 42px hsl(224, 99%, 54%), 0 0 82px hsl(224, 99%, 54%),
    0 0 92px hsl(224, 99%, 54%), 0 0 102px hsl(224, 99%, 54%),
    0 0 151px hsl(224, 99%, 54%);
}

body {
  font-size: 18px;
  font-family: 'Electrolize', sans-serif;
  background-color: #010a01;
  display: column;
  text-align: left;
}

h1,
h2 {
  text-align: left;
  font-weight: 400;
}

h1 {
  font-size: 50px;
  animation: pulsate 1.5s infinite alternate;
}

@keyframes pulsate {
  100% {
    text-shadow: 0 0 4px rgb(49, 45, 45), 0 0 11px rgb(49, 45, 45),
      0 0 19px rgb(49, 45, 45), 0 0 40px hsl(224, 99%, 54%),
      0 0 80px hsl(224, 99%, 54%), 0 0 90px hsl(224, 99%, 54%),
      0 0 100px hsl(224, 99%, 54%), 0 0 150px hsl(224, 99%, 54%);
  }

  0% {
    text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff,
      0 0 10px hsl(224, 99%, 54%), 0 0 45px hsl(224, 99%, 54%),
      0 0 55px hsl(224, 99%, 54%), 0 0 70px hsl(224, 99%, 54%),
      0 0 80px hsl(224, 99%, 54%);
  }
}
.info__general {
  font-family: 'Changa', sans-serif;
  line-height: 110%;
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
  font-family: 'Press Start 2P', cursive;
  border-radius: 4%;
  cursor: pointer;
  text-align: left;
  float: left;
  text-decoration: none;
  background-color: hsla(240, 100%, 4%, 0.718);
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--secondary-color);
  text-shadow: 0 0 7px #005678, 0 0 10px #005678, 0 0 21px #005678,
    0 0 42px #005678, 0 0 82px #005678;
  border: 3px double #005678;
  border-radius: 4px;
  -webkit-box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
    5px 5px 15px 5px rgba(255, 139, 253, 0);
  box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
    5px 5px 15px 5px rgba(255, 139, 253, 0);
}
.link__game:hover {
  border-color: var(--secondary-color);
  transform: translate(0.25em, 5%);
  box-shadow: 0 0 0 2px pink, 0 0 pink;
  text-shadow: none;
}

.leaderboard {
  width: 60vw;
  padding-top: 50px;
  margin: auto;
}

.user-edit {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80vw;
  max-width: 800px;
  max-height: 100%;
  padding: 0 20px;
  transform: translate(-50%, -50%);
  overflow: scroll;
  background-color: rgb(231, 234, 238);
  color: black;
  line-height: 130%;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.9);
  border-radius: 2px;
  z-index: 100;
}
</style>
