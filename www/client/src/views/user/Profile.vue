<template>
	<div class="user-profile">
		<h2>User-Profile</h2>

		<div v-if="loading">
			Loading...
		</div>
		<div v-else-if="!user">
			User not found.
		</div>
		<div v-else>
			<h3>User</h3>
			<p>
				user.id: {{ user.id }}
				<br>
				user.name: {{ user.name }}
				<br>
				user.email: {{ user.email }}
			</p>
		</div>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";
	import { ref } from "vue";

	import { useUsers } from "@/composables/users";

	export default defineComponent({
		name: 'user-profile',

		setup()
		{
			const loading = ref(true);

			const { users, get } = useUsers();

			get()
			.then(() => {
				loading.value = false;
			});

			return {
				// Datas
				loading,
				user: users,
			};
		},

	});
</script>

<style scoped>
	.user-profile {
		background: rgb(230, 163, 64);
	}
</style>
