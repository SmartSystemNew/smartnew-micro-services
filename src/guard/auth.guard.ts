import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BranchesByUserRepository } from 'src/repositories/branches-by-user-repository';
import { CompanyRepository } from 'src/repositories/company-repository';
import { LoginRepository } from 'src/repositories/login-repository';
import { ModuleRepository } from 'src/repositories/module-repository';
import { UserRepository } from 'src/repositories/user-repository';
import { ENVService } from 'src/service/env.service';
import { MessageService } from 'src/service/message.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private envService: ENVService,
    private loginRepository: LoginRepository,
    private userRepository: UserRepository,
    private branchesByUserRepository: BranchesByUserRepository,
    private moduleRepository: ModuleRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const validBear = this.extractTokenFromHeader(request);

    const token = validBear !== undefined ? validBear : request.cookies.jwt;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload =
        token !== 'script-case' && token !== 'pdf'
          ? await this.jwtService.verifyAsync(token, {
              secret: this.envService.KEY,
            })
          : {
              sub: request.query.login || request.body.login,
              clientId: request.query.clientId || request.body.clientId,
            };

      request.tenantId = payload.tenantId;
      // console.log(request.tenantId);
      // console.log(payload);
      const user = await this.loginRepository.findLogin(payload.sub);

      const company = await this.companyRepository.findById(
        Number(payload.clientId),
      );

      if (!user) {
        throw new UnauthorizedException(MessageService.Credential_invalid);
      }

      if (!company) {
        throw new UnauthorizedException(MessageService.Company_not_found);
      }

      if (request.url.includes('/excel')) {
        if (!['bruno.matias', 'suporte3'].includes(user.login)) {
          throw new ForbiddenException(
            MessageService.Excel_user_not_permission,
          );
        }
      }

      const group = await this.userRepository.findGroup(user.login);

      const branches = [];
      const allBranch = [];

      for await (const branch of await this.branchesByUserRepository.listByClientAndUser(
        token === 'script-case'
          ? Number(request.query.clientId) || Number(request.body.clientId)
          : company.ID,
        user.login,
      )) {
        branches.push(branch.id_filial);
        allBranch.push({
          id: branch.id_filial,
          cnpj: branch.branch.cnpj,
          name: branch.branch.filial_numero,
        });
      }

      const allModules = await this.moduleRepository.listAll();

      const module = [];

      allModules.forEach((mod) => {
        if (mod.clientes.split(',').includes(String(company.ID))) {
          module.push(mod);
        }
      });

      request['user'] = {
        name: user.name,
        login: user.login,
        clientId: company.ID || user.id_cliente,
        typeAccess: user.tipo_acesso,
        collaboratorId: user.id_mantenedor ? user.id_mantenedor : null,
        branches,
        branch: allBranch,
        module,
        company: {
          id: company.ID,
          name: company.razao_social,
          cnpj: company.cnpj,
        },
        group: {
          description: group.group.description,
          id: group.group_id,
        },
      };
    } catch (error) {
      console.error(error);

      if (request.url.includes('/excel')) {
        throw new ForbiddenException(MessageService.Excel_user_not_permission);
      } else throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.url.includes('/maintenance/request-service/list/?token')) {
      const token = request.url.split('=') ?? [];
      token[1] = token[1].replace('&day', '');

      return token[1];
    } else if (
      request.url.includes(
        '/maintenance/service-order/list-order-params/?token',
      )
    ) {
      const token = request.url.split('=') ?? [];
      token[1] = token[1].replace('&dateOpen', '');

      return token[1];
    } else if (request.url.includes('/script-case')) {
      return 'script-case';
    } else if (request?.query?.b) {
      const token = request.query.b.toString() ?? '';

      return token || '';
    } else if (
      request.url.includes('/maintenance/reports') &&
      request.query.format === 'pdf'
    ) {
      return 'pdf';
    } else {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      return type === 'Bearer' ? token : undefined;
    }
  }
}
