import { reactive } from '@vue/reactivity'

import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import getCreateMessage from '../Messages/createMessage'
import getFetchMessages from '../Messages/fetchMessages'
import getCreatePermission from './createPermission'
import getFetchPermissions from './fetchPermissions'
import getFetchRoom from './fetchRoom'
import getDeletePermission from './deletePermission'
import getDeleteSubscription from '@/composables/Chat/Subscription/deleteSubscription'

import { PermissionCreationType } from '@/types/chat/permission'
import { RoomDataType } from '@/types/chat/room_data'
import { AxiosErrType } from '@/composables/axios'

import { useSocket } from '@/composables/socket'

// -----------------------------------------------------------------------------
// Api usage
// -----------------------------------------------------------------------------
const { fetchRoom } = getFetchRoom()
const { fetchMessages } = getFetchMessages()
const { createMessage } = getCreateMessage()
const { fetchPermissions } = getFetchPermissions()
const { createPermission } = getCreatePermission()
const { deletePermission } = getDeletePermission()
const { deleteSubscription } = getDeleteSubscription()

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

let roomData = reactive<RoomDataType>({
  room: undefined,
  messages: [],
  moderators: [],
  muted: [],
  page: 1,
  max_msg: false,
  open_setting: false,
})

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useRoom() {
  const getData = async (id: number) => {
    try {
      roomData.room = await fetchRoom(id)
      roomData.messages = await fetchMessages(id, 1)
      roomData.moderators = await fetchPermissions(id, 'moderator')
      roomData.muted = await fetchPermissions(id, 'muted')
    } catch (e) {
      console.log(e)
    }
  }

  const reloadRoom = async () => {
    if (roomData.room) {
      getData(roomData.room.id as number)
    }
  }

  const getMessages = async (id: number, page: number) => {
    try {
      let messages = await fetchMessages(id, page)
      return messages
    } catch (e: any) {
      throw e
    }
  }

  const getPermissions = async (
    room_id: number,
    permission: 'moderator' | 'banned' | 'muted',
  ) => {
    try {
      let data = await fetchPermissions(room_id, permission)
      return data
    } catch (e) {
      throw e
    }
  }

  const sendMessage = async (room_id: number, msg: string) => {
    try {
      let res = await createMessage(room_id, msg)
      return res
    } catch (e: AxiosErrType) {
      console.log(e.response)
      return 'muted'
    }
  }

  const setPermission = async (permission: PermissionCreationType) => {
    try {
      await createPermission(permission)
    } catch (e) {
      throw e
    }
  }

  const revokePermission = async (userId: number, roomId: number) => {
    try {
      await deletePermission(userId, roomId)
    } catch (e) {
      console.log(e)
    }
  }

  const isModerator = (userID: number) => {
    let index = roomData.moderators.findIndex((perm) => perm.user.id == userID)
    return index != -1
  }

  const isMuted = (userID: number) => {
    return roomData.muted.find((perm) => perm.user.id == userID)
  }

  const leave = async () => {
    let roomId = roomData.room?.id
    if (!roomId) {
      return
    }

    await deleteSubscription(roomId as number).then(() => {
      useSocket('chat').socket.emit('leave', { room_id: roomId })
      createToast('Successfully left the room', {
        type: 'warning',
      })
    })
  }

  const resetData = () => {
    roomData.max_msg = false
    roomData.page = 1
    roomData.messages.length = 0
    roomData.open_setting = false
    roomData.messages = []
    roomData.moderators = []
    roomData.muted = []
  }

  return {
    roomData,
    getData,
    getMessages,
    getPermissions,
    reloadRoom,
    sendMessage,
    setPermission,
    revokePermission,
    isModerator,
    isMuted,
    leave,
    resetData,
  }
}
