<template>
  <div class="edit-profile-window">
    <h1 class="title">Edit profile</h1>

    <div id="dynamic-component-demo" class="demo">
      <div class="demo-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-button', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div class="demo-2">
        <keep-alive>
          <component :is="currentTabComponent" v-on:update-user="updateUser">
          </component>
        </keep-alive>
      </div>
    </div>

    <button @click="closeWindow">Done Editing</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Data, computed, ref } from 'vue'
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
  setup(props: Data, context: SetupContext) {
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
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');

.edit-profile-window {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: 'Inconsolata', monospace;
  font-size: 2rem;
}

@media only screen and (max-width: 768px) {
  .demo {
    flex-direction: column;
  }
}

.demo {
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: center;
  min-height: 150px;
}
.demo-1 {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.demo-2 {
  padding: 0 30px;
}
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
