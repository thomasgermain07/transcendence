import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2'
import { stringify } from 'querystring'
import { AuthService } from '../services/auth.service'
import { MarvinLoginDto } from '../dto/marvin-login.dto'
import { HttpService } from '@nestjs/axios'

const clientID = process.env.VITE_FT_ID
const clientSecret = process.env.VITE_FT_SECRET
const callbackURL = process.env.VITE_FT_CALLBACK_URL

@Injectable()
export class MarvinAuthStrategy extends PassportStrategy(Strategy, 'marvin') {
  constructor(
    private readonly authService: AuthService,
    private http: HttpService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: clientID,
        redirect_uri: callbackURL,
        response_type: 'code',
        scope: 'public',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      scope: 'public',
      clientID,
      clientSecret,
      callbackURL,
    })
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise()

    // console.log(accessToken)
    const user: MarvinLoginDto = {
      marvinId: data.id,
      email: data.email,
      name: data.login,
      avatar: data.image_url,
    }

    return this.authService.findOrCreateAuthMarvinUser(user)
  }
}