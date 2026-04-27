import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.error(exception);

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        message: exception.message,
      });
    }

    if (exception.code === 'ER_DUP_ENTRY') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Duplicate entry',
      });
    }

    if (exception.code === 'ECONNREFUSED') {
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        message: 'Database connection failed',
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}