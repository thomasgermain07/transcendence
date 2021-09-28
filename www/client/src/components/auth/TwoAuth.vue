<template>
  <div class="google-authenticator">
    <h3>Activate Google Authenticator</h3>
    <div class="switch">
      <input
        id="switch-1"
        type="checkbox"
        class="switch-input"
        v-model="switchTwoFa.state"
      />
      <label for="switch-1" class="switch-label">Switch</label>
    </div>
    <div class="qrcode" v-bind:class="{ active: switchTwoFa.state }">
      <img v-bind:src="qrcode" class="qrcode_picture" alt="qrcode" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref, reactive, watch } from 'vue'

import { useAuth } from '@/composables/auth'
import { AxiosResType, AxiosErrType } from '@/composables/axios'

export default defineComponent({
  name: 'google-authenticator',

  setup() {
    const messages = ref([])
    const qrcode = ref()
    const qrcodeActive = ref(false)

    const { activateTwoFa, deactivateTwoFa, user } = useAuth()

    const switchTwoFa = reactive({
      state: user.isTwoFactorAuthenticationEnabled,
    })

    watch(
      () => switchTwoFa.state,
      () => {
        if (switchTwoFa.state === true) {
          activateTwoFa()
            .then((response: AxiosResType) => {
              qrcode.value = response.data
            })
            .catch((err: AxiosErrType) => {
              messages.value = err.response?.data.message
            })
        } else {
          deactivateTwoFa()
            .then(() => {
              qrcode.value = null
            })
            .catch((err: AxiosErrType) => {
              messages.value = err.response?.data.message
            })
        }
      },
    )

    return {
      // Datas
      messages,
      qrcode,
      qrcodeActive,
      user,
      // Functions
      switchTwoFa,
    }
  },
})
</script>

<style scoped>
.google-authenticator {
  padding: 20px;
}
.qrcode {
  display: none;
}
.qrcode.active {
  display: block;
}
.qrcode_picture {
  width: 250px;
  height: 250px;
}
/* Power Ups Switch button */
.switch {
  position: relative;
  display: inline-block;
  margin: 20px;
}
.switch-input {
  display: none;
}
.switch-label {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
}
.switch-label::before,
.switch-label::after {
  content: '';
  display: block;
  position: absolute;
  cursor: pointer;
}
.switch-label::before {
  width: 100%;
  height: 100%;
  background-color: #dedede;
  border-radius: 9999em;
  -webkit-transition: background-color 0.25s ease;
  transition: background-color 0.25s ease;
}
.switch-label::after {
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
  -webkit-transition: left 0.25s ease;
  transition: left 0.25s ease;
}
.switch-input:checked + .switch-label::before {
  background-color: green;
}
.switch-input:checked + .switch-label::after {
  left: 24px;
}
</style>
