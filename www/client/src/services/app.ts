import { AxiosResType } from '@/composables/axios';
import { useAxios } from '@/composables/axios';

async function csrf(): Promise<AxiosResType> {
	const { axios, setHeader } = useAxios();

	const url: string = `csrf`;

	return await axios.get(url).then((res: AxiosResType) => {
		setHeader('csrf-token', res.data.token);

		return res;
	});
}

export const AppService = {
	csrf,
};
