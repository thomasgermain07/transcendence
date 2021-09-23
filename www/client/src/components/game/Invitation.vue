<template>
  <div class="invitation">
    <p>{{ Invitation.host.name }} invited you to play</p>
  </div>
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'
import { InvitationType } from '@/types/game/invitation'
export default {
  props: {
    Invitation: Object as PropType<InvitationType>,
  },
  setup() {},
}
</script>

<style scoped></style>
