import { reactive, ref } from 'vue'

import { Player } from '../../types/game/player'
import { GameState } from '../../types/game/gameRoom'

import { useAxios } from '../axios'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/users'
import { createToast } from 'mosha-vue-toastify'

const useGameRoom = () => {
  const { axios } = useAxios()
  const router = useRouter()

  const { users, get } = useUsers()
  const currentUser = users

  const state = reactive({
    isLoading: false,
    error: null,
    currentPlayer: null,
    isActive: false,
    isPause: false,
  })

  const room = ref({})

  const loadRoom = async (routeId: string): Promise<void> => {
    state.isLoading = true
    state.error = null
    state.currentPlayer = null
    state.isActive = false
    state.isPause = false
    const response = await axios
      .get(`game/rooms/${routeId}`)
      .catch((error: any) => {
        state.error = error.response.data.message
        state.isLoading = false
      })
    if (response) {
      // refresh current user data
      await get()

      // transfer data into room
      room.value = response.data

      // find if current user is a player of the room
      state.currentPlayer = response.data.players.find(
        (player: Player) => player.user.id === currentUser.value.id,
      )
      // protect room access according to state
      if (
        (!state.currentPlayer && response.data.state === GameState.WAITING) ||
        (state.currentPlayer && response.data.locked === false)
      ) {
        state.error = 'Not authorized'
      }

      // for ready button
      if (state.currentPlayer && state.currentPlayer.isReady === true) {
        state.isActive = true
      }
      if (state.currentPlayer && state.currentPlayer.isPause === true) {
        state.isPause = true
      }

      state.isLoading = false
    }
  }

  const redirectToGameView = () => {
    room.value.mode === 'duel'
      ? router.push('/game/duel')
      : router.push('/game/ladder')
  }

  const toastOppLeaving = () => {
    createToast(
      {
        title: 'Your opponent left the game room',
        description: 'We are putting you back in the queue',
      },
      {
        timeout: 3000,
        type: 'info',
      },
    )
  }

  const toastGameCanceled = () => {
    createToast(
      {
        title: 'Game canceled',
        description: 'You have been redirected to the game view',
      },
      {
        timeout: 3000,
        type: 'info',
      },
    )
  }

  return {
    state,
    room,
    loadRoom,
    toastOppLeaving,
    toastGameCanceled,
    redirectToGameView,
  }
}

export default useGameRoom
