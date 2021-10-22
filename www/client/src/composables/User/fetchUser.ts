import { UserType } from '@/types/user/user'
import { Ref, ref } from 'vue'
import { useAxios, AxiosErrType } from '../axios'
import requestStatus from '../requestStatus'

export default function getFetchUser(status?: Ref) {
  let user = ref<UserType>()

  const fetchUser: any = async (id: number) => {
    const { axios } = useAxios()

    try {
      const { data } = await axios.get(`users/${id}`)
      user.value = data
      if (status) {
        status.value = requestStatus.success
      }
    } catch (e: AxiosErrType) {
      if (status) {
        status.value = requestStatus.error
      }
    }
  }

  return { user, fetchUser }
}
