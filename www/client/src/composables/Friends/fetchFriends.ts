import { UserType } from '@/types/user/user'
import { Ref, ref } from 'vue'
import { useAxios } from '../axios'
import requestStatus from '../requestStatus'

export default function getFetchFriends(status: Ref) {
  let friends = ref([])

  const fetchFriends = async () => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get('friends')
      // const { data } = await axios.get('users') // TODO : replace url for friends
      friends.value = data
      friends.value?.map((friend: UserType) => (friend.connected = true)) // TODEL
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { friends, fetchFriends }
}
