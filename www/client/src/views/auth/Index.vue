<template>
	<div>
		<h1>Transcendence</h1>
		<router-view />
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'auth',

		setup()
		{

		},

	});
</script>

<style scoped>
	h1 {
		margin: 10vh 0;
		color: var(--tertiary-color);
		font-size: 2.5rem;
		font-family: 'Press Start 2P', cursive;
	}
</style>
