import {
  Body,
  Req,
  Controller,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { Post, Delete } from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'

import { LocalGuard } from '../guards/local.guard'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { OAuthMarvinGuard } from '../guards/oauth-marvin.guard'
import { AuthService } from '../services/auth.service'
import { CookieType } from '../services/cookies.service'
import { CookiesService } from '../services/cookies.service'
import { AuthUser } from '../decorators/auth-user.decorator'

import { EditProfilePayload } from '../interfaces/edit-profile-payload.interface'
import { GoogleAuthPayload } from '../interfaces/google-code-payload.interface'

import { TwoFactorAuthenticationService } from 'src/auth/services/twoFactorAuthentication.service'
import { UsersService } from 'src/users/services/users.service'

type LoginResponseType = {
  two_factor_enabled: boolean
  user_id?: number
}

@Controller('auth')
export class AuthController {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(
    private readonly auth_svc: AuthService,
    private readonly cookies_svc: CookiesService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  // -------------------------------------------------------------------------
  // Public methods
  // -------------------------------------------------------------------------
  @Post('register')
  async register(@Body() create_dto: CreateUserDto): Promise<User> {
    return this.auth_svc.register(create_dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate2Fa')
  async activate2Fa(@AuthUser() user: User): Promise<string> {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user,
      )
    const qrcode = await this.twoFactorAuthenticationService.pipeQrCodeStream(
      otpauthUrl,
    )
    await this.twoFactorAuthenticationService.turnOnTwoFactorAuthentication(
      user,
    )
    return qrcode
  }

  @UseGuards(JwtAuthGuard)
  @Post('deactivate2Fa')
  async deactivate2Fa(@AuthUser() user: User): Promise<void> {
    await this.twoFactorAuthenticationService.turnOffTwoFactorAuthentication(
      user,
    )
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtTwoFactorGuard)
  @Post('edit')
  async edit(
    @AuthUser() user: User,
    @Body() edit_info: EditProfilePayload,
  ): Promise<User> {
    return this.auth_svc.edit(user, edit_info)
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<LoginResponseType> {
    const auth = this.cookies_svc.getJwtTokenCookie(
      user,
      CookieType.AUTHENTICATION,
    )
    const refresh = this.cookies_svc.getJwtTokenCookie(user, CookieType.REFRESH)

    this.auth_svc.refresh(user, refresh.token)

    if (user.isTwoFactorAuthenticationEnabled) {
      return {
        user_id: user.id,
        two_factor_enabled: true,
      }
    }
    request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie])
    return {
      two_factor_enabled: false,
    }
  }

  @Post('code')
  async code(
    @Body() twoFactorAuthenticationCode: GoogleAuthPayload,
    @Req() request: Request,
  ): Promise<LoginResponseType> {
    const user: User = await this.usersService.findOne({
      id: twoFactorAuthenticationCode.user_id,
    })
    if (!user) {
      throw new NotFoundException('User Not found')
    }
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      )
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code')
    }
    const auth = this.cookies_svc.getJwtTokenCookie(
      user,
      CookieType.AUTHENTICATION,
    )
    const refresh = this.cookies_svc.getJwtTokenCookie(user, CookieType.REFRESH)

    this.auth_svc.refresh(user, refresh.token)

    request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie])

    return {
      two_factor_enabled: user.isTwoFactorAuthenticationEnabled,
    }
  }

  @UseGuards(OAuthMarvinGuard)
  @Post('marvin')
  async loginWithMarvin(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<LoginResponseType> {
    return this.login(user, request)
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @AuthUser() user: User,
    @Req() request: Request,
  ): Promise<void> {
    const auth = this.cookies_svc.getJwtTokenCookie(
      user,
      CookieType.AUTHENTICATION,
    )

    request.res.setHeader('Set-Cookie', auth.cookie)

    return
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@AuthUser() user: User, @Req() request: Request): Promise<void> {
    this.auth_svc.logout(user)

    request.res.setHeader('Set-Cookie', this.cookies_svc.getJwtClearCookies())

    return
  }
}
