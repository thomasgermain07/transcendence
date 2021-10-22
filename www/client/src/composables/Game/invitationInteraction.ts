import { GameOptions } from '@/types/game/gameOptions';
import { InvitationType } from '@/types/game/invitation';
import { useAuth } from '../auth';
import { AxiosErrType, useAxios } from '../axios';

export default function getInvitationInteraction() {
	let axios = useAxios().axios;

	const hasPendingInvite = async (id: Number) => {
		try {
			let { data } = await axios.get(`users/${id}/game-invite-pending`);
			return data;
		} catch (e) {}
	};

	const isInGameOrQueue = async (id: number) => {
		try {
			let { data } = await axios.get(`game/players/checkIfInGameOrQueue/${id}`);
			return data;
		} catch (e) {}
	};

	const createInvitation = async (
		gameOptions: GameOptions,
		guestId: Number,
	) => {
		try {
			const { data } = await axios.post('dm/send-invitation', {
				gameOptions: gameOptions,
				host: useAuth().user,
				guestId: guestId,
			});
			return data;
		} catch (e: AxiosErrType) {
			throw e.response.data;
		}
	};

	const deleteInvitation = async () => {
		try {
			await axios.post('dm/cancel-invitation');
		} catch (e) {}
	};

	const acceptInvitation = async (invitation: InvitationType) => {
		try {
			let { data } = await axios.post('dm/accept-invitation', {
				...invitation,
			});
			return data;
		} catch (e: AxiosErrType) {
			return e.response.data.message;
		}
	};

	const refuseInvitation = async (invitation: InvitationType) => {
		try {
			await axios.post('dm/refuse-invitation', { ...invitation });
		} catch (e: AxiosErrType) {
			return e.response.data.message;
		}
	};

	return {
		hasPendingInvite,
		isInGameOrQueue,
		createInvitation,
		deleteInvitation,
		refuseInvitation,
		acceptInvitation,
	};
}
