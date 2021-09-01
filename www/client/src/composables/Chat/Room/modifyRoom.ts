import { useAxios } from '@/composables/axios'

export default function getChangeRoom(Room: any) {
  const changeRoom = async (password?: any) => {
    if (password) {
      Room.password = password
    }

    return await useAxios().axios.patch(`chat/rooms/${Room.id}`, Room)
  }

  return { changeRoom }
}
