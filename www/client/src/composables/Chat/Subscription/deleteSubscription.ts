import { useAxios } from '@/composables/axios';

export default function getDeleteSubscription() {
	const deleteSubscription = async (id: number) => {
		try {
			await useAxios().axios.delete(`chat/subscriptions?room_id=${id}`);
		} catch (e) {
			throw e;
		}
	};

	return { deleteSubscription };
}
