import { ref } from 'vue'
import { useAxios } from '@/composables/axios'

export default function getFetchRoom() {
  const fetchRoom = async (id: Number) => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get(`chat/rooms/${id}`)
      return data
    } catch (e) {
      throw e
    }
  }

  return { fetchRoom }
}
