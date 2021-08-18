<template>
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
      <button v-if="!isCurrentUser" @click="addFriend(user)">add friend</button>
    </div>
    <div class="user-interaction">
      <button v-if="!isCurrentUser" @click="removeFriend(user)">
        remove friend
      </button>
    </div>

    <hr class="separator" />
    <div class="update-avatar">
      <input v-if="isCurrentUser" type="file" @change="onFileSelected">
      <button v-if="isCurrentUser" @click="onUpload">Upload</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/auth'
import ErrorPage from '@/components/ErrorPage.vue'
import getFetchUser from '@/composables/User/fetchUser'
import requestStatus from '@/composables/requestStatus'
import { addFriend, removeFriend } from '@/composables/User/userInteraction'
import { useAxios } from '../../composables/axios'
import { useUsers } from '../../composables/users'
export default {
  components: {
    ErrorPage,
  },
  setup() {
    const route = useRoute()
    let imageFile = ref("");
    let status = ref(requestStatus.loading)
    const { axios } = useAxios()
    const { user, fetchUser } = getFetchUser(status)  
     const { users, get } = useUsers()
    const isCurrentUser = computed(() => {
      return user.value.id == useAuth().user.id
    })
    const userId = route.params.id || useAuth().user.id

    fetchUser(userId)
    function onFileSelected(event) {
      imageFile.value = event.target.files[0]
    }

    async function onUpload() {

      let data = new FormData();
      data.append('file', imageFile.value)

      const res = await axios.post('users/upload', data).catch((err) => {
            alert(`${err.response?.data.message}`)
          })
      if (res) {
        user.value = res.data
        console.log(user.value)
      }
    }

    watchEffect(async () => {
      if (route.params.id == undefined) {
        await get()
        fetchUser(users.value.id)
      } else {
        fetchUser(route.params.id)
      }
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
