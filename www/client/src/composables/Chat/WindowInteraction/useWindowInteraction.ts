import { ref } from 'vue'

import { UserType } from '@/types/user/user'
import { RoomType } from '@/types/chat/room'

let window_open = ref(false)
let chat_open = ref(false)
let notification = ref(false)

let chat_view = ref('')
let conv_id = ref(0)

let page_title = ref('')

export function useWindowInteraction() {
  const openWindow = () => {
    window_open.value = true
    if (notification.value) {
      chat_open.value = true
    }
  }
  const closeWindow = () => {
    window_open.value = false
    notification.value = false
    chat_open.value = false
  }

  const setPageTitle = (title: string) => {
    page_title.value = title
  }

  const openChat = () => {
    chat_open.value = true
    setPageTitle('')
  }

  const closeChat = () => {
    chat_open.value = false
    setPageTitle('')
  }

  const closeChatView = () => {
    chat_view.value = ''
    conv_id.value = 0
    setPageTitle('')
  }

  const openDm = (user: UserType) => {
    if (!window_open.value) {
      openWindow()
    }
    if (!chat_open.value) {
      openChat()
    }
    chat_view.value = 'dm'
    setPageTitle(user.name)
    conv_id.value = user.id
  }

  const openRoom = (room: RoomType) => {
    if (!chat_open.value) {
      openChat()
    }
    chat_view.value = 'room'
    setPageTitle(room.name as string)
    conv_id.value = room.id as number
  }

  const openCreate = () => {
    conv_id.value = 0
    chat_view.value = 'create'
    setPageTitle('Create Room')
  }

  const openJoin = () => {
    conv_id.value = 0
    chat_view.value = 'join'
    setPageTitle('Join a Room')
  }

  return {
    window_open,
    chat_open,
    notification,
    conv_id,
    chat_view,
    page_title,
    openWindow,
    closeWindow,
    openChat,
    closeChat,
    openDm,
    openRoom,
    openCreate,
    openJoin,
    closeChatView,
    setPageTitle,
  }
}
