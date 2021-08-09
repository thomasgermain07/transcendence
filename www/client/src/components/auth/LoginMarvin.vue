<template>
	<div class="auth-login-marvin">
		<a :href="url">Signin with 42</a>
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'auth-login-marvin',

		setup()
		{
			const client_id    = import.meta.env.VITE_FT_ID;
			const redirect_uri = import.meta.env.VITE_FT_CALLBACK_URL;

			const url = new URL('https://api.intra.42.fr/oauth/authorize');
			url.searchParams.set('scope', 'public');
			url.searchParams.set('client_id', client_id);
			url.searchParams.set('redirect_uri', redirect_uri);
			url.searchParams.set('response_type', 'code');

			return {
				// Datas
				url: url.toString()
			};
		},

	});
</script>

<style scoped>
	.auth-login-marvin {
		background: rgb(89, 118, 196);
	}
</style>
