<template>
  <div class="chat-window">
    <div class="rooms">
      <header class="rooms__banner">Rooms</header>
    </div>
    <div class="chat"></div>
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style scoped>
.chat-window {
  display: flex;
  height: 400px;
}

.rooms {
  flex-basis: 180px;
  border-right: 2px solid lightgray;
}

.rooms__banner {
  background-color: darkgray;
  border-bottom: 2px solid black;
}

.chat {
  flex-grow: 1;
}
</style>
