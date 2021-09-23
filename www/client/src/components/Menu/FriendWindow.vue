<template>
  <div class="friend-window">
    <TopBar :Title="'Friends'" @close="$emit('close')" @refresh="loadData" />
    <form class="search-bar-ctn">
      <i class="fas fa-search search-icon"></i>
      <input v-model="searchQuery" class="search-bar" placeholder="Search" />
      <i class="fas fa-times search-reset" @click="searchQuery = ''"></i>
    </form>
    <FriendsList
      v-if="searchQuery"
      :Friends="friendsByName"
      @open_chat="open_chat"
      @reload_data="loadData"
    />

    <div @click="open_chat" class="open-chat-btn" v-if="!searchQuery">
      <i class="fas fa-bell notification"></i>
      Open chat
      <i
        class="fas fa-bell notification"
        :class="{ 'notification--visible': Notification && !ChatStatus }"
      ></i>
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
      v-if="showRequest && !searchQuery"
      :Requests="requests"
      @request_answered="loadData"
      @reload_data="loadData"
      @open_chat="open_chat"
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
      :Friends="onlineFriends"
      @open_chat="open_chat"
      @reload_data="loadData"
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
      :Friends="offlineFriends"
      @open_chat="open_chat"
      @reload_data="loadData"
    />

    <a
      v-if="!searchQuery"
      class="roll-menu"
      :class="{ 'roll-menu--open': showIgnored }"
      @click="toggle_menu('ignored')"
    >
      Blocked
      <i class="far fa-arrow-alt-circle-down arrow"></i>
    </a>
    <IgnoredList
      v-if="showIgnored && !searchQuery"
      :Ignored="ignored"
      @unblocked_user="loadData"
    />
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue'

import getFetchFriends from '@/composables/Friends/fetchFriends'
import getFetchRequest from '@/composables/Friends/fetchRequest'
import getFetchIgnored from '@/composables/Ignored/fetchIgnored'

import {
  getFriendsByName,
  getFriendsByStatus,
} from '@/composables/Friends/getFriendsByFilters'
import getFriendsWindowInteraction from '@/composables/Window/FriendsWindowInteraction'

import TopBar from './Utils/TopBar.vue'
import FriendsList from './Friend/Friends/FriendsList.vue'
import RequestList from './Friend/Request/RequestList.vue'
import IgnoredList from './Friend/Ignored/IgnoredList.vue'

export default {
  components: {
    TopBar,
    FriendsList,
    RequestList,
    IgnoredList,
  },
  props: {
    Notification: Number,
    ChatStatus: Boolean,
  },
  setup(props, { emit }) {
    let { friends, fetchFriends } = getFetchFriends()
    let { ignored, fetchIgnored } = getFetchIgnored()

    let { searchQuery, friendsByName } = getFriendsByName(friends, ignored)
    const { onlineFriends, offlineFriends } = getFriendsByStatus(
      friends,
      ignored,
    )

    const { requests, fetchRequest } = getFetchRequest()

    let { showOffline, showOnline, showRequest, showIgnored, toggle_menu } =
      getFriendsWindowInteraction()

    const loadData = () => {
      friends.value = []
      ignored.value = []
      fetchRequest()
      fetchFriends()
      fetchIgnored()
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
      ignored,
      searchQuery,
      showOnline,
      showOffline,
      showRequest,
      showIgnored,
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
  emits: ['open_chat', 'close', 'open_create_invite'],
}
</script>

<style scoped>
.friend-window {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 375px;
}

.notification {
  color: red;
  visibility: hidden;
}

.notification--visible {
  visibility: visible;
}

.search-bar-ctn {
  padding: 2px;
  justify-content: space-around;
  height: 24px;
  border-bottom: 2px solid black;
}

.open-chat-btn {
  display: flex;
  justify-content: space-between;
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
