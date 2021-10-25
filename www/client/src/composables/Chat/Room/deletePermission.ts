import { useAxios } from '@/composables/axios';

export default function getDeletePermission() {
	const deletePermission = async (userId: number, roomId: number) => {
		try {
			let res = await useAxios().axios.delete('chat/permissions', {
				params: {
					room_id: roomId,
					user_id: userId,
				},
			});
			return res;
		} catch (e) {
			throw e;
		}
	};

	return {
		deletePermission,
	};
}
