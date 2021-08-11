<template>
	<div class="auth-register-form">
		<h3>Registration form</h3>

		<div v-for="message in messages" :key="message">
			{{ message }}
		</div>
		<form @submit.prevent="submit">
			<div>
				<label for="name">Name</label>
				<input type="text" name="name" id="name" v-model="user.name">
			</div>
			<div>
				<label for="email">Email</label>
				<input type="email" name="email" id="email" v-model="user.email">
			</div>
			<div>
				<label for="password">Password</label>
				<input type="password" name="password" id="password" v-model="user.password">
			</div>

			<button type="submit">Register</button>
		</form>
	</div>
</template>

<script lang='ts'>
	import { defineComponent }         from "vue";
	import { ref, reactive, readonly } from "vue";

	import { RegisterType } from "@/composables/auth";
	import { useAuth }      from "@/composables/auth";

	export default defineComponent({
		name: 'auth-register-form',

		setup()
		{
			const messages = ref([]);
			const user = reactive<RegisterType>({
				name: '',
				email: '',
				password: '',
			});

			const { register } = useAuth();

			const submit = () => {
				register(readonly(user))
					.catch((err) => {
						messages.value = err.response?.data.message;
					})
				;
			};

			return {
				// Datas
				user,
				messages,
				// Functions
				submit,
			};
		},

	});
</script>

<style scoped>
	.auth-register {
		background: rgb(230, 163, 64);
	}
</style>
