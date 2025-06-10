import md5 from 'md5';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ISeed } from 'src/models/ISeed';
import SeedRepository from 'src/repositories/seed-repository';
import { ENVService } from 'src/service/env.service';
import InsertBlankBody from './dtos/insertBlank-body';
import InsertEquipmentBody from './dtos/insertEquipment-body';
import InsertOrderBody from './dtos/insertOrder-body';
import BranchForCompany from './dtos/branchForCompany';
import {
  ApiExcludeController,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Seed')
@ApiExcludeController()
@Controller('/seed')
export default class SeedController {
  constructor(
    private seedRepository: SeedRepository,
    private envService: ENVService,
  ) {}

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('/')
  async populate() {
    if (this.envService.NODE_ENV !== 'DOCKER') {
      return {
        message: 'Você não está no ambiente do docker!',
      };
    }

    const data: ISeed['local'] = {
      company: {
        companyName: 'SMART NEW SYSTEM',
        fantasyName: 'SMART NEW SYSTEM',
        cnpj: '12345678910',
      },
      branch: {
        branchName: 'Local ',
        fantasyName: 'Local ',
        cnpj: '12345678910',
      },
      login: {
        name: 'docker',
        pswd: md5('docker'),
      },
      group: {
        name: 'ADMINISTRADOR',
      },
      module: [
        {
          icon: '',
          name: 'FINANCEIRO',
          order: 1,
        },
      ],
      provider: {
        name: 'Fornecedor Teste',
        fantasyName: 'Fornecedor Teste',
        category: 'Teste',
        cnpj: '12345678910',
        day: 10,
      },
      descriptionCostCenter: {
        name: 'Docker',
      },
      costCenter: {
        code: '1',
        name: 'Local',
      },
      compositionGroup: {
        code: '1-1',
        name: 'computador',
      },
      compositionItem: {
        code: '1-1-1',
        name: 'usuario',
      },
      typeDocument: [
        {
          name: 'RECIBO',
          key: false,
          auto: true,
        },
        {
          name: 'NOTA FISCAL',
          key: true,
          auto: false,
        },
      ],
      typePayment: [
        {
          name: 'BOLETO',
          split: true,
        },
        {
          name: 'CARTAO',
          split: true,
        },
        {
          name: 'PIX',
          split: false,
        },
        {
          name: 'DINHEIRO',
          split: false,
        },
      ],
      category: {
        name: 'Itens em geral',
      },
      material: [
        {
          name: 'Monitor',
          code: 'MT',
          unity: 'UN',
          value: 100,
          active: true,
          tipo: 'stock',
        },
        {
          name: 'Teclado',
          code: 'TC',
          unity: 'UN',
          value: 30,
          active: true,
          tipo: 'stock',
        },
        {
          name: 'Mouse',
          code: 'MS',
          unity: 'UN',
          value: 10,
          active: true,
          tipo: 'stock',
        },
      ],
      input: [
        {
          name: 'Receitas',
        },
        {
          name: 'Debitos em Geral',
        },
      ],
      bank: [
        {
          name: 'NUBANK',
          number: 123456,
          digit: 1,
          agency: 1234,
          digitAgency: 1,
          balance: 3000,
          negative: false,
          status: 'ATIVO',
        },
        {
          name: 'ITAU',
          number: 123456,
          digit: 1,
          agency: 1234,
          digitAgency: 1,
          balance: 5000,
          negative: true,
          status: 'ATIVO',
        },
      ],
      taxation: ['ICMS', 'ACRESCIMO', 'DESCONTO', 'FRETE'],
    };

    const seed = await this.seedRepository.local(data);

    if (seed) {
      return {
        message: 'Seed Gerado com Sucesso!',
      };
    } else {
      return {
        message: 'Erro ao gerar Seed',
      };
    }
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/blank')
  async insertBlank(@Body() body: InsertBlankBody) {
    if (this.envService.NODE_ENV !== 'DOCKER') {
      return {
        message: 'Você não está no ambiente do docker!',
      };
    }

    await this.seedRepository.blank(body);

    return {
      inserted: true,
    };
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/equipment')
  async insertEquipment(@Body() body: InsertEquipmentBody) {
    if (this.envService.NODE_ENV !== 'DOCKER') {
      return {
        message: 'Você não está no ambiente do docker!',
      };
    }

    await this.seedRepository.equipment({
      ...body,
      family: {
        description: body.family.description,
        user: body.user,
      },
    });

    return {
      inserted: true,
    };
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/order')
  async insertOrder(@Body() body: InsertOrderBody) {
    if (this.envService.NODE_ENV !== 'DOCKER') {
      return {
        message: 'Você não está no ambiente do docker!',
      };
    }

    await this.seedRepository.order({
      clientId: body.clientId,
      branchId: body.branchId,
      code: body.code,
      description: body.description,
      equipmentId: body.equipmentId,
    });

    return {
      inserted: true,
    };
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('/branchForCompany')
  async branchForCompany(@Body() body: BranchForCompany) {
    const response = await this.seedRepository.launchBuyImportForBranch({
      id: body.branchId,
      newCompanyId: 111,
      newBranchId: 636,
    });

    return {
      inserted: response,
    };
  }
}
