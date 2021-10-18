<template>
  <div class="edit-profile-name">
    <h3>Change your name</h3>

    <div class="err-msg" v-if="errorMsg">
      {{ errorMsg }}
    </div>
    <div class="current-name">
      <p>Current name: {{ user.name }}</p>
    </div>
    <form @submit.prevent="submit">
      <div>
        <label for="name">New Name</label>
        <input
          type="text"
          name="new_name"
          id="new_name"
          v-model="edit_user.new_name"
        />
      </div>

      <button type="submit">Edit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Data } from 'vue'
import { ref, reactive, readonly } from 'vue'

import { RegisterType } from '@/composables/auth'
import { useAuth } from '@/composables/auth'
import { AxiosErrType } from '../../composables/axios'

export default defineComponent({
  name: 'edit-profile-name',
  emit: ['update-user'],
  setup(props: Data, context: SetupContext) {
    const errorMsg = ref('')
    const { edit, user } = useAuth()
    const edit_user = reactive<RegisterType>({
      name: user.name,
      new_name: null,
    })

    const submit = async () => {
      errorMsg.value = ''
      if (!edit_user.new_name) {
        errorMsg.value = 'Name must not be empty'
        return
      }
      await edit(readonly(edit_user)).catch((err: AxiosErrType) => {
        errorMsg.value = err.response?.data.message
      })
      edit_user.name = user.name
      edit_user.new_name = null
      context.emit('update-user')
    }

    return {
      // Datas
      user,
      edit_user,
      errorMsg,
      // Functions
      submit,
    }
  },
})
</script>

<style scoped>
h3 {
  padding-bottom: 1rem;
}

.current-name {
  font-weight: 600;
  padding-bottom: 0.5rem;
}

button {
  margin: 0.5rem 0;
}
.err-msg {
  color: red;
}
</style>
