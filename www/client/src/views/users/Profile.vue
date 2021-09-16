<template>
  <div>
    <h1>UserProfile</h1>

    <p v-if="status == 'loading'">Loading profile ...</p>

    <div v-if="status == 'error'">
      <ErrorPage />
    </div>

    <div v-if="status == 'success'" class="profile-ctn">
      <div class="user-ctn">
        <div class="user-ctn__pp">
          <img v-bind:src="user.avatar" class="profile_picture" />
        </div>
        <div class="user-ctn__info">
          <p class="info__name">{{ user.name }}</p>
          <p>Point : {{ user.point }}</p>
        </div>
      </div>
      <div class="user-interaction">
        <button v-if="!isCurrentUser" @click="addFriend(user)">
          add friend
        </button>
      </div>
      <div class="user-interaction">
        <button v-if="!isCurrentUser" @click="removeFriend(user)">
          remove friend
        </button>
      </div>

      <hr class="separator" />
      <div class="update-avatar">
        <input v-if="isCurrentUser" type="file" @change="onFileSelected" />
        <button v-if="isCurrentUser" @click="onUpload">Upload</button>
      </div>

      <hr class="separator" />
      <GameStats :user="user" />

      <hr class="separator" />
      <MatchHistory :user="user" />

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
import { useAxios } from '../../composables/axios'
import getFriendInteraction from '@/composables/Friends/getFriendInteraction'
import EditProfileForm from '@/components/edit/EditProfileForm.vue'
import GoogleAuthenticator from '@/components/auth/TwoAuth.vue'

export default {
  components: {
    ErrorPage,
    GameStats,
    MatchHistory,
    EditProfileForm,
    GoogleAuthenticator,
  },
  setup() {
    const route = useRoute()
    let status = ref(requestStatus.loading)
    const { user, fetchUser } = getFetchUser(status)
    const { addFriend, removeFriend } = getFriendInteraction()
    const { users, get } = useUsers()
    const { axios } = useAxios()
    let imageFile = ref('')

    const isCurrentUser = computed(() => {
      return user.value.id == useAuth().user.id
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
    }
  },
}
</script>

<style scoped>
.profile-ctn {
  display: flex;
  flex-direction: column;
}

.user-ctn {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  font-weight: bold;
  font-size: 1.5rem;
}

.separator {
  width: 50%;
  border-top: 2px solid lightgray;
  margin-top: 80px;
}
</style>
