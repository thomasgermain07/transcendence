import axios from 'axios'
import { Ref, ref } from 'vue'
import requestStatus from '../requestStatus'

export default function fetchUser(status: Ref) {
  let user = ref()

  const getUser: any = async (id: string) => {
    try {
      const { data } = await axios.get(`users/${id}`)
      user.value = data
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { user, getUser }
}
