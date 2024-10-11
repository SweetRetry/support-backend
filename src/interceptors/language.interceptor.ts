import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 获取 Accept-Language 头信息
    const acceptLanguage = request.headers['accept-language'] || 'en-US';

    console.log(
      '🚀 ~ LanguageInterceptor ~ intercept ~ acceptLanguage:',
      acceptLanguage,
    );

    // 设置语言信息到 request 对象上，方便后续使用
    request['language'] = acceptLanguage; // 如果没有设置 Accept-Language，则使用默认语言

    return next.handle(); // 继续传递请求
  }
}
