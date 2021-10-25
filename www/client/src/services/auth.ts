import { RegisterType } from '@/composables/auth';
import { LoginType } from '@/composables/auth';
import { AxiosResType } from '@/composables/axios';
import { useAxios } from '@/composables/axios';
import { GoogleAuthType } from '../composables/auth';

async function register(payload: RegisterType): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/register`;

	return await axios.post(url, payload);
}

async function login(payload: LoginType): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/login`;

	return await axios.post(url, payload);
}

async function loginMarvin(code: string): Promise<AxiosResType> {
	const { axios } = useAxios();

	const params: string = new URLSearchParams({ code: code }).toString();
	const url: string = `auth/marvin?${params}`;

	return await axios.post(url);
}

async function refresh(): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/refresh`;

	return await axios.post(url);
}

async function logout(): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/logout`;

	return await axios.delete(url);
}

async function activate2Fa(payload?: RegisterType): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/activate2Fa`;

	return await axios.post(url, payload);
}

async function deactivate2Fa(payload?: RegisterType): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/deactivate2Fa`;

	return await axios.post(url, payload);
}

async function verifyCode(code: GoogleAuthType): Promise<AxiosResType> {
	const { axios } = useAxios();

	const url: string = `auth/code`;
	return await axios.post(url, code);
}

export const AuthService = Object.freeze({
	register,
	login,
	loginMarvin,
	refresh,
	logout,
	activate2Fa,
	deactivate2Fa,
	verifyCode,
});
