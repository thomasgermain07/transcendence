import { ref } from 'vue'

import { RoomType } from '@/types/chat/room'
import { UserType } from '@/types/user/user'
import { NotificationType } from '@/types/chat/notification'
import { MessageType } from '@/types/chat/message'
import { ConversationType } from '@/types/chat/conversation'

import getFetchRooms from './Rooms/fetchRooms'
import getFetchUsers from './Dms/fetchUsers'

import { useSocket } from '../socket'
import { useAuth } from '../auth'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
const { fetchRooms } = getFetchRooms()
const { fetchUsers } = getFetchUsers()

// -----------------------------------------------------------------------------
// Sockets
// -----------------------------------------------------------------------------
const dmSocket = useSocket('dm').socket
const chatSocket = useSocket('chat').socket

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const rooms = ref<RoomType[]>([])
const relatedUsers = ref<UserType[]>([])
const notifications = ref<NotificationType[]>([])

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------

export function useChat() {
  const loadData = async () => {
    try {
      rooms.value = await fetchRooms(true)
      relatedUsers.value = await fetchUsers()
    } catch (e) {
      console.error('Something went wrong with chat data')
    }
  }

  const joinSocket = () => {
    rooms.value.forEach((room: RoomType) => {
      chatSocket.emit('join', { room_id: room.id })
    })
    dmSocket.emit('join')
  }

  const listenSocket = () => {
    dmSocket.on('message', (message: MessageType) => {
      if (message.author.id != useAuth().user.id) {
        notifications.value.unshift({
          type: 'dm',
          target: message.author.id,
        })
      }
    })

    chatSocket.on('message', (message: MessageType) => {
      if (message.author.id != useAuth().user.id) {
        notifications.value.unshift({
          type: 'room',
          target: message.room.id,
        })
      }
    })
  }

  const reloadRooms = async () => {
    rooms.value = await fetchRooms(true)
  }

  const reloadRelatedUsers = async () => {
    relatedUsers.value = await fetchUsers()
  }

  const getConvs = () => {
    let convs: Array<ConversationType> = []

    rooms.value.forEach((room) => {
      convs.push({ type: 'room', target: room })
    })
    relatedUsers.value.forEach((user) => {
      convs.push({ type: 'dm', target: user })
    })

    return convs
  }

  return {
    dmSocket,
    chatSocket,
    rooms,
    relatedUsers,
    notifications,
    loadData,
    joinSocket,
    listenSocket,
    reloadRooms,
    reloadRelatedUsers,
    getConvs,
  }
}
