import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserDto} from './interfaces/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}

    @Get()
    findAll() {
        return this.userRepository.find();
    }

    @Post()
    create(@Body() userDto: UserDto) {
        return this.userRepository.createUser(userDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userRepository.findOneUser(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() userDto: UserDto) {
        return this.userRepository.updateUser(id, userDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userRepository.removeUser(id);
    }
}
