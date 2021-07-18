import axios from 'axios'
import { Ref, ref } from 'vue'
import fetchStatus from '../fetchStatus'

export default function fetchUser(status: Ref) {
  let user = ref()

  const getUser: any = async (id: string) => {
    try {
      const { data } = await axios.get(`users/${id}`)
      user.value = data
      status.value = fetchStatus.success
    } catch (e) {
      status.value = fetchStatus.error
    }
  }

  return { user, getUser }
}
