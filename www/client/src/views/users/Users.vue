<template>
	<div class="users-view">
		<div v-if="status == 'error'">Error Loading content ...</div>
		<div v-else-if="loading">LOADING...</div>
		<div class="users-list">
			<div class="search-container">
				<input
					type="text"
					v-model="search"
					placeholder="search"
					class="search-input"
				/>
			</div>
			<div v-if="search">
				<div class="users-item" v-for="user in users" :key="user">
					<router-link
						:to="{ name: 'user-profile', params: { id: user.id } }"
						class="users-link"
					>
						<img :src="user.avatar" class="avatar-logo" />
						{{ user.name }}
					</router-link>
				</div>
			</div>
			<div v-else>
				<div class="users-item" v-for="user in users" :key="user">
					<router-link
						:to="{ name: 'user-profile', params: { id: user.id } }"
						class="users-link"
					>
						<img :src="user.avatar" class="avatar-logo" />
						{{ user.name }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, watch, defineComponent } from 'vue';

import getFetchUsers from '@/composables/Users/fetchUsers';
import requestStatus from '@/composables/requestStatus';

export default defineComponent({
	setup() {
		const loading = ref(true);
		let search = ref('');
		let status = ref(requestStatus.loading);
		let { users, fetchUsers, oldOffset, offset } = getFetchUsers(
			status,
			loading,
			search,
		);

		const handleScroll = (): void => {
			if (
				!loading.value &&
				window.innerHeight + document.documentElement.scrollTop >=
					document.documentElement.offsetHeight
			) {
				fetchUsers();
			}
		};

		watch(
			() => search.value,
			() => {
				users.value = [];
				offset.value = 0;
				oldOffset.value = -1;
				fetchUsers();
			},
		);

		onMounted(() => {
			fetchUsers();
			window.addEventListener('scroll', handleScroll);
		});

		onUnmounted(() => {
			window.removeEventListener('scroll', handleScroll);
		});

		return { users, status, offset, loading, search };
	},
});
</script>

<style scoped>
.users-list {
	list-style-type: none;
	align-items: center;
	text-decoration: none;
	font-size: 280%;
}
.users-link {
	text-decoration: none;
	color: black;
}

.search-container {
	padding-top: 64px;
	padding-bottom: 50px;
}

.search-input {
	width: 50%;
	padding: 12px 24px;

	background-color: transparent;
	transition: transform 250ms ease-in-out;
	font-size: 14px;
	line-height: 18px;

	color: #575756;
	background-color: transparent;
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-size: 18px 18px;
	background-position: 95% center;
	border-radius: 50px;
	border: 1px solid #575756;
	transition: all 250ms ease-in-out;
	backface-visibility: hidden;
	transform-style: preserve-3d;
}
.search-input::placeholder {
	color: color(#575756 a(0.8));
	text-transform: uppercase;
	letter-spacing: 1.5px;
}

.search-input::hover,
.search-input::focus {
	padding: 12px 0;
	outline: 0;
	border: 1px solid transparent;
	border-bottom: 1px solid #575756;
	border-radius: 0;
	background-position: 100% center;
}

.avatar-logo {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
</style>
