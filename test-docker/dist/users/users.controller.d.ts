import { UserDto } from './interfaces/user.dto';
import { UserRepository } from './users.repository';
export declare class UsersController {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findAll(): Promise<import("./users.entity").User[]>;
    create(userDto: UserDto): Promise<UserDto & import("./users.entity").User>;
    findOne(id: string): Promise<import("./users.entity").User>;
    update(id: string, userDto: UserDto): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
    } & import("./users.entity").User>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
