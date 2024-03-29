import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ExceptionFilter } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter
	extends BaseExceptionFilter
	implements ExceptionFilter
{
	catch(exception: any, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<Request>();

		if (exception.code === 'EBADCSRFTOKEN') {
			res.status(403).json({
				statusCode: 403,
				message: 'Invalid CSRF Token.',
			});
		} else {
			super.catch(exception, host);
		}
	}
}
