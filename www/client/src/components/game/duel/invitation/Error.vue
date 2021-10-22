<template>
	<div>
		<p class="text">{{ Msg }}</p>
	</div>
</template>

<script lang="ts">
export default {
	props: {
		Msg: String,
	},
};
</script>

<style scoped>
.text {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	color: white;
}
</style>
