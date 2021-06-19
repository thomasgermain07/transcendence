<template>
  <div class='navigation'>
    <ul class="list">
      <li>
        <router-link :to="{ name: 'home'}" class="link">Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'user'}" class="link">User</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'game'}" class="link">Game</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'chat'}" class="link">Chat</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  .navigation {
    margin-bottom: 1em;
    position: sticky;
    top: 0;
    left: 0;
    background: grey;
  }
  .list {
    display: flex;
    list-style-type: none;
  }
  .link {
    display: block;
    color: white;
    padding: 14px 16px;
    text-decoration: none;
  }
  .link:hover {
    background-color: black;
  }
</style>