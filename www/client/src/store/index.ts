import { createStore } from 'vuex'
import AuthModule from './modules/auth'
import UserModule from './modules/user'

export const store = createStore({
  state: {},
  modules: {
    auth: AuthModule,
    user: UserModule,
  },
})
