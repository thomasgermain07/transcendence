<template>
  <div class="content">
    <p>List of banned users</p>
    <div v-for="user in bannedUsers" :key="user">
      {{ user.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted } from 'vue'
import getFetchPermissions from '@/composables/Chat/Room/fetchPermissions'
import { PermissionType } from '@/types/chat/permission'
import { useRoom } from '@/composables/Chat/Room/useRoom'
import { UserType } from '@/types/user/user'

export default {
  setup() {
    const { fetchPermissions } = getFetchPermissions()

    let banned: PermissionType[] = []
    let { roomData } = useRoom()

    onMounted(async () => {
      await fetchPermissions(roomData.room!.id as number, 'banned')
    })

    const bannedUsers = computed(() => {
      let users: UserType[] = []

      banned.forEach((perm) => {
        users.unshift(perm.user)
      })

      return users
    })

    return {
      banned,
      bannedUsers,
    }
  },
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 5px;
}
</style>
