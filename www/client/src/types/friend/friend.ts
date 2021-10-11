import { UserType } from '../user/user'

// -----------------------------------------------------------------------------
// User Type
// -----------------------------------------------------------------------------
export type FriendType = {
  accepted: boolean
  user: UserType
  target: UserType
}
