import { ref } from '@vue/reactivity'

export default function getFriendsWindowInteraction() {
  let showOnline = ref(true)
  let showOffline = ref(false)
  let showRequest = ref(false)

  const toggle_menu = (menu: string) => {
    if (menu == 'online') {
      showOnline.value = !showOnline.value
    } else if (menu == 'offline') {
      showOffline.value = !showOffline.value
    } else if (menu == 'request') {
      showRequest.value = !showRequest.value
    }
  }

  return {
    showOnline,
    showOffline,
    showRequest,
    toggle_menu,
  }
}
