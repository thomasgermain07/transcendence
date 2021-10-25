<template>
	<div class="top-bar">
		<a @click="$emit('close')">
			<i class="far fa-times-circle top-bar__icon"></i>
		</a>
		<div class="top-bar__name">{{ Title }}</div>
		<a @click="$emit('refresh')">
			<i class="fas fa-sync-alt top-bar__icon"></i>
		</a>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		Title: String,
	},
});
</script>

<style scoped>
.top-bar {
	display: flex;
	justify-content: flex-start;
	padding: 4px 4px;
	background-color: black;
	color: white;
}

.top-bar__name {
	flex-grow: 1;
}

.top-bar__icon {
	color: whitesmoke;
	cursor: pointer;
}
</style>
