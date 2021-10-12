import { Ref } from 'vue'

import { router } from '@/router'
import { openModal } from 'jenesius-vue-modal'

import { useAuth } from './auth'
import { useFriends } from './Friends/useFriends'
import { useGameInvite } from './Game/useGameInvite'
import { useRoom } from './Chat/Room/useRoom'

import getInvitationInteraction from './Game/invitationInteraction'
import getUserInteraction from '@/composables/User/getUserInteraction'

import DuelCreaction from '@/components/game/duel/DuelCreation.vue'

import { UserType } from '@/types/user/user'
import { PermissionCreationType } from '@/types/chat/permission'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
const { hasPendingInvite } = getInvitationInteraction()
const { removeFriend, blockUser, unblockUser } = getUserInteraction()

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useContextMenu() {
  const onProfile = (user: UserType) => {
    if (user != undefined) {
      router.push({
        name: 'user-profile',
        params: { id: user.id },
      })
    }
  }

  const onSendDuel = async (user: UserType) => {
    if (await hasPendingInvite(useAuth().user.id)) {
      useGameInvite().alreadySendInvite()
      return
    }
    openModal(DuelCreaction, {
      Target: user,
    })
  }

  const onDeleteFriend = async (user: UserType) => {
    await removeFriend(user)
    useFriends().reloadFriends()
  }

  const onBlockUser = async (user: UserType) => {
    await blockUser(user)
    useFriends().reloadIgnored()
  }

  const onUnblockUser = async (user: UserType) => {
    await unblockUser(user)
    useFriends().reloadIgnored()
  }

  const onSetModerator = async (userID: number, roomID: number) => {
    let permission: PermissionCreationType = {
      user_id: userID,
      room_id: roomID,
      type: 'moderator',
      expired_at: null,
    }

    try {
      await useRoom().setPermission(permission)
    } catch (e) {
      console.log(e)
    }
  }

  const onRevokeModerator = async (user: UserType, roomId: number) => {
    try {
      await useRoom().revokePermission(user.id, roomId)
    } catch (e) {
      console.log(e)
    }
  }

  const onMuteUser = async (userID: number, roomID: number, time: Date) => {
    let permission: PermissionCreationType = {
      user_id: userID,
      room_id: roomID,
      type: 'muted',
      expired_at: time,
    }

    try {
      await useRoom().setPermission(permission)
    } catch (e) {
      console.log(e)
    }
  }

  const onBanUser = async (userId: number, roomId: number) => {
    let permission: PermissionCreationType = {
      user_id: userId,
      room_id: roomId,
      type: 'banned',
      expired_at: null,
    }

    try {
      await useRoom().setPermission(permission)
    } catch (e) {
      console.log(e)
    }
  }

  const onUnbanUser = async (userId: number, roomId: number) => {
    try {
      await useRoom().revokePermission(userId, roomId)
    } catch (e) {
      console.log(e)
    }
  }

  const isBlocked = (id: number) => {
    console.log(useFriends().ignored.value)
    return useFriends().ignored.value.findIndex((user) => user.id == id) == -1
  }

  return {
    onProfile,
    onSendDuel,
    onDeleteFriend,
    onBlockUser,
    onUnblockUser,
    onSetModerator,
    onRevokeModerator,
    onMuteUser,
    onBanUser,
    onUnbanUser,
    isBlocked,
  }
}
