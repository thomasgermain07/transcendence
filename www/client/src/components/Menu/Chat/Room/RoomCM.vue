<template>
  <v-contextmenu-item @click="eventHandler.onProfile(User)"
    >View Profile</v-contextmenu-item
  >

  <v-contextmenu-item @click="eventHandler.onOpenDm(User)"
    >Send Message</v-contextmenu-item
  >

  <v-contextmenu-item
    v-if="IsOwner && !isModerator(User.id) && !isBanned(User.id)"
    @click="onSetModerator"
    >Set Moderator</v-contextmenu-item
  >

  <v-contextmenu-item
    v-if="IsOwner && isModerator(User.id) && !isBanned(User.id)"
    @click="onRevokeModerator"
    >Revoke Moderator</v-contextmenu-item
  >

  <v-contextmenu-submenu
    v-if="
      (IsOwner || IsModerator) &&
      User.id != Room.owner.id &&
      !isModerator(User.id) &&
      !isBanned(User.id)
    "
    title="Mute"
  >
    <v-contextmenu-item @click="onMuteUser(1)">1min</v-contextmenu-item>
    <v-contextmenu-item @click="onMuteUser(3)">3m</v-contextmenu-item>
    <v-contextmenu-item @click="onMuteUser(10)">10m</v-contextmenu-item>
    <v-contextmenu-item @click="onMuteUser(1440)">1day</v-contextmenu-item>
    <v-contextmenu-item @click="onMuteUser(4320)">3day</v-contextmenu-item>
  </v-contextmenu-submenu>

  <v-contextmenu-item
    v-if="
      (IsOwner ||
        (IsModerator && User.id != Room.owner.id && !isModerator(User.id))) &&
      !isBanned(User.id)
    "
    @click="eventHandler.onBanUser(User.id, Room.id)"
  >
    Ban
  </v-contextmenu-item>

  <v-contextmenu-item
    v-if="!isBlocked(User.id)"
    @click="eventHandler.onSendDuel(User)"
    >Send Duel</v-contextmenu-item
  >

  <v-contextmenu-item
    v-if="!isBlocked(User.id)"
    @click="eventHandler.onBlockUser(User)"
    >Block</v-contextmenu-item
  >
  <v-contextmenu-item v-else @click="eventHandler.onUnblockUser(User)"
    >Unblock</v-contextmenu-item
  >
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'

import { useContextMenu } from '@/composables/useContextMenu'
import { useFriends } from '@/composables/Friends/useFriends'

import { UserType } from '@/types/user/user'
import { RoomType } from '@/types/chat/room'
import { useRoom } from '@/composables/Chat/Room/useRoom'

export default {
  props: {
    User: Object as PropType<UserType>,
    IsModerator: Boolean,
    IsOwner: Boolean,
    Room: Object as PropType<RoomType>,
  },
  setup(props) {
    const eventHandler = useContextMenu()

    const { isModerator, isBanned } = useRoom()
    const { isBlocked } = useFriends()

    const onSetModerator = async () => {
      try {
        await eventHandler.onSetModerator(
          props.User!.id,
          props.Room!.id as number,
        )
      } catch (e) {
      }
    }

    const onRevokeModerator = async () => {
      try {
        await eventHandler.onRevokeModerator(
          props.User!,
          props.Room!.id as number,
        )
      } catch (e) {
      }
    }

    const onMuteUser = async (time: number) => {
      let t = new Date()
      t.setMinutes(t.getMinutes() + time)
      eventHandler.onMuteUser(props.User!.id, props.Room!.id as number, t)
    }

    return {
      eventHandler,
      onSetModerator,
      onRevokeModerator,
      onMuteUser,
      isModerator,
      isBanned,
      isBlocked,
    }
  },
}
</script>
