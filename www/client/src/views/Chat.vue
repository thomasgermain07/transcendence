<template>
  <h1>Chat View</h1>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { io } from 'socket.io-client'

  export default defineComponent({
    name: 'Chat',

    setup()
    {
      const socket = io('ws://localhost:8080/chat');

      // Send to server
      socket.emit('message', { message: "Socket.io works!" });
      // Received from server
      socket.on('message', (data) => { console.log(data); });
    },

  })
</script>

<style scoped>

</style>
