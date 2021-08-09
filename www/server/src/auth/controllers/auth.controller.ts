import { Body, Req, Controller } from "@nestjs/common";
import { Post, Delete }          from "@nestjs/common";
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

type LoginResponseType = {
	two_factor_enabled: boolean;
};

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
		: Promise<LoginResponseType>
	{
		const auth    = this.cookies_svc.getJwtTokenCookie(user, CookieType.AUTHENTICATION);
		const refresh = this.cookies_svc.getJwtTokenCookie(user, CookieType.REFRESH);

		this.auth_svc.refresh(user, refresh.token);

		request.res.setHeader('Set-Cookie', [auth.cookie, refresh.cookie]);

		return {
			two_factor_enabled: false,
		};
	}

	@UseGuards(OAuthMarvinGuard)
	@Post('marvin')
	async loginWithMarvin(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<LoginResponseType>
	{
		return this.login(user, request);

	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	async refresh(
		@AuthUser() user: User,
		@Req() request: Request,
	)
		: Promise<void>
	{
		const auth = this.cookies_svc.getJwtTokenCookie(user, CookieType.AUTHENTICATION);

		request.res.setHeader('Set-Cookie', auth.cookie);

		return ;
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

		return ;
	}

}
