import { ref, computed } from 'vue'

import { UserType } from '@/types/user/user'
import { FriendType } from '@/types/friend/friend'

import getFetchFriends from './fetchFriends'

import { useAuth } from '../auth'
import getFetchIgnored from '../Ignored/fetchIgnored'
import getFetchRequests from './fetchRequests'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
const { fetchFriends } = getFetchFriends()
const { fetchIgnored } = getFetchIgnored()
const { fetchRequests } = getFetchRequests()

// -----------------------------------------------------------------------------
// Sockets
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const friendsList = ref<FriendType[]>([])
const ignoredList = ref<FriendType[]>([])
const requestsList = ref<FriendType[]>([])

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useFriends() {
  let me = useAuth().user

  const loadData = async () => {
    friendsList.value = await fetchFriends()
    ignoredList.value = await fetchIgnored()
    requestsList.value = await fetchRequests()
  }

  const reloadFriends = async () => {
    friendsList.value = await fetchFriends()
  }

  const reloadIgnored = async () => {
    ignoredList.value = await fetchIgnored()
  }

  const reloadRequests = async () => {
    requestsList.value = await fetchRequests()
  }

  const friends = computed(() => {
    let friends: UserType[] = []

    friendsList.value.forEach((friend: FriendType) => {
      if (friend.user.id != me.id) {
        friends.unshift(friend.user)
      } else {
        friends.unshift(friend.target)
      }
    })

    // TODEL
    friends.forEach((friend) => {
      friend.connected = true
    })

    return friends
  })

  const ignored = computed(() => {
    let ignored: UserType[] = []

    ignoredList.value.forEach((relation: FriendType) => {
      if (relation.user.id != me.id) {
        ignored.unshift(relation.user)
      } else {
        ignored.unshift(relation.target)
      }
    })

    return ignored
  })

  const requests = computed(() => {
    return requestsList.value.filter(
      (request: FriendType) => request.target.id == useAuth().user.id,
    )
  })

  const hasPendingInvite = (user: UserType) => {
    if (
      requestsList.value.findIndex((request) => {
        return request.target.id == user.id
      }) != -1
    ) {
      return true
    }
    return false
  }

  return {
    friends,
    ignored,
    requests,
    loadData,
    reloadFriends,
    reloadIgnored,
    reloadRequests,
    hasPendingInvite,
  }
}
