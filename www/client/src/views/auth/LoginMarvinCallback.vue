<template>
	<div>
		<GoogleAuth
			v-if="googleCode.visible"
			@submit="submit"
			>
		</GoogleAuth>
		<div class="auth-login-marvin-callback">
			<h2>Auth-Login-Marvin-Callback</h2>

			{{ message }}
		</div>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";
	import { ref } from "vue";
	import { useRoute }        from "vue-router";

	import { useAuth } from "@/composables/auth";
	import GoogleAuth from "@/components/auth/GoogleAuth.vue";

	export default defineComponent({
		name: 'auth-login-marvin-callback',
		components: {
			GoogleAuth,
		},
		setup()
		{
			const route = useRoute();

			const code: string = (typeof route.query.code === 'string')
				? route.query.code
				: ""
			;

			const message = ref("Verifying your login...");

			const { loginMarvin, googleCode } = useAuth();

			loginMarvin(code)
				.catch((err) => {
					message.value = err.response?.data.message;
				})
			;

			return {
				// Datas
				googleCode,
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