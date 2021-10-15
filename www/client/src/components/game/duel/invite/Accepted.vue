<template>
  <div class="content">
    <div class="text-ctn">
      <p class="message">
        <span class="username">{{ Target.name }}</span> accepted the duel
      </p>
      <div class="join-section">
        <button class="btn" @click="onJoinRoom">Join Room</button>
      </div>
    </div>
    <div class="logo">
      <i class="fas fa-check"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'
import { UserType } from '@/types/user/user'
import { useGameInvite } from '@/composables/Game/useGameInvite'

export default {
  props: {
    Target: Object as PropType<UserType>,
    GameRoomId: Number,
  },
  setup(props) {
    const { closeInviteNotification, redirectToGameRoom } = useGameInvite()

    const onJoinRoom = () => {
      redirectToGameRoom(props.GameRoomId!)
      closeInviteNotification()
    }

    return {
      onJoinRoom,
    }
  },
}
</script>

<style scoped>
.username {
  font-weight: bold;
  color: red;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  border-radius: 8px;
}

.text-ctn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fa-check {
  color: green;
  font-size: 50px;
}

.btn {
  margin: 10px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
