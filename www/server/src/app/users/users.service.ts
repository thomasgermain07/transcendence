import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './createuser.dto';
import { promises, write } from 'fs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    private readonly logger = new Logger(UsersService.name)


    create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.name = createUserDto.name;
        user.password = createUserDto.password;
        user.email = createUserDto.email;
        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    async findOneByName(name: string): Promise<User | undefined> {
        this.logger.log("FIND ONE");
        return this.usersRepository.findOne({name});
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    // async update(id: number, dto: UpdateUserDto): Promise<User> {

    //     let toUpdate = await this.usersRepository.findOne(id);
    //     delete toUpdate.password;
    //     delete toUpdate.name;
    //     delete toUpdate.email;

    //     let updated = Object.assign(toUpdate, dto);
    //     return await this.usersRepository.save(updated);
    // }
}