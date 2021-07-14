<template>
  <div class="friend-window">
    <form class="search-bar-container">
      <i class="fas fa-search search-icon"></i>
      <input v-model="searchQuery" class="search-bar" placeholder="Search" />
      <i class="fas fa-times search-reset" @click="resetValue"></i>
    </form>

    <div class="search-container" v-if="searchQuery">
      <div
        class="friend-item"
        v-for="friend in friendsByName"
        :key="friend"
        @click="$emit('open_chat', friend)"
      >
        {{ friend.name }}
        <i
          v-if="friend.connected"
          class="fas fa-circle status status--connected"
        ></i>
        <i v-else class="fas fa-circle status status--disconnected"></i>
      </div>
    </div>

    <a
      v-if="!searchQuery"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOnline }"
      @click="toggle_online"
    >
      Online
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOnline && !searchQuery">
      <div
        class="friend-item"
        v-for="friend in onlineFriends"
        :key="friend"
        @click="$emit('open_chat')"
      >
        {{ friend.name }}
        <i class="fas fa-circle status status--connected"></i>
      </div>
    </div>

    <a
      v-if="!searchQuery"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOffline }"
      @click="toggle_offline"
    >
      Offline
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>

    <div class="friend-container" v-if="showOffline && !searchQuery">
      <div
        class="friend-item"
        v-for="friend in offlineFriends"
        :key="friend"
        @click="$emit('open_chat')"
      >
        {{ friend.name }}
        <i class="fas fa-circle status status--disconnected"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import getFetchFriends from '@/composables/Friends/fetchFriends'
import {
  getFriendsByName,
  getFriendsByStatus,
} from '@/composables/Friends/getFriendsByFilters'
import requestStatus from '@/composables/requestStatus'
import getFriendsWindowInteraction from '@/composables/Window/FriendsWindowInteraction'

export default {
  setup() {
    let status = ref(requestStatus.loading)

    let { friends, fetchFriends } = getFetchFriends(status)
    let { searchQuery, friendsByName } = getFriendsByName(friends)
    const { onlineFriends, offlineFriends } = getFriendsByStatus(friends)
    let { showOffline, showOnline, toggle_offline, toggle_online } =
      getFriendsWindowInteraction()

    const resetValue = () => {
      searchQuery.value = ''
    }

    onMounted(fetchFriends)

    return {
      // Variables
      searchQuery,
      showOnline,
      showOffline,
      status, // TODO : Handle status error in templates
      // Methods
      fetchFriends,
      resetValue,
      toggle_online,
      toggle_offline,
      // Computed
      onlineFriends,
      offlineFriends,
      friendsByName,
    }
  },
}
</script>

<style scoped>
.friend-window {
  overflow-y: auto;
  overflow-x: hidden;
}

.search-bar-container {
  padding: 2px;
  display: flex;
  justify-content: space-around;
  height: 25px;
  border-bottom: 2px solid black;
}

.search-bar {
  width: 75%;
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