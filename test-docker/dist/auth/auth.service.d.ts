import { UserRepository } from '../users/users.repository';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: UserRepository);
    validateUser(name: string, pass: string): Promise<any>;
}
