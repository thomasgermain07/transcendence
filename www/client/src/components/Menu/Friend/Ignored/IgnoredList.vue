<template>
  <div class="user-container">
    <v-contextmenu ref="user-interaction" @hide="cm_user = undefined">
      <v-contextmenu-item>View Profile</v-contextmenu-item>
      <v-contextmenu-item @click="removeBlockUser">Unblock</v-contextmenu-item>
    </v-contextmenu>

    <div
      class="user-item"
      v-for="user in Ignored"
      :key="user"
      @click.right="cm_user = user"
      v-contextmenu:user-interaction
    >
      {{ user.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, PropType } from 'vue'
import { UserType } from '@/types/user/user'
import getUserInteraction from '@/composables/User/getUserInteraction'

export default {
  props: {
    Ignored: Array as PropType<Array<UserType>>,
  },
  setup(props, { emit }) {
    let cm_user = ref<UserType>()

    const { unblockUser } = getUserInteraction()

    const removeBlockUser = async () => {
      if (cm_user.value == undefined) {
        return
      }
      await unblockUser(cm_user.value)
      emit('unblocked_user')
    }

    return { cm_user, removeBlockUser }
  },
}
</script>

<style scoped>
.user-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-item {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}
</style>
