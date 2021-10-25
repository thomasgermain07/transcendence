<template>
	<v-contextmenu-item
		v-if="Conv?.type == 'dm'"
		@click="eventHandler.onProfile(getTarget)"
		>View Profile</v-contextmenu-item
	>
	<v-contextmenu-item
		v-if="Conv?.type == 'dm' && !isBlocked(getTarget.id)"
		@click="eventHandler.onSendDuel(getTarget)"
		>Send Duel</v-contextmenu-item
	>

	<v-contextmenu-item
		v-if="Conv?.type == 'dm' && !isBlocked(getTarget.id)"
		@click="eventHandler.onBlockUser(getTarget)"
		>Block</v-contextmenu-item
	>
	<v-contextmenu-item
		v-if="Conv?.type == 'dm' && isBlocked(getTarget.id)"
		@click="eventHandler.onUnblockUser(getTarget)"
		>Unblock</v-contextmenu-item
	>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/runtime-core';
import { ConversationType } from '@/types/chat/conversation';
import { useContextMenu } from '@/composables/useContextMenu';
import { useFriends } from '@/composables/Friends/useFriends';
import { UserType } from '@/types/user/user';

export default defineComponent({
	props: {
		Conv: Object as PropType<ConversationType>,
	},
	setup(props) {
		const eventHandler = useContextMenu();
		const { isBlocked } = useFriends();

		const getTarget = computed(() => {
			return props?.Conv?.target as UserType;
		});

		return {
			eventHandler,
			getTarget,
			isBlocked,
		};
	},
});
</script>
