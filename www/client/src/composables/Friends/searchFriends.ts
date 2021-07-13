import { computed, ref } from 'vue'

export default function searchFriendsByName(friends: any) {
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
