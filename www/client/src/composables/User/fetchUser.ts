import { Ref, ref } from 'vue'
import { useAxios } from '../axios'
import requestStatus from '../requestStatus'

export default function getFetchUser(status: Ref) {
  let user = ref()

  const fetchUser: any = async (id: number) => {
    const { axios } = useAxios()

    try {
      const { data } = await axios.get(`users/${id}`)
      user.value = data
      status.value = requestStatus.success
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { user, fetchUser }
}
