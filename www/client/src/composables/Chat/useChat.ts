import { ref, computed } from 'vue'

import { RoomType } from '@/types/chat/room'
import { UserType } from '@/types/user/user'
import { NotificationType } from '@/types/chat/notification'
import { MessageType } from '@/types/chat/message'
import { ConversationType } from '@/types/chat/conversation'
import getFetchRooms from './Rooms/fetchRooms'
import getFetchUsers from './Dms/fetchUsers'

import { useSocket } from '../socket'
import { useAuth } from '../auth'
import { useWindowInteraction } from './WindowInteraction/useWindowInteraction'
import { DirectMessageType } from '@/types/chat/direct_message'
import { useFriends } from '../Friends/useFriends'

const { fetchRooms } = getFetchRooms()
const { fetchUsers } = getFetchUsers()

const rooms = ref<RoomType[]>([])
const relatedUsers = ref<UserType[]>([])
const notifications = ref<NotificationType[]>([])

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
      useSocket('chat').socket.emit('join', { room_id: room.id })
    })
    useSocket('dm').socket.emit('join')
  }

  const listenSocket = () => {
    useSocket('dm').socket.on('message', (message: DirectMessageType) => {
      if (message.author.id == useAuth().user.id) {
        return
      }

      if (isOpenned('dm', message.author.id)) {
        return
      }

      let user = relatedUsers.value.find((user) => user.id == message.author.id)
      if (user == undefined) {
        relatedUsers.value.push(message.author)
      }

      notifications.value.push({
        type: 'dm',
        target: message.author.id,
      })
    })

    useSocket('chat').socket.on('message', (message: MessageType) => {
      if (message.author.id == useAuth().user.id) {
        return
      }

      if (
        isOpenned('room', message.room.id as number) ||
        useFriends().isBlocked(message.author.id)
      ) {
        return
      }

      notifications.value.push({
        type: 'room',
        target: message.room.id,
      })
    })
  }

  const reloadRooms = async () => {
    rooms.value = await fetchRooms(true)
  }

  const reloadRelatedUsers = async () => {
    relatedUsers.value = await fetchUsers()
  }

  const readNotif = (room_id: Number) => {
    notifications.value = notifications.value.filter(
      (notif) => notif.target != room_id,
    )
  }

  const convs = computed(() => {
    let convs: Array<ConversationType> = []

    rooms.value.forEach((room) => {
      convs.push({ type: 'room', target: room })
    })
    relatedUsers.value.forEach((user) => {
      convs.push({ type: 'dm', target: user })
    })

    notifications.value.forEach((notif) => {
      let conv = convs.find((conv) => {
        return conv.type == notif.type && conv.target.id == notif.target
      })
      if (conv) {
        conv.notification = true
        let index = convs.indexOf(conv)
        convs.splice(index, 1)
        convs.unshift(conv)
      }
    })

    return convs
  })

  const getBanFrom = (id: number) => {
    let index = rooms.value.findIndex((room) => room.id == id)
    if (index != -1) {
      rooms.value.splice(index, 1)
    }
  }

  return {
    rooms,
    relatedUsers,
    notifications,
    convs,
    loadData,
    joinSocket,
    listenSocket,
    reloadRooms,
    reloadRelatedUsers,
    readNotif,
    getBanFrom,
  }
}

function isOpenned(type: string, id: number) {
  return useWindowInteraction().chat_view.value == type &&
    useWindowInteraction().conv_id.value == id
    ? true
    : false
}
