<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <h3>Google Authenticator</h3>
        <a @click="closeWindow">
          <i class="far fa-times-circle cross__icon"></i>
        </a>
      </header>
      <div>
        <div class="form__error" v-if="message">
          {{ message }}
        </div>
        <form @submit.prevent="submit">
          <div class="form__field">
            <label for="code">Code</label>
            <input type="text" name="code" id="code" v-model="google.code" />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosErrType } from '@/composables/axios'
import { defineComponent, ref, reactive } from 'vue'
import { useAuth, GoogleAuthType } from '../../composables/auth'

export default defineComponent({
  name: 'GoogleAuth',

  setup() {
    const message = ref('')
    const { verifyCode, googleCode } = useAuth()

    const google = reactive<GoogleAuthType>({
      visible: true,
      code: '',
      user_id: googleCode.user_id,
    })

    const closeWindow = (): void => {
      googleCode.visible = false
    }

    const submit = (): void => {
      verifyCode(google).catch((err: AxiosErrType) => {
        message.value = err.response?.data.message
      })
    }

    return {
      google,
      message,
      submit,
      closeWindow,
    }
  },
})
</script>

<style scoped>
  .modal-backdrop {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.808);
  }

  .modal {
    padding: 1em;
    background: white;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    color: var(--tertiary-color);
  }

  .cross__icon {
    cursor: pointer;
    float: right;
  }

  .form__error {
		color: var(--primary-color);
	}
	.form__error:last-of-type {
		margin-bottom: 1em;
	}

	.form__field {
		display: flex;
		flex-direction: column;
		gap: .2em;
		margin-bottom: 1em;
	}
</style>
