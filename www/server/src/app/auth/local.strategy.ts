import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {

    super({
        usernameField: 'name',
        passwordField: 'password',
    });    
  }
  private readonly logger = new Logger(AuthService.name)

  async validate(name: string, password: string): Promise<any> {
    this.logger.log("IN VALIDATEUSER FUNCTION");
    const user = await this.authService.validateUser(name, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}