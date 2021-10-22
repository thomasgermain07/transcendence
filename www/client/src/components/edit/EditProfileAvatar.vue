<template>
	<div class="edit-profile-avatar">
		<h3>Change your avatar</h3>

		<div
			v-for="message in messages"
			:key="message.content"
			class="form__message"
			:class="[message.is_error ? 'form__error' : 'form__info']"
		>
			- {{ message.content }}
		</div>
		<input type="file" @change="onFileSelected" />
		<button @click="onUpload">Upload</button>
	</div>
</template>

<script lang="ts">
import { FormMessage } from '@/types/formMessage';
import { defineComponent, reactive } from 'vue';
import { ref } from 'vue';
import { AxiosErrType, useAxios } from '../../composables/axios';

export default defineComponent({
	name: 'edit-profile-avatar',
	emit: ['update-user'],
	setup(props, context) {
		let imageFile = ref('');
		const { axios } = useAxios();

		const messages = reactive<FormMessage[]>([]);

		const onFileSelected = (event: any): void => {
			imageFile.value = event.target.files[0];
		};

		const onUpload = async (): Promise<void> => {
			while (messages.length > 0) messages.pop();

			try {
				let data = new FormData();
				data.append('file', imageFile.value);
				await axios.post('users/upload', data);

				messages.push({
					content: 'Your avatar has been updated successfully.',
					is_error: false,
				});

				context.emit('update-user');
			} catch (err: AxiosErrType) {
				const errors: string | string[] = err.response?.data?.message;

				if (Array.isArray(errors)) {
					errors.forEach((error: string) =>
						messages.push({
							content: error,
							is_error: true,
						}),
					);
				} else {
					messages.push({
						content: errors,
						is_error: true,
					});
				}
			}
		};

		return {
			messages,
			onFileSelected,
			onUpload,
		};
	},
});
</script>

<style scoped>
h3 {
	padding-bottom: 1rem;
}
.err-msg {
	color: red;
}

.form__message + .form__message {
	margin-top: 0.5em;
}
.form__message:last-of-type {
	margin-bottom: 1em;
}
.form__error {
	color: var(--primary-color);
}
.form__info {
	color: rgb(38, 199, 38);
}
.form__field {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
	margin-bottom: 1em;
}
</style>
