import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserInfo } from 'src/models/IUser';
import { PermissionRepository } from 'src/repositories/permission-repository';
import { MessageService } from 'src/service/message.service';

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  // ... Add other methods if needed
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionRepository: PermissionRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const application =
      request['body'].application || request['query'].application;

    if (!application) {
      throw new NotFoundException(MessageService.SYSTEM_application_not_found);
    }

    const user: IUserInfo = request['user'];

    const permission =
      await this.permissionRepository.findByApplicationAndGroupAndUser(
        application,
        user.group.id,
        user.login,
      );

    if (!permission) {
      throw new NotFoundException(MessageService.SYSTEM_application_not_found);
    }

    const method = request.method as HttpMethod;

    switch (method) {
      case HttpMethod.GET:
        if (permission.access !== 'Y') {
          throw new UnauthorizedException(
            MessageService.SYSTEM_not_have_permission,
          );
        }
        break;
      case HttpMethod.POST:
        if (permission.insert !== 'Y') {
          throw new UnauthorizedException(
            MessageService.SYSTEM_not_have_permission,
          );
        }
        break;
      case HttpMethod.PATCH:
        if (permission.update !== 'Y') {
          throw new UnauthorizedException(
            MessageService.SYSTEM_not_have_permission,
          );
        }
        break;

      case HttpMethod.DELETE:
        if (permission.delete !== 'Y') {
          throw new UnauthorizedException(
            MessageService.SYSTEM_not_have_permission,
          );
        }
        break;
    }

    return true;
  }
}
