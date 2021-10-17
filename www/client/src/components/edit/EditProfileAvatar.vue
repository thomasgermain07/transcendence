<template>
  <div class="edit-profile-avatar">
    <h3>Change you avatar</h3>

    <div class="err-msg" v-if="errorMsg">
      {{ errorMsg }}
    </div>
    <input type="file" @change="onFileSelected" />
    <button @click="onUpload">Upload</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Data } from 'vue'
import { ref } from 'vue'
import { AxiosErrType, useAxios } from '../../composables/axios'

export default defineComponent({
  name: 'edit-profile-avatar',
  emit: ['update-user'],
  setup(props: Data, context: SetupContext) {
    const errorMsg = ref('')
    let imageFile = ref('')
    const { axios } = useAxios()

    const onFileSelected = (event: any) => {
      imageFile.value = event.target.files[0]
    }
    const onUpload = async () => {
      errorMsg.value = ''
      let data = new FormData()
      data.append('file', imageFile.value)
      const res = await axios
        .post('users/upload', data)
        .catch((err: AxiosErrType) => {
          errorMsg.value = err.response?.data.message
        })
      if (res) {
        context.emit('update-user')
      }
    }

    return {
      errorMsg,
      onFileSelected,
      onUpload,
    }
  },
})
</script>

<style scoped>
h3 {
  padding-bottom: 1rem;
}
.err-msg {
  color: red;
}
</style>
