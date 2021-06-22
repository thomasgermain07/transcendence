import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap()
{
  const app = await NestFactory.create(AppModule, {
    // logger: new MyLogger(),
    // logger: false,
  });

  // app.useLogger(app.get(MyLogger));
  app.setGlobalPrefix('api');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Auth example')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}

bootstrap();
