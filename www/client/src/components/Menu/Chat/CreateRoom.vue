<template>
  <div class="create-room-ctn">
    <header class="window-title">Create new room</header>
    <div class="field-ctn">
      <p>Give your room a name</p>
      <input
        v-model="fields.name.value"
        class="field-input"
        :class="{ 'field-input--invalid': errors.name.value.length }"
        placeholder="name (minimum 3 characters)"
      />
      <p
        class="field__error-msg"
        :class="{ 'field__error-msg--visible': errors.name.value.length }"
      >
        {{ errors.name.value }}
      </p>
    </div>
    <div class="field-ctn">
      <p>Give it a password too (or not)</p>
      <input
        type="password"
        v-model="fields.password.value"
        class="field-input"
        :class="{ 'field-input--invalid': errors.password.value.length }"
        placeholder="password (optionnal)"
      />
      <p
        class="field__error-msg"
        :class="{ 'field__error-msg--visible': errors.password.value.length }"
      >
        {{ errors.password.value }}
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
      <button
        class="action__btn"
        :class="{ 'action__btn--invalid': sendable }"
        @click="sendData"
      >
        Create
      </button>
      <button class="action__btn" @click="$emit('close')">Cancel</button>
    </div>
    <p v-if="status == 'sending'">sending ...</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import {
  getRoomInputs,
  createRoom,
} from '../../../composables/Chat/Room/createRoom'
import requestStatus from '../../../composables/requestStatus'

export default {
  setup(props, { emit }) {
    let { fields, errors, sendable } = getRoomInputs()

    let status = ref(requestStatus.default)

    const sendData = () => {
      createRoom(fields, status)
        .then(() => {
          emit('refresh_rooms')
          emit('close')
        })
        .catch((e) => {
          status.value = requestStatus.error
          errors.name.value = e.response.data.message[0]
        })
    }

    return {
      fields,
      errors,
      status,
      sendData,
      sendable,
    }
  },
  emits: ['close', 'refresh_rooms'],
}
</script>

<style scoped>
.create-room-ctn {
  display: flex;
  flex-direction: column;
}

.window-title {
  flex-basis: 25px;
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

.action__btn {
  padding: 10px;
  margin: 0 5px 0 5px;
  border-radius: 2px;
  cursor: pointer;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 10px;
}

.action__btn:hover {
  background-color: white;
}

.action__btn--invalid {
  pointer-events: none;
}

.action__btn--invalid:hover {
  background-color: darkgray;
}
</style>
