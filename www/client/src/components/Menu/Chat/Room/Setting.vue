<template>
  <div class="setting-ctn">
    <header class="window-header">
      <i class="fas fa-arrow-left" @click="$emit('close')"></i>
      <p class="window-title">{{ Room.name }} settings</p>
      <i class="fas fa-arrow-left window-bar__separator"></i>
    </header>
    <div class="content">
      <AdminSetting v-if="is_admin" :Room="Room" />

      <div class="btn-ctn" v-if="!is_admin">
        <p class="label">Do you want to leave this room ?</p>
        <button class="action-btn">Leave</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/auth'
import AdminSetting from './AdminSetting.vue'

export default {
  components: {
    AdminSetting,
  },
  props: {
    Room: Object,
  },
  setup(props) {
    let is_admin = ref(useAuth().user.id == props.Room?.owner.id ? true : false)

    return { is_admin }
  },
}
</script>

<style scoped>
.setting-ctn {
  height: 100%;
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
