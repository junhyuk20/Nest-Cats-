/*요청과 함께 jwt를 보냈을시 해당 jwt 인증하는 파일 */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Payload } from './jwt.payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // auth 모듈의 import 항목에서 JwtModule을 작성시 적었던 secret항목의 value 값과 secretOrKey의 value 값은 항상 일치해야 된다. 그래야 토큰 디코딩 할수있음
      ignoreExpiration: false, //* false 만료기간 따짐 , true 만료기간 안따짐
    });
  }
  //* jwt 인증부분 유효성 검사
  async validate(payload: Payload) {
    const cat = await this.catsRepository.findCatByIdWithoutPassword(
      payload.sub,
    );
    if (cat) {
      return cat; //* request.user 에 cat이 들어가게됨
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
