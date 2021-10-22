<template>
	<login-marvin />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoginMarvin from '@/components/auth/LoginMarvin.vue';

export default defineComponent({
	name: 'auth-login',
	components: {
		LoginMarvin,
	},

	setup() {},
});
</script>

<style scoped></style>
