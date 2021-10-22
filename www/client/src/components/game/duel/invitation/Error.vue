<template>
	<div>
		<p class="text">{{ Msg }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
	props: {
		Msg: String,
	},
});
</script>

<style scoped>
.text {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	color: white;
}
</style>
