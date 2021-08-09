import { AxiosResType } from "@/composables/axios";
import { useAxios }     from "@/composables/axios";

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
async function get(
	id: number | undefined = undefined,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = id ? `users/${id}` : `users/me`;

	return await axios.get(url);
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const UsersService = Object.freeze({
	get,
});
