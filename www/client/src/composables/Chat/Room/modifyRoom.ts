import { AxiosErrType, useAxios } from '@/composables/axios'

import { RoomParamsType } from '@/types/chat/room_params'

export default function getChangeRoom() {
  const changeRoom = async (id: Number, roomParam: RoomParamsType) => {
    try {
      let res = await useAxios().axios.patch(`chat/rooms/${id}`, roomParam)
      return res
    } catch (e: AxiosErrType) {
      console.log(e.response.data.message)
      throw e.response.data.message
    }
  }

  return { changeRoom }
}
