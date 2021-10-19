// -----------------------------------------------------------------------------
// User Type
// -----------------------------------------------------------------------------
export type UserType = {
  id: number
  name: string
  email: string
  avatar: string
  ladderLevel: number
  isTwoFactorAuthenticationEnabled: boolean
  status: string
  first_log: boolean
};

export type UserUpdateType = Partial<UserType>;