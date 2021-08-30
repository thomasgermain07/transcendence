import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'

import { AppModule } from 'src/app/app.module'
import { SocketAdapter } from './app/adapter/socket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Add prefix to all `routes` (cosmetic)
  // See: https://docs.nestjs.com/faq/global-prefix#global-prefix
  app.setGlobalPrefix('api')

  // Allow `Cross-Origin Resource Sharing` with front-end
  // See: https://docs.nestjs.com/security/cors#cors
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  })

  // Convert controllers `args` to expected type
  // See: https://docs.nestjs.com/techniques/validation#transform-payload-objects
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true }),
  )

  // Facilitate `cookies` usage
  // See: https://docs.nestjs.com/techniques/cookies
  app.use(cookieParser())

   // Socket Adapter to enable cors
  app.useWebSocketAdapter(new SocketAdapter(app));

  // CSRF Protection
  // See: https://docs.nestjs.com/security/csrf
  app.use(csurf({ cookie: { sameSite: true, httpOnly: true } }))

  // Allow `class-validator` to use `NestJS` Dependency Injection
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(8080)
}

bootstrap()
