import { useAxios } from '../axios';

export default function getFetchIgnored() {
	const fetchIgnored = async () => {
		try {
			const { data } = await useAxios().axios.get('ignoreds');
			return data;
		} catch (e) {}
	};

	return { fetchIgnored };
}
