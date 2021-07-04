<template>
  <div class="topbar">
    <div class="navigation">
      <router-link to="/" class="link">
        <i class="fas fa-home"></i>
      </router-link>
      <router-link to="/game" class="link">
        <i class="fas fa-gamepad"></i>
      </router-link>
      <router-link to="/users" class="link">
        <i class="fas fa-users"></i>
      </router-link>
    </div>
    <div class="navigation">
      <router-link to="/profile" class="link">
        <i class="fas fa-user"></i>
      </router-link>
      <router-link to="/logout" class="link">
        <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.topbar {
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: grey;
}

.navigation {
  display: flex;
}

.link {
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
