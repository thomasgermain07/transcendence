import { ref } from '@vue/reactivity'

export default function getFriendsWindowInteraction() {
  let showOnline = ref(true)
  let showOffline = ref(false)

  const toggle_online = () => {
    showOnline.value = !showOnline.value
  }
  const toggle_offline = () => {
    showOffline.value = !showOffline.value
  }

  return { showOffline, showOnline, toggle_offline, toggle_online }
}
