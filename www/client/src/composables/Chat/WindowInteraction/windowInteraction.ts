import { ref } from 'vue'

export default function getChatWindowInteraction(set_page_title: Function) {
  let openned = ref('')
  let open_id = ref(0)

  const open = (vue: string, params?: any) => {
    if (vue == 'room' || vue == 'dm') {
      set_page_title(params.name)
      open_id.value = params.id
      openned.value = vue
    } else if (vue == 'create') {
      set_page_title('Create')
      openned.value = vue
    } else if (vue == 'join') {
      set_page_title('Join')
      openned.value = vue
    }
  }

  const close = () => {
    set_page_title('')
    openned.value = ''
    open_id.value = 0
  }

  return { open_id, openned, open, close }
}
