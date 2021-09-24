// Notifications
import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { InvitationType } from '@/types/game/invitation'
import { useSocket } from '../socket'

import Invitation from '@/components/game/duel/invitation/Invitation.vue'
import Invite from '@/components/game/duel/invite/Invite.vue'
import { UserType } from '@/types/user/user'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
let currentInviteClose: Function | undefined = undefined
let currentInvitationClose: Function | undefined = undefined

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export default function useGameInvite() {
  const alreadySendInvite = () => {
    createToast('You already sent a game invite') // TODO : Create the vue
  }

  const createInviteNotification = (
    invitation: InvitationType,
    target: UserType,
  ) => {
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
        position: 'top-center',
      },
    )
    currentInvitationClose = close
  }

  const closeInvitationNotification = () => {
    if (currentInvitationClose != undefined) {
      currentInvitationClose()
      currentInvitationClose = undefined
    }
  }

  return {
    alreadySendInvite,
    createInviteNotification,
    closeInviteNotification,
    createInvitationNotification,
    closeInvitationNotification,
  }
}
