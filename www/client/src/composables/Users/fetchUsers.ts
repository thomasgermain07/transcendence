import { Ref, ref } from 'vue';
import { useAxios, AxiosErrType } from '../axios';
import requestStatus from '../requestStatus';
import { UserType } from '../../types/user/user';

export default function getFetchUsers(
	status?: Ref,
	loading?: Ref,
	search?: Ref,
) {
	let users = ref<UserType[]>([]);
	let oldOffset = ref(-1);
	let offset = ref(0);
	let limit: number = 20;
	const fetchUsers = async (): Promise<void> => {
		const { axios } = useAxios();
		try {
			if (loading) loading.value = true;

			offset.value = users.value.length;
			if (oldOffset.value == offset.value) {
				if (loading) loading.value = false;
				return;
			}
			oldOffset.value = offset.value;
			const response = await axios.get(
				`users/users?offset=${offset.value}&limit=${limit}&search=${search?.value}`,
			);

			if (response) {
				if (users.value && response.data.length > 0) {
					response.data.forEach((element: any) => {
						users.value.push(element);
					});
				} else if (response.data.length > 0) {
					users.value = response.data;
				}
				if (loading) loading.value = false;
			}
		} catch (e: AxiosErrType) {
			if (status) status.value = requestStatus.error;
		}
	};

	return { users, fetchUsers, oldOffset, offset };
}
