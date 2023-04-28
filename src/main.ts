import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptionFilter/http-exception.filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //* 제네릭타입을 작성한 이유는 아래의 미들웨어중 useStaticAssets함수가 express 에서 사용되는 함수이기 떄문에 제네릭으로 express의 application이다 라는것을 명시 해준다.
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

  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media', //* path.join으로 명시한 업로드 파일 위치 /common/uploads를 => /media로 변경해서 사용하겠다. => /media/cats 이와 같은 형태로 작성 가능, 이렇게 작성하는 이유는 아마도 보안 때문이지 않을까 한다.
  });

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
