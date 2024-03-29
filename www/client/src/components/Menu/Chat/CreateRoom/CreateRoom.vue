<template>
	<div class="create-room-ctn">
		<header class="window-header">
			<i class="fas fa-arrow-left" @click="$emit('close')"></i>
			<p class="window-title">Create room</p>
			<i class="fas fa-arrow-left window-bar__separator"></i>
		</header>
		<div class="content">
			<div class="field-ctn">
				<p>Give your room a name</p>
				<input
					v-model="fields.name.value"
					class="field-input"
					:class="{ 'field-input--invalid': errors.name.value.length }"
					placeholder="name (minimum 3 characters)"
				/>
				<p
					class="field__error-msg"
					:class="{ 'field__error-msg--visible': errors.name.value.length }"
				>
					{{ errors.name.value }}
				</p>
			</div>
			<div class="field-ctn">
				<p>Give it a password too (or not)</p>
				<input
					type="password"
					v-model="fields.password.value"
					class="field-input"
					:class="{ 'field-input--invalid': errors.password.value.length }"
					placeholder="password (optionnal)"
				/>
				<p
					class="field__error-msg"
					:class="{ 'field__error-msg--visible': errors.password.value.length }"
				>
					{{ errors.password.value }}
				</p>
			</div>
			<div class="field-ctn">
				<p>Do you want it to be visible by everybody ?</p>
				<div class="switch-ctn">
					<div
						class="switch"
						:class="{ 'switch--selected-yes': fields.visible.value }"
						@click="fields.visible.value = true"
					>
						Yes
					</div>
					<div
						class="switch"
						:class="{ 'switch--selected-no': !fields.visible.value }"
						@click="fields.visible.value = false"
					>
						No
					</div>
				</div>
			</div>
			<div class="action-ctn">
				<button
					class="action-btn"
					:class="{ 'action-btn--invalid': sendable }"
					@click="sendData"
				>
					Create
				</button>
				<button class="action-btn" @click="$emit('close')">Cancel</button>
			</div>
			<p v-if="status == 'sending'">sending ...</p>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

import requestStatus from '@/composables/requestStatus';

import { getRoomInputs, createRoom } from '@/composables/Chat/Room/createRoom';
import { useChat } from '@/composables/Chat/useChat';
import { useSocket } from '@/composables/socket';

export default defineComponent({
	setup(props, { emit }) {
		let { fields, errors, sendable } = getRoomInputs();

		let status = ref(requestStatus.default);

		const { reloadRooms } = useChat();

		const sendData = async () => {
			try {
				let res = await createRoom(fields, status);
				useSocket('chat').socket.emit('join', { room_id: res.data.id });
				reloadRooms();
				emit('close');
			} catch (messages: any) {
				status.value = requestStatus.error;

				if (Array.isArray(messages)) {
					messages.forEach((error: string) =>
						errors.name.value += error + " "
					);
				} else {
					errors.name.value = messages;
				}
			}
		};

		return {
			fields,
			errors,
			status,
			sendData,
			sendable,
		};
	},
});
</script>

<style scoped>
.create-room-ctn {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}

.content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
}

.field-ctn {
	margin: 5px;
}

.field-ctn > p {
	margin: 5px;
}

.switch-ctn {
	display: flex;
	justify-content: center;
}

.switch {
	padding: 2px 15px;
	background-color: darkgrey;
	border-top: 2px solid black;
	border-bottom: 2px solid black;
	border-right: 2px solid black;
	border-radius: 0 10px 10px 0;
	cursor: pointer;
}

.switch:first-child {
	border-left: 2px solid black;
	border-radius: 10px 0 0 10px;
}

.switch--selected-yes {
	background-color: green;
}

.switch--selected-no {
	background-color: red;
}

.action-ctn {
	margin-top: 15px;
}
</style>
