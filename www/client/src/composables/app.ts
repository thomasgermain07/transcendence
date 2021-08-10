import { AppService }   from "@/services/app";
import { AxiosErrType } from "@/composables/axios";

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useApp()
{
	// -------------------------------------------------------------------------
	// Functions
	// -------------------------------------------------------------------------
	async function csrf()
		: Promise<void>
	{
		try
		{
			const res = await AppService.csrf();

			console.log("useApp.csrf: Done.");
		}
		catch (err: AxiosErrType)
		{
			console.log("useApp.csrf: Fail.");
		}

		return ;
	}

	return {
		// Functions
		csrf,
	};
};
