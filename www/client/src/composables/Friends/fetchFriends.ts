import { Ref, ref } from 'vue'
import axios from 'axios'
import requestStatus from '../requestStatus'

export interface IFriend {
  connected: true
  name: string
}

export default function getFetchFriends(status: Ref) {
  let friends = ref([])

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get('users') // TODO : Replace to get user's friends when done in api
      friends.value = data
      friends.value?.map((friend: IFriend) => (friend.connected = true)) // TODO : delete when connection status in api side is done
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { friends, fetchFriends }
}
