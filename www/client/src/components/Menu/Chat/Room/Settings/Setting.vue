<template>
  <div class="setting-ctn">
    <header class="window-header">
      <i class="fas fa-arrow-left" @click="$emit('close')"></i>
      <p class="window-title">{{ room.name }} settings</p>
      <i class="fas fa-arrow-left window-bar__separator"></i>
    </header>
    <div class="content">
      <AdminSetting
        v-if="is_owner"
        @close="$emit('close')"
        @delete="$emit('leave')"
      />

      <div class="btn-ctn" v-if="!is_owner">
        <p class="label">Do you want to leave this room ?</p>
        <button class="action-btn" @click="onLeave">Leave</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

import AdminSetting from './AdminSetting.vue'

import { useAuth } from '@/composables/auth'

import { useRoom } from '@/composables/Chat/Room/useRoom'

export default {
  components: {
    AdminSetting,
  },
  setup(props, { emit }) {
    const { roomData, leave } = useRoom()

    let is_owner = ref(
      useAuth().user.id == roomData.room!.owner.id ? true : false,
    )

    const onLeave = async () => {
      await leave()
      emit('leave')
      emit('close')
    }

    return {
      is_owner,
      room: roomData.room,
      onLeave,
    }
  },
  emit: ['close', 'leave'],
}
</script>

<style scoped>
.setting-ctn {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  padding: 5px;
}
</style>
