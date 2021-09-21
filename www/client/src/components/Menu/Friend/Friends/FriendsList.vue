<template>
  <div class="friend-container">
    <v-contextmenu ref="contextmenu" @hide="cm_user = undefined">
      <v-contextmenu-item @click="onProfile">View Profile</v-contextmenu-item>
      <v-contextmenu-item @click="onOpenDm">Send Message</v-contextmenu-item>
      <v-contextmenu-item @click="onSendDuel">Send Duel</v-contextmenu-item>
      <v-contextmenu-item @click="onDeleteFriend"
        >Delete Friend</v-contextmenu-item
      >
      <v-contextmenu-item @click="onBlockUser">Block</v-contextmenu-item>
    </v-contextmenu>

    <div
      class="friend-item"
      v-for="friend in Friends"
      :key="friend"
      @click.left="$emit('open_chat', friend.id, friend.name)"
      @click.right="onRightClick(friend)"
      v-contextmenu:contextmenu
    >
      {{ friend.name }}
      <!-- TODO : connected for status connection -->
      <i
        class="fas fa-circle status"
        :class="friend.connected ? 'status--connected' : 'status--disconnected'"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, PropType } from 'vue'
import { UserType } from '@/types/user/user'
import getUserInteraction from '@/composables/User/getUserInteraction'
import { useRouter } from 'vue-router'

export default {
  props: {
    Friends: Array as PropType<Array<UserType>>,
  },
  setup(props, { emit }) {
    let cm_user: UserType
    let router = useRouter()

    const { removeFriend, blockUser } = getUserInteraction()

    const onRightClick = (user: UserType) => {
      cm_user = user
    }

    const onProfile = () => {
      if (cm_user != undefined) {
        router.push({
          name: 'user-profile',
          params: { id: cm_user.id },
        })
      }
    }

    const onSendDuel = () => {
      // TODO : Connect with game when done
    }

    const onOpenDm = () => {
      if (cm_user == undefined) {
        return
      }
      emit('open_chat', cm_user.id, cm_user.name)
    }

    const onDeleteFriend = async () => {
      if (cm_user == undefined) {
        return
      }
      await removeFriend(cm_user)
      emit('reload_data')
    }

    const onBlockUser = async () => {
      if (cm_user == undefined) {
        return
      }
      await blockUser(cm_user)
      emit('reload_data')
    }

    return {
      cm_user,
      onOpenDm,
      onRightClick,
      onProfile,
      onSendDuel,
      onDeleteFriend,
      onBlockUser,
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

.status {
  font-size: 0.7em;
  align-self: center;
}

.status--connected {
  color: green;
}

.status--disconnected {
  color: red;
}
</style>
