import axios from 'axios'
import { Ref, ref } from 'vue'
import requestStatus from '../../requestStatus'

export default function fetchRooms(status: Ref) {
  let rooms = ref([])

  const getRooms = async (related: boolean) => {
    try {
      const { data } = await axios.get('chat/rooms', {
        params: { related: related },
      })
      rooms.value = data
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { rooms, getRooms }
}
