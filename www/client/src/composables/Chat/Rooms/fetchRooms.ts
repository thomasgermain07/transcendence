import { Ref, ref } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { useAxios } from '@/composables/axios'
import { RoomType } from '@/types/chat/room'

export default function getFetchRooms() {
  let rooms = ref<RoomType[]>([])

  const fetchRooms = async (related: boolean) => {
    try {
      const { data } = await useAxios().axios.get('chat/rooms', {
        params: { related: related },
      })
      rooms.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { rooms, fetchRooms }
}
