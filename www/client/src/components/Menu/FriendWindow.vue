<template>
  <div class="friend-window">
    <form class="search-bar-ctn">
      <i class="fas fa-search search-icon"></i>
      <input v-model="searchQuery" class="search-bar" placeholder="Search" />
      <i class="fas fa-times search-reset" @click="searchQuery = ''"></i>
    </form>
    <FriendsList
      v-if="searchQuery"
      :friends="friendsByName"
      @open_chat="open_chat"
    />

    <div @click="open_chat" class="open-chat-btn" v-if="!searchQuery">
      Open chat
    </div>

    <a
      v-if="!searchQuery && requests.length"
      class="roll-menu"
      :class="{ 'roll-menu--open': showRequest }"
      @click="toggle_menu('request')"
    >
      New request(s)
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>
    <RequestList
      v-if="showRequest"
      :requests="requests"
      @request_answered="loadData"
    />

    <a
      v-if="!searchQuery"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOnline }"
      @click="toggle_menu('online')"
    >
      Online
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>
    <FriendsList
      v-if="showOnline && !searchQuery"
      :friends="onlineFriends"
      @open_chat="open_chat"
    />

    <a
      v-if="!searchQuery"
      class="roll-menu"
      :class="{ 'roll-menu--open': showOffline }"
      @click="toggle_menu('offline')"
    >
      Offline
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>
    <FriendsList
      v-if="showOffline && !searchQuery"
      :friends="offlineFriends"
      @open_chat="open_chat"
    />
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'

import getFetchFriends from '@/composables/Friends/fetchFriends'
import getFetchRequest from '@/composables/Friends/fetchRequest'

import {
  getFriendsByName,
  getFriendsByStatus,
} from '@/composables/Friends/getFriendsByFilters'
import getFriendsWindowInteraction from '@/composables/Window/FriendsWindowInteraction'

import FriendsList from './Friend/Friends/FriendsList.vue'
import RequestList from './Friend/Request/RequestList.vue'

export default {
  components: {
    FriendsList,
    RequestList,
  },
  setup(props, { emit }) {
    let { friends, fetchFriends } = getFetchFriends()
    let { searchQuery, friendsByName } = getFriendsByName(friends)
    const { onlineFriends, offlineFriends } = getFriendsByStatus(friends)

    const { requests, fetchRequest } = getFetchRequest()

    let { showOffline, showOnline, showRequest, toggle_menu } =
      getFriendsWindowInteraction()

    const loadData = () => {
      fetchRequest()
      fetchFriends()
    }

    const open_chat = (userId: Number, userName: String) => {
      emit('open_chat', userId, userName)
    }

    onMounted(() => {
      loadData()
    })

    return {
      // Variables
      requests,
      searchQuery,
      showOnline,
      showOffline,
      showRequest,
      // Methods
      toggle_menu,
      loadData,
      open_chat,
      // Computed
      onlineFriends,
      offlineFriends,
      friendsByName,
    }
  },
  emits: ['open_chat'],
}
</script>

<style scoped>
.friend-window {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 375px;
}

.search-bar-ctn {
  padding: 2px;
  justify-content: space-around;
  height: 24px;
  border-bottom: 2px solid black;
}

.open-chat-btn {
  border-bottom: 2px solid black;
  padding: 3px;
}

.roll-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em;
  cursor: pointer;
  background-color: darkgrey;
  border-bottom: 1px solid black;
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
</style>
