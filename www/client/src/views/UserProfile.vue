<template>
  <h1>UserProfile</h1>

  <p v-if="status == 'loading'">Loading profile ...</p>

  <div v-if="status == 'error'">
    <ErrorPage />
  </div>

  <div v-if="status == 'success'" class="profile-ctn">
    <div class="user-ctn">
      <div class="user-ctn__pp">
        <img v-bind:src="user.profile_picture" class="profile_picture" />
      </div>
      <div class="user-ctn__info">
        <p class="info__name">{{ user.name }}</p>
        <p>Point : {{ user.point }}</p>
      </div>
    </div>
    <div class="user-interaction">
      <button v-if="!isCurrentUser" @click="addFriend(user)">add friend</button>
    </div>

    <hr class="separator" />
  </div>
</template>

<script lang="ts">
import ErrorPage from '../components/ErrorPage.vue'
import { ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import fetchUser from '../composables/User/fetchUser'
import fetchStatus from '../composables/fetchStatus'
import { addFriend, removeFriend } from '../composables/User/userInteraction'

export default {
  components: {
    ErrorPage,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    let status = ref(fetchStatus.loading)

    const { user, getUser } = fetchUser(status)
    const isCurrentUser = computed(() => {
      return user.value.id == store.state.user.id
    })

    watchEffect(() => {
      if (route.params.id != undefined) {
        getUser(route.params.id)
      }
    })

    return {
      user,
      status,
      getUser,
      addFriend,
      removeFriend,
      isCurrentUser,
    }
  },
}
</script>

<style>
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
