import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

import { Player } from '../../types/game/player'
import { GameState, Room } from '../../types/game/gameRoom'


const useAllGameRoom = () => {
	console.log("---------------------")
	const rooms = ref({});
	console.log("---------d------------")
  const loadGameRooms = async (): Promise<void> => {
    const response = await axios.get(`game/rooms/watch`)
    console.log("---------------------")
		console.log(response.data)
		rooms.value =  response.data
		console.log(rooms.value)
    // return rooms;
  }

  return {
		rooms,
    loadGameRooms,
  }
}

export default useAllGameRoom