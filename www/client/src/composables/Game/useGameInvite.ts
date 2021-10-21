import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { router } from '@/router/index'

import getInvitationInteraction from './invitationInteraction'

import { InvitationType } from '@/types/game/invitation'

import Invitation from '@/components/game/duel/invitation/Invitation.vue'
import Error from '@/components/game/duel/invitation/Error.vue'

import Invite from '@/components/game/duel/invite/Invite.vue'

import { UserType } from '@/types/user/user'
import { useAuth } from '../auth'
import { useFriends } from '../Friends/useFriends'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
const { isInGameOrQueue, refuseInvitation, deleteInvitation } =
  getInvitationInteraction()

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type InvitationTab = {
  invitation: InvitationType
  close: Function
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
let currentInviteClose: Function | undefined = undefined
let invitationsList: Array<InvitationTab> = []

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useGameInvite() {
  const inviteError = (msg: string) => {
    createToast(withProps(Error, { Msg: msg }), {
      timeout: 5000,
      type: 'danger',
    })
  }

  const invitationExpired = () => {
    createToast(withProps(Error, { Msg: 'Invitation expired' }), {
      timeout: 5000,
      type: 'danger',
    })
  }

  const checkIfCanInvite = async (user: UserType) => {
    if (user.status != 'connected') {
      if (user.status == 'disconnected') {
        inviteError(user.name + ' is disconnected')
      }
      return false
    }

    let res = await isInGameOrQueue(user.id)
    if (res.ingame) {
      inviteError(`${user.name} is already playing`)
      return false
    } else if (res.roomRoute.length > 0) {
      inviteError(`${user.name} is already in a room or matchmaking`)
      return false
    }

    res = await isInGameOrQueue(useAuth().user.id)
    if (res.roomRoute.length > 0) {
      inviteError(`You already are in a room`)
      return false
    }

    return true
  }

  const createInviteNotification = (
    invitation: InvitationType,
    target: UserType,
  ) => {
    if (currentInviteClose) {
      currentInviteClose()
    }

    const { close } = createToast(
      withProps(Invite, { Invitation: invitation, Target: target }),
      {
        timeout: -1,
        showCloseButton: false,
        swipeClose: false,
        hideProgressBar: true,
        toastBackgroundColor: 'white',
        position: 'top-center',
      },
    )
    currentInviteClose = close
  }

  const closeInviteNotification = () => {
    if (currentInviteClose != undefined) {
      currentInviteClose()
      currentInviteClose = undefined
    }
  }

  const createInvitationNotification = (invitation: InvitationType) => {
    let { close } = createToast(
      withProps(Invitation, { Invitation: invitation }),
      {
        timeout: -1,
        swipeClose: false,
        showCloseButton: false,
        hideProgressBar: true,
        toastBackgroundColor: 'white',
      },
    )
    invitationsList.unshift({ invitation: invitation, close: close })
  }

  const closeInvitationNotification = (invitation: InvitationType) => {
    let index = invitationsList.findIndex((tab) => {
      return tab.invitation.host.id == invitation.host.id
    })
    if (index != -1) {
      invitationsList[index].close()
      invitationsList.splice(index, 1)
    }
  }

  const redirectToGameRoom = (gameRoomId: number) => {
    router.push({
      name: 'game-room',
      params: {
        id: gameRoomId,
      },
    })
  }

  const closeEverything = async () => {
    invitationsList.forEach(async (invitation) => {
      await refuseInvitation(invitation.invitation)
      invitation.close()
    })
    invitationsList.length = 0
    if (currentInviteClose) {
      await deleteInvitation()
      closeInviteNotification()
    }
  }

  return {
    inviteError,
    invitationExpired,
    checkIfCanInvite,
    createInviteNotification,
    closeInviteNotification,
    createInvitationNotification,
    closeInvitationNotification,
    redirectToGameRoom,
    closeEverything,
  }
}
