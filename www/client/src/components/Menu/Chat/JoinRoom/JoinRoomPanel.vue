<template>
	<div class="panel-ctn">
		<div class="roll-menu__password">
			<input
				type="password"
				placeholder="password"
				class="field-input"
				v-if="room?.password"
				v-model="password_field"
			/>
		</div>

		<div class="error-msg">{{ error }}</div>

		<button @click="join">join</button>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

import getCreateSubscription from '@/composables/Chat/Subscription/createSubscription';

import { useSocket } from '@/composables/socket';

export default defineComponent({
	props: {
		room: Object,
	},
	setup(props, { emit }) {
		let error = ref('');

		let { password_field, createSubscription } = getCreateSubscription();

		const join = () => {
			createSubscription(props.room!.name)
				.then(() => {
					useSocket('chat').socket.emit('join', { room_id: props.room!.id });
					emit('joinned');
				})
				.catch((e) => {
					error.value = e.response.data.message;
				});
		};

		return { error, password_field, join };
	},
});
</script>

<style scoped>
.panel-ctn {
	border-bottom: 1px solid darkgray;
	padding: 10px;
}

.panel-ctn * {
	margin: 3px;
}

.error-msg {
	color: red;
	font-weight: lighter;
}
</style>
