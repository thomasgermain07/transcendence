// Notifications
import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { InvitationType } from '@/types/game/invitation'
import { useSocket } from '../socket'

import Invitation from '@/components/game/Invitation.vue'

export default function useGameInvite() {
  const listenSocket = () => {
    useSocket('dm').socket.on(
      'gameInvitationReceived',
      (invitation: InvitationType) => {
        createToast(withProps(Invitation, { Invitation: invitation }), {
          timeout: -1,
        })
      },
    )
  }

  const alreadySendInvite = () => {
    createToast('You already sent a game invite') // TODO : Create the vue
  }

  return {
    listenSocket,
    alreadySendInvite,
  }
}
