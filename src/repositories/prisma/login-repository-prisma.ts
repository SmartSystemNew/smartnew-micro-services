import { PrismaService } from 'src/database/prisma.service';
import { LoginRepository } from '../login-repository';
import { IFindLogin } from 'src/models/IUser';
import { Inject, Injectable } from '@nestjs/common';
import { TokenProvider } from 'src/models/TokenProvider';

@Injectable()
export class LoginRepositoryPrisma implements LoginRepository {
  constructor(@Inject(TokenProvider.login) private prisma: PrismaService) {}

  private table = this.prisma.sec_users;

  async findLogin(login: string): Promise<IFindLogin | null> {
    const user = await this.table.findFirst({
      select: {
        login: true,
        name: true,
        id_cliente: true,
        tipo_acesso: true,
        id_mantenedor: true,
        pswd: true,
        company: {
          select: {
            ID: true,
            nome_fantasia: true,
            razao_social: true,
            cnpj: true,
          },
        },
        managerUserBound: {
          select: {
            companyBound: {
              select: {
                ID: true,
                nome_fantasia: true,
                razao_social: true,
                cnpj: true,
              },
            },
          },
        },
        boundBank: {
          select: {
            id: true,
            bank: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        }, //new_pswd: true,
      },
      where: {
        login,
      },
    });

    return user;
  }
}
