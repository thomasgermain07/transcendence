<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <h1> Google Authenticator </h1>
      </header>
      <div>
        <form @submit.prevent="submit">
          <div>
              <label for="code">Code</label>
              <input type="text" name="code" id="code" v-model="google.code">
          </div>
          <button type="submit">Submit</button>
		    </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  readonly,
  reactive,
} from 'vue'
import { useAuth, GoogleAuthType } from '../../composables/auth';

export default defineComponent({
  name: 'GoogleAuth',

  setup() {
    

    const messages = ref([]);
    const { verifyCode, googleCode } = useAuth();

    const google = reactive<GoogleAuthType>({
				visible: true,
        code: '',
        user_id: googleCode.user_id,
			});

    const submit = () => {
      verifyCode(google)
        .catch((err) => {
          messages.value = err.response?.data.message;
        })
      ;
    };

    return {
      // Datas
      google,
      googleCode,
      messages,
      // Functions
      submit,
    };
  },
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.808);
  display: flex;
  justify-content: center;
  align-items: center;
  /* z position  */
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 80%;
  max-height: 70%;
  /* font-family: 'Courier New', Courier, monospace; */
  font-size: 2vh;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  /* font-family: 'Courier New', Courier, monospace; */
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>