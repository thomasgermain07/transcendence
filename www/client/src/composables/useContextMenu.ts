import { router } from '@/router'
import { openModal } from 'jenesius-vue-modal'

import { useFriends } from './Friends/useFriends'
import { useRoom } from './Chat/Room/useRoom'

import getUserInteraction from '@/composables/User/getUserInteraction'

import DuelCreaction from '@/components/game/duel/DuelCreation.vue'

import { UserType } from '@/types/user/user'
import { PermissionCreationType } from '@/types/chat/permission'
import { useWindowInteraction } from './Chat/WindowInteraction/windowInteraction'
import getInvitationInteraction from './Game/invitationInteraction'
import { useAuth } from './auth'

import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import { useGameInvite } from './Game/useGameInvite'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
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

  const onOpenDm = (user: UserType) => {
    useWindowInteraction().openDm(user)
  }

  const onSendDuel = async (user: UserType) => {
    if (await getInvitationInteraction().hasPendingInvite(useAuth().user.id)) {
      useGameInvite().inviteError(
        'You already sent a game invite to ' + user.name,
      )
      return false
    }
    useWindowInteraction().closeChat()
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
    onOpenDm,
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
