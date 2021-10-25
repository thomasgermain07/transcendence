import { useAxios } from '@/composables/axios';

export default function getFetchPermissions() {
	const fetchPermissions = async (
		room_id: number,
		type: 'moderator' | 'muted' | 'banned',
	) => {
		try {
			const { data } = await useAxios().axios.get('/chat/permissions/filter', {
				params: {
					type: type,
					room_id: room_id,
				},
			});
			return data;
		} catch (e) {
			throw e;
		}
	};

	return {
		fetchPermissions,
	};
}
