<template>
  <div class="friend-container">
    <v-contextmenu ref="contextmenu">
      <FriendsListCM :User="cm_user" />
    </v-contextmenu>

    <div
      class="friend-item"
      v-for="friend in Friends"
      :key="friend"
      @click.left="openDm(friend)"
      @click.right="onRightClick(friend)"
      v-contextmenu:contextmenu
    >
      {{ friend.name }}
      <i
        class="fas fa-circle status"
        :class="{
          'status--connected': friend.status == 'connected',
          'status--disconnected': friend.status == 'disconnected',
          'status--ingame': friend.status == 'ingame',
        }"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'

import FriendsListCM from './FriendsListCM.vue'

import { UserType } from '@/types/user/user'

import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/windowInteraction'

export default {
  props: {
    Friends: Array as PropType<Array<UserType>>,
  },
  components: {
    FriendsListCM,
  },
  setup(props, { emit }) {
    let cm_user = ref<UserType>()

    const { openDm } = useWindowInteraction()

    const onRightClick = (user: UserType) => {
      cm_user.value = user
    }

    return {
      cm_user,
      openDm,
      onRightClick,
    }
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

.status--ingame {
  color: yellow;
}

.status--disconnected {
  color: red;
}
</style>
