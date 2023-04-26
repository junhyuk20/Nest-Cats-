//* 커스텀 데코레이터

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

//* 한단계더 높은 추상화,
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
