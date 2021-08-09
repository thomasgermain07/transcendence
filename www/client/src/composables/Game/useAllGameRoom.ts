import { ref } from 'vue'
import axios from 'axios'


const useAllGameRoom = (mode: string) => {
	// console.log("---------------------")
	const rooms = ref({});
	// console.log("---------d------------")
  const loadGameRooms = async (): Promise<void> => {
    const response = await axios.get(`game/rooms/${mode}`)
    // console.log("---------------------")
		// console.log(response.data)
		rooms.value =  response.data
		// console.log(rooms.value)
    // return rooms;
  }

  return {
		rooms,
    loadGameRooms,
  }
}

export default useAllGameRoom