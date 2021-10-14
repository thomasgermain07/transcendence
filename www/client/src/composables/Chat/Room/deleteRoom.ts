import { useAxios } from '@/composables/axios'

export default function getDeleteRoom() {
  const deleteRoom = async (id: number) => {
    try {
      let res = await useAxios().axios.delete(`chat/rooms/${id}`)
      console.log(res)
      return res
    } catch (e) {
      throw e
    }
  }

  return {
    deleteRoom,
  }
}
