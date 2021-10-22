import { reactive, ref } from 'vue'

import { Player } from '../../types/game/player'
import { GameState } from '../../types/game/gameRoom'

import { AxiosErrType, useAxios } from '../axios'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/users'
import { createToast } from 'mosha-vue-toastify'
import { Room } from '@/types/game/gameRoom'

type useGameRoomState = {
  isLoading: boolean
  error: null | string
  currentPlayer: null | Player
  isActive: boolean
  isPause: boolean
}

const useGameRoom = () => {
  const { axios } = useAxios()
  const router = useRouter()

  const { users, get } = useUsers()
  const currentUser = users

  const state = reactive<useGameRoomState>({
    isLoading: false,
    error: null,
    currentPlayer: null,
    isActive: false,
    isPause: false,
  })

  const room = ref<Room>()

  const loadRoom = async (routeId: string | string[]): Promise<void> => {
    state.isLoading = true
    state.error = null
    state.currentPlayer = null
    state.isActive = false
    state.isPause = false
    const response = await axios
      .get(`game/rooms/${routeId}`)
      .catch((error: AxiosErrType) => {
        state.error = error.response.data.message
        state.isLoading = false
      })
    if (response) {
      await get()
      room.value = response.data
      state.currentPlayer = response.data.players.find(
        (player: Player) => player.user.id === currentUser.value.id,
      )
      if (
        (!state.currentPlayer && response.data.state === GameState.WAITING) ||
        (state.currentPlayer && response.data.locked === false)
      ) {
        state.error = 'Not authorized'
      }

      if (!state.currentPlayer && currentUser.value.status === 'ingame') {
        state.error = "You can't watch a game while in a another game"
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
    room?.value?.mode === 'duel'
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
