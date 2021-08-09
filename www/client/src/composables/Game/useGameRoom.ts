import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

import { Player } from '../../types/game/player'
import { GameState } from '../../types/game/gameRoom'

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
        state.error = error.response.data.message
        state.isLoading = false
      })
    if (response) {
      // transfer data into room
      room.value = response.data

      // find if current user is a player of the room
      state.currentPlayer = response.data.players.find(
        (player: Player) => player.user.id === currentUser.id,
      )

      // protect room access according to state
      if ((!state.currentPlayer && response.data.state === GameState.WAITING)
        || (state.currentPlayer && response.data.locked === false)) {
        console.log('NOT A PLAYER or ROOM INCOMPLETE')
        state.error = 'Not authorized'
      }

      // for ready button
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
