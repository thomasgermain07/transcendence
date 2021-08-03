import { ref } from 'vue'

export default function fetchRoom() {
  let room_id = ref()

  const getRoom = async () => {}

  return {
    room_id,
    getRoom,
  }
}
