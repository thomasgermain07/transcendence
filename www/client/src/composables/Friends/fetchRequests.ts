import { useAxios } from '../axios'

export default function getFetchRequests() {
  const fetchRequests = async () => {
    try {
      const { data } = await useAxios().axios.get('friends?pending=true')
      return data
    } catch (e) {
      console.log(e)
    }
  }

  return { fetchRequests }
}
