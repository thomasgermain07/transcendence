import { useAxios } from '@/composables/axios';
import { MessageType } from '@/types/chat/message';

export default function getFetchMessages() {
	const fetchMessages = async (room_id: number, page: number): Promise<MessageType[]> => {
		try {
			const { data } = await useAxios().axios.get('chat/messages', {
				params: {
					room_id: room_id,
					page: page,
				},
			});
			return data;
		} catch (e) {
			throw e;
		}
	};

	return { fetchMessages };
}
