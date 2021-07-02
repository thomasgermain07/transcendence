import router from '../../routers/router'
import axios, { AxiosResponse } from 'axios'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { IUserState } from './user'

// Auth Module Interface
export interface IAuthState {
  loading: boolean
  authenticated: boolean
  // oauth2Client?: null,
  // error: null,
}

// ADD namespace?
@Module
export default class AuthModule extends VuexModule implements IAuthState {
  loading = true
  authenticated = false

  get isAuthenticated(): boolean {
    return this.isAuthenticated
  }

  @Mutation
  SET_LOADING(value: boolean): void {
    this.loading = value
  }

  @Mutation
  SET_AUTH(value: boolean): void {
    this.authenticated = value
  }

  //   @Action({ rawError: true })
  @Action
  async login(payload: IUserState): Promise<void> {
    // this.context.commit("SET_LOADING", true);
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
      this.context.commit('SET_AUTH', true)
      this.context.commit('SET_USER', response.data)
      router.push('/')
    }
    // return { response };
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
      this.context.commit('SET_AUTH', false)
      router.replace('/login')
    })
    if (response) {
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_AUTH', true)
      this.context.commit('SET_USER', response.data)
      router.replace('/')
    }
  }

  @Action
  async refreshTokens(): Promise<void> {
    const response = await axios.get(`auth/refresh`).catch((error) => {
      console.log('Refresh token expired, request rejected')
      this.context.commit('SET_AUTH', false)
      router.replace('/login')
      return Promise.reject(error)
    })
    if (response) {
      this.context.commit('SET_LOADING', false)
      this.context.commit('SET_AUTH', true)
      this.context.commit('SET_USER', response.data)
      //   router.push("/");
    }
  }

  @Action
  async logout(): Promise<void> {
    const payload = {}
    // this.context.commit("SET_LOADING", true);
    const response = await axios.delete(`auth/logout`, payload).catch(() => {
      console.log('IN LOGOUT ERROR')
      // console.log(err);
    })
    if (response) {
      // this.context.commit("SET_LOADING", false);
      console.log('Logging out')
      this.context.commit('SET_AUTH', false)
      this.context.commit('SET_USER', <IUserState>{})
      router.replace('/login')
    }
  }
}
