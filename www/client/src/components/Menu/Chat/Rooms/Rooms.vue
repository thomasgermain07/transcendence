<template>
  <div class="convs-interaction-ctn">
    <div class="convs-interaction" @click="$emit('open', 'create')">Create</div>
    <div class="convs-interaction" @click="$emit('open', 'join')">Join</div>
  </div>

  <div v-if="sortedConvs" class="convs__list">
    <p v-if="!sortedConvs.length">No rooms registered</p>

    <div v-for="conv in sortedConvs" :key="conv">
      <div class="convs-item" @click="openConv(conv)">
        <i v-if="conv.type == 'room'" class="fas fa-users conv-icon"></i>
        <i v-else-if="conv.type == 'dm'" class="fas fa-user conv-icon"></i>

        <span class="convs-item--name">{{ conv.target.name }}</span>
        <i
          class="fas fa-bell notification"
          :class="{ 'notification--visible': conv.notification }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { ConversationType } from '@/types/chat/conversation'
import { NotificationType } from '@/types/chat/notification'
import { RoomType } from '@/types/chat/room'
import { UserType } from '@/types/user/user'
import getFetchUser from '@/composables/User/fetchUser'

export default {
  props: {
    CurrentRoomId: Number,
    Notifications: Array as PropType<Array<NotificationType>>,
    Rooms: Array as PropType<Array<RoomType>>,
    RelatedUsers: Array as PropType<Array<UserType>>,
  },
  setup(props, { emit }) {
    let convs = ref<ConversationType[]>([])

    let { user, fetchUser } = getFetchUser()

    const newDmConv = async (id: Number) => {
      await fetchUser(id)
      let new_conv: ConversationType = { type: 'dm', target: user.value! }
      new_conv.notification = true
      convs.value.unshift(new_conv)
    }

    const markNotification = () => {
      props.Notifications?.forEach((notif) => {
        let conv = convs.value.find(
          (conv) => conv.type == notif.type && conv.target.id == notif.target,
        )
        if (conv != undefined) {
          if (notif.type == 'room') {
            conv.target.id != props.CurrentRoomId
              ? (conv!.notification = true)
              : 0
          } else if (notif.type == 'dm') {
            conv.target.id != props.CurrentRoomId
              ? (conv!.notification = true)
              : 0
          }
        } else {
          newDmConv(notif.target)
        }
      })
    }

    const getConvs = () => {
      convs.value = []

      props.Rooms!.forEach((room) => {
        convs.value.push({ type: 'room', target: room })
      })
      props.RelatedUsers!.forEach((user) => {
        convs.value.push({ type: 'dm', target: user })
      })

      markNotification()
    }

    onMounted(() => {
      getConvs()
    })

    const openConv = (conv: ConversationType) => {
      let index = props.Notifications?.findIndex(
        (notif) => notif.type == conv.type && notif.target == conv.target.id,
      )
      if (index != undefined && index != -1) {
        props.Notifications?.splice(index, 1)
      }
      emit('open', conv.type, { id: conv.target.id, name: conv.target.name })
    }

    const sortedConvs = computed(() => {
      convs.value.sort((a, b) => {
        if (a.notification && !b.notification) {
          return -1
        } else if (!a.notification && b.notification) {
          return 1
        }
        return 0
      })
      return convs.value
    })

    watch(
      () => props.Rooms?.length,
      () => getConvs(),
    )
    watch(
      () => props.RelatedUsers?.length,
      () => getConvs(),
    )

    watch(
      () => props.Notifications?.length,
      () => {
        convs.value.forEach((conv) => {
          conv.notification = false
        })
        markNotification()
      },
    )

    return {
      sortedConvs,
      openConv,
    }
  },
  emits: ['open'],
}
</script>

<style scoped>
.rooms__banner {
  background-color: darkgray;
  border-bottom: 2px solid black;
  font-weight: bold;
}

.convs-interaction-ctn {
  display: flex;
  background-color: darkgray;
}

.notification {
  color: red;
  visibility: hidden;
}

.notification--visible {
  visibility: visible;
}

.convs-interaction {
  padding: 3px;
  flex-grow: 1;
  border-bottom: 2px solid black;
  cursor: pointer;
}

.convs-interaction:hover {
  background-color: white;
}

.convs-interaction-ctn > .convs-interaction:first-child {
  border-right: 2px solid black;
}

.convs__list {
  display: flex;
  flex-direction: column;
}

.convs-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.convs-item--name {
  padding: 4px 0;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

/* TODO : Align conv icon on the center */
.conv-icon {
  padding: 2px;
}
</style>
