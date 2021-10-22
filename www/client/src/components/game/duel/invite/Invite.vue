<template>
	<div class="background">
		<Waiting
			v-if="status == 'waiting'"
			:Invitation="Invitation"
			:Target="Target"
		/>
		<Refused v-if="status == 'refused'" :Target="Target" />
		<Accepted
			v-if="status == 'accepted'"
			:Target="Target"
			:GameRoomId="gameRoomId"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import { UserType } from '@/types/user/user';
import { useSocket } from '@/composables/socket';

import Waiting from './Waiting.vue';
import Accepted from './Accepted.vue';
import Refused from './Refused.vue';

import { InvitationType } from '@/types/game/invitation';

export default defineComponent({
	components: {
		Waiting,
		Accepted,
		Refused,
	},
	props: {
		Invitation: Object as PropType<InvitationType>,
		Target: Object as PropType<UserType>,
	},
	setup() {
		let status = ref('waiting');
		let gameRoomId = ref(0);

		useSocket('dm').socket.on('gameInvitationAnswered', (invitation) => {
			if (invitation.reply === 'Game Invitation Refused') {
				status.value = 'refused';
			} else if (invitation.reply === 'Game Invitation Accepted') {
				gameRoomId.value = invitation.gameRoom.id;
				status.value = 'accepted';
			}
		});

		return {
			status,
			gameRoomId,
		};
	},
});
</script>
