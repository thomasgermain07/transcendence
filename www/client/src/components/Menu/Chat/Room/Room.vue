<template>
  <div class="room-ctn">
    <div class="messages-ctn">msg</div>
    <div class="input-ctn">
      <input type="text" class="input__txt" />
      <button class="input__btn">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUpdate, onMounted, ref } from 'vue'
import getFetchRoom from '@/composables/Chat/Room/fetchRoom'
import requestStatus from '@/composables/requestStatus'

export default {
  props: {
    room_id: Number,
  },
  setup(props) {
    let status = ref(requestStatus.loading)
    let { room, fetchRoom } = getFetchRoom(status)

    onMounted(() => (props.room_id == 0 ? null : fetchRoom(props.room_id!)))
    onBeforeUpdate(() => fetchRoom(props.room_id!))

    return { room, fetchRoom }
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

.input-ctn {
  flex-basis: 30px;
  background-color: lightgray;
  border-top: 2px solid black;
  display: flex;
}

.input__txt {
  flex-grow: 2;
}

.input__btn {
  flex-grow: 1;
}
</style>
