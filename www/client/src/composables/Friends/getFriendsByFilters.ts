import { computed, ref, Ref } from 'vue'
import { IFriend } from './fetchFriends'

export function getFriendsByName(friends: any) {
  let searchQuery = ref('')

  const friendsByName = computed(() => {
    return friends.value?.filter((friend: any) => {
      return friend.name
        .toLowerCase()
        .includes(searchQuery.value.trim().toLowerCase())
    })
  })

  return { searchQuery, friendsByName }
}

export function getFriendsByStatus(friends: Ref) {
  const onlineFriends = computed(() => {
    return friends.value?.filter((friend: IFriend) => friend.connected)
  })
  const offlineFriends = computed(() => {
    return friends.value?.filter((friend: IFriend) => !friend.connected)
  })

  return { onlineFriends, offlineFriends }
}
