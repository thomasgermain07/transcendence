<template>
	<div class="app-home">
		<h2>App-Home</h2>
		<Leaderboard />
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";
	import Leaderboard from '../../components/game/Leaderboard.vue'

	export default defineComponent({
		name: 'app-home',
		components: { Leaderboard },

		setup()
		{

		},

	});
</script>

<style scoped>
	.app-home {
		background: rgb(230, 163, 64);
	}
</style>
