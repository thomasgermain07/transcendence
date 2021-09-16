import { useAxios } from '@/composables/axios'
import { DirectMessageType } from '@/types/chat/direct_message'
import { ref } from 'vue'

export default function getFetchMessages() {
  let messages = ref<DirectMessageType[]>([])

  const fetchMessages = async (id: Number) => {
    try {
      const { data } = await useAxios().axios.get('dm/messages/', {
        params: { target: id, page: 0 },
      })
      messages.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { messages, fetchMessages }
}
