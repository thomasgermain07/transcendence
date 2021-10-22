<template>
	<div class="content">
		<div class="text-ctn">
			<p class="message">
				<span class="username">{{ Target?.name }}</span> refused the duel
			</p>
			<button class="btn" @click="closeInvite">close</button>
		</div>
		<div class="logo">
			<i class="fas fa-times"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { onMounted, PropType } from '@vue/runtime-core';
import { UserType } from '@/types/user/user';
import { useGameInvite } from '@/composables/Game/useGameInvite';

export default {
	props: {
		Target: Object as PropType<UserType>,
	},
	setup() {
		let interval = 0;

		const { closeInviteNotification } = useGameInvite();

		const closeInvite = () => {
			clearInterval(interval);
			closeInviteNotification();
		};

		const startCountDown = (counter: number) => {
			interval = setInterval(() => {
				counter--;

				if (counter < 0) {
					closeInvite();
				}
			}, 1000);
		};

		onMounted(() => startCountDown(6));

		return {
			closeInvite,
		};
	},
};
</script>

<style scoped>
.username {
	font-weight: bold;
	color: red;
}

.content {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	font-family: Avenir, Helvetica, Arial, sans-serif;
}

.text-ctn {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.fa-times {
	color: red;
	font-size: 50px;
}

.btn {
	margin: 10px;
	border: 1px solid black;
	border-radius: 8px;
	background-color: white;
	cursor: pointer;
}
</style>
