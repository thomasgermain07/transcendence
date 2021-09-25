<template>
  <div class="content">
    <div class="text-ctn">
      <p class="message">
        <span class="username">{{ Invitation.host.name }}</span>
        invited you to play
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
    <div class="btns">
      <p class="btn btn--accept" @click="onAccept">Accept</p>
      <p class="btn btn--refuse" @click="onRefuse">Refuse</p>
      <p class="timer">{{ timer }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref, onMounted, onUnmounted } from '@vue/runtime-core'

import useGameInvite from '@/composables/Game/useGameInvite'

import getInvitationInteraction from '@/composables/Game/invitationInteraction'

import { InvitationType } from '@/types/game/invitation'

export default {
  props: {
    Invitation: Object as PropType<InvitationType>,
  },
  setup(props) {
    let timer = ref('')
    let interval = 0

    const { acceptInvitation, refuseInvitation } = getInvitationInteraction()
    const {
      closeInvitationNotification,
      invitationExpired,
      redirectToGameRoom,
    } = useGameInvite()

    const startCountDown = (counter: number) => {
      timer.value = new Date(counter * 1000).toISOString().substr(14, 5)

      interval = setInterval(() => {
        counter--
        timer.value = new Date(counter * 1000).toISOString().substr(14, 5)

        if (counter < 0) {
          clearInterval(interval)
          timer.value = '00:00'
          onRefuse()
        }
      }, 1000)
    }

    const onAccept = async () => {
      clearInterval(interval)

      let gameRoom = await acceptInvitation(props.Invitation!)

      if (gameRoom == 'Invitation expired') {
        invitationExpired()
      } else {
        redirectToGameRoom(gameRoom.id)
      }
      closeInvitationNotification(props.Invitation!)
    }

    const onRefuse = async () => {
      let res = await refuseInvitation(props.Invitation!)
      if (res) {
        invitationExpired()
      }
      closeInvitationNotification(props.Invitation!)
    }

    onMounted(() => startCountDown(120))
    onUnmounted(() => clearInterval(interval))

    return {
      timer,
      onAccept,
      onRefuse,
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
  text-align: center;
}

.btns {
  padding-left: 20px;
}

.btn {
  padding: 2px;
  padding-left: 8px;
  padding-right: 8px;
  margin: 5px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}

.btn--accept:hover {
  background-color: lime;
}

.btn--refuse:hover {
  background-color: red;
}
</style>
