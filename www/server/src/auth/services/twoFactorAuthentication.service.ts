import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { toDataURL } from 'qrcode';
import { GoogleAuthPayload } from 'src/auth/interfaces/google-code-payload.interface';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(private readonly usersService: UsersService) {}

	public isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode: GoogleAuthPayload,
		user: User,
	) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode.code,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(
			user.email,
			process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
			secret,
		);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

		return {
			secret,
			otpauthUrl,
		};
	}

	public async pipeQrCodeStream(otpauthUrl: string) {
		return await toDataURL(otpauthUrl);
	}

	public async turnOnTwoFactorAuthentication(user: User): Promise<void> {
		await this.usersService.turnOnTwoFactorAuthentication(user.id);
	}

	public async turnOffTwoFactorAuthentication(user: User): Promise<void> {
		await this.usersService.turnOffTwoFactorAuthentication(user.id);
	}
}
