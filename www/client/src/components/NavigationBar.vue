<template>
  <div>
    <ul class="navigation">
      <li class="section">
        <router-link to="/" class="link">Home</router-link>
      </li>
      <!-- <li class="section">
        <router-link to="/game" class="link">Game</router-link>
      </li> -->
      <li class="section">
        <router-link to="/user" class="link">User</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  background-color: grey;
}

.section {
  float: left;
}

.link {
  display: block;
  color: white;
  padding: 8px;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.link:hover {
  background-color: black;
}
</style>
