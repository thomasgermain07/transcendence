import { computed, ref, Ref } from 'vue'
import { FriendType } from '@/types/friend/friend'

export function getFriendsByName(friends: Ref) {
  let searchQuery = ref('')

  const friendsByName = computed(() => {
    return friends.value?.filter((friend: FriendType) => {
      return friend.user.name
        .toLowerCase()
        .includes(searchQuery.value.trim().toLowerCase())
    })
  })

  return { searchQuery, friendsByName }
}

export function getFriendsByStatus(friends: Ref) {
  const onlineFriends = computed(() => {
    return friends.value?.filter((friend: FriendType) => friend.user.connected)
  })
  const offlineFriends = computed(() => {
    return friends.value?.filter((friend: FriendType) => !friend.user.connected)
  })

  return { onlineFriends, offlineFriends }
}
