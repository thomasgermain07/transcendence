import axios from 'axios'
import { Ref, ref } from 'vue'

export default function getFetchUsers(loading: Ref) {
  let users = ref()

  const fetchUsers = async () => {
    const { data } = await axios.get('users')
    users.value = data
    loading.value = false
  }

  return { users, fetchUsers }
}
