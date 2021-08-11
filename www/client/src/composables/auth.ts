import { reactive, readonly, computed } from 'vue'

import { router } from '@/router'
import { AuthService } from '@/services/auth'
import { useUsers } from '@/composables/users'

import { AxiosErrType } from './axios'
import { UserType } from '../types/user/user'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const EXPIRATION = parseInt(import.meta.env.VITE_JWT_ACCESS_LIFETIME)
const TIMEOUT = Math.max(10, EXPIRATION - (EXPIRATION > 600 ? 300 : 30))

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

// -------------------------------------------------------------------------
// State
// -------------------------------------------------------------------------
const user = reactive<UserType>({
  id: 0,
  name: '',
  email: '',
  ladderLevel: 1,
})
const is_authenticated = computed(() => !(user.id === 0))

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

      const { users, get } = useUsers()

      await get()

      setUser(users.value)
      setAuthenticated(true)

      router.replace({ name: 'index' })
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

      const { users, get } = useUsers()

      await get()

      setUser(users.value)
      setAuthenticated(true)

      router.replace({ name: 'index' })
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
    }

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

    router.replace({ name: 'auth-login' })

    return
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

    // Datas

    // Functions
    register,
    login,
    loginMarvin,
    refresh,
    autoRefresh,
    logout,

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
  user.ladderLevel = data?.ladderLevel ?? 1
}
