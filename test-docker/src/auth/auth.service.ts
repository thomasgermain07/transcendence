import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async validateUser(name: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne(name);
        if (user && user.password == pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
