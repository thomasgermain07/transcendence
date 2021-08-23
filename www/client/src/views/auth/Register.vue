<template>
	<div class="auth-register">
		<h2>Auth-Register</h2>

		<register-form />
	</div>
</template>

<script lang='ts'>
	import { defineComponent } from "vue";

	import RegisterForm from "@/components/auth/RegisterForm.vue";

	export default defineComponent({
		name: 'auth-register',
		components: {
			RegisterForm,
		},

		setup()
		{

		},

	});
</script>

<style scoped>
	.auth-register {
		background: rgb(230, 163, 64);
	}
</style>
