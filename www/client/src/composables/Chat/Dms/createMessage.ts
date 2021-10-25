import { useAxios } from '@/composables/axios';

export default function getCreateMessage() {
	const createMessage = async (id: number, content: string) => {
		try {
			await useAxios().axios.post('dm/messages', {
				target_id: id,
				content: content,
			});
		} catch (e) {
			throw e;
		}
	};

	return { createMessage };
}
