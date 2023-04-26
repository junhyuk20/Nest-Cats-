import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptionFilter/http-exception.filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); //* 글로벌 범위에서 개발자가 작성한 예외처리 적용
  app.useGlobalPipes(new ValidationPipe()); //*class-validator 라이브러리 적용하려면 요렇게 등록해 주어야 된다.
  //* API정의서 보안
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  const config = new DocumentBuilder() //* api 정의서 만들어주는 녀석
    .setTitle('C.I.C') // 제목
    .setDescription('cat') // 내용
    .setVersion('1.0.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document); //* 첫번인자는 Swagger의 end point 명을 정해주는것
  app.enableCors({
    origin: true, //* 모든 URL 허용
    credentials: true,
  });
  const PORT = process.env.PORT;
  await app.listen(PORT);
}

bootstrap();
