import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRawToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new Error('Authorization header not found');
    }
    
    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '');
    return token;
  },
);
