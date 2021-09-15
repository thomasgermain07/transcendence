import { Ref, ref } from 'vue'
import { useAxios } from '../axios'
import requestStatus from '../requestStatus'

export default function getFetchUsers(status?: Ref) {
  let users = ref()

  const fetchUsers = async () => {
    const { axios } = useAxios()
    try {
      const { data } = await axios.get('users')
      users.value = data
      if (status) {
        status.value = requestStatus.success
      }
    } catch (e) {
      if (status) {
        status.value = requestStatus.error
      }
    }
  }

  return { users, fetchUsers }
}
