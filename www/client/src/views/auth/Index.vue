<template>
	<div class="auth">
		<h1>Auth</h1>

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
	.auth {
		background: rgb(184, 62, 184);
	}
</style>
