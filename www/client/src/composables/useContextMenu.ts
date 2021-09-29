import { router } from '@/router'
import { openModal } from 'jenesius-vue-modal'

import { UserType } from '@/types/user/user'
import { useAuth } from './auth'

import { useGameInvite } from './Game/useGameInvite'

import getInvitationInteraction from './Game/invitationInteraction'
import getUserInteraction from '@/composables/User/getUserInteraction'

import DuelCreaction from '@/components/game/duel/DuelCreation.vue'
import { useFriends } from './Friends/useFriends'

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

  return {
    onProfile,
    onSendDuel,
    onDeleteFriend,
    onBlockUser,
    onUnblockUser,
  }
}
