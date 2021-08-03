<template>
  <div class="room-ctn">Room chat here</div>
</template>

<script>
import fetchRoom from '../../../composables/Chat/Room/fetchRoom'

export default {
  setup() {
    let { room_id, getRoom } = fetchRoom()

    return {}
  },
}
</script>

<style scoped></style>
