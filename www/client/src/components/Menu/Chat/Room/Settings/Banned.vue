<template>
  <div class="content">
    <p>List of banned users</p>
    <div v-if="bannedUsers.length == 0">No banned user for this room</div>

    <div v-for="user in bannedUsers" :key="user">
      {{ user.name }}
      <button @click="onClickUnban(user.id)">unban</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoom } from '@/composables/Chat/Room/useRoom'
import { UserType } from '@/types/user/user'
import { useContextMenu } from '@/composables/useContextMenu'

export default defineComponent({
  setup() {
    const { onUnbanUser } = useContextMenu()

    let { roomData } = useRoom()

    const bannedUsers = computed(() => {
      let users: UserType[] = []

      roomData.banned.forEach((perm) => {
        users.unshift(perm.user)
      })

      return users
    })

    const onClickUnban = async (id: number) => {
      await onUnbanUser(id, roomData.room!.id as number)

      let index = roomData.banned.findIndex((perm) => perm.user.id == id)
      if (index != -1) {
        roomData.banned.splice(index, 1)
      }
    }

    return {
      banned: roomData.banned,
      bannedUsers,
      onClickUnban,
    }
  },
  emits: ['close'],
})
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: 5px;
}
</style>
