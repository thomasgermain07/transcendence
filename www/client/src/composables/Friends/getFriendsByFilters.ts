import { computed, ref, Ref } from 'vue'
import { UserType } from '@/types/user/user'

function getFriendsWithoutIgnored(friends: UserType[], ignored: UserType[]) {
  return friends.filter((friend: UserType) => {
    return ignored.find((user) => user.id == friend.id) != undefined ? 0 : 1
  })
}

export function getFriendsByName(
  friends: Ref<UserType[]>,
  ignored: Ref<UserType[]>,
) {
  let searchQuery = ref('')

  const friendsByName = computed(() => {
    return getFriendsWithoutIgnored(friends.value, ignored.value).filter(
      (friend: UserType) => {
        return friend.name
          .toLowerCase()
          .includes(searchQuery.value.trim().toLowerCase())
      },
    )
  })

  return { searchQuery, friendsByName }
}

export function getFriendsByStatus(
  friends: Ref<UserType[]>,
  ignored: Ref<UserType[]>,
) {
  const onlineFriends = computed(() => {
    return friends.value?.filter(
      (friend: UserType) =>
        friend.connected && !ignored.value.find((user) => user.id == friend.id),
    )
  })
  const offlineFriends = computed(() => {
    return friends.value?.filter(
      (friend: UserType) =>
        !friend.connected &&
        !ignored.value.find((user) => user.id == friend.id),
    )
  })

  return { onlineFriends, offlineFriends }
}
