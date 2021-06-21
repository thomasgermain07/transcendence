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
import { UsersService } from 'src/users/users.service'
import JwtRefreshGuard from './jwt-refresh-token.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    )
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id)

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id)

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id)
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut())
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    )

    request.res.setHeader('Set-Cookie', accessTokenCookie)
    return request.user
  }
}
