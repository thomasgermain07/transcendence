<template>
	<div class="error-not-found">
		<h1>NotFound</h1>

		<router-link :to="{ name: 'index' }">Back to Homepage</router-link>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'not-found',

		setup()
		{

		},

	});
</script>

<style scoped>
	.error-not-found {
		background: rgb(184, 62, 184);
	}
</style>
