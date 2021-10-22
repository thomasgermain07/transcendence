<template>
	<div class="auth-register-form">
		<h3>Registration</h3>

		<div v-for="message in messages" :key="message" class="form__error">
			- {{ message }}
		</div>
		<form @submit.prevent="submit">
			<div class="form__field">
				<label for="name">Name</label>
				<input type="text" name="name" id="name" v-model="user.name" />
			</div>
			<div class="form__field">
				<label for="email">Email</label>
				<input type="email" name="email" id="email" v-model="user.email" />
			</div>
			<div class="form__field">
				<label for="password">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					v-model="user.password"
				/>
			</div>

			<button type="submit">Register</button>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref, reactive, readonly } from 'vue';

import { RegisterType } from '@/composables/auth';
import { useAuth } from '@/composables/auth';
import { AxiosErrType } from '@/composables/axios';

export default defineComponent({
	name: 'auth-register-form',

	setup() {
		const messages = ref([]);
		const user = reactive<RegisterType>({
			name: '',
			email: '',
			password: '',
		});

		const { register } = useAuth();

		const submit = (): void => {
			register(readonly(user)).catch((err: AxiosErrType) => {
				messages.value = err.response?.data.message;
			});
		};

		return {
			user,
			messages,
			submit,
		};
	},
});
</script>

<style scoped>
.auth-register-form {
	padding: 2em;
	text-align: left;
	box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
}
h3 {
	font-size: 1.5rem;
	margin-bottom: 1em;
}
.form__error {
	color: var(--primary-color);
}
.form__error + .form__error {
	margin-top: 0.5em;
}
.form__error:last-of-type {
	margin-bottom: 1em;
}
.form__field {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
	margin-bottom: 1em;
}
</style>
