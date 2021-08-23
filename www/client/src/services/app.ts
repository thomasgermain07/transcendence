import { AxiosResType } from "@/composables/axios";
import { useAxios }     from "@/composables/axios";

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
async function csrf()
	: Promise<AxiosResType>
{
	const { axios, setHeader } = useAxios();

	const url: string = `csrf`;

	return await axios.get(url)
		.then((res: AxiosResType) => {
			setHeader("csrf-token", res.data.token);

			return res;
		})
	;
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const AppService = {
	csrf,
};
