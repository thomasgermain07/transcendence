<template>
  <div class="users">
    <!-- <h1>User</h1> -->

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'users',
  setup() {},
})
</script>

<style scoped>
/* .user {
  background: rgb(184, 62, 184);
} */
</style>
