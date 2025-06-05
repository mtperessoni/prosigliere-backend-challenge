import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorResponse {
  message: string[];
  error: string;
  statusCode: number;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ValidationErrorResponse;

    if (Array.isArray(exceptionResponse.message)) {
      const errors: Record<string, string[]> = {};
      exceptionResponse.message.forEach((error: string) => {
        const field = error.split(' ')[0];
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(error);
      });

      return response.status(status).json({
        errors,
        statusCode: status,
      });
    }

    return response.status(status).json(exceptionResponse);
  }
}
