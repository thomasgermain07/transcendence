import { useAxios } from '@/composables/axios'
import { ref } from 'vue'

export default function getCreateSubscription() {
  let password_field = ref()

  const createSubscription = async (room: any) => {
    let params: any = { room_id: room.id }
    if (room.password) {
      params.password = password_field.value
    }

    const { axios } = useAxios()
    return await axios.post('chat/subscriptions', params)
  }

  return { password_field, createSubscription }
}
