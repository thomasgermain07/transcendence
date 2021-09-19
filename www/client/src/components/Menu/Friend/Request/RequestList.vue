<template>
  <div class="friend-container">
    <div class="friend-item" v-for="request in Requests" :key="request">
      {{ request.user.name }}
      <div class="request-btn">
        <i
          class="fas fa-check-square accept-btn"
          @click="acceptRequest(request.user)"
        ></i>
        <i
          class="fas fa-window-close refuse-btn"
          @click="refuseRequest(request.user)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import getUserInteraction from '@/composables/User/getUserInteraction'
import { UserType } from '@/types/user/user'

export default {
  props: {
    Requests: Object,
  },
  setup(props, { emit }) {
    const { addFriend, removeFriend } = getUserInteraction()

    const acceptRequest = async (user: UserType) => {
      await addFriend(user)
      emit('request_answered')
    }

    const refuseRequest = async (user: UserType) => {
      await removeFriend(user)
      emit('request_answered')
    }

    return { acceptRequest, refuseRequest }
  },
}
</script>

<style scoped>
.friend-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.friend-item {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.request-btn * {
  padding: 0 3px;
}

.accept-btn:hover {
  color: green;
}

.refuse-btn:hover {
  color: red;
}
</style>
