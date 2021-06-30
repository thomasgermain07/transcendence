<template>
  <a class="open-button" v-if="!open" @click="toggle_window">
    <i class="fas fa-bars fa-2x"></i>
  </a>
  <div v-if="open" class="window">
    <header class="top-bar">
      <a @click="toggle_window">
        <i class="far fa-times-circle"></i>
      </a>
    </header>
    <div class="friend-list">
      <ul>
        <li v-for="friend in sortedFriends" :key="friend">
          <div class="friend">
            {{ friend.nickname }}
            <i v-if="friend.connected" class="fas fa-circle connected"></i>
            <i v-if="!friend.connected" class="fas fa-circle disconnected"></i>
          </div>
        </li>
      </ul>
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
    let loading = ref(true)
    let open = ref(false)

    const getFriends = () => {
      axios
        .get('https://60d5fd1b943aa60017768d55.mockapi.io/api/users') // TODO : Link friend list api
        .then((res) => {
          friends.value = res.data
          loading.value = false
        })
    }

    const sortedFriends = computed(() => {
      return friends.value?.filter((friend) => friend.connected)
    })

    onMounted(getFriends)

    return {
      friends,
      loading,
      open,
      getFriends,
      sortedFriends,
    }
  },
  methods: {
    toggle_window() {
      this.open = !this.open
    },
  },
}
</script>

<style scoped>
.open-button {
  position: fixed;
  bottom: 0;
  right: 10px;
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
  overflow-y: scroll;
  overflow-x: hidden;
}

.friend-list ul {
  list-style-type: none;
  text-align: left;
  padding: 0.5em;
  margin: 0;
}

.friend-list li {
  padding: 0.15em;
}

.friend {
  position: relative;
}

.fa-times-circle {
  color: whitesmoke;
}

.fa-circle {
  position: absolute;
  /* right: 0; */
  padding: 0.5em;
  font-size: 0.7em;
}

.connected {
  color: green;
}

.disconnected {
  color: red;
}
</style>
