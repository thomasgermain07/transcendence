import { UserType } from '@/types/user/user'
import { useAxios } from '../axios'

export default function getFriendInteraction() {
  const { axios } = useAxios()

  const addFriend = async (user: UserType) => {
    try {
      await axios.post('friends', { target_name: user.name })
    } catch (e) {
      console.log(e)
    }
  }

  const removeFriend = async (user: UserType) => {
    try {
      await axios.delete(`friends/${user.id}`)
    } catch (e) {
      console.log(e)
    }
  }

  return { addFriend, removeFriend }
}
