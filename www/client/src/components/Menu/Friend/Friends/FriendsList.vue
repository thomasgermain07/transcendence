<template>
  <div class="friend-container">
    <div
      class="friend-item"
      v-for="friend in friends"
      :key="friend"
      @click="$emit('open_chat')"
    >
      {{ getFriend(friend).name }}
      <!-- TODO : getFriend(connected) for status conne -->
      <i
        class="fas fa-circle status"
        :class="
          getFriend(friend).connected
            ? 'status--connected'
            : 'status--disconnected'
        "
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/composables/auth'
import { FriendType } from '@/types/friend/friend'

export default {
  props: {
    friends: Object,
  },
  setup() {
    let me = useAuth().user

    const getFriend = (friend: FriendType) => {
      return friend.user.id == me.id ? friend.target : friend.user
    }

    return { getFriend }
  },
}
</script>

<style scoped>
.friend-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.friend-item {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.status {
  font-size: 0.7em;
  align-self: center;
}

.status--connected {
  color: green;
}

.status--disconnected {
  color: red;
}
</style>
