<template>
	<div class="friend-window">
		<TopBar :Title="'Friends'" @close="closeWindow" @refresh="loadData" />
		<form class="search-bar-ctn">
			<i class="fas fa-search search-icon"></i>
			<input v-model="searchQuery" class="search-bar" placeholder="Search" />
			<i class="fas fa-times search-reset" @click="searchQuery = ''"></i>
		</form>
		<FriendsList v-if="searchQuery" :Friends="friendsByName" />

		<div
			@click="openChat"
			class="open-chat-btn"
			v-if="!searchQuery && !chat_open"
		>
			<i class="fas fa-bell notification"></i>
			Open chat
			<i
				class="fas fa-bell notification"
				:class="{ 'notification--visible': notification }"
			></i>
		</div>

		<a
			v-if="!searchQuery && requests.length"
			class="roll-menu"
			:class="{ 'roll-menu--open': showRequest }"
			@click="toggle_menu('request')"
		>
			New request(s)
			<i class="far fa-arrow-alt-circle-down arrow"></i>
		</a>
		<RequestList
			v-if="showRequest && !searchQuery"
			:Requests="requests"
			@request_answered="loadData"
			@reload_data="loadData"
		/>

		<a
			v-if="!searchQuery"
			class="roll-menu"
			:class="{ 'roll-menu--open': showOnline }"
			@click="toggle_menu('online')"
		>
			Online
			<i class="far fa-arrow-alt-circle-down arrow"></i>
		</a>
		<FriendsList v-if="showOnline && !searchQuery" :Friends="onlineFriends" />

		<a
			v-if="!searchQuery"
			class="roll-menu"
			:class="{ 'roll-menu--open': showOffline }"
			@click="toggle_menu('offline')"
		>
			Offline
			<i class="far fa-arrow-alt-circle-down arrow"></i>
		</a>
		<FriendsList v-if="showOffline && !searchQuery" :Friends="offlineFriends" />

		<a
			v-if="!searchQuery"
			class="roll-menu"
			:class="{ 'roll-menu--open': showIgnored }"
			@click="toggle_menu('ignored')"
		>
			Blocked
			<i class="far fa-arrow-alt-circle-down arrow"></i>
		</a>
		<IgnoredList
			v-if="showIgnored && !searchQuery"
			:Ignored="ignored"
			@unblocked_user="loadData"
		/>
	</div>
</template>

<script lang="ts">
import { onMounted, watch, defineComponent } from 'vue';

import {
	getFriendsByName,
	getFriendsByStatus,
} from '@/composables/Friends/getFriendsByFilters';
import getFriendsWindowInteraction from '@/composables/Window/FriendsWindowInteraction';

import TopBar from './Utils/TopBar.vue';
import FriendsList from './Friend/Friends/FriendsList.vue';
import RequestList from './Friend/Request/RequestList.vue';
import IgnoredList from './Friend/Ignored/IgnoredList.vue';

import { useChat } from '@/composables/Chat/useChat';
import { useFriends } from '@/composables/Friends/useFriends';
import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/useWindowInteraction';

export default defineComponent({
	components: {
		TopBar,
		FriendsList,
		RequestList,
		IgnoredList,
	},
	setup(props, { emit }) {
		const { loadData, friends, ignored, requests } = useFriends();

		let { searchQuery, friendsByName } = getFriendsByName(friends, ignored);
		const { onlineFriends, offlineFriends } = getFriendsByStatus(
			friends,
			ignored,
		);

		let { showOffline, showOnline, showRequest, showIgnored, toggle_menu } =
			getFriendsWindowInteraction();

		const { notification, chat_open, closeWindow, openChat } =
			useWindowInteraction();

		watch(
			() => useChat().notifications.value.length,
			(v) => {
				notification.value = v > 0 ? true : false;
			},
		);

		onMounted(async () => {
			await loadData();
		});

		return {
			requests,
			ignored,
			searchQuery,
			showOnline,
			showOffline,
			showRequest,
			showIgnored,
			notification,
			toggle_menu,
			loadData,
			onlineFriends,
			offlineFriends,
			friendsByName,

			chat_open,
			closeWindow,
			openChat,
		};
	},
	emits: ['open_create_invite'],
});
</script>

<style scoped>
.friend-window {
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 375px;
}

.notification {
	color: red;
	visibility: hidden;
}

.notification--visible {
	visibility: visible;
}

.search-bar-ctn {
	padding: 2px;
	justify-content: space-around;
	height: 24px;
	border-bottom: 2px solid black;
}

.open-chat-btn {
	display: flex;
	justify-content: space-between;
	border-bottom: 2px solid black;
	padding: 3px;
}

.roll-menu {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.3em;
	cursor: pointer;
	background-color: darkgrey;
	border-bottom: 1px solid black;
}

.roll-menu--open {
	border-bottom: 2px solid black;
}

.roll-menu .arrow {
	transform: rotate(0deg);
	transition: linear 0.2s;
}

.roll-menu--open .arrow {
	transform: rotate(180deg);
}
</style>
