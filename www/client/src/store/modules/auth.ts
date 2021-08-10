import router from '@/routers/router'
import axios, { AxiosResponse } from 'axios'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { IUserState } from './user'

enum LoginState {
  verifying = 'verifying',
  loggedIn = 'loggedIn',
  error = 'error',
}

// Auth Module Interface
export interface IAuthState {
  loading: boolean
  marvinAuthState: LoginState
}

// ADD namespace?
@Module
export default class AuthModule extends VuexModule implements IAuthState {
  loading = true
  marvinAuthState = LoginState.verifying

  @Mutation
  SET_LOADING(value: boolean): void {
    this.loading = value
  }

  @Mutation
  SET_OAUTH(state: LoginState): void {
    this.marvinAuthState = state
  }

  //   @Action({ rawError: true })
  @Action
  async login(payload: IUserState): Promise<void> {
    this.context.commit('SET_LOADING', true)
    const response = await axios
      .post(`auth/login`, payload)
      .catch((err: AxiosResponse) => {
        const ret = JSON.parse(err.request.response)
        console.log(ret)
        alert(ret.message)
      })
    if (response) {
      // console.log(response);
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_USER', response.data)
      localStorage.setItem('auth', 'true')
      router.push('/')
    }
  }

  @Action
  async loginWith42(code: string): Promise<void> {
    this.context.commit('SET_LOADING', true)
    const response = await axios
      .get(`auth/marvin?code=${code}`)
      .catch((err: AxiosResponse) => {
        this.context.commit('SET_OAUTH', LoginState.error)
        router.push('/login')
      })
    if (response) {
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_OAUTH', LoginState.loggedIn)
      this.context.commit('SET_USER', response.data)
      localStorage.setItem('auth', 'true')
      router.push('/')
    }
  }

  @Action
  async register(payload: IUserState): Promise<void> {
    // this.context.commit("SET_LOADING", true);
    const response = await axios
      .post(`auth/register`, payload)
      .catch((err: AxiosResponse) => {
        const ret = JSON.parse(err.request.response)
        console.log(ret)
        alert(ret.message)
      })
    if (response) {
      // console.log(response);
      console.log('Registration successful')
      router.push('/login')
    }
  }

  @Action
  async checkAuth(): Promise<void> {
    const response = await axios.get(`auth`).catch(() => {
      alert('Your session has expired')
      // router.replace('/login')
    })
    if (response) {
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_USER', response.data)
    }
  }

  @Action
  async refreshTokens(): Promise<void> {
    const response = await axios.get(`auth/refresh`).catch((error) => {
      console.log('Refresh token expired, request rejected')
      localStorage.removeItem('auth')
      router.replace('/login')
      return Promise.reject(error)
    })
    if (response) {
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_USER', response.data)
    }
  }

  @Action
  async logout(): Promise<void> {
    const payload = {}
    // this.context.commit("SET_LOADING", true);
    const response = await axios.delete(`auth/logout`, payload).catch(() => {
      localStorage.removeItem('auth')
    })
    if (response) {
      // this.context.commit("SET_LOADING", false);
      console.log('Logging out')
      this.context.commit('SET_USER', <IUserState>{})
      localStorage.removeItem('auth')
    }
    router.replace('/login')
  }
}
