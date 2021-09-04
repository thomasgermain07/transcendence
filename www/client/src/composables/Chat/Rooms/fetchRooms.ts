import { Ref, ref } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { useAxios } from '@/composables/axios'
import { RoomType } from '@/types/chat/room'

export default function getFetchRooms(status?: Ref) {
  let rooms = ref<RoomType[]>()

  const fetchRooms = async (related: boolean) => {
    try {
      const { data } = await useAxios().axios.get('chat/rooms', {
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
