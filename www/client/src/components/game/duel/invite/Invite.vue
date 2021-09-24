<template>
  <div class="background">
    <Waiting
      v-if="status == 'waiting'"
      :Invitation="Invitation"
      :Target="Target"
    />
    <Refused v-if="status == 'refused'" :Target="Target" />
    <Accepted v-if="status == 'accepted'" :Target="Target" />
    <button @click="status = 'accepted'">accept</button>
    <button @click="status = 'refused'">refuse</button>
  </div>
</template>

<script lang="ts">
import { onMounted, PropType, ref } from '@vue/runtime-core'

import { UserType } from '@/types/user/user'
import { useSocket } from '@/composables/socket'

import Waiting from './Waiting.vue'
import Accepted from './Accepted.vue'
import Refused from './Refused.vue'

import { InvitationType } from '@/types/game/invitation'

export default {
  components: {
    Waiting,
    Accepted,
    Refused,
  },
  props: {
    Invitation: Object as PropType<InvitationType>,
    Target: Object as PropType<UserType>,
  },
  setup(props) {
    let status = ref('waiting')
    let gameRoomId = 0

    onMounted(() => {
      console.log(props.Invitation!)
    })

    useSocket('dm').socket.on('gameInvitationAnswered', (invitation) => {
      console.log('invitation')
    })

    return { status }
  },
}
</script>
