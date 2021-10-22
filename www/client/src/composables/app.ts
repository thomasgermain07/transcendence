import { AppService }   from "@/services/app";
import { AxiosErrType } from "@/composables/axios";

export function useApp()
{
	async function csrf()
		: Promise<void>
	{
		try
		{
			const res = await AppService.csrf();
		}
		catch (err: AxiosErrType)
		{
		}

		return ;
	}

	return {
		csrf,
	};
};
