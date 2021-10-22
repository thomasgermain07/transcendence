<template>
	<div class="root">
		<widget-container-modal />
		<Navigation />

		<span v-if="starting">
			{{ message }}
		</span>
		<router-view v-else />
		<Menu v-if="is_authenticated" />
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

import Navigation from '@/components/Navigation.vue';
import Menu from '@/components/Menu/MenuWindow.vue';
import { container } from 'jenesius-vue-modal';

import { useApp } from '@/composables/app';
import { useAuth } from '@/composables/auth';

export default defineComponent({
	name: 'root',
	components: {
		Navigation,
		Menu,
		WidgetContainerModal: container,
	},
	setup() {
		const starting = ref(true);
		const message = ref('Starting the application...');

		const { csrf } = useApp();

		const {
			refresh,
			autoRefresh,
			isPreviouslyAuthenticated,
			is_authenticated,
		} = useAuth();

		csrf().then(async () => {
			if (isPreviouslyAuthenticated()) {
				message.value = 'Recovering your session...';
				await refresh();
			}

			autoRefresh();

			message.value = 'Done.';
			starting.value = false;
		});

		return {
			starting,
			message,
			is_authenticated,
		};
	},
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Electrolize&family=Noto+Sans+Mono:wght@900&family=Play&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Changa:wght@300&family=Special+Elite&display=swap');

.root {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	position: relative;

	--primary-color: #ff2a6d;
	--secondary-color: #d1f7ff;
	--tertiary-color: #01012b;
	box-sizing: border-box;
}
</style>
