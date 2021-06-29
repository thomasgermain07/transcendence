<template>
  <div>
    <ul class="navigation">
      <li class="left-section">
        <router-link to="/" class="link">
          <i class="fas fa-home"></i>
        </router-link>
      </li>
      <li class="left-section">
        <router-link to="/game" class="link">
          <i class="fas fa-gamepad"></i>
        </router-link>
      </li>
      <li class="left-section">
        <router-link to="/users" class="link">
          <i class="fas fa-users"></i>
        </router-link>
      </li>
      <li class="right-section">
        <router-link to="/logout" class="link">
          <i class="fas fa-sign-out-alt"></i>
        </router-link>
      </li>
      <li class="right-section">
        <router-link to="/profile" class="link">
          <i class="fas fa-user"></i>
        </router-link>
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
.left-section {
  float: left;
}

.right-section {
  float: right;
}

.link {
  display: block;
  color: white;
  padding: 8px;
  text-align: center;
  padding: 14px 23px;
  text-decoration: none;
}

.link:hover {
  background-color: black;
}
</style>
