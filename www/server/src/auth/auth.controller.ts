import {
  Body,
  Req,
  Controller,
  HttpCode,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import RequestWithUser from './request-with-user.interface'
import LocalAuthGuard from './local-auth.guard'
import JwtAuthGuard from './jwt-auth.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request
    const cookie = this.authService.getCookieWithJwtToken(user.id)
    request.res.setHeader('Set-Cookie', cookie)

    user.password = undefined
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut())
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user
    user.password = undefined
    return user
  }
}
