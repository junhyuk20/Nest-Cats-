import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService, //* 해당 녀석은 auth 모듈에 import 부분에 명시됨
  ) {}

  //* 로그인시 요청한 파라메터를 비교 후 jwt 인증 절차 진행
  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    //* email이 일치 하는지
    const cat = await this.catsRepository.findCatByEmail(email);

    //* 없다면
    if (!cat) {
      throw new UnauthorizedException(`이메일과 비밀번호를 확인해 주세요.`);
    }

    //* password 는 해쉬화가 되어있으므로 compare 함수를 통해 비교해야됨!
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException(`이메일과 비밀번호를 확인해 주세요`);
    }

    //*jwt 만들시 필요한 payload
    const payload = { email: email, sub: cat.id }; //* sub = 토큰 제목을 의미

    //* 만든 payload를 넣어서 토큰 만들기!
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
