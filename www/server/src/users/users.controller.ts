import { Controller, Get, UseGuards } from '@nestjs/common'
import JwtAuthGuard from 'src/auth/jwt-auth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // route to test if auth is working
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return 'All Users'
  }
}
