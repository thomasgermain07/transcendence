import { ref } from 'vue'

export function getRoomsInteraction() {
  const rooms = ref()

  const refresh_rooms = () => {
    rooms.value.fetchRooms(true)
  }

  return { rooms, refresh_rooms }
}

export function getChatWindowInteraction(set_page_title: Function) {
  let openned = ref('')
  const room = ref(0)

  const open = (vue: string, params?: any) => {
    if (vue == 'room') {
      set_page_title(params.name)
      room.value = params.id
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
  }

  return { room, openned, open, close }
}
