import axios from 'axios'
import { Ref, ref, watch } from 'vue'
import requestStatus from '../../requestStatus'

export function getRoomInputs() {
  let name_f = ref('')
  let password_f = ref('')
  let visible_f = ref(true)
  let name_v = ref(true)
  let password_v = ref(true)

  watch(name_f, (new_value) => {
    if (new_value.length >= 3) {
      name_v.value = true
    } else {
      name_v.value = false
    }
  })

  watch(password_f, (new_value) => {
    if (new_value.length == 0 || new_value.length >= 6) {
      password_v.value = true
    } else {
      password_v.value = false
    }
  })

  return {
    fields: { name: name_f, password: password_f, visible: visible_f },
    validators: { name: name_v, password: password_v },
  }
}

export async function createRoom(fields: any, status: Ref) {
  status.value = requestStatus.sending

  let params: any = { name: fields.name.value, visible: fields.visible.value }
  if (fields.password.value.length) {
    params.password = fields.password.value
  }

  const res = await axios.post('chat/rooms', params).catch((err) => {
    console.log(err)
  })
  return res
}

export function join() {
  console.log('join')
}
