import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
//import { PrismaClient as SofmanClient } from 'prisma/sofman';

@Injectable()
export default class MigrateService {
  private smartNewTable = new PrismaClient();
  //private sofmanTable = new SofmanClient();
  async importCompany() {
    // const companiesSofman =
    //   await this.sofmanTable.cadastro_de_empresas.findFirst({
    //     where: {
    //       ID: 221,
    //     },
    //   });

    //console.log(companiesSofman);

    return {};
  }
}
