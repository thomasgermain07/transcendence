<template>
  <div class="edit-profile-avatar">
    <h3>Edit Avatar</h3>
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
    let imageFile = ref('')
    const { axios } = useAxios()

    const onFileSelected = (event: any) => {
      imageFile.value = event.target.files[0]
    }
    const onUpload = async () => {
      let data = new FormData()
      data.append('file', imageFile.value)
      const res = await axios
        .post('users/upload', data)
        .catch((err: AxiosErrType) => {
          alert(`${err.response?.data.message}`)
        })
      if (res) {
        context.emit('update-user')
      }
    }

    return { onFileSelected, onUpload }
  },
})
</script>

<style scoped></style>
