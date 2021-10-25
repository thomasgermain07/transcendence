import { useAxios } from '../axios';

export default function getFetchFriends() {
	const fetchFriends = async () => {
		try {
			const { data } = await useAxios().axios.get('friends');
			return data;
		} catch (e) {}
	};

	return { fetchFriends };
}
