import { Ref, ref } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { useAxios } from '@/composables/axios'

export default function getFetchRooms(status: Ref) {
  let rooms = ref([])

  const fetchRooms = async (related: boolean) => {
    const { axios } = useAxios()
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

  return { rooms, fetchRooms }
}
