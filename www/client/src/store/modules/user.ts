import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface IUserState {
  id: number
  name: string
  email: string
  //   avatar: string;
  //   roles: string[];
}

@Module
export default class UserModule extends VuexModule implements IUserState {
  public id = 0
  public name = ''
  public email = ''

  @Mutation
  SET_USER(user: IUserState): void {
    this.id = user.id
    this.name = user.name
    this.email = user.email
  }
}
