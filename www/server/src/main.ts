import { NestFactory }    from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { useContainer }   from 'class-validator';
import * as cookieParser  from 'cookie-parser'

import { AppModule }       from 'src/app/app.module'
import { SocketIoAdapter } from 'src/app/adapters/socket-io.adapter';

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
	});

	// Adapter to use `Socket.io (v4)` with NestJS `websockets`
	// See: https://docs.nestjs.com/websockets/adapter#advanced-custom-adapter
	app.useWebSocketAdapter(new SocketIoAdapter(app));

	// Convert controllers `args` to expected type
	// See: https://docs.nestjs.com/techniques/validation#transform-payload-objects
	app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, transform: true }));

	// ?
	app.use(cookieParser());

	// Allow `class-validator` to use `NestJS` Dependency Injection
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.listen(8080);
}

bootstrap();
