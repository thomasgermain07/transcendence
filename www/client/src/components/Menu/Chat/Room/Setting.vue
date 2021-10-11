<template>
  <div class="setting-ctn">
    <header class="window-header">
      <i class="fas fa-arrow-left" @click="$emit('close')"></i>
      <p class="window-title">{{ Room.name }} settings</p>
      <i class="fas fa-arrow-left window-bar__separator"></i>
    </header>
    <div class="content">
      <AdminSetting v-if="is_owner" :Room="Room" />

      <div class="btn-ctn" v-if="!is_owner">
        <p class="label">Do you want to leave this room ?</p>
        <button class="action-btn" @click="leave">Leave</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

import getDeleteSubscription from '@/composables/Chat/Subscription/deleteSubscription'

import AdminSetting from './AdminSetting.vue'

import { useAuth } from '@/composables/auth'

import { useSocket } from '@/composables/socket'

export default {
  components: {
    AdminSetting,
  },
  props: {
    Room: Object,
  },
  setup(props, { emit }) {
    let is_owner = ref(useAuth().user.id == props.Room?.owner.id ? true : false)

    const { deleteSubscription } = getDeleteSubscription()

    const leave = async () => {
      await deleteSubscription(props.Room!.id).then(() => {
        useSocket('chat').socket.emit('leave', { room_id: props.Room!.id })
      })
      emit('leave')
      emit('close')
    }

    return { is_owner, leave }
  },
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
