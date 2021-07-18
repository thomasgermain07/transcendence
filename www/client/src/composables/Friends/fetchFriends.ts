import { computed, ref, Ref } from 'vue'
import axios from 'axios'

export interface IFriend {
  connected: true
  name: string
}

export default function fetchFriends() {
  let friends = ref([])

  const getFriends = async () => {
    const { data } = await axios.get('users') // TODO : Replace to get user's friends when done in api
    friends.value = data
    friends.value?.map((friend: IFriend) => (friend.connected = true)) // TODO : replace when connection status in api side is done
  }

  return { friends, getFriends }
}
