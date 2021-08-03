import { ref } from 'vue'

export default function getWindowInteraction() {
  let showCreateRoom = ref(false)
  const rooms = ref()

  const toggle_create_window = (state: String) => {
    if (state == 'open') {
      showCreateRoom.value = true
    } else if (state == 'close') {
      showCreateRoom.value = false
    }
  }
  const refresh_rooms = () => {
    rooms.value.getRooms()
  }

  return {
    showCreateRoom,
    rooms,
    toggle_create_window,
    refresh_rooms,
  }
}
