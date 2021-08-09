<template>
	<div class='root'>
		<navigation />

		<span v-if="starting">
			{{ message }}
		</span>
		<router-view v-else />
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";
	import { ref }             from "vue";

	import Navigation  from "@/components/Navigation.vue";

	import { useApp }  from "@/composables/app";
	import { useAuth } from "@/composables/auth";

	export default defineComponent({
		name: 'root',
		components: {
			Navigation,
		},

		setup()
		{
			const starting = ref(true);
			const message = ref("Starting the application...");

			// Csrf
			const { csrf } = useApp();

			const {
				refresh,
				autoRefresh,
				isPreviouslyAuthenticated,
			} = useAuth();

			csrf()
			.then(async () => {
				// Authentication
				if (isPreviouslyAuthenticated())
				{
					message.value = "Recovering your session...";
					await refresh();
				}

				autoRefresh();

				message.value = "Done.";
				starting.value = false;
			});

			return {
				starting,
				message,
			};
		},

	});
</script>

<style>
	html {
		box-sizing: border-box;
	}

	*, *::before, *::after {
		box-sizing: inherit;
	}

	body {
		margin: 0;
		font-size: 1em;
		font-family: "Open Sans", Arial, Helvetica, sans-serif;
	}
</style>