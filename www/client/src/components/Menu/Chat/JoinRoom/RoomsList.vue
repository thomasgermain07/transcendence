<template>
	<div class="rooms-ctn">
		<form class="search-bar-ctn">
			<i class="fas fa-search search-icon"></i>
			<input v-model="searchQuery" class="search-bar" placeholder="Search" />
			<i class="fas fa-times search-reset" @click="resetValue"></i>
		</form>

		<div class="room" v-for="room in rooms_list" :key="room">
			<span
				class="room__name"
				:class="{ 'room__name--panel-open': open_panel == room.id }"
				@click="openPanel(room.id)"
			>
				{{ room.name }}
				<i v-if="room.password" class="fas fa-lock room__lock"></i>
			</span>
			<JoinRoomPanel
				v-if="open_panel == room.id"
				:room="room"
				@joinned="$emit('joinned')"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from '@vue/runtime-core';

import JoinRoomPanel from './JoinRoomPanel.vue';

import getFetchRooms from '@/composables/Chat/Rooms/fetchRooms';
import getJoinPanelInteraction from '@/composables/Chat/WindowInteraction/getJoinPanelInteraction';
import { getRoomsByName } from '@/composables/Chat/Rooms/getRoomsByFilters';
import { RoomType } from '@/types/chat/room';

export default {
	components: {
		JoinRoomPanel,
	},
	setup() {
		const rooms = ref<RoomType[]>([]);

		let { fetchRooms } = getFetchRooms();
		let { searchQuery, roomsByName } = getRoomsByName(rooms);

		let { open_panel, openPanel } = getJoinPanelInteraction();

		const rooms_list = computed(() => {
			if (searchQuery.value) {
				return roomsByName();
			}
			return rooms.value;
		});

		const resetValue = () => {
			searchQuery.value = '';
			open_panel.value = 0;
		};

		onMounted(async () => {
			rooms.value = await fetchRooms(false);
		});

		return {
			rooms_list,
			open_panel,
			searchQuery,
			openPanel,
			resetValue,
		};
	},
};
</script>

<style scoped>
.search-bar-ctn {
	width: 80%;
	align-self: center;
	padding: 2px;
	justify-content: space-around;
}

.rooms-ctn {
	overflow-y: auto;
	display: flex;
	flex-direction: column;
}

.room {
	padding: 5px;
}

.room__name {
	padding: 0 8px;
	border-bottom: 1px solid darkgray;
	cursor: pointer;
}

.room__name--panel-open {
	border-bottom: 0;
	font-weight: bold;
}

.room__name:hover {
	border-radius: 5px;
	background-color: lightgray;
}

.room__lock {
	font-size: 0.7em;
}
</style>
