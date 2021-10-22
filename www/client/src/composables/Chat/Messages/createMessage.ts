import { AxiosErrType, useAxios } from '@/composables/axios';

export default function getCreateMessage() {
	const createMessage = async (id: number, content: string) => {
		try {
			const res = await useAxios().axios.post('chat/messages', {
				room_id: id,
				content: content,
			});
			return res;
		} catch (e: AxiosErrType) {
			throw e;
		}
	};

	return { createMessage };
}
