import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { router } from '@/router/index'

import { InvitationType } from '@/types/game/invitation'

import Invitation from '@/components/game/duel/invitation/Invitation.vue'
import Error from '@/components/game/duel/invitation/Error.vue'

import Invite from '@/components/game/duel/invite/Invite.vue'

import { UserType } from '@/types/user/user'

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
export default function useGameInvite() {
  const alreadySendInvite = () => {
    createToast(withProps(Error, { Msg: 'You already sent an invitation' }), {
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

  return {
    alreadySendInvite,
    invitationExpired,
    createInviteNotification,
    closeInviteNotification,
    createInvitationNotification,
    closeInvitationNotification,
    redirectToGameRoom,
  }
}
