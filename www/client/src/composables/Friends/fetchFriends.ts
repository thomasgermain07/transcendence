import { FriendType } from '@/types/friend/friend'
import { ref } from 'vue'
import { useAxios } from '../axios'

export default function getFetchFriends() {
  let friends = ref([])

  const fetchFriends = async () => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get('friends')
      friends.value = data
      friends.value?.map((friend: FriendType) => (friend.user.connected = true)) // TODEL
    } catch (e) {}
  }

  return { friends, fetchFriends }
}
