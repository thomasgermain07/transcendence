import { ref } from 'vue'
import { useAxios } from '@/composables/axios'

export default function getFetchRoom() {
  let room = ref()

  const fetchRoom = async (id: Number) => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get(`chat/rooms/${id}`)
      room.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { room, fetchRoom }
}
