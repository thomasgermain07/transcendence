<template>
	<div class="auth-register">
		<register-form />
		<login-form />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import RegisterForm from '@/components/auth/RegisterForm.vue';
import LoginForm from '@/components/auth/LoginForm.vue';

export default defineComponent({
	name: 'auth-register',
	components: {
		RegisterForm,
		LoginForm,
	},

	setup() {},
});
</script>

<style scoped>
.auth-register {
	display: grid;
	gap: 3em;
	grid-template-columns: repeat(2, 1fr);
	margin: 0 10vw;
}
</style>
