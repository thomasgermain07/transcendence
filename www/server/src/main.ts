import { NestFactory }    from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { useContainer }   from 'class-validator';
import * as cookieParser  from 'cookie-parser'

import { AppModule }       from 'src/app/app.module'

async function bootstrap()
{
	const app = await NestFactory.create(AppModule)

	// See : https://docs.nestjs.com/faq/global-prefix#global-prefix
	app.setGlobalPrefix('api')
	// See : https://docs.nestjs.com/security/cors#cors
	app.enableCors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
	// See : https://docs.nestjs.com/techniques/validation#transform-payload-objects
	app.useGlobalPipes(new ValidationPipe())

	app.use(cookieParser())

	// Allow `class-validator` to use `NestJS` Dependency Injection
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(8080)
}

bootstrap()
