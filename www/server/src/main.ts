import { NestFactory }    from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { useContainer }   from "class-validator";
import * as cookieParser  from "cookie-parser";

import { AppModule } from 'src/app/app.module'

async function bootstrap()
{
	const app = await NestFactory.create(AppModule)

	// Add prefix to all `routes` (cosmetic)
	// See: https://docs.nestjs.com/faq/global-prefix#global-prefix
	app.setGlobalPrefix('api');

	// Allow `Cross-Origin Resource Sharing` with front-end
	// See: https://docs.nestjs.com/security/cors#cors
	app.enableCors({
		credentials: true,
		origin: 'http://localhost:3000',
	})

	// Convert controllers `args` to expected type
	// See: https://docs.nestjs.com/techniques/validation#transform-payload-objects
	app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, transform: true }));

	// Facilitate `cookies` usage
	// See: https://docs.nestjs.com/techniques/cookies
	app.use(cookieParser());

	// Allow `class-validator` to use `NestJS` Dependency Injection
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(8080);
};

bootstrap();
