import { AxiosInstance, AxiosResponse } from "axios";
import axios                            from "axios";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type AxiosResType = AxiosResponse<any>;
export type AxiosErrType = any;

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const instance: AxiosInstance = axios.create({
	baseURL: "http://localhost:8080/api/",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useAxios()
{
	// -------------------------------------------------------------------------
	// Functions
	// -------------------------------------------------------------------------
	function setHeader(
		name: string,
		value: string,
	)
		: void
	{
		instance.defaults.headers[name] = value;
	}

	return {
		// Specials
		axios: instance,

		// Functions
		setHeader,
	};
};
