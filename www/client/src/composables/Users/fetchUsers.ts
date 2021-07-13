import axios from 'axios'
import { Ref, ref } from 'vue'

export function fetchUsers(loading: Ref) {
  let users = ref()

  const getUsers = async () => {
    const { data } = await axios.get('users')
    users.value = data
    loading.value = false
  }

  return { users, getUsers }
}
