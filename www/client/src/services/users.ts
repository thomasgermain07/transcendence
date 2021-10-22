import { AxiosResType } from "@/composables/axios";
import { useAxios }     from "@/composables/axios";

import { UserUpdateType } from "@/types/user/user"

async function get(
	id: number | undefined = undefined,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = id ? `users/${id}` : `users/me`;

	return await axios.get(url);
}

async function edit(
	id: number,
	payload: UserUpdateType
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios()

	const url: string = `users/${id}`

	return await axios.patch(url, payload)
}

export const UsersService = Object.freeze({
	get,
	edit,
});
