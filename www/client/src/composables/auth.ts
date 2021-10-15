import { reactive, readonly, computed } from 'vue'

import { router } from '@/router'
import { AuthService } from '@/services/auth'
import { useUsers } from '@/composables/users'

import { AxiosErrType } from './axios'
import { UserType } from '../types/user/user'
import { useSocket } from './socket'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const EXPIRATION = parseInt(import.meta.env.VITE_JWT_ACCESS_LIFETIME)
const TIMEOUT = Math.max(10, EXPIRATION - (EXPIRATION > 600 ? 300 : 30))
// const namespaces = ['matchmaker', 'game-rooms']

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type RegisterType = {
  name: string
  email: string
  password: string
}

export type LoginType = {
  email: string
  password: string
}

export type GoogleAuthType = {
  visible: boolean
  code: string
  user_id: number
}

export type EditType = {
  name: string
  newname: string
}

// -------------------------------------------------------------------------
// State
// -------------------------------------------------------------------------
const user = reactive<UserType>({
  id: 0,
  name: '',
  email: '',
  avatar: '',
  ladderLevel: 1,
  isTwoFactorAuthenticationEnabled: false,
  connected: true,
})
const is_authenticated = computed(() => !(user.id === 0))

const googleCode = reactive<GoogleAuthType>({
  visible: false,
  user_id: 0,
  code: '',
})
// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useAuth() {
  // -------------------------------------------------------------------------
  // Functions
  // -------------------------------------------------------------------------
  async function register(payload: RegisterType): Promise<void> {
    try {
      const res = await AuthService.register(payload)

      console.log('useAuth.register: Done.')

      router.push({ name: 'auth-login' })
    } catch (err: AxiosErrType) {
      console.log('useAuth.register: Fail.')

      throw err
    }

    return
  }

  async function login(payload: LoginType): Promise<void> {
    try {
      const res = await AuthService.login(payload)

      console.log('useAuth.login: Done.')

      if (!res.data || !res.data.two_factor_enabled) {
        const { users, get } = useUsers()
        await get()
        setUser(users.value)
        setAuthenticated(true)
        router.replace({ name: 'index' })
      } else {
        console.log(res)
        googleCode.user_id = res.data.user_id
        googleCode.visible = true
      }
    } catch (err: AxiosErrType) {
      console.log('useAuth.login: Fail.')

      throw err
    }

    return
  }

  async function loginMarvin(code: string): Promise<void> {
    try {
      const res = await AuthService.loginMarvin(code)

      console.log('useAuth.loginMarvin: Done.')

      if (!res.data || !res.data.two_factor_enabled) {
        const { users, get } = useUsers()
        await get()
        setUser(users.value)
        setAuthenticated(true)
        router.replace({ name: 'index' })
      } else {
        googleCode.user_id = res.data.user_id
        googleCode.visible = true
      }
    } catch (err: AxiosErrType) {
      console.log('useAuth.loginMarvin: Fail.')

      throw err
    }

    return
  }

  async function refresh(): Promise<void> {
    try {
      const res = await AuthService.refresh()

      console.log('useAuth.refresh: Done.')

      if (!is_authenticated.value) {
        const { users, get } = useUsers()

        await get()

        setUser(users.value)
      }

      setAuthenticated(true)
    } catch (err: AxiosErrType) {
      console.log('useAuth.refresh: Fail.')

      logout(true)
      return
    }

    // Refresh the socket connections
    // const namespaces = ['chat', 'matchmaker', 'game-rooms']
    // namespaces.forEach((nsp) => {
    //   useSocket(nsp).refresh()
    // })

    return
  }

  function autoRefresh(): void {
    if (is_authenticated.value) refresh()

    setTimeout(autoRefresh, TIMEOUT * 1000)
  }

  async function logout(soft: boolean = false): Promise<void> {
    if (!soft) {
      try {
        const res = await AuthService.logout()

        console.log('useAuth.logout: (Hard) Done.')
      } catch (err: AxiosErrType) {
        console.log('useAuth.logout: (Hard) Fail.')
      }
    }

    console.log('useAuth.logout: (Soft) Done.')

    setUser()
    setAuthenticated(false)
    googleCode.visible = false
    googleCode.user_id = 0
    router.replace({ name: 'auth-login' })

    const namespaces = ['user', 'dm', 'chat', 'matchmaker', 'game-rooms']
    namespaces.forEach((nsp) => {
      useSocket(nsp).close()
    })

    useSocket('dm').close()
    useSocket('chat').close()
    useSocket('user').close()

    return
  }

  async function edit(payload: EditType): Promise<void> {
    try {
      const res = await AuthService.edit(payload)
      if (res) {
        const { users, get } = useUsers()
        await get()
        setUser(users.value)
      }
      console.log('useAuth.editing: Done.')
    } catch (err: AxiosErrType) {
      console.log('useAuth.editing: Fail.')

      throw err
    }

    return
  }

  async function activateTwoFa(): Promise<string> {
    try {
      const res = await AuthService.activate2Fa()
      if (res) {
        const { users, get } = useUsers()
        await get()
        setUser(users.value)
      }
      console.log('useAuth.activate2fa: Done.')

      return res
    } catch (err: AxiosErrType) {
      console.log('useAuth.activate2Fa: Fail.')

      throw err
    }
  }

  async function deactivateTwoFa(): Promise<string> {
    try {
      const res = await AuthService.deactivate2Fa()
      if (res) {
        const { users, get } = useUsers()
        await get()
        setUser(users.value)
      }
      console.log('useAuth.deactivate2fa: Done.')

      return res
    } catch (err: AxiosErrType) {
      console.log('useAuth.deactivate2Fa: Fail.')

      throw err
    }
  }

  async function verifyCode(code: GoogleAuthType): Promise<string> {
    try {
      const res = await AuthService.verifyCode(code)

      const { users, get } = useUsers()

      await get()

      console.log('useAuth.verifyCode: Done.')
      setUser(users.value)
      setAuthenticated(true)
      router.replace({ name: 'index' })
      return res
    } catch (err: AxiosErrType) {
      console.log('useAuth.verifyCode: Fail.')

      throw err
    }
  }

  function isPreviouslyAuthenticated(): boolean {
    return localStorage.getItem('auth') === true.toString()
  }

  // -------------------------------------------------------------------------
  // Exposes
  // -------------------------------------------------------------------------
  return {
    // State
    user: readonly(user),
    is_authenticated,
    googleCode,
    // Datas

    // Functions
    register,
    login,
    loginMarvin,
    refresh,
    autoRefresh,
    logout,
    edit,
    activateTwoFa,
    deactivateTwoFa,
    verifyCode,
    isPreviouslyAuthenticated,
  }
}

// -----------------------------------------------------------------------------
// Private functions
// -----------------------------------------------------------------------------
function setAuthenticated(authenticated: boolean): void {
  localStorage.setItem('auth', authenticated.toString())
}

function setUser(data: UserType | undefined = undefined) {
  user.id = data?.id ?? 0
  user.name = data?.name ?? ''
  user.email = data?.email ?? ''
  user.avatar = data?.avatar ?? ''
  user.ladderLevel = data?.ladderLevel ?? 1
  user.isTwoFactorAuthenticationEnabled =
    data?.isTwoFactorAuthenticationEnabled ?? false
}
