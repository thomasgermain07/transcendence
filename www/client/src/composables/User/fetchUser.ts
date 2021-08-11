import { Ref, ref } from 'vue'
import { useAxios } from '../axios'
import requestStatus from '../requestStatus'

export default function fetchUser(status: Ref) {
  let user = ref()

  const getUser: any = async (id: string) => {
    const { axios } = useAxios()
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
