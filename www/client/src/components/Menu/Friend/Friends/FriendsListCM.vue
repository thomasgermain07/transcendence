<template>
	<v-contextmenu-item @click="eventHandler.onProfile(getUser)"
		>View Profile</v-contextmenu-item
	>
	<v-contextmenu-item @click="eventHandler.onOpenDm(getUser)"
		>Send Message</v-contextmenu-item
	>
	<v-contextmenu-item @click="eventHandler.onSendDuel(getUser)"
		>Send Duel</v-contextmenu-item
	>
	<v-contextmenu-item @click="eventHandler.onDeleteFriend(getUser)"
		>Delete Friend</v-contextmenu-item
	>
	<v-contextmenu-item @click="eventHandler.onBlockUser(getUser)"
		>Block</v-contextmenu-item
	>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';

import { useContextMenu } from '@/composables/useContextMenu';

import { UserType } from '@/types/user/user';
export default defineComponent({
	props: {
		User: Object as PropType<UserType>,
	},
	setup(props) {
		const eventHandler = useContextMenu();

		const getUser = computed<UserType>(() => {
			return props.User as UserType;
		});

		return {
			getUser,
			eventHandler,
		};
	},
});
</script>
