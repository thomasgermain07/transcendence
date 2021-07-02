import { Body, Req, Controller }      from '@nestjs/common'
import { Get, Post, Delete }          from '@nestjs/common'
import { UseGuards, UseInterceptors } from '@nestjs/common'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { Request }                    from 'express'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User }          from 'src/users/entities/user.entity'

import { LocalAuthGuard }  from '../guards/local-auth.guard'
import { JwtAuthGuard }    from '../guards/jwt-auth.guard'
import { JwtRefreshGuard } from '../guards/jwt-refresh-token.guard'
import { AuthService }     from '../services/auth.service'
import { CookieType }      from '../services/cookies.service'
import { CookiesService }  from '../services/cookies.service'
import { AuthUser }        from '../decorators/auth-user.decorator'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly authService : AuthService,
		private readonly cookiesService : CookiesService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post('register')
	public async register(
		@Body() create_user_dto: CreateUserDto,
	)
		: Promise<User>
	{
		return this.authService.register(create_user_dto);
	}

	// @HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	public login(
		@AuthUser() user : User,
		@Req() request : Request,
	)
		: User
	{
		const auth    = this.cookiesService.getJwtTokenCookie(user, CookieType.AUTHENTICATION);
		const refresh = this.cookiesService.getJwtTokenCookie(user, CookieType.REFRESH);

		this.authService.refresh(user, refresh.token);

		request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie]);

		return user;
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	public refresh(
		@AuthUser() user : User,
		@Req() request : Request,
	)
		: User
	{
		const auth = this.cookiesService.getJwtTokenCookie(user, CookieType.AUTHENTICATION);

		request.res.setHeader('Set-Cookie', auth.cookie);

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('logout')
	public logout(
		@AuthUser() user : User,
		@Req() request: Request,
	)
		: void
	{
		this.authService.logout(user)

		request.res.setHeader('Set-Cookie', this.cookiesService.getJwtClearCookies())
	}

}
