import { Ref, ref } from 'vue'
import { useAxios } from '../axios'

export default function getFetchUsers(loading: Ref) {
  let users = ref()

  const fetchUsers = async () => {
    const { axios } = useAxios()
    // TODO : Try catch block
    const { data } = await axios.get('users')
    users.value = data
    loading.value = false
  }

  return { users, fetchUsers }
}
