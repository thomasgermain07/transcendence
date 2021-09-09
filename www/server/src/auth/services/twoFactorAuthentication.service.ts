import { Injectable } from '@nestjs/common'
import { authenticator } from 'otplib'
import { User } from '../../users/entities/user.entity'
import { UsersService } from '../../users/services/users.service'
import { DatabaseConfigService } from 'src/app/services/database-config.service'
import { Response } from 'express'
import { toDataURL } from 'qrcode'
import { GoogleAuthPayload } from 'src/auth/interfaces/google-code-payload.interface'

@Injectable()
export class TwoFactorAuthenticationService {
    constructor (
        private readonly usersService: UsersService,
    ) {}

    public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: GoogleAuthPayload, user: User) {
        console.log(twoFactorAuthenticationCode.code)
        console.log(authenticator.verify({token: twoFactorAuthenticationCode.code, secret: user.twoFactorAuthenticationSecret}))
        return authenticator.verify({token: twoFactorAuthenticationCode.code, secret: user.twoFactorAuthenticationSecret})
    }

    public async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret()

        const otpauthUrl = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret)

        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id)

        return {
            secret,
            otpauthUrl
        }
    }

    public async pipeQrCodeStream(otpauthUrl: string) {
        console.log("--------------QRCODE----------------")
        console.log(await toDataURL(otpauthUrl))
        // console.log(await toString(otpauthUrl))
        // return await toString(otpauthUrl)
        return await toDataURL(otpauthUrl)
    }

    public async turnOnTwoFactorAuthentication(user: User): Promise<void> {
        await this.usersService.turnOnTwoFactorAuthentication(user.id)
    }

    public async turnOffTwoFactorAuthentication(user: User): Promise<void> {
        await this.usersService.turnOffTwoFactorAuthentication(user.id)
    }
}