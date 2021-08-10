import axios from 'axios'
import { ref, Ref } from 'vue'
import requestStatus from '@/composables/requestStatus'

export default function getFetchRoom(status: Ref) {
  let room = ref()

  const fetchRoom = async (id: Number) => {
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
