import { useAxios } from '@/composables/axios';

export default function getFetchRooms() {
	const fetchRooms = async (related: boolean) => {
		try {
			const { data } = await useAxios().axios.get('chat/rooms', {
				params: { related: related },
			});
			return data;
		} catch (e) {}
	};

	return { fetchRooms };
}
