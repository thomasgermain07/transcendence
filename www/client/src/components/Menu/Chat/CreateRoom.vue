<template>
  <div class="create-room-ctn">
    <header class="window-title">Create new room</header>
    <div class="field-ctn">
      <p>Give your room a name</p>
      <input
        v-model="fields.name.value"
        class="field-input"
        :class="{ 'field-input--invalid': !validators.name.value }"
        placeholder="name (minimum 3 characters)"
      />
      <p
        class="field__error-msg"
        :class="{ 'field__error-msg--visible': !validators.name.value }"
      >
        name should be at least 3 char
      </p>
    </div>
    <div class="field-ctn">
      <p>Give it a password too (or not)</p>
      <input
        v-model="fields.password.value"
        class="field-input"
        :class="{ 'field-input--invalid': !validators.password.value }"
        placeholder="password (optionnal)"
      />
      <p
        class="field__error-msg"
        :class="{ 'field__error-msg--visible': !validators.password.value }"
      >
        let this field empty if you don't want a password or it should be at
        least 6 char
      </p>
    </div>
    <div class="field-ctn">
      <p>Do you want it to be visible by everybody ?</p>
      <div class="switch-ctn">
        <div
          class="switch"
          :class="{ 'switch--selected-yes': fields.visible.value }"
          @click="fields.visible.value = true"
        >
          Yes
        </div>
        <div
          class="switch"
          :class="{ 'switch--selected-no': !fields.visible.value }"
          @click="fields.visible.value = false"
        >
          No
        </div>
      </div>
    </div>
    <div class="action-ctn">
      <button class="action__button" @click="sendData">Create</button>
      <button class="action__button">Cancel</button>
    </div>
    <p v-if="status == 'sending'">sending ...</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import {
  getRoomInputs,
  createRoom,
} from '../../../composables/Chat/Rooms/createRoom'
import requestStatus from '../../../composables/requestStatus'

export default {
  setup() {
    let { fields, validators } = getRoomInputs()

    let status = ref(requestStatus.default)

    const sendData = () => {
      createRoom(fields, status)
    }

    return {
      fields,
      validators,
      status,
      sendData,
    }
  },
}
</script>

<style scoped>
.create-room-ctn {
  /* width: 100%; */
  display: flex;
  flex-direction: column;
}

.window-title {
  font-weight: bold;
  font-size: x-large;
}

.field-ctn {
  margin: 5px;
}

.field-ctn > p {
  margin: 5px;
}

.field-input {
  width: 175px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid black;
}

.field-input--invalid {
  color: red;
  border: 1px solid red;
}

.field__error-msg {
  visibility: hidden;
  color: red;
  font-weight: 500;
}

.field__error-msg--visible {
  visibility: visible;
}

.switch-ctn {
  display: flex;
  justify-content: center;
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

.action-ctn {
  margin-top: 15px;
}

.action__button {
  padding: 10px;
  margin: 0 5px 0 5px;
  border-radius: 2px;
  cursor: pointer;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 10px;
}

.action__button:hover {
  background-color: white;
}
</style>
