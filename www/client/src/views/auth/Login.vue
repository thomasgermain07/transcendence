<template>
	<div class="auth-login">
		<h2>Auth-Login</h2>
		<login-marvin />
		<hr>
		<login-form />
		<hr>
		Need an account? <router-link :to="{ name: 'auth-register' }">Register here</router-link>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	import LoginForm   from "@/components/auth/LoginForm.vue";
	import LoginMarvin from "@/components/auth/LoginMarvin.vue";

	export default defineComponent({
		name: 'auth-login',
		components: {
			LoginForm,
			LoginMarvin
		},

		setup()
		{

		},

	});
</script>

<style scoped>
	.auth-login {
		background: rgb(230, 163, 64);
	}
</style>
