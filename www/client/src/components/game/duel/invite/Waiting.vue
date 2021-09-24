<template>
  <div class="content">
    <div class="text-ctn">
      <p class="message">
        Waiting for <span class="username">{{ Target.name }}</span>
      </p>
      <div class="game-option">
        <p>Game option :</p>
        <p>
          {{ Invitation.gameOptions.map }} -
          {{ Invitation.gameOptions.difficulty }}
          <span v-if="Invitation.gameOptions.powerUps"> - Power Ups</span>
        </p>
      </div>
    </div>
    <div class="loader-ctn">
      <div class="loader"></div>
      <p class="timer">{{ timer }}</p>
      <p class="btn" @click="cancelWaiting">cancel</p>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, PropType, ref } from '@vue/runtime-core'
import { InvitationType } from '@/types/game/invitation'
import { UserType } from '@/types/user/user'
import useGameInvite from '@/composables/Game/useGameInvite'
import getInvitationInteraction from '@/composables/Game/invitationInteraction'

export default {
  props: {
    Invitation: Object as PropType<InvitationType>,
    Target: Object as PropType<UserType>,
  },
  setup() {
    let timer = ref('')
    let interval = 0

    const { deleteInvitation } = getInvitationInteraction()

    const cancelWaiting = async () => {
      await deleteInvitation()
      useGameInvite().closeInviteNotification()
    }

    const startCountDown = (counter: number) => {
      timer.value = new Date(counter * 1000).toISOString().substr(14, 5)

      interval = setInterval(() => {
        counter--
        timer.value = new Date(counter * 1000).toISOString().substr(14, 5)

        if (counter < 0) {
          cancelWaiting()
        }
      }, 1000)
    }

    onMounted(() => startCountDown(120))

    onBeforeUnmount(() => clearInterval(interval))

    return {
      timer,
      cancelWaiting,
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
  justify-content: space-between;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.text-ctn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.loader-ctn {
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer {
  padding-top: 5px;
}

.btn {
  padding: 2px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}

.loader {
  border: 6px solid white;
  border-top: 6px solid red;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
