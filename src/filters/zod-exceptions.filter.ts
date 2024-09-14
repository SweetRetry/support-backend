import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 构造自定义的错误响应
    const errorResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Params Validation failed',
      errors: JSON.parse(exception.getZodError().message),
    };

    // 返回 HttpStatus.BAD_REQUEST 状态码以及自定义错误消息
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
