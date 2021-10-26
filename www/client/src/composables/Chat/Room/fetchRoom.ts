import { useAxios } from '@/composables/axios';
import { RoomType } from '@/types/chat/room';

export default function getFetchRoom() {
	const fetchRoom = async (id: Number): Promise<RoomType> => {
		const { axios } = useAxios();
		try {
			const { data } = await axios.get(`chat/rooms/${id}`);
			return data;
		} catch (e) {
			throw e;
		}
	};

	return { fetchRoom };
}
