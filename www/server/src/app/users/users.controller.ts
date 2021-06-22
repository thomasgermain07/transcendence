import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateUserDto} from './createuser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post('/create')
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.create(userDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() userDto: UserDto) {
    //     return this.usersService.update(id, userDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}