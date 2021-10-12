import { MessageType } from './message'
import { RoomType } from './room'
import { PermissionType } from './permission'

export type RoomDataType = {
  room: RoomType | undefined
  messages: MessageType[]
  moderators: PermissionType[]
  muted: PermissionType[]
  banned: PermissionType[]
  page: number
  max_msg: boolean
  open_setting: boolean
}
