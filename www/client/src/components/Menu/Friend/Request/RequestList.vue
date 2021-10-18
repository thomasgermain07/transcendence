<template>
  <div class="friend-container">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onProfile(cm_user)"
        >View Profile</v-contextmenu-item
      >
      <v-contextmenu-item @click="onOpenDm(cm_user)"
        >Send Message</v-contextmenu-item
      >
      <v-contextmenu-item
        @click="onBlockUser(cm_user) && refuseRequest(cm_user)"
        >Block</v-contextmenu-item
      >
    </v-contextmenu>

    <div class="friend-item" v-for="request in Requests" :key="request">
      <div
        @click.left="onOpenDm(request.user)"
        @click.right="onRightClick(request.user)"
        v-contextmenu:contextmenu
      >
        <div>
          {{ request.user.name }}
        </div>
      </div>
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
import { ref } from 'vue'
import getUserInteraction from '@/composables/User/getUserInteraction'
import { UserType } from '@/types/user/user'
import { useContextMenu } from '@/composables/useContextMenu'

export default {
  props: {
    Requests: Object,
  },
  setup(props, { emit }) {
    let cm_user = ref()

    const { addFriend, removeFriend } = getUserInteraction()
    const { onProfile, onBlockUser, onOpenDm } = useContextMenu()

    const onRightClick = (user: UserType) => {
      cm_user.value = user
    }

    const acceptRequest = async (user: UserType) => {
      await addFriend(user)
      emit('request_answered')
    }

    const refuseRequest = async (user: UserType) => {
      await removeFriend(user)
      emit('request_answered')
    }

    return {
      cm_user,
      onRightClick,
      onProfile,
      onBlockUser,
      onOpenDm,
      acceptRequest,
      refuseRequest,
    }
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
