import { ref } from '@vue/reactivity'
import { useAxios } from '../axios'
import { useAuth } from '../auth'
import { FriendType } from '@/types/friend/friend'

export default function getFetchRequest() {
  const { axios } = useAxios()
  const requests = ref([])

  const fetchRequest = async () => {
    try {
      const { data } = await axios.get('friends?pending=true')
      requests.value = data.filter(
        (request: FriendType) => request.target.id == useAuth().user.id,
      )
    } catch (e) {
      console.log(e)
    }
  }

  return { requests, fetchRequest }
}
