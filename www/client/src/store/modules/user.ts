import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface IUserState {
  id: number
  name: string
  email: string
  ladderLevel: number
  //   avatar: string;
  //   roles: string[];
}

@Module
export default class UserModule extends VuexModule implements IUserState {
  public id = 0
  public name = ''
  public email = ''
  public ladderLevel = 0

  @Mutation
  SET_USER(user: IUserState): void {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.ladderLevel = user.ladderLevel
  }
}
