import { Ref, ref, watch, computed } from 'vue'
import requestStatus from '@/composables/requestStatus'
import { AxiosErrType, useAxios } from '@/composables/axios'

export function getRoomInputs() {
  let name_f = ref('')
  let password_f = ref('')
  let visible_f = ref(true)
  let name_e = ref('')
  let password_e = ref('')

  watch(name_f, (new_value) => {
    if (new_value.length >= 3) {
      name_e.value = ''
    } else {
      name_e.value = 'room name should be at least 3 chars'
    }
  })

  watch(password_f, (new_value) => {
    if (new_value.length == 0 || new_value.length >= 6) {
      password_e.value = ''
    } else {
      password_e.value =
        "let this field empty if you don't want a password or it should be at least 6 char"
    }
  })

  const sendable = computed(() => {
    if (!name_f.value.length) {
      return 1
    }
    return name_e.value.length || password_e.value.length
  })

  return {
    fields: { name: name_f, password: password_f, visible: visible_f },
    errors: { name: name_e, password: password_e },
    sendable,
  }
}

export async function createRoom(fields: any, status: Ref) {
  status.value = requestStatus.sending
  const { axios } = useAxios()

  let params: any = { name: fields.name.value, visible: fields.visible.value }
  if (fields.password.value.length) {
    params.password = fields.password.value
  }

  try {
    const res = await axios.post('chat/rooms', params)
    status.value = requestStatus.success
    return res
  } catch (e: AxiosErrType) {
    throw e.response.data.message
  }
}
