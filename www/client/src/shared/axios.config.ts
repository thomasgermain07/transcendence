import axios from 'axios'
import { store } from '../store'

const initAxios = (): void => {
  // -----------------------------------------------------------------------------
  // Axios Config
  // -----------------------------------------------------------------------------

  // Url
  axios.defaults.baseURL = 'http://localhost:8080/api/'
  // HTTP Headers
  axios.defaults.headers.common = {
    'Content-Type': 'application/json',
  }
  // HTTP Options
  axios.defaults.withCredentials = true

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    async function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response.status === 401 && error.config.url != 'auth/refresh') {
        console.log('Attempting to get new access with refresh tokens')
        await store.dispatch('refreshTokens')
        return new Promise((resolve, reject) => {
          axios
            .request(error.config)
            .then((response) => {
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
      return Promise.reject(error)
    },
  )
}

export default initAxios
