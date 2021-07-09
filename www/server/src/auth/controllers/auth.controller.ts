import { Body, Req, Controller }      from '@nestjs/common'
import { Get, Post, Delete }          from '@nestjs/common'
import { UseGuards, UseInterceptors } from '@nestjs/common'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { Request }                    from 'express'

import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User }          from 'src/users/entities/user.entity'
import { RegisterDto } 	 from '../dto/register.dto'

import { LocalAuthGuard }  from '../guards/local-auth.guard'
import { JwtAuthGuard }    from '../guards/jwt-auth.guard'
import { JwtRefreshGuard } from '../guards/jwt-refresh-token.guard'
import { AuthService }     from '../services/auth.service'
import { CookieType }      from '../services/cookies.service'
import { CookiesService }  from '../services/cookies.service'
import { AuthUser }        from '../decorators/auth-user.decorator'
import MarvinAuthGuard from '../guards/marvin-auth.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly authService: AuthService,
		private readonly cookiesService: CookiesService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post('register')
	async register(
		@Body() create_user_dto: RegisterDto,
	)
		: Promise<User>
	{
		return this.authService.register(create_user_dto);
	}

	// @HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<User>
	{
		const auth    = this.cookiesService.getJwtTokenCookie(user, CookieType.AUTHENTICATION);
		const refresh = this.cookiesService.getJwtTokenCookie(user, CookieType.REFRESH);

		this.authService.refresh(user, refresh.token);

		request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie]);

		return user;
	}

	@UseGuards(MarvinAuthGuard)
	@Get('marvin')
	loginWithMarvin(
		@AuthUser() user : User,
		@Req() request : Request,
	)
		: User
	{
		this.login(user, request)

		return user;
	}

	// Endpoint to check auth and get current user on frontend
	@UseGuards(JwtAuthGuard)
	@Get()
	authenticate(
		@AuthUser() user : User,
	)
		: User
	{
	  return user
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	async refresh(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<User>
	{
		const auth = this.cookiesService.getJwtTokenCookie(user, CookieType.AUTHENTICATION);

		request.res.setHeader('Set-Cookie', auth.cookie);

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('logout')
	async logout(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<void>
	{
		this.authService.logout(user)

		request.res.setHeader('Set-Cookie', this.cookiesService.getJwtClearCookies())
	}

}
