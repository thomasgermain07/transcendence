import { useAxios } from '@/composables/axios'

export default function getDeleteSubscription() {
  const deleteSubscription = async (id: number) => {
    try {
      await useAxios().axios.delete(`chat/subscriptions?room_id=${id}`)
      console.log('Left room')
    } catch (e) {
      console.log(e)
    }
  }

  return { deleteSubscription }
}
