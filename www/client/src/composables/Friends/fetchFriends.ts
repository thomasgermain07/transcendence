import { FriendType } from '@/types/friend/friend'
import { UserType } from '@/types/user/user'
import { ref } from 'vue'
import { useAuth } from '../auth'
import { useAxios } from '../axios'

export default function getFetchFriends() {
  let friends = ref<UserType[]>([])
  let meID = useAuth().user.id

  const fetchFriends = async () => {
    friends.value = []
    try {
      const { data } = await useAxios().axios.get('friends')
      data.forEach((friend: FriendType) => {
        if (friend.user.id != meID) {
          friends.value.unshift(friend.user)
        } else {
          friends.value.unshift(friend.target)
        }
      })

      // TODEL
      friends.value.forEach((friend) => {
        friend.connected = true
      })
    } catch (e) {
      console.log(e)
    }
  }

  return { friends, fetchFriends }
}
