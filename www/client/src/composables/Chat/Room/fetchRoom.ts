import { ref, Ref } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { useAxios } from '@/composables/axios'

export default function getFetchRoom(status: Ref) {
  let room = ref()

  const fetchRoom = async (id: Number) => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get(`chat/rooms/${id}`)
      room.value = data
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { room, fetchRoom }
}
