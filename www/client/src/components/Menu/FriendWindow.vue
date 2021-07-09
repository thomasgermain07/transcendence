<template>
  <div class="friend-window" name="Rechercher">
    <form class="search-bar-container">
      <i class="fas fa-search search-icon"></i>
      <input v-model="searchValue" class="search-bar" placeholder="Search" />
      <i class="fas fa-times search-reset" @click="resetValue"></i>
    </form>

    <div class="search-container" v-if="searchValue">
      <div class="friend-item" v-for="friend in searchFriends" :key="friend">
        {{ friend.nickname }}
        <i
          v-if="friend.connected"
          class="fas fa-circle status status--connected"
        ></i>
        <i v-else class="fas fa-circle status status--disconnected"></i>
      </div>
    </div>

    <a
      v-if="!searchValue"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOnline }"
      @click="toggle_online"
    >
      Online
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOnline && !searchValue">
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
      v-if="!searchValue"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOffline }"
      @click="toggle_offline"
    >
      Offline
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOffline && !searchValue">
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
  nickname: string
}

export default {
  setup() {
    let friends = ref<Friend[]>()
    let searchValue = ref()

    const getFriends = async () => {
      const { data } = await axios.get(
        'https://60d5fd1b943aa60017768d55.mockapi.io/api/users',
      )
      friends.value = data
    }
    const resetValue = () => {
      searchValue.value = ''
    }

    const onlineFriends = computed(() => {
      return friends.value?.filter((friend) => friend.connected)
    })
    const offlineFriends = computed(() => {
      return friends.value?.filter((friend) => !friend.connected)
    })
    const searchFriends = computed(() => {
      let onlineFriendsSearch = onlineFriends.value?.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchValue.value.toLowerCase()),
      )
      let offlineFriendsSearch = offlineFriends.value?.filter((friend) =>
        friend.nickname.toLowerCase().includes(searchValue.value.toLowerCase()),
      )
      return onlineFriendsSearch?.concat(offlineFriendsSearch as Friend[])
    })

    onMounted(getFriends)

    return {
      searchValue,
      getFriends,
      resetValue,
      onlineFriends,
      offlineFriends,
      searchFriends,
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

.search-bar-container {
  display: flex;
  justify-content: space-around;
  height: 25px;
  border-bottom: 2px solid black;
}

.search-bar {
  border: 1px solid black;
  border-radius: 5px;
  background-color: lightgray;
}

.search-icon {
  align-self: center;
}

.search-reset {
  align-self: center;
  cursor: pointer;
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

@keyframes slidein {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0%);
  }
}
</style>
