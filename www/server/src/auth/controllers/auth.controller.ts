import { Body, Req, Controller } from "@nestjs/common";
import { Get, Post, Delete }     from "@nestjs/common";
import { UseGuards }             from "@nestjs/common";
import { Request }               from "express";

import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User }          from "src/users/entities/user.entity";

import { LocalGuard }       from "../guards/local.guard";
import { JwtAuthGuard }     from "../guards/jwt-auth.guard";
import { JwtRefreshGuard }  from "../guards/jwt-refresh.guard";
import { OAuthMarvinGuard } from "../guards/oauth-marvin.guard";
import { AuthService }      from "../services/auth.service";
import { CookieType }       from "../services/cookies.service";
import { CookiesService }   from "../services/cookies.service";
import { AuthUser }         from "../decorators/auth-user.decorator";

@Controller('auth')
export class AuthController
{
	// -------------------------------------------------------------------------
	// Constructor
	// -------------------------------------------------------------------------
	constructor(
		private readonly auth_svc: AuthService,
		private readonly cookies_svc: CookiesService,
	)
	{

	}

	// -------------------------------------------------------------------------
	// Public methods
	// -------------------------------------------------------------------------
	@Post('register')
	async register(
		@Body() create_dto: CreateUserDto,
	)
		: Promise<User>
	{
		return this.auth_svc.register(create_dto);
	}

	@UseGuards(LocalGuard)
	@Post('login')
	async login(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<User>
	{
		const auth    = this.cookies_svc.getJwtTokenCookie(user, CookieType.AUTHENTICATION);
		const refresh = this.cookies_svc.getJwtTokenCookie(user, CookieType.REFRESH);

		this.auth_svc.refresh(user, refresh.token);

		request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie]);

		return user;
	}

	@UseGuards(OAuthMarvinGuard)
	@Post('marvin')
	async loginWithMarvin(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<User>
	{
		this.login(user, request);

		return user;
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	async refresh(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<User>
	{
		const auth = this.cookies_svc.getJwtTokenCookie(user, CookieType.AUTHENTICATION);

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
		this.auth_svc.logout(user);

		request.res.setHeader('Set-Cookie', this.cookies_svc.getJwtClearCookies());
	}

}
