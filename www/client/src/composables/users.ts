import { ref, computed } from 'vue';

import { UsersService } from '@/services/users';

import { AxiosErrType } from './axios';

export function useUsers() {
	const users = ref();

	async function get(id: number | undefined = undefined): Promise<void> {
		try {
			const res = await UsersService.get(id);

			users.value = res.data;
		} catch (err: AxiosErrType) {}

		return;
	}

	return {
		users: computed(() => users.value),
		get,
	};
}
