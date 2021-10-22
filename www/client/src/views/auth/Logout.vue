<template>
	<div>
		<span> Cleaning your session... </span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useAuth } from '@/composables/auth';

export default defineComponent({
	name: 'auth-logout',

	setup() {
		const { logout } = useAuth();

		logout();

		return {};
	},
});
</script>

<style scoped></style>
