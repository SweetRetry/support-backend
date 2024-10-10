import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodExceptionFilter } from './filters/zod-exceptions.filter';
import { INestApplication } from '@nestjs/common';
import { LanguageInterceptor } from './interceptors/language.interceptor';

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Support')
    .setDescription('The support API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initSwagger(app);

  app
    .useGlobalInterceptors(new ResponseInterceptor())
    .useGlobalInterceptors(new LanguageInterceptor());

  app.useGlobalPipes(new ZodValidationPipe());

  app
    .useGlobalFilters(new AllExceptionsFilter())
    .useGlobalFilters(new ZodExceptionFilter());

  await app.listen(3000);
}
bootstrap();
