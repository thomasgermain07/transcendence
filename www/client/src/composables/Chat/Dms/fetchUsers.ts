import { useAxios } from '@/composables/axios'
import { UserType } from '@/types/user/user'
import { ref } from 'vue'

export default function getFetchUsers() {
  let relatedUsers = ref<UserType[]>()

  const fetchUsers = async () => {
    try {
      let { data } = await useAxios().axios.get('dm/users')
      relatedUsers.value = data
    } catch (e) {
      console.log(e)
    }
  }

  return { relatedUsers, fetchUsers }
}
