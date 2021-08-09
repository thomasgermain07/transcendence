<template>
	<div class="user">
		<h1>User</h1>

		<router-view />
  </div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'user',

		setup()
		{

		},

	});
</script>

<style scoped>
	.user {
		background: rgb(184, 62, 184);
	}
</style>
