import { UserType } from '../user/user'

export type FriendType = {
  accepted: boolean
  user: UserType
  target: UserType
}
