<template>
	<div class="navigation-ctn">
		<div class="navigation">
			<router-link :to="{ name: 'index' }" class="link tooltip">
				<i class="fas fa-home"></i>
				<span class="tooltiptext">Home</span>
			</router-link>
			<router-link
				v-if="is_authenticated"
				:to="{ name: 'game' }"
				class="link tooltip"
			>
				<i class="fas fa-gamepad"></i>
				<span class="tooltiptext">Play</span>
			</router-link>
			<router-link
				v-if="is_authenticated"
				:to="{ name: 'users' }"
				class="link tooltip"
			>
				<i class="fas fa-users"></i>
				<span class="tooltiptext">Users</span>
			</router-link>
		</div>
		<div class="navigation">
			<router-link
				v-if="is_authenticated"
				:to="{ name: 'user-profile' }"
				class="link tooltip user"
			>
				<img class="avatar-icon" :src="user.avatar" alt="" srcset="" />
				<p>{{ user.name }}</p>
				<span class="tooltiptext">Profile</span>
			</router-link>
			<router-link
				v-if="is_authenticated"
				:to="{ name: 'auth-logout' }"
				class="link tooltip"
			>
				<i class="fas fa-sign-out-alt"></i>
				<span class="tooltiptext logout">Logout</span>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '@/composables/auth';

export default defineComponent({
	name: 'navigation',

	setup() {
		const { is_authenticated, user } = useAuth();

		return { is_authenticated, user };
	},
});
</script>

<style scoped>
.navigation-ctn {
	display: flex;
	justify-content: space-between;
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	background-color: white;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
	z-index: 2;
}
.navigation {
	display: flex;
}
.link {
	padding: 14px 23px;
	text-align: center;
	color: var(--tertiary-color);
	text-decoration: none;
	cursor: pointer;
}
.link:hover {
	background-color: var(--primary-color);
}

.tooltip .tooltiptext {
	visibility: hidden;
	width: 80px;
	background-color: rgba(0, 0, 0, 0.555);
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;

	position: absolute;
	z-index: 1;
	top: 90%;
	margin-left: -30px;
}

.tooltiptext.logout {
	top: 90%;
	left: 95%;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
}

.avatar-icon {
	width: 20px;
	height: 20px;
	padding-right: 10px;
}

.user {
	display: flex;
	align-items: center;
	font-weight: 500;
}
</style>
