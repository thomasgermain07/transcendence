import { useAxios } from '@/composables/axios'

export default function getCreateMessage() {
  const createMessage = async (id: number, content: string) => {
    try {
      await useAxios().axios.post('chat/messages', {
        room_id: id,
        content: content,
      })
    } catch (e) {
      console.log(e)
    }
  }

  return { createMessage }
}
