<template>
  <div class="room-ctn">
    <div class="messages-ctn">
      <Setting
        v-if="open_setting"
        @close="open_setting = false"
        @leave="$emit('leave')"
        :Room="room"
      />
    </div>
    <div class="bar">
      <i
        class="fas fa-cogs setting-btn"
        @click="open_setting = !open_setting"
      ></i>
      <div class="bar__input" v-if="!open_setting">
        <input type="text" class="input__field" />
        <div class="input__btn">Send</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue'

import Setting from './Setting.vue'

import getFetchRoom from '@/composables/Chat/Room/fetchRoom'
import requestStatus from '@/composables/requestStatus'

export default {
  props: {
    room_id: Number,
  },
  components: {
    Setting,
  },
  setup(props) {
    let status = ref(requestStatus.loading)
    let open_setting = ref(false)
    let { room, fetchRoom } = getFetchRoom(status)

    onMounted(() => (props.room_id == 0 ? null : fetchRoom(props.room_id!)))

    watch(
      () => props.room_id,
      (new_value) => {
        fetchRoom(new_value as Number)
        open_setting.value = false
      },
    )

    return { open_setting, room, fetchRoom }
  },
}
</script>

<style scoped>
.room-ctn {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.messages-ctn {
  flex-grow: 1;
}

.bar {
  background-color: lightgray;
  border-top: 2px solid black;
  display: flex;
  justify-content: space-between;
}

.bar__input {
  flex-grow: 1;
  display: flex;
}

.input__field {
  width: 80%;
}

.input__btn {
  width: 15%;
  padding: 5px;
  border-left: 2px solid black;
}

.setting-btn {
  padding: 5px;
  border-right: 2px solid black;
  cursor: pointer;
}
</style>
