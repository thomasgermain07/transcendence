<template>
	<div class="edit-profile-form">
		<h3>Edit Profile</h3>

		<div v-for="message in messages" :key="message">
			{{ message }}
		</div>
		<form @submit.prevent="submit">
			<div>
				<label for="name">Name</label>
				<input type="text" name="name" id="name" v-model="edit_user.name">
			</div>
            <div>
				<label for="name">New Name</label>
				<input type="text" name="new_name" id="new_name" v-model="edit_user.new_name">
			</div>
            
			<button type="submit">Edit</button>
		</form>
	</div>
</template>

<script lang='ts'>
	import { defineComponent }         from "vue";
	import { ref, reactive, readonly } from "vue";

	import { RegisterType } from "@/composables/auth";
	import { useAuth }      from "@/composables/auth";

	export default defineComponent({
		name: 'edit-profile-form',

		setup()
		{
			const messages = ref([]);
			const edit_user = reactive<RegisterType>({
                name: null,
                new_name: null,
			});

			const { edit } = useAuth();

			const submit = () => {
				edit(readonly(edit_user))
					.catch((err) => {
						messages.value = err.response?.data.message;
					})
				;
			};

			return {
				// Datas
				edit_user,
				messages,
				// Functions
				submit,
			};
		},

	});
</script>

<style scoped>
	.edit-profile {
		background: rgb(230, 163, 64);
	}
</style>
