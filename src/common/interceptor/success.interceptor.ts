import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class successInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //*컨트롤러 진입 전, 이부분은 미들웨어로도 대체가 되므로 패스해도 된다.
    console.log('Before...');

    //* 컨트롤러 진입 후 해당 컨트롤러가 반환하는 값을 받아서 사용가능, 인터셉터는 컨트롤러의 반환값을 받아서 가공해서 사용한다라고 이해하자
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
    //.pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
