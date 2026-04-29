import {
  ExceptionFilter,
  Catch,
  ArgumentsHost
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const res = exception.getResponse();

    return response.status(exception.getStatus()).json(res);
  }
}