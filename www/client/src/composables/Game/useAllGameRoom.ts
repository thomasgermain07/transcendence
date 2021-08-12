import { ref } from 'vue'
import { useAxios } from '../axios'

const useAllGameRoom = (mode: string) => {
  const { axios } = useAxios()

  const rooms = ref({})

  const loadGameRooms = async (): Promise<void> => {
    const response = await axios.get(`game/rooms/${mode}`)
    rooms.value = response.data
  }

  return {
    rooms,
    loadGameRooms,
  }
}

export default useAllGameRoom
