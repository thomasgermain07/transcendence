import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth'

import { LobbyType, InGameType } from '../../types/game/game'
import { Player } from '../../types/game/player'
import { GameMode } from '../../types/game/gameRoom'
import { GameOptions } from '../../types/game/gameOptions'
import { useSocket } from '../socket';
import { useAxios } from '../axios';

const useMatchmaker = () => {
  const matchmakingSocket = useSocket('matchmaker').socket
  const router = useRouter()

  const { user } = useAuth()
  const currentUser = user

  const { axios } = useAxios()

  const lobby: LobbyType = reactive({
    visible: false,
    matched: false,
    player: null,
  })

  const roomName = computed(() => {
    if (lobby.player) return `lobby-${lobby?.player.room.id}`
  })

  // check if user is already in Game Room
  const checkInGame: InGameType = reactive({
    inGame: false,
    roomRoute: '',
  })

  // open modal
  const showLobby = () => {
    console.log('In Show Lobby')
    lobby.visible = true
  }

  // close modal
  const closeLobby = () => {
    console.log('In Close Lobby')
    lobby.visible = false
  }

  const updateMatchedState = (value: boolean) => {
    console.log('in update matched state')
    lobby.matched = value
  }

  const joinLobby = (player: Player): void => {
    console.log('Join lobby from client')
    showLobby()
    lobby.player = player
    matchmakingSocket.emit(
      'joinLobbyInServer',
      {
        room: roomName.value,
        roomId: lobby.player.room.id,
      },
      (message: string) => {
        console.log(message)
        if (message === 'matchFound') {
          updateMatchedState(true)
        }
      },
    )
  }

  const leaveLobby = async () => {
    console.log('In leave lobby Duel view')
    await axios.delete(`game/players/${ lobby.player.id}`).catch((err: any)=> {
      console.log(err)
    })
    matchmakingSocket.emit('leaveLobbyInServer', {
      room: roomName.value,
      playerId: lobby.player.id,
    }, (message: string) => {
      console.log(message)
      closeLobby()
    })
  }

  const goToRoom = () => {
    closeLobby()
    console.log('Redirection to game room')
    console.log(lobby.player.room.id)
    router.push(`/game/room/${lobby.player.room.id}`)
  }

  const checkIfInGameOrQueue = async (): Promise<void> => {
    const response = await axios
    .get(`game/players/checkIfInGameOrQueue/${currentUser.id}`)
    .catch((error: any) => {
  
    })
    if (response) {
      console.log(response)
      checkInGame.inGame = response.data.inGame
      checkInGame.roomRoute = response.data.roomRoute
      // show matchmaking window if player in unlocked game room
      if (!checkInGame.inGame && checkInGame.roomRoute === 'matchmaking') {
        showLobby()
        joinLobby(response.data.player)
      }
    }
  }

  // FOR LADDER ONLY
  const expandRange = (range: number): void => {
    console.log('in expand range in ladder view')
    console.log('Received range: ' + range)
    matchmakingSocket.emit(
      'expandSearchRange',
      {
        user: currentUser,
        player: lobby.player,
        currentRoomName: roomName.value,
        range: range,
      },
      (player: Player) => {
        console.log(player)
        lobby.player = player
      },
    )
  }

  // FOR DUEL ONLY
  const renewSearch = (): void => {
    console.log('in renew Search in duel view')
    matchmakingSocket.emit(
      'renewSearchDuel',
      {
        user: currentUser,
        player: lobby.player,
        currentRoomName: roomName.value,
      },
      (player: Player) => {
        console.log(player)
        lobby.player = player
      },
    )
  }

  const playGame = (mode: GameMode, options: GameOptions | null): void => {
    matchmakingSocket.emit(
      'searchMatch',
      {
        user: currentUser,
        mode: mode,
        options: options,
      },
      (player: Player) => {
        alert(`${player.user.name} already in Game`)
      },
    )
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
