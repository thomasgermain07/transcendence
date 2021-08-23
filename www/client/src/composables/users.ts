import { ref, computed } from 'vue'

import { UsersService } from '@/services/users'

import { AxiosErrType } from './axios'

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useUsers() {
  // -------------------------------------------------------------------------
  // Datas
  // -------------------------------------------------------------------------
  const users = ref()

  // -------------------------------------------------------------------------
  // Functions
  // -------------------------------------------------------------------------
  async function get(id: number | undefined = undefined): Promise<void> {
    try {
      const res = await UsersService.get(id)

      console.log('useUsers.get: Done.')

      users.value = res.data
    } catch (err: AxiosErrType) {
      console.log('useUsers.get: Fail.')
    }

    return
  }

  return {
    // Datas
    users: computed(() => users.value),

    // Functions
    get,
  }
}
