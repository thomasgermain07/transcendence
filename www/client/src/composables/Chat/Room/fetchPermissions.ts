import { useAxios } from '@/composables/axios';
import { PermissionType } from '@/types/chat/permission';

export default function getFetchPermissions() {
	const fetchPermissions = async (
		room_id: number,
		type: 'moderator' | 'muted' | 'banned',
	): Promise<PermissionType[]> => {
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
