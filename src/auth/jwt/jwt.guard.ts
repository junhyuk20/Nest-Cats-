import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
//* 상속받은 AuthGuard 는 자동으로 jwt strategy를 실행 한다.  jwt strategy에서 validate함수 실행
