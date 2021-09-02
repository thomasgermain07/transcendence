import { useAxios } from '@/composables/axios'
import { ref } from 'vue'
import { MessageType } from '@/types/chat/message'

export default function getFetchMessages() {
  let messages = ref<MessageType[]>()

  const fetchMessages = async (room_id: number) => {
    try {
      const { data } = await useAxios().axios.get('chat/messages', {
        params: {
          room_id: room_id,
          page: 0,
        },
      })
      messages.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { messages, fetchMessages }
}
