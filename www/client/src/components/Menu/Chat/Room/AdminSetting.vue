<template>
  <div class="admin-ctn">
    <div class="change-name">
      <p>Change this room's name</p>
      <input
        type="text"
        class="field-input"
        v-model="Room.name"
        :placeholder="Room.name"
      />
    </div>
    <div v-if="has_password" class="change-pw">
      <p>Change this room's password</p>
      <input
        type="password"
        class="field-input"
        v-model="password"
        placeholder="New password"
      />
      <p>or</p>
      <button @click="deletePassword">Delete password</button>
    </div>
    <div v-if="!has_password" class="set-pw">
      <p>Add a password to this room</p>
      <input
        type="password"
        class="field-input"
        v-model="password"
        placeholder="Create password"
      />
    </div>
    <div>
      <p>Change Visibility section</p>
      <div class="switch-ctn">
        <div
          class="switch"
          :class="{ 'switch--selected-yes': Room.visible }"
          @click="Room.visible = true"
        >
          Yes
        </div>
        <div
          class="switch"
          :class="{ 'switch--selected-no': !Room.visible }"
          @click="Room.visible = false"
        >
          No
        </div>
      </div>
    </div>
    <div>
      <button @click="changeRoom(password)">Validate Changes</button>
    </div>
  </div>
</template>

<script lang="ts">
import getChangeRoom from '@/composables/Chat/Room/modifyRoom'
import { ref } from '@vue/reactivity'

export default {
  props: {
    Room: Object,
  },
  setup(props) {
    let has_password = props.Room!.password ? true : false

    let password = ref('')

    const { changeRoom } = getChangeRoom(props.Room)

    const deletePassword = () => {
      delete props.Room!.password
      changeRoom()
    }

    return {
      has_password,
      password,
      deletePassword,
      changeRoom,
    }
  },
}
</script>

<style scoped>
.admin-ctn {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.admin-ctn > div {
  padding: 5px;
}

.switch-ctn {
  display: flex;
  justify-content: center;
  margin: 5px;
}

.switch {
  padding: 2px 15px;
  background-color: darkgrey;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
}

.switch:first-child {
  border-left: 2px solid black;
  border-radius: 10px 0 0 10px;
}

.switch--selected-yes {
  background-color: green;
}

.switch--selected-no {
  background-color: red;
}
</style>
