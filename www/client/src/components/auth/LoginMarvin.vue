<template>
	<a :href="url" class="auth-login-marvin">Signin with 42</a>
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
		display: inline-block;
		padding: 1em 2em;
		color: var(--secondary-color);
		text-decoration: none;
		background: var(--tertiary-color);
		box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
	}
	.auth-login-marvin:hover {
		background: var(--primary-color);
	}
</style>
