import { useAxios } from '@/composables/axios'
import { ref } from 'vue'

export default function getCreateSubscription() {
  let password_field = ref('')

  const createSubscription = async (name: string) => {
    let params: any = { room_name: name }

    if (password_field.value.length) {
      params.password = password_field.value
    }

    const { axios } = useAxios()
    return await axios.post('chat/subscriptions', params)
  }

  return { password_field, createSubscription }
}
