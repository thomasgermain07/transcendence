<template>
	<div class="join-room-ctn">
		<header class="window-header">
			<i class="fas fa-arrow-left" @click="goBack"></i>
			<p class="window-title">Join room</p>
			<i class="fas fa-arrow-left window-bar__separator"></i>
		</header>

		<RoomsList v-if="open_list" @joinned="joinned" />

		<div v-if="!open_list" class="content">
			<RoomSearch @joinned="joinned" />

			<div class="separator"></div>

			<div class="display-rooms-ctn">
				<div class="label">Navigate through rooms list</div>
				<button class="action-btn" @click="open_list = true">Go to list</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

import JoinRoomPanel from './JoinRoomPanel.vue';
import RoomsList from './RoomsList.vue';
import RoomSearch from './RoomSearch.vue';

import { useChat } from '@/composables/Chat/useChat';

export default defineComponent({
	components: {
		JoinRoomPanel,
		RoomsList,
		RoomSearch,
	},
	setup(props, { emit }) {
		let open_list = ref(false);

		const { reloadRooms } = useChat();

		const joinned = () => {
			reloadRooms();
			emit('close');
		};

		const goBack = () => {
			open_list.value == true ? (open_list.value = false) : emit('close');
		};

		return {
			open_list,
			joinned,
			goBack,
		};
	},
});
</script>

<style scoped>
.join-room-ctn {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
}

.separator {
	background-color: black;
	height: 2px;
}

.label {
	font-weight: bold;
}

.display-rooms-ctn * {
	margin: 5px;
}
</style>
