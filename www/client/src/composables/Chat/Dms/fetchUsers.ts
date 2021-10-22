import { useAxios } from '@/composables/axios'

export default function getFetchUsers() {
  const fetchUsers = async () => {
    try {
      let { data } = await useAxios().axios.get('dm/users')
      return data
    } catch (e) {
    }
  }

  return { fetchUsers }
}
