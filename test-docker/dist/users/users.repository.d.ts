import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './interfaces/user.dto';
export declare class UserRepository extends Repository<User> {
    createUser: (userDto: UserDto) => Promise<UserDto & User>;
    findOneUser: (id: string) => Promise<User>;
    updateUser: (id: string, userDto: UserDto) => Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
    } & User>;
    removeUser: (id: string) => Promise<import("typeorm").DeleteResult>;
}
