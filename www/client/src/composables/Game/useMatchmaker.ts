import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth'

import { LobbyType, InGameType } from '../../types/game/game'
import { Player } from '../../types/game/player'
import { GameMode } from '../../types/game/gameRoom'
import { GameOptions } from '../../types/game/gameOptions'
import { useSocket } from '../socket'
import { useAxios, AxiosErrType } from '../axios'
import { createToast } from 'mosha-vue-toastify'

const useMatchmaker = () => {
  const matchmakingSocket = useSocket('matchmaker').socket
  const router = useRouter()

  const { user } = useAuth()
  const currentUser = user

  const { axios } = useAxios()

  const lobby = reactive<LobbyType>({
    visible: false,
    matched: false,
    player: null,
  })

  const roomName = computed(() => {
    if (lobby.player) return `lobby-${lobby?.player.room.id}`
  })

  const checkInGame = reactive<InGameType>({
    inGame: false,
    roomRoute: '',
  })

  const toastException = (message: string) => {
    createToast(message, {
      timeout: 3000,
      type: 'warning',
    })
  }

  const showLobby = () => {
    lobby.visible = true
  }

  const closeLobby = () => {
    lobby.visible = false
  }

  const updateMatchedState = (value: boolean) => {
    lobby.matched = value
  }

  const joinLobby = (player: Player): void => {
    showLobby()
    lobby.player = player
    matchmakingSocket.emit(
      'joinLobbyInServer',
      {
        room: roomName.value,
        roomId: lobby.player.room.id,
      },
      (message: string) => {
        if (message === 'matchFound') {
          updateMatchedState(true)
        }
      },
    )
  }

  const leaveLobby = async () => {
    await axios
      .delete(`game/players/${lobby?.player?.id}`)
      .catch((err: AxiosErrType) => {})
    matchmakingSocket.emit(
      'leaveLobbyInServer',
      {
        room: roomName.value,
        playerId: lobby?.player?.id,
      },
      () => {
        closeLobby()
      },
    )
  }

  const goToRoom = () => {
    closeLobby()
    router.push(`/game/room/${lobby?.player?.room.id}`)
  }

  const checkIfInGameOrQueue = async (): Promise<void> => {
    const response = await axios
      .get(`game/players/checkIfInGameOrQueue/${currentUser.id}`)
      .catch((error: any) => {})
    if (response) {
      checkInGame.inGame = response.data.inGame
      checkInGame.roomRoute = response.data.roomRoute
      if (!checkInGame.inGame && checkInGame.roomRoute === 'matchmaking') {
        showLobby()
        joinLobby(response.data.player)
      }
    }
  }

  const expandRange = (range: number): void => {
    matchmakingSocket.emit(
      'expandSearchRange',
      {
        user: currentUser,
        player: lobby.player,
        currentRoomName: roomName.value,
        range: range,
      },
      (player: Player) => {
        lobby.player = player
      },
    )
  }

  const renewSearch = (): void => {
    matchmakingSocket.emit(
      'renewSearchDuel',
      {
        user: currentUser,
        player: lobby.player,
        currentRoomName: roomName.value,
      },
      (player: Player) => {
        lobby.player = player
      },
    )
  }

  const playGame = async (
    mode: GameMode,
    options: GameOptions | null,
  ): Promise<void> => {
    const response = await axios
      .post(`game/rooms/matchmaking`, {
        mode: mode,
        options: options,
      })
      .catch((err: AxiosErrType) => {
        toastException(err.response?.data?.message)
      })
    if (response) {
      joinLobby(response.data)
    }
  }

  return {
    lobby,
    roomName,
    checkInGame,
    checkIfInGameOrQueue,
    updateMatchedState,
    joinLobby,
    leaveLobby,
    goToRoom,
    expandRange,
    renewSearch,
    playGame,
  }
}

export default useMatchmaker
