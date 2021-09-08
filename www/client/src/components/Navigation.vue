<template>
  <div class="navigation-ctn">
    <div class="navigation">
      <router-link :to="{ name: 'index' }" class="link">
        <i class="fas fa-home"></i>
      </router-link>
      <router-link v-if="is_authenticated" :to="{ name: 'game' }" class="link">
        <i class="fas fa-gamepad"></i>
      </router-link>
      <router-link v-if="is_authenticated" :to="{ name: 'users' }" class="link">
        <i class="fas fa-users"></i>
      </router-link>
    </div>
    <div class="navigation">
      <router-link
        v-if="is_authenticated"
        :to="{ name: 'user-profile' }"
        class="link"
      >
        <i class="fas fa-user"></i>
      </router-link>
      <router-link
        v-if="is_authenticated"
        :to="{ name: 'auth-logout' }"
        class="link"
      >
        <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useAuth } from '@/composables/auth'
export default defineComponent({
  name: 'navigation',
  setup() {
    const { is_authenticated } = useAuth()
    return { is_authenticated }
  },
})
</script>

<style scoped>
.navigation-ctn {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  margin-bottom: 1em;
  background-color: grey;
  z-index: 2;
}
.navigation {
  display: flex;
}
.link {
  padding: 14px 23px;
  text-align: center;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.link:hover {
  background-color: black;
}
</style>
