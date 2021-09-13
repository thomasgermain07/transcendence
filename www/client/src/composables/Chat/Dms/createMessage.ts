import { useAxios } from '@/composables/axios'

export default function getCreateMessage() {
  const createMessage = async (id: Number, content: String) => {
    try {
      await useAxios().axios.post('dm/messages', {
        target_id: id,
        content: content,
      })
    } catch (e) {
      console.log(e)
    }
  }

  return { createMessage }
}
