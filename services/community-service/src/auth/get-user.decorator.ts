import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common"
import { User } from "src/users/users.entity";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        if (user instanceof User) {
            return user;
        }
        else {
            throw new InternalServerErrorException("Payload doesn't contain user. Check @AuthGuard applied to function")
        }
    });
