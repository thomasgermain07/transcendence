<template>
  <div class="edit-profile-name">
    <h3>Change your name</h3>

    <div
      v-for="message in messages"
      :key="message.content"
      class="form__message"
      :class="[message.is_error ? 'form__error' : 'form__info']"
    >
      - {{ message.content }}
    </div>
    <form @submit.prevent="submit">
      <div class="form__field">
        <label for="name">New name:</label>
        <input type="text" name="name" id="name" v-model="user_update.name" />
      </div>

      <button type="submit">Edit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { reactive } from 'vue'

import { useAuth } from '@/composables/auth'
import { AxiosErrType } from '@/composables/axios'
import { UserUpdateType } from '@/types/user/user'
import { FormMessage } from '@/types/formMessage'

export default defineComponent({
  name: 'edit-profile-name',
  emit: ['update-user'],

  setup(props, context) {
    const { edit } = useAuth()

    const messages = reactive<FormMessage[]>([])
    const user_update = reactive<UserUpdateType>({
      name: '',
    })

    const submit = async (): Promise<void> => {
      while (messages.length > 0) messages.pop()

      if (!user_update.name) {
        messages.push({
          content: 'Your name must not be empty.',
          is_error: true,
        })
        return
      }

      try {
        await edit(user_update)

        messages.push({
          content: 'Your name has been updated successfully.',
          is_error: false,
        })

        context.emit('update-user')
      } catch (err: AxiosErrType) {
        const errors: string | string[] = err.response?.data?.message

        if (Array.isArray(errors)) {
          errors.forEach((error: string) =>
            messages.push({
              content: error,
              is_error: true,
            }),
          )
        } else {
          messages.push({
            content: errors,
            is_error: true,
          })
        }
      }
    }

    return {
      // Datas
      messages,
      user_update,
      // Functions
      submit,
    }
  },
})
</script>

<style scoped>
.edit-profile-name {
  text-align: left;
}

.form__message + .form__message {
  margin-top: 0.5em;
}
.form__message:last-of-type {
  margin-bottom: 1em;
}
.form__error {
  color: var(--primary-color);
}
.form__info {
  color: rgb(38, 199, 38);
}
.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  margin-bottom: 1em;
}
</style>
