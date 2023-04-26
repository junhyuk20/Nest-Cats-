//* logger 미들웨어
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); //* nestjs 에서 제공해주는 logger 클래스

  use(req: Request, res: Response, next: NextFunction) {
    //* on 함수의 finish 이벤트 호출
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode} ${req.originalUrl} `,
      );
    });
    next();
  }
}
