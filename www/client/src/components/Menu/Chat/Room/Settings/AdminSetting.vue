<template>
	<div class="admin-ctn">
		<div v-if="has_password" class="change-pw">
			<p>Change this room's password</p>
			<input
				type="password"
				class="field-input"
				v-model="roomParams.password"
				placeholder="New password"
			/>
			<p>or</p>
			<button @click="deletePassword">Delete password</button>
		</div>
		<div v-if="!has_password">
			<p>Add a password to this room</p>
			<input
				type="password"
				class="field-input"
				v-model="roomParams.password"
				placeholder="Create password"
			/>
		</div>
		<div>
			<p>Change Visibility section</p>
			<div class="switch-ctn">
				<div
					class="switch"
					:class="{ 'switch--selected-yes': roomParams.visibility }"
					@click="roomParams.visibility = true"
				>
					Yes
				</div>
				<div
					class="switch"
					:class="{ 'switch--selected-no': !roomParams.visibility }"
					@click="roomParams.visibility = false"
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
import { reactive } from '@vue/runtime-core';

import getChangeRoom from '@/composables/Chat/Room/modifyRoom';

import { RoomParamsType } from '@/types/chat/room_params';
import { useRoom } from '@/composables/Chat/Room/useRoom';

import BannedList from './Banned.vue';

export default {
	components: {
		BannedList,
	},
	setup(props, { emit }) {
		let { roomData } = useRoom();

		let has_password = roomData.room!.password ? true : false;

		let roomParams = reactive<RoomParamsType>({
			visibility: roomData.room!.visible,
		});

		const { changeRoom } = getChangeRoom();

		const deletePassword = () => {
			roomParams.password = null;
			onValidateChanges();
		};

		const onValidateChanges = async () => {
			try {
				if (roomParams.password != null && roomParams.password?.length == 0) {
					delete roomParams.password;
				}
				await changeRoom(roomData.room!.id, roomParams);
				await useRoom().reloadRoom();
				emit('close');
			} catch (e) {}
		};

		const onDeleteRoom = async () => {
			await useRoom().destroyRoom();
			emit('delete');
			emit('close');
		};

		return {
			has_password,
			roomParams,
			deletePassword,
			changeRoom,
			onValidateChanges,
			onDeleteRoom,
		};
	},
	emits: ['close', 'delete'],
};
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
</style>
