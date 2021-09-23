import { GameOptions } from '@/types/game/gameOptions'
import { InvitationType } from '@/types/game/invitation'
import { useAuth } from '../auth'
import { useAxios } from '../axios'

export default function getInvitationInteraction() {
  let axios = useAxios().axios
  let me = useAuth().user

  const hasPendingInvite = async (id: Number) => {
    try {
      let { data } = await axios.get(`users/${id}/game-invite-pending`)
      return data
    } catch (e) {
      console.log(e)
    }
  }

  const createInvitation = async (
    gameOptions: GameOptions,
    guestId: Number,
  ) => {
    try {
      const { data } = await axios.post('dm/send-invitation', {
        gameOptions: gameOptions,
        host: me,
        guestId: guestId,
      })
      return data
    } catch (e) {
      console.log(e)
    }
  }

  const refuseInvitation = async (invitation: InvitationType) => {
    try {
      await axios.post('dm/refuse-invitation', { ...invitation })
    } catch (e) {
      console.log(e)
    }
  }

  const acceptInvitation = async (invitation: InvitationType) => {
    try {
      let { data } = await axios.post('dm/accept-invitation', { ...invitation })
      return data
    } catch (e) {
      console.log(e)
    }
  }

  return {
    hasPendingInvite,
    createInvitation,
    refuseInvitation,
    acceptInvitation,
  }
}
