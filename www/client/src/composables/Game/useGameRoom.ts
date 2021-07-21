import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

import { Player } from '../../types/game/player'

const useGameRoom = () => {
  const store = useStore()
  const currentUser = store.state.user

  const state = reactive({
    isLoading: false,
    error: null,
    currentPlayer: null,
    isActive: false,
  })

  const room = ref({})

  const loadRoom = async (routeId: string): Promise<void> => {
    state.isLoading = true
    const response = await axios
      .get(`game/rooms/${routeId}`)
      .catch((error: any) => {
        state.error = error
        state.isLoading = false
      })
    if (response) {
      console.log('User id: ' + store.state.user.id)
      room.value = response.data
      state.currentPlayer = response.data.players.find(
        (player: Player) => player.user.id === currentUser.id,
      )
      if (state.currentPlayer && state.currentPlayer.isReady === true) {
        state.isActive = true
      }
      state.isLoading = false
    }
  }

  return {
    state,
    room,
    loadRoom,
  }
}

export default useGameRoom
