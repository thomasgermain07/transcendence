<template>
	<div class="navigation">
		<ul class="list">
			<li>
				<router-link :to="{ name: 'index'}" class="link">Home</router-link>
			</li>
			<li v-if="is_authenticated">
				<router-link :to="{ name: 'user'}" class="link">User</router-link>
			</li>
			<li v-if="is_authenticated">
				<router-link :to="{ name: 'game'}" class="link">Game</router-link>
			</li>
		</ul>
		<ul class="list">
			<li v-if="is_authenticated">
				<router-link :to="{ name: 'auth-logout'}" class="link">Logout</router-link>
			</li>
		</ul>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "@vue/runtime-core";

	import { useAuth } from "@/composables/auth";

	export default defineComponent({
		name: 'navigation',

		setup()
		{
			const { is_authenticated } = useAuth();

			return {
				is_authenticated,
			};
		},

	});
</script>

<style scoped>
	.navigation {
		display: flex;
		justify-content: space-between;
		position: sticky;
		top: 0;
		left: 0;
		margin-bottom: 1em;
		background: hsl(0, 0%, 7%);
	}

	.list {
		display: flex;
		margin: 0;
		padding: 0;
		list-style-type: none;
	}

	.link {
		display: block;
		padding: 1em;
		color: white;
		text-decoration: none;
		cursor: pointer;
	}
	.link:hover,
	.link:focus {
		color: hsl(0, 0%, 7%);
		background-color: hsl(199, 66%, 59%);
	}
</style>
