import { useAxios } from '@/composables/axios'
import { PermissionCreationType } from '@/types/chat/permission'

export default function getCreatePermission() {
  const createPermission = async (permission: PermissionCreationType) => {
    try {
      await useAxios().axios.post('chat/permissions', permission)
    } catch (e) {
      throw e
    }
  }

  return {
    createPermission,
  }
}
