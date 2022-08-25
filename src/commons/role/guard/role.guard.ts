import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../enum/role.enum';
import { RequestWithUser } from '../interface/requestWithUser.interface';

export const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuarMixin implements CanActivate{
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user  = request.user;
        return user?.role.includes(role);
        }
    }
    return mixin(RoleGuarMixin);
};
