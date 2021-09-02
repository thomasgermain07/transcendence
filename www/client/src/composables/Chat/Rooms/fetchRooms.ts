import { Ref, ref } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { useAxios } from '@/composables/axios'

export default function getFetchRooms(status?: Ref) {
  let rooms = ref([])

  const fetchRooms = async (related: boolean) => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get('chat/rooms', {
        params: { related: related },
      })
      rooms.value = data
      if (status) {
        status.value = requestStatus.success
      }
    } catch (e) {
      if (status) {
        status.value = requestStatus.error
      } else {
        console.log(e)
      }
    }
  }

  return { rooms, fetchRooms }
}
