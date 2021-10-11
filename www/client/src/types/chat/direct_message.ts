import { UserType } from '../user/user'

export type DirectMessageType = {
  author: UserType
  target: UserType
  content: String
}
