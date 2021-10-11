import { Ref, ref } from 'vue'
import { useAxios } from '../axios'
import requestStatus from '../requestStatus'

export default function getFetchUsers(status?: Ref, loading?: Ref, search?: Ref) {
  let users = ref([])
  let oldOffset = ref(-1)
  let offset = ref(0)
  let limit = 20
  const fetchUsers = async () => {
    const { axios } = useAxios()
    try {
      loading.value = true
      
      offset.value = users.value.length;
      if (oldOffset.value == offset.value) {
        loading.value = false
        return
      }
      oldOffset.value = offset.value
      const response = await axios.get(`users/users?offset=${offset.value}&limit=${limit}&search=${search.value}`)

      if (response) {
        if (users.value && response.data.length > 0)
        {
          response.data.forEach((element: any) => {
            users.value.push(element)
          });
        }
        else if (response.data.length > 0)
        {
          users.value = response.data
        }
        loading.value = false
      }
    } catch (e) {
      status.value = requestStatus.error
    }
  }

  return { users, fetchUsers, oldOffset, offset }
}
