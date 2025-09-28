import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices'; // Asegúrate de importar

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message || message;
    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      status = (rpcError as any)?.statusCode || status; 
      message = (rpcError as any)?.message || message; 
    } else if (exception instanceof Error) {
      message = exception.message || message;
    } else if (typeof exception === 'string') {
      message = exception;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}