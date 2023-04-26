//* 요청시 필요한 파라메터를 DTO형으로 작성 법
import { PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

//* PickType 은 필요한것만 뽑아서 사용하게 도와주는 메서드, 반대로 필요없는것만 빼는것은 오미타입 ? 이라고함
export class CatRequestDto extends PickType(Cat, [
  'email',
  'name',
  'password',
] as const) {}
