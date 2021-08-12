import { io } from 'socket.io-client'

const sockets = {
  gameRoom: io('ws://localhost:8080/game-rooms'),
  matchmaking: io('ws://localhost:8080/matchmaker'),
}

const useSockets = () => {
  const gameRoomsSocket = sockets.gameRoom
  const matchmakingSocket = sockets.matchmaking

  return {
    gameRoomsSocket,
    matchmakingSocket,
  }
}

export default useSockets
