<template>
	<div class="app-home">
		<h2>App-Home</h2>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	import { useSocket } from "@/composables/socket";

	export default defineComponent({
		name: 'app-home',

		setup()
		{
			const { socket } = useSocket('dm');

			socket.emit('join');

			socket.on("connect_error", (err) => {
				console.log(err);
			});

			socket.on('message', (mes) => {
				console.log(mes);
			});
		},

	});
</script>

<style scoped>
	.app-home {
		background: rgb(230, 163, 64);
	}
</style>
