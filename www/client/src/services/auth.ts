import { RegisterType } from "@/composables/auth";
import { LoginType }    from "@/composables/auth";
import { AxiosResType } from "@/composables/axios";
import { useAxios }     from "@/composables/axios";
import { EditType, GoogleAuthType } from "../composables/auth";


// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------
async function register(
	payload: RegisterType,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/register`;

	return await axios.post(url, payload);
}

async function login(
	payload: LoginType,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/login`;

	return await axios.post(url, payload);
}

async function loginMarvin(
	code: string,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const params: string = new URLSearchParams({ code: code }).toString();
	const url: string = `auth/marvin?${params}`;

	return await axios.post(url);
}

async function refresh()
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/refresh`;

	return await axios.post(url);
}

async function logout()
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/logout`;

	return await axios.delete(url);
}

async function edit(
	payload: EditType,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/edit`;

	return await axios.post(url, payload);
}

async function activate2Fa(
	payload: RegisterType,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/activate2Fa`;
	
	return await axios.post(url, payload);
}

async function verifyCode(
	code: GoogleAuthType,
)
	: Promise<AxiosResType>
{
	const { axios } = useAxios();

	const url: string = `auth/code`;
	console.log('-------')
	console.log(code)
	return await axios.post(url, code);
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const AuthService = Object.freeze({
	register,
	login,
	loginMarvin,
	refresh,
	logout,
	edit,
	activate2Fa,
	verifyCode,
});
