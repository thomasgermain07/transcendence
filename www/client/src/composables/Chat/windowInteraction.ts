import { ref } from 'vue'

export function getRoomsInteraction() {
  const rooms = ref()

  const refresh_rooms = () => {
    rooms.value.getRooms(true)
  }

  return {
    rooms,
    refresh_rooms,
  }
}
