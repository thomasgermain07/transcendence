<template>
  <div class="friend-window">
    <a
      class="roll-menu"
      :class="{ 'roll-menu--open': showOnline }"
      @click="toggle_online"
    >
      Online
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOnline">
      <div
        class="friend-item"
        v-for="friend in onlineFriends"
        :key="friend"
        @click="$emit('open_chat', friend)"
      >
        {{ friend.nickname }}
        <i class="fas fa-circle status status--connected"></i>
      </div>
    </div>

    <a
      class="roll-menu"
      :class="{ 'roll-menu--open': showOffline }"
      @click="toggle_offline"
    >
      Offline
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOffline">
      <div
        class="friend-item"
        v-for="friend in offlineFriends"
        :key="friend"
        @click="$emit('open_chat', friend)"
      >
        {{ friend.nickname }}
        <i class="fas fa-circle status status--disconnected"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

interface Friend {
  connected: boolean
}

export default {
  setup() {
    let friends = ref<Friend[]>()

    const getFriends = async () => {
      const { data } = await axios.get(
        'https://60d5fd1b943aa60017768d55.mockapi.io/api/users',
      )
      friends.value = data
    }

    const onlineFriends = computed(() => {
      return friends.value?.filter((friend) => friend.connected)
    })
    const offlineFriends = computed(() => {
      return friends.value?.filter((friend) => !friend.connected)
    })

    onMounted(getFriends)

    return {
      getFriends,
      onlineFriends,
      offlineFriends,
    }
  },
  data() {
    return {
      showOnline: true,
      showOffline: false,
    }
  },
  emits: ['open_chat'],
  methods: {
    toggle_online() {
      this.showOnline = !this.showOnline
    },
    toggle_offline() {
      this.showOffline = !this.showOffline
    },
  },
}
</script>

<style scoped>
.friend-window {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.roll-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em;
  cursor: pointer;
  background-color: darkgrey;
}

.roll-menu--open {
  border-bottom: 2px solid black;
}

.roll-menu .arrow {
  transform: rotate(0deg);
  transition: linear 0.2s;
}

.roll-menu--open .arrow {
  transform: rotate(180deg);
}

.friend-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.friend-item {
  display: flex;
  justify-content: space-between;
  padding: 4px;
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

@keyframes slidein {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0%);
  }
}
</style>
