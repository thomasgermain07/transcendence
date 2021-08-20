import { computed, ref, Ref } from 'vue'
import { useAuth } from '../auth'
import { UserType } from '@/types/user/user'
import { FriendType } from '@/types/friend/friend'

export function getFriendsByName(friends: Ref) {
  let searchQuery = ref('')

  const friendsByName = computed(() => {
    return friends.value?.filter((friend: UserType) => {
      return friend.name
        .toLowerCase()
        .includes(searchQuery.value.trim().toLowerCase())
    })
  })

  return { searchQuery, friendsByName }
}

export function getFriendsByStatus(friends: Ref) {
  const onlineFriends = computed(() => {
    return friends.value?.filter((friend: UserType) => friend.connected)
  })
  const offlineFriends = computed(() => {
    return friends.value?.filter((friend: UserType) => !friend.connected)
  })

  return { onlineFriends, offlineFriends }
}
