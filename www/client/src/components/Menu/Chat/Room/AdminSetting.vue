<template>
  <div class="admin-ctn">
    <div class="change-name">
      <p>Change this room's name</p>
      <input
        type="text"
        class="field-input"
        v-model="name_f"
        placeholder="new name"
      />
    </div>
    <div v-if="has_password" class="change-pw">
      <p>Change this room's password</p>
      <input
        type="text"
        class="field-input"
        v-model="password_f"
        placeholder="new password"
      />
    </div>
    <div v-if="!has_password" class="set-pw">
      <p>Add a password to this room</p>
      <input
        type="text"
        class="field-input"
        v-model="password_f"
        placeholder="create password"
      />
    </div>
    <div>
      <p>Change Visibility section</p>
      <div class="switch-ctn">
        <div
          class="switch"
          :class="{ 'switch--selected-yes': visibility }"
          @click="visibility = true"
        >
          Yes
        </div>
        <div
          class="switch"
          :class="{ 'switch--selected-no': !visibility }"
          @click="visibility = false"
        >
          No
        </div>
      </div>
    </div>
    <div>
      <button>Validate Changes</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'

export default {
  props: {
    Room: Object,
  },
  setup(props) {
    let has_password = ref(props.Room!.password)

    let visibility = ref(props.Room!.visible)
    let name_f = ref('')
    let password_f = ref('')

    return {
      has_password,
      visibility,
      name_f,
      password_f,
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
  /* flex-grow: 1; */
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
