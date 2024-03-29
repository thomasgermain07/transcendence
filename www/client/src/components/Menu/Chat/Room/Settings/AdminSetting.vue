<template>
	<div class="admin-ctn">
		<div v-if="has_password" class="change-pw">
			<p>Change this room's password</p>
			<input
				type="password"
				class="field-input"
				v-model="password"
				placeholder="New password"
			/>
			<p v-if="error" class="error">{{ error }}</p>
			<p>or</p>
			<button @click="deletePassword">Delete password</button>
		</div>
		<div v-if="!has_password">
			<p>Add a password to this room</p>
			<input
				type="password"
				class="field-input"
				v-model="password"
				placeholder="Create password"
			/>
			<p v-if="error" class="error">{{ error }}</p>
		</div>
		<div>
			<p>Change Visibility section</p>
			<div class="switch-ctn">
				<div
					class="switch"
					:class="{ 'switch--selected-yes': roomParams.visible }"
					@click="roomParams.visible = true"
				>
					Yes
				</div>
				<div
					class="switch"
					:class="{ 'switch--selected-no': !roomParams.visible }"
					@click="roomParams.visible = false"
				>
					No
				</div>
			</div>
		</div>
		<div>
			<button @click="onDeleteRoom">Delete Room</button>
			<button @click="onValidateChanges">Validate Changes</button>
		</div>
	</div>
	<div class="banned-list">
		<BannedList />
	</div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref } from 'vue';

import getChangeRoom from '@/composables/Chat/Room/modifyRoom';

import { RoomParamsType } from '@/types/chat/room_params';
import { useRoom } from '@/composables/Chat/Room/useRoom';

import BannedList from './Banned.vue';

export default defineComponent({
	components: {
		BannedList,
	},
	setup(props, { emit }) {
		let { roomData } = useRoom();

		const error = ref<string>('');
		const password = ref<string>('');

		let has_password = roomData.room!.password ? true : false;

		let roomParams = reactive<RoomParamsType>({
			password: password.value,
			visible: roomData.room!.visible,
		});

		const { changeRoom } = getChangeRoom();

		const deletePassword = () => {
			roomParams.password = null;
			onValidateChanges();
		};

		const onValidateChanges = async () => {
			try {
				if (roomParams.password != null)
					roomParams.password = password.value || undefined;

				await changeRoom(roomData.room!.id, roomParams);
				await useRoom().reloadRoom();
				emit('close');
			} catch (e: any) {
				if (Array.isArray(e)) {
					e.forEach((err: string) =>
						error.value += err + " "
					);
				} else {
					error.value = e;
				}
			}
		};

		const onDeleteRoom = async () => {
			await useRoom().destroyRoom();
			emit('delete');
			emit('close');
		};

		return {
			password,
			error,
			has_password,
			roomParams,
			deletePassword,
			changeRoom,
			onValidateChanges,
			onDeleteRoom,
		};
	},
	emits: ['close', 'delete'],
});
</script>

<style scoped>
.admin-ctn {
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
}

.admin-ctn > div {
	padding: 5px;
	flex-grow: 1;
}

.banned-list {
	border-top: 2px solid black;
	flex-grow: 1;
}

.switch-ctn {
	display: flex;
	justify-content: center;
	margin: 5px;
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

.error {
	color: rgb(216, 14, 14);
}
</style>
