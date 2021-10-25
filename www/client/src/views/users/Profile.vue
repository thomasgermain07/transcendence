<template>
	<div>
		<p v-if="status == 'loading'">Loading profile ...</p>

		<div v-if="status == 'success'" class="profile-ctn">
			<section class="user-info">
				<div class="user-ctn__pp">
					<img v-bind:src="users.avatar" class="profile_picture" />
				</div>
				<div class="user-ctn">
					<div class="user-ctn__info">
						<p class="info__name">{{ users.name }}</p>
						<p class="ladder__level">Ladder Level : {{ users.ladderLevel }}</p>

						<button v-if="isCurrentUser && !userEdit" @click="openEdit">
							Edit Profile
						</button>
						<div v-if="isCurrentUser && userEdit" class="user-edit">
							<edit-profile-window
								v-on:closeWindow="closeEdit"
								v-on:update-user="updateUser"
							/>
						</div>

						<div class="user-interaction">
							<button
								v-if="!isCurrentUser && !isAlreadyFriend"
								@click="onAddFriend"
							>
								add friend
							</button>
						</div>
						<div class="user-interaction">
							<button
								v-if="!isCurrentUser && isAlreadyFriend"
								@click="onDeleteFriend"
							>
								remove friend
							</button>
							<button v-if="!isCurrentUser" @click="openDm(users)">
								Send Message
							</button>
						</div>
					</div>
				</div>
			</section>

			<section class="user-match-history">
				<h1 class="info-header">MATCH HISTORY ></h1>
				<hr />
				<MatchHistory class="matches" :user="users" />
			</section>

			<section class="user-game-info">
				<div class="user-stats">
					<h1 class="info-header">GAME STATS ></h1>
					<hr />
					<GameStats :user="users" />
				</div>
				<div class="user-achievements">
					<h1 class="info-header">ACHIEVEMENTS ></h1>
					<hr />
					<Achievements :user="users" />
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useAuth } from '@/composables/auth';
import { useUsers } from '@/composables/users';
import requestStatus from '@/composables/requestStatus';
import GameStats from '@/components/game/GameStats.vue';
import MatchHistory from '@/components/game/MatchHistory.vue';
import Achievements from '@/components/game/Achievements.vue';
import EditProfileWindow from '@/components/edit/EditProfileWindow.vue';
import getUserInteraction from '@/composables/User/getUserInteraction';
import { useFriends } from '@/composables/Friends/useFriends';
import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/useWindowInteraction';

export default defineComponent({
	components: {
		GameStats,
		MatchHistory,
		Achievements,
		EditProfileWindow,
	},
	setup() {
		let status = ref(requestStatus.loading);

		const route = useRoute();
		const router = useRouter();
		const { edit } = useAuth();
		const { users, get } = useUsers();

		const userEdit = ref(false);

		const openEdit = () => {
			userEdit.value = true;
		};

		const closeEdit = () => {
			userEdit.value = false;
		};

		const { addFriend, removeFriend } = getUserInteraction();
		const { reloadFriends, reloadRequests, hasPendingInvite, friends } =
			useFriends();

		const { openDm } = useWindowInteraction();

		const isCurrentUser = computed(() => {
			return users.value!.id == useAuth().user.id;
		});

		const updateUser = async (): Promise<void> => {
			fetchUserProfile(parseInt(route.params.id as string));
			await edit({ first_log: false });
		};

		const fetchUserProfile = async (id: number): Promise<void> => {
			await get(id);
			status.value = users.value ? requestStatus.success : requestStatus.error;
			if (status.value == requestStatus.error) {
				router.replace({ name: 'error-not-found' });
			}
		};

		const onAddFriend = async (): Promise<void> => {
			await addFriend(users.value!);
			reloadRequests();
			reloadFriends();
		};

		const onDeleteFriend = async (): Promise<void> => {
			await removeFriend(users.value!);
			reloadRequests();
			reloadFriends();
		};

		const isAlreadyFriend = computed(() => {
			if (
				friends.value.findIndex((friend) => {
					return friend.id == users.value!.id;
				}) != -1 ||
				hasPendingInvite(users.value!)
			) {
				return true;
			}
			return false;
		});

		onBeforeRouteUpdate((updateGuard) => {
			const nextUserId = parseInt(updateGuard.params.id as string);
			fetchUserProfile(nextUserId);
		});

		onMounted(() => {
			fetchUserProfile(parseInt(route.params.id as string));
		});

		return {
			users,
			status,
			isCurrentUser,
			userEdit,
			openEdit,
			closeEdit,
			updateUser,
			isAlreadyFriend,
			onAddFriend,
			onDeleteFriend,
			openDm,
		};
	},
});
</script>

<style scoped>
* {
	box-sizing: border-box;
	font-family: 'Inconsolata', monospace;
}

.user-info {
	display: flex;
	margin: 40px;
	margin-top: 0;
}

@media only screen and (max-width: 768px) {
	.user-info {
		flex-direction: column;
		text-align: center;
	}
	.user-game-info {
		flex-direction: column;
		align-items: stretch;
	}
	.user-stats {
		margin: 50px;
	}
	.user-match-history {
		margin: 50px;
	}
}

.profile-ctn {
	margin-top: 2em;
	display: flex;
	flex-direction: column;
}

.user-ctn {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.user-ctn__pp {
	margin: auto 0;
}

.user-ctn__info {
	padding: 0 50px;
	text-align: left;
}

.profile_picture {
	border-radius: 50%;
	width: 150px;
	height: 150px;
}

.info__name {
	font-weight: 800;
	font-size: 64px;
	text-transform: capitalize;
	letter-spacing: -1px;
	margin: 20px 0 0;
	color: var(--tertiary-color);
}
.ladder__level {
	padding: 0 0 20px 0;
	color: grey;
}

.user-game-info {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
}

.info-header {
	font-size: 16px;
	font-weight: 800;
	padding: 20px;
	text-align: left;
}

.user-stats,
.user-achievements {
	flex: 1;
	margin: 0 30px 20px 30px;
	padding: 20px 50px;
	color: var(--tertiary-color);
	box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
	border-radius: 4px;
	height: 60vh;
	overflow: scroll;
}

.user-match-history {
	margin: 0 30px 20px 30px;
	padding: 20px 50px;
	color: var(--secondary-color);
	background-color: #060b1f;
	border-radius: 4px;
}

.user-edit {
	position: fixed;
	top: 50%;
	left: 50%;
	width: 80vw;
	max-width: 800px;
	max-height: 100%;
	padding: 0 20px;
	transform: translate(-50%, -50%);
	overflow: scroll;
	background-color: rgb(231, 234, 238);
	color: black;
	line-height: 130%;
	box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.9);
	border-radius: 2px;
	z-index: 100;
}
</style>
