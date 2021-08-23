import { ref } from '@vue/reactivity'

export default function getJoinPanelInteraction() {
  let open_panel = ref(0)

  const openPanel = (id: number) => {
    id == open_panel.value ? (open_panel.value = 0) : (open_panel.value = id)
  }

  return { open_panel, openPanel }
}
