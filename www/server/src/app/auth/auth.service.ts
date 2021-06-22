import { Logger, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        // private readonly logger = new Logger(AuthService.name)
        ) {}
    private readonly logger = new Logger(AuthService.name)

    async validateUser(name: string, password: string): Promise<any> {
        // Logger.warn('warning')
        // Logger.log(username);
        // Logger.log('Doing something...');
        this.logger.log("IN VALIDATEUSER FUNCTION");
        this.logger.log("ghgddg");
        const user = await this.usersService.findOneByName(name);
        if (user && user.password === password) {
          const { password,  ...result } = user;
          return result;
        }
        return null;
    }

    async login(user: any) {
        this.logger.log("IN LOGIN FUNCTION");
        const payload = { name: user.name, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
