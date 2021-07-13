import axios from 'axios'
import { Ref, ref } from 'vue'

export function fetchUser(id: string, loading: Ref) {
  let user = ref()

  const getUser = async () => {
    const { data } = await axios.get(`users/${id}`)
    user.value = data
    loading.value = false
  }

  return { user, getUser }
}
