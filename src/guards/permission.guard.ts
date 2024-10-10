import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@prisma/client';
import { PERMISSION_KEY } from 'src/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }

    console.log(
      '🚀 ~ PermissionGuard ~ canActivate ~ requiredPermission:',
      requiredPermission,
    );
    const { user } = context.switchToHttp().getRequest();

    if (user.permissions?.includes(requiredPermission)) {
      return true;
    } else {
      throw new UnauthorizedException(
        ' You are not authorized to access this resource',
      );
    }
  }
}
