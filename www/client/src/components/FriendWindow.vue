<template>
  <a class="open-button" v-if="!open" @click="toggle_window">
    <!-- <i class="fas fa-bars fa-2x"></i> -->
    <i class="fas fa-comments fa-2x"></i>
  </a>
  <div v-if="open" class="window">
    <header class="top-bar">
      <a @click="toggle_window">
        <i class="far fa-times-circle close-button"></i>
      </a>
    </header>

    <div class="friend-list">
      <a
        class="roll-menu"
        :class="{ 'roll-menu--open': showOnline }"
        @click="toggle_online"
      >
        Online
        <i class="far fa-arrow-alt-circle-down arrow"></i>
      </a>

      <div class="friend-container" v-if="showOnline">
        <ul>
          <li
            v-for="friend in onlineFriends"
            :key="friend"
            @click.right.prevent="right_click"
          >
            <div class="friend">
              {{ friend.nickname }}
              <i class="fas fa-circle status status--connected"></i>
            </div>
          </li>
        </ul>
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
        <ul>
          <li v-for="friend in offlineFriends" :key="friend">
            <div class="friend">
              {{ friend.nickname }}
              <i class="fas fa-circle status status--disconnected"></i>
            </div>
          </li>
        </ul>
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
  data() {
    return {
      open: false,
      showOnline: true,
      showOffline: false,
    }
  },
  setup() {
    let friends = ref<Friend[]>()
    let loading = ref(true)

    const getFriends = async () => {
      const { data } = await axios.get(
        'https://60d5fd1b943aa60017768d55.mockapi.io/api/users',
      )
      friends.value = data
      loading.value = false
    }

    const onlineFriends = computed(() => {
      return friends.value?.filter((friend) => friend.connected)
    })
    const offlineFriends = computed(() => {
      return friends.value?.filter((friend) => !friend.connected)
    })

    onMounted(getFriends)

    return {
      friends,
      loading,
      getFriends,
      onlineFriends,
      offlineFriends,
    }
  },
  methods: {
    toggle_window() {
      this.open = !this.open
      if (this.open) {
        this.getFriends()
      }
    },
    toggle_online() {
      this.showOnline = !this.showOnline
    },
    toggle_offline() {
      this.showOffline = !this.showOffline
    },
    right_click() {
      console.log('right clicked')
    },
  },
}
</script>

<style scoped>
.open-button {
  position: fixed;
  bottom: 0;
  right: 10px;
  margin: 5px;
}

.window {
  width: 180px;
  position: fixed;
  bottom: 0;
  right: 10px;
  background-color: grey;
}

.top-bar {
  padding: 4px 4px;
  background-color: black;
  text-align: left;
}

.friend-list {
  height: 275px;
  overflow-y: auto;
  overflow-x: hidden;
}

.friend-list ul {
  list-style-type: none;
  text-align: left;
  padding: 0.5em;
  margin: 0;
  animation-name: slidein;
  animation-duration: 0.2s;
}

.friend-list li {
  padding: 0.15em;
  border-bottom: 1px solid darkgray;
}

.friend-list li:last-child {
  border-bottom: none;
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
  overflow: hidden;
}

.friend {
  position: relative;
}

.close-button {
  color: whitesmoke;
}

.status {
  position: absolute;
  right: 0;
  padding: 0.5em;
  font-size: 0.7em;
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
