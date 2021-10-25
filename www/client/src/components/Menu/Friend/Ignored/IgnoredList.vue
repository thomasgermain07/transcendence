<template>
  <div class="user-container">
    <v-contextmenu ref="user-interaction" @hide="cm_user = undefined">
      <v-contextmenu-item @click="onProfile(cm_user)"
        >View Profile</v-contextmenu-item
      >
      <v-contextmenu-item @click="onUnblockUser(cm_user)"
        >Unblock</v-contextmenu-item
      >
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
import { ref, PropType, defineComponent } from 'vue'
import { UserType } from '@/types/user/user'
import { useContextMenu } from '@/composables/useContextMenu'

export default defineComponent({
  props: {
    Ignored: Array as PropType<Array<UserType>>,
  },
  setup(props, { emit }) {
    let cm_user = ref<UserType>()

    const { onProfile, onUnblockUser } = useContextMenu()

    return {
      cm_user,
      onProfile,
      onUnblockUser,
    }
  },
})
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
