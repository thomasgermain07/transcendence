import { ref } from 'vue';
import { useAxios, AxiosErrType } from '../axios';
import { Room } from '@/types/game/gameRoom';

const useAllGameRoom = (mode: string) => {
	const { axios } = useAxios();

	const rooms = ref<Room[]>([]);

	const loadGameRooms = async (): Promise<void> => {
		const response = await axios
			.get(`game/rooms/${mode}`)
			.catch((error: AxiosErrType) => {});

		if (response) rooms.value = response.data;
	};

	return {
		rooms,
		loadGameRooms,
	};
};

export default useAllGameRoom;
