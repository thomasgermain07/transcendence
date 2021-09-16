<template>
	<div class="app">
		<!-- <h1>App</h1> -->

		<router-view />
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'app',

		setup()
		{

		},

	});
</script>

<style scoped>
	/* .app {
		background: rgb(184, 62, 184);
	} */
</style>
