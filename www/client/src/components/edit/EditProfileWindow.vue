<template>
  <div class="edit-profile-window">
    <!-- header  -->
    <div class="header">
      <h1>Edit profile</h1>
    </div>

    <!-- tabs  -->
    <div class="tabBlock">
      <div class="tabBlock-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tabBlock-tab', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          <span v-if="tab === 'edit-profile-avatar'">Avatar</span>
          <span v-if="tab === 'edit-profile-name'">Name</span>
          <span v-if="tab === 'google-authenticator'">Google auth</span>
        </button>
      </div>
      <div class="tabBlock-content">
        <keep-alive>
          <component :is="currentTabComponent" v-on:update-user="updateUser">
          </component>
        </keep-alive>
      </div>
    </div>

    <!-- footer  -->
    <div class="footer">
      <button @click="closeWindow">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import EditProfileName from '@/components/edit/EditProfileName.vue'
import EditProfileAvatar from '@/components/edit/EditProfileAvatar.vue'
import GoogleAuthenticator from '@/components/auth/TwoAuth.vue'

export default defineComponent({
  name: 'edit-profile-window',
  components: {
    EditProfileName,
    EditProfileAvatar,
    GoogleAuthenticator,
  },
  emit: ['update-user', 'close-window'],
  setup(props, context) {
    const updateUser = () => {
      context.emit('update-user')
    }

    const closeWindow = () => {
      context.emit('close-window')
    }

    const currentTab = ref('edit-profile-avatar')
    const tabs = [
      'edit-profile-avatar',
      'edit-profile-name',
      'google-authenticator',
    ]

    const currentTabComponent = computed(() => {
      return currentTab.value.toLowerCase()
    })

    return {
      updateUser,
      closeWindow,
      currentTab,
      tabs,
      currentTabComponent,
    }
  },
})
</script>

<style scoped>
.edit-profile-window {
  color: var(--tertiary-color);
  font-family: 'Play', sans-serif;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 50rem;
  padding: 1.5rem 1.25rem;
}

.header h1 {
  font-size: 2rem;
  padding-bottom: 1rem;
}
.tabBlock {
  margin: 0 0 2.5rem;
}
.tabBlock-tabs {
  list-style: none;
  margin: 0;
  padding: 0;
}
.tabBlock-tabs::after {
  clear: both;
  content: '';
  display: table;
}
.tabBlock-tab {
  background-color: rgb(231, 234, 238);
  border-color: #d8d8d8;
  border-left-style: solid;
  border-top: solid;
  border-width: 2px;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  float: left;
  padding: 0.625rem 1.25rem;
  position: relative;
  transition: 0.1s ease-in-out;
  text-decoration: none;
}
.tabBlock-tab::before,
.tabBlock-tab::after {
  content: '';
  display: block;
  height: 4px;
  position: absolute;
  transition: 0.1s ease-in-out;
}
.tabBlock-tab::before {
  background-color: #2c3e50;
  left: -2px;
  right: -2px;
  top: -2px;
}
.tabBlock-tab::after {
  background-color: transparent;
  bottom: -2px;
  left: 0;
  right: 0;
}
.tabBlock-tab:hover,
.tabBlock-tab:focus {
  color: var(--primary-color);
}
@media screen and (min-width: 700px) {
  .tabBlock-tab {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
.tabBlock-tab.active {
  position: relative;
  color: var(--primary-color);
  z-index: 1;
}
.tabBlock-tab.active::before {
  background-color: var(--primary-color);
}
.tabBlock-tab.active::after {
  background-color: rgb(231, 234, 238);
}
.tabBlock-content {
  background-color: rgb(231, 234, 238);
  border: 2px solid #d8d8d8;
  padding: 1.25rem;
}

.footer button {
  font-family: 'Play', sans-serif;
  font-weight: 600;
  text-align: center;
  border: none;
  display: block;
  margin: auto;
  padding: 1em 2em;
  color: var(--secondary-color);
  text-decoration: none;
  background: var(--tertiary-color);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
}

.footer button:hover {
  background-color: var(--primary-color);
}
</style>
