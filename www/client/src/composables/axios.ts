import { AxiosInstance, AxiosResponse } from "axios";
import axios                            from "axios";

export type AxiosResType = AxiosResponse<any>;
export type AxiosErrType = any;

const instance: AxiosInstance = axios.create({
	baseURL: "http://localhost:8080/api/",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export function useAxios()
{
	function setHeader(
		name: string,
		value: string,
	)
		: void
	{
		instance.defaults.headers[name] = value;
	}

	return {
		axios: instance,
		setHeader,
	};
};
