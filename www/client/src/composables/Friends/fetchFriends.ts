import { Ref, ref } from 'vue'
import axios from 'axios'
import requestStatus from '../requestStatus'

export interface IFriend {
  connected: true
  name: string
}

export default function fetchFriends(status: Ref) {
  let friends = ref([])

  const getFriends = async () => {
    try {
      const { data } = await axios.get('users') // TODO : Replace to get user's friends when done in api
      friends.value = data
      friends.value?.map((friend: IFriend) => (friend.connected = true)) // TODO : delete when connection status in api side is done
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { friends, getFriends }
}
