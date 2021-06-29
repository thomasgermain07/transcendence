<template>
  <div id="component">
    <a v-if="!open" @click="toggle_window">
      <i class="fas fa-bars fa-2x"></i>
    </a>
    <div v-if="open" id="window">
      <div id="top-bar">
        <a @click="toggle_window">
          <i class="far fa-times-circle"></i>
        </a>
      </div>
      <ul id="friend-list">
        <li class="friend" v-for="friend in friends" :key="friend">
          <span>{{ friend.nickname }}</span>
          <!-- <i class="fas fa-circle friend-status"></i> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

export default {
  setup() {
    let friends = ref([])
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

    onMounted(getFriends)

    return {
      friends,
      loading,
      open,
      getFriends,
    }
  },
  methods: {
    toggle_window() {
      this.open = !this.open
    },
  },
}
</script>

<style>
#component {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0px 15px;
}

#top-bar {
  position: fixed;
  height: 25px;
  width: 190px;
  background-color: black;
}

#window {
  height: 300px;
  width: 190px;
  background-color: grey;
  bottom: 0;
  overflow-y: scroll;
  overflow-x: hidden;
}

#friend-list {
  list-style-type: none;
  text-align: left;
  padding: 0.5em;
  margin: 0;
}

#friend-list li {
  padding: 0.15em;
}

.fa-times-circle {
  position: absolute;
  left: 0;
  margin: 0.3rem;
  color: whitesmoke;
}

.friend .friend-status {
  position: fixed;
  right: 0;
}
</style>
