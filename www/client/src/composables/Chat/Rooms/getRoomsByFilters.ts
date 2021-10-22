import { ref, Ref, computed } from 'vue';

export function getRoomsByName(rooms: Ref) {
	let searchQuery = ref('');

	const roomsByName = () => {
		return rooms.value?.filter((room: any) => {
			return room.name
				.toLowerCase()
				.includes(searchQuery.value.trim().toLowerCase());
		});
	};

	return { searchQuery, roomsByName };
}
