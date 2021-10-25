import { useAxios } from '@/composables/axios';
import { DirectMessageType } from '@/types/chat/direct_message';
import { ref } from 'vue';

export default function getFetchMessages() {
	let messages = ref<DirectMessageType[]>([]);

	const fetchMessages = async (id: number, page: number) => {
		try {
			const { data } = await useAxios().axios.get('dm/messages', {
				params: {
					target: id,
					page: page,
				},
			});
			messages.value = messages.value.concat(data);
		} catch (e) {}
	};

	return { messages, fetchMessages };
}
