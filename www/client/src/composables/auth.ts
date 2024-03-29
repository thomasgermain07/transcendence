import { reactive, readonly, computed } from 'vue';

import { router } from '@/router';
import { AuthService } from '@/services/auth';
import { UsersService } from '@/services/users';
import { useUsers } from '@/composables/users';

import { AxiosErrType, AxiosResType } from './axios';
import { UserType, UserUpdateType } from '../types/user/user';
import { useSocket } from './socket';
import { useGameInvite } from './Game/useGameInvite';

const EXPIRATION = parseInt(import.meta.env.VITE_JWT_ACCESS_LIFETIME);
const TIMEOUT = Math.max(10, EXPIRATION - (EXPIRATION > 600 ? 300 : 30));
const namespaces = ['user', 'dm', 'chat', 'matchmaker', 'game-rooms'];

export type RegisterType = {
	name: string;
	email: string;
	password: string;
};

export type LoginType = {
	email: string;
	password: string;
};

export type GoogleAuthType = {
	visible: boolean;
	code: string;
	user_id: number;
};

const user = reactive<UserType>({
	id: 0,
	name: '',
	email: '',
	avatar: '',
	ladderLevel: 1,
	isTwoFactorAuthenticationEnabled: false,
	status: '',
	first_log: true,
});
const is_authenticated = computed(() => !(user.id === 0));

const googleCode = reactive<GoogleAuthType>({
	visible: false,
	user_id: 0,
	code: '',
});

export function useAuth() {
	async function register(payload: RegisterType): Promise<void> {
		try {
			const res = await AuthService.register(payload);

			router.push({ name: 'auth-register' });
		} catch (err: AxiosErrType) {
			throw err;
		}

		return;
	}

	async function login(payload: LoginType): Promise<void> {
		try {
			const res = await AuthService.login(payload);

			if (!res.data || !res.data.two_factor_enabled) {
				const { users, get } = useUsers();
				await get();
				setUser(users.value);
				setAuthenticated(true);
				router.replace({ name: 'index' });
			} else {
				googleCode.user_id = res.data.user_id;
				googleCode.visible = true;
			}
		} catch (err: AxiosErrType) {
			throw err;
		}

		return;
	}

	async function loginMarvin(code: string): Promise<void> {
		try {
			const res = await AuthService.loginMarvin(code);

			if (!res.data || !res.data.two_factor_enabled) {
				const { users, get } = useUsers();
				await get();
				setUser(users.value);
				setAuthenticated(true);
				router.replace({ name: 'index' });
			} else {
				googleCode.user_id = res.data.user_id;
				googleCode.visible = true;
			}
		} catch (err: AxiosErrType) {
			throw err;
		}

		return;
	}

	async function refresh(): Promise<void> {
		try {
			const res = await AuthService.refresh();

			if (!is_authenticated.value) {
				const { users, get } = useUsers();

				await get();

				setUser(users.value);
			}

			setAuthenticated(true);
		} catch (err: AxiosErrType) {
			logout(true);
			return;
		}

		return;
	}

	function autoRefresh(): void {
		if (is_authenticated.value) refresh();

		setTimeout(autoRefresh, TIMEOUT * 1000);
	}

	async function logout(soft: boolean = false): Promise<void> {
		useGameInvite().closeEverything();

		if (!soft) {
			try {
				const res = await AuthService.logout();
			} catch (err: AxiosErrType) {}
		}

		setUser();
		setAuthenticated(false);
		googleCode.visible = false;
		googleCode.user_id = 0;
		router.replace({ name: 'auth-login' });

		namespaces.forEach((nsp) => {
			useSocket(nsp).close();
		});

		return;
	}

	async function edit(payload: UserUpdateType): Promise<void> {
		try {
			const res = await UsersService.edit(user.id, payload);
			if (res) {
				const { users, get } = useUsers();
				await get();
				setUser(users.value);
			}
		} catch (err: AxiosErrType) {
			throw err;
		}

		return;
	}

	async function activateTwoFa(): Promise<AxiosResType> {
		try {
			const res = await AuthService.activate2Fa();
			if (res) {
				const { users, get } = useUsers();
				await get();
				setUser(users.value);
			}
			return res;
		} catch (err: AxiosErrType) {
			throw err;
		}
	}

	async function deactivateTwoFa(): Promise<AxiosResType> {
		try {
			const res = await AuthService.deactivate2Fa();
			if (res) {
				const { users, get } = useUsers();
				await get();
				setUser(users.value);
			}
			return res;
		} catch (err: AxiosErrType) {
			throw err;
		}
	}

	async function verifyCode(code: GoogleAuthType): Promise<AxiosResType> {
		try {
			const res = await AuthService.verifyCode(code);

			const { users, get } = useUsers();

			await get();

			setUser(users.value);
			setAuthenticated(true);
			router.replace({ name: 'index' });
			return res;
		} catch (err: AxiosErrType) {
			throw err;
		}
	}

	function isPreviouslyAuthenticated(): boolean {
		return localStorage.getItem('auth') === true.toString();
	}

	return {
		user: readonly(user),
		is_authenticated,
		googleCode,
		register,
		login,
		loginMarvin,
		refresh,
		autoRefresh,
		logout,
		edit,
		activateTwoFa,
		deactivateTwoFa,
		verifyCode,
		isPreviouslyAuthenticated,
	};
}

function setAuthenticated(authenticated: boolean): void {
	localStorage.setItem('auth', authenticated.toString());
}

function setUser(data: UserType | undefined = undefined) {
	user.id = data?.id ?? 0;
	user.name = data?.name ?? '';
	user.email = data?.email ?? '';
	user.avatar = data?.avatar ?? '';
	user.ladderLevel = data?.ladderLevel ?? 1;
	user.isTwoFactorAuthenticationEnabled =
		data?.isTwoFactorAuthenticationEnabled ?? false;
	user.first_log = data?.first_log ?? true;
}
