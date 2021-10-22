<template>
	<div class="search-room-ctn">
		<div class="label">Searching for an invisible room ?</div>
		<div class="field-ctn">
			<input
				type="text"
				placeholder="Room name"
				class="field-input"
				:class="{
					'field-input--invalid': error.length && error[0].includes('name'),
				}"
				v-model="name_field"
			/>
			<input
				type="password"
				placeholder="Password"
				class="field-input"
				:class="{ 'field-input--invalid': error.includes('password') }"
				v-model="password_field"
			/>
		</div>

		<div
			class="field__error-msg"
			:class="{ 'field__error-msg--visible': error.length }"
		>
			{{ error }}
		</div>

		<button
			class="action-btn"
			@click="join"
			:class="{ 'action-btn--invalid': name_field.length < 3 }"
		>
			Join
		</button>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import getCreateSubscription from '@/composables/Chat/Subscription/createSubscription';
import { useSocket } from '@/composables/socket';

export default defineComponent({
	setup(props, { emit }) {
		let error = ref('');
		let name_field = ref('');
		let { password_field, createSubscription } = getCreateSubscription();

		const join = () => {
			createSubscription(name_field.value)
				.then((res) => {
					useSocket('chat').socket.emit('join', { room_id: res.data.id });
					emit('joinned');
				})
				.catch((e) => {
					error.value = e.response.data.message;
				});
		};

		return { name_field, password_field, error, join };
	},
});
</script>

<style scoped>
.search-room-ctn * {
	margin: 5px;
}

.action-btn {
	width: 20%;
}

.label {
	font-weight: bold;
}
</style>
