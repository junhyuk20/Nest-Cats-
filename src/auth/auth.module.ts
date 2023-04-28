import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CatsModule } from 'src/cats/cats.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    //* .env 사용 위한 모듈
    ConfigModule.forRoot(),
    //* 인증 받기위한 모듈
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false /*session cookie 사용 안함*/,
    }),
    //* jwt 로그인 모듈
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' }, //*만료기간 작성 항목
    }),
    forwardRef(() => CatsModule),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
