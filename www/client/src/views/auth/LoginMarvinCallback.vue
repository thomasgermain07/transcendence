<template>
	<div class="auth-login-marvin-callback">
		<h2>Auth-Login-Marvin-Callback</h2>

		{{ message }}
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";
	import { ref } from "vue";
	import { useRoute }        from "vue-router";

	import { useAuth } from "@/composables/auth";

	export default defineComponent({
		name: 'auth-login-marvin-callback',

		setup()
		{
			const route = useRoute();

			const code: string = (typeof route.query.code === 'string')
				? route.query.code
				: ""
			;

			const message = ref("Verifying your login...");

			const { loginMarvin } = useAuth();

			loginMarvin(code)
				.catch((err) => {
					message.value = err.response?.data.message;
				})
			;

			return {
				// Datas
				message,
			};
		},

	});
</script>

<style scoped>
	.auth-login-marvin-callback {
		background: rgb(230, 163, 64);
	}
</style>