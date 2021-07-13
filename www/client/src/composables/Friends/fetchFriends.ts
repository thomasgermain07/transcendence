import { computed, ref, Ref } from 'vue'
import axios from 'axios'

interface IFriend {
  connected: true
  name: string
}

export function fetchFriends() {
  let friends = ref([])

  const getFriends = async () => {
    const { data } = await axios.get('users') // TODO : Replace to get user's friends when done in api
    friends.value = data
    friends.value?.map((friend: IFriend) => (friend.connected = true)) // TODO : replace when connection status in api side is done
  }

  return { friends, getFriends }
}

export function getFriendsByStatus(friends: Ref) {
  const onlineFriends = computed(() => {
    return friends.value?.filter((friend: IFriend) => friend.connected)
  })
  const offlineFriends = computed(() => {
    return friends.value?.filter((friend: IFriend) => !friend.connected)
  })

  return { onlineFriends, offlineFriends }
}
