import { useAxios } from '../axios'
import { ref } from 'vue'
import { UserType } from '@/types/user/user'
import { FriendType } from '@/types/friend/friend'
import { useAuth } from '../auth'

export default function getFetchIgnored() {
  let ignored = ref<UserType[]>([])
  let meID = useAuth().user.id

  const fetchIgnored = async () => {
    ignored.value = []
    try {
      const { data } = await useAxios().axios.get('ignoreds')
      data.forEach((relation: FriendType) => {
        if (relation.user.id != meID) {
          ignored.value.unshift(relation.user)
        } else {
          ignored.value.unshift(relation.target)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return { ignored, fetchIgnored }
}
