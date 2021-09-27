<template>
  <div>
    <p v-if="status == 'loading'">Loading profile ...</p>

    <div v-if="status == 'error'">
      <ErrorPage />
    </div>

    <div v-if="status == 'success'" class="profile-ctn">
      <section class="user-info">
        <div class="user-ctn__pp">
          <img v-bind:src="user.avatar" class="profile_picture" />
        </div>
        <div class="user-ctn">
          <div class="user-ctn__info">
            <p class="info__name">{{ user.name }}</p>
            <p class="ladder__level">Ladder Level : {{ user.ladderLevel }}</p>

            <!-- TODO: add edit profile button  -->
            <div class="update-avatar">
              <input
                v-if="isCurrentUser"
                type="file"
                @change="onFileSelected"
              />
              <button v-if="isCurrentUser" @click="onUpload">Upload</button>
            </div>

            <div class="user-interaction">
              <button
                v-if="!isCurrentUser && !isAlreadyFriend"
                @click="onAddFriend"
              >
                add friend
              </button>
            </div>
            <div class="user-interaction">
              <button
                v-if="!isCurrentUser && isAlreadyFriend"
                @click="onDeleteFriend"
              >
                remove friend
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="user-match-history">
        <h1 class="info-header">MATCH HISTORY ></h1>
        <hr />
        <MatchHistory class="matches" :user="user" />
      </section>

      <section class="user-game-info">
        <div class="user-stats">
          <h1 class="info-header">GAME STATS ></h1>
          <hr />
          <GameStats :user="user" />
        </div>
        <!-- TODO: Achievements  -->
        <div class="user-achievements">
          <h1 class="info-header">ACHIEVEMENTS ></h1>
          <hr />
          <Achievements :user="user" />
        </div>
      </section>

      <hr class="separator" />

      <div class="edit-profile" v-if="isCurrentUser">
        <edit-profile-form :user="user" />
      </div>

      <hr class="separator" />
      <div class="google-authenticator" v-if="isCurrentUser">
        <google-authenticator />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useAuth } from '@/composables/auth'

import ErrorPage from '@/components/ErrorPage.vue'

import getFetchUser from '@/composables/User/fetchUser'
import requestStatus from '@/composables/requestStatus'
import { useUsers } from '../../composables/users'
import GameStats from '../../components/game/GameStats.vue'
import MatchHistory from '../../components/game/MatchHistory.vue'
import Achievements from '../../components/game/Achievements.vue'
import { useAxios } from '../../composables/axios'
import getUserInteraction from '@/composables/User/getUserInteraction'
import EditProfileForm from '@/components/edit/EditProfileForm.vue'
import GoogleAuthenticator from '@/components/auth/TwoAuth.vue'
import { useFriends } from '@/composables/Friends/useFriends'

export default {
  components: {
    ErrorPage,
    GameStats,
    MatchHistory,
    EditProfileForm,
    GoogleAuthenticator,
    Achievements,
  },
  setup() {
    let status = ref(requestStatus.loading)

    const route = useRoute()
    const { users, get } = useUsers()
    const { axios } = useAxios()

    const { user, fetchUser } = getFetchUser(status)
    const { addFriend, removeFriend } = getUserInteraction()
    let imageFile = ref('')

    const { reloadFriends, reloadRequests, hasPendingInvite, friends } =
      useFriends()

    const isCurrentUser = computed(() => {
      return user.value!.id == useAuth().user.id
    })

    const fetchUserFromRoute = async () => {
      await get()
      if (!route.params.id) {
        fetchUser(users?.value?.id)
      } else {
        fetchUser(route.params.id)
      }
    }

    const onFileSelected = (event: any) => {
      imageFile.value = event.target.files[0]
    }
    const onUpload = async () => {
      let data = new FormData()
      data.append('file', imageFile.value)
      const res = await axios.post('users/upload', data).catch((err: any) => {
        alert(`${err.response?.data.message}`)
      })
      if (res) {
        user.value = res.data
        console.log(user.value)
      }
    }

    const onAddFriend = async () => {
      await addFriend(user.value!)
      reloadRequests()
      reloadFriends()
    }

    const onDeleteFriend = async () => {
      await removeFriend(user.value!)
      reloadFriends()
    }

    const isAlreadyFriend = computed(() => {
      if (
        friends.value.findIndex((friend) => {
          return friend.id == user.value!.id
        }) != -1 ||
        hasPendingInvite(user.value!)
      ) {
        return true
      }
      return false
    })

    onBeforeRouteUpdate(() => {
      fetchUserFromRoute()
    })
    onMounted(() => {
      fetchUserFromRoute()
    })

    return {
      user,
      status,
      addFriend,
      removeFriend,
      isCurrentUser,
      onFileSelected,
      onUpload,
      isAlreadyFriend,
      onAddFriend,
      onDeleteFriend,
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Inconsolata', monospace;
}

.user-info {
  display: flex;
  margin: 40px;
  margin-top: 0;
}

@media only screen and (max-width: 768px) {
  /* @media only screen and (max-width: 600px) { */
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  .user-game-info {
    flex-direction: column;
    align-items: stretch;
  }
  .user-stats {
    margin: 50px;
  }
  .user-match-history {
    margin: 50px;
  }
}

.profile-ctn {
  display: flex;
  flex-direction: column;
}

.user-ctn {
  /* border: solid 1px red; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* flex: 1; */
}
.user-ctn__pp {
  /* border: solid 1px green; */
  /* flex: 1; */
  margin: auto 0;
}

.user-ctn__info {
  padding: 0 50px;
  text-align: left;
}

.profile_picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

.info__name {
  font-weight: 800;
  font-size: 64px;
  text-transform: capitalize;
  letter-spacing: -1px;
  margin: 20px 0 0;
  color: var(--tertiary-color);
}
.ladder__level {
  padding: 0 0 20px 0;
  color: grey;
}

.user-game-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.separator {
  width: 50%;
  border-top: 2px solid lightgray;
  margin-top: 80px;
}

.info-header {
  /* font-size: 26px; */
  font-size: 16px;
  font-weight: 800;
  padding: 20px;
  text-align: left;
  /* color: var(--secondary-color);
  background-color: #173f5f; */
}

.user-stats,
.user-achievements {
  flex: 1;
  /* border: solid 1px black; */
  margin: 0 30px 20px 30px;
  padding: 20px 50px;
  /* color: var(--secondary-color); */
  /* background-color: var(--tertiary-color); */
  /* background-color: #173f5f; */
  color: var(--tertiary-color);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  height: 60vh;
  overflow: scroll;
}

.user-match-history {
  /* flex: 4; */
  margin: 0 30px 20px 30px;
  padding: 20px 50px;
  color: var(--secondary-color);
  /* background-color: var(--tertiary-color); */
  background-color: #060b1f;
  /* box-shadow: 0 0 50px rgba(0, 0, 0, 0.4); */
  border-radius: 4px;
  /* height: 60vh;
  overflow: scroll; */
}

hr {
  border-top: 0.5px solid white;
  margin: 20px;
  margin-top: 0;
}
</style>
