import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { IUserInfo } from 'src/models/IUser';
import { BranchRepository } from 'src/repositories/branch-repository';
import MaterialEstoqueRepository from 'src/repositories/material-estoque-repository';
import MaterialRepository from 'src/repositories/material-repository';

@ApiTags('Script Case - Buy - Warehouse')
@Controller('/script-case/buy/warehouse')
export default class WarehouseBuyScriptCaseController {
  constructor(
    private materialEstoqueRepository: MaterialEstoqueRepository,
    private branchRepository: BranchRepository,
    private materialRepository: MaterialRepository,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/list-material')
  async listMaterial(@Req() req) {
    const user: IUserInfo = req.user;

    const data = await this.materialEstoqueRepository.findByMaterialAndEstoque(
      user.branches,
    );

    const response = data.map((item) => {
      return {
        id: item.id,
        code_ncm: item.buy.numero,
        branch: item.buy.branch.filial_numero,
        material: item.material.material,
        unit: item.material.unidade,
        center_cost:
          item.itemBuy?.compositionItem?.compositionGroup?.costCenter
            ?.centro_custo || 'N/A',
        itens_composition:
          (item.itemBuy?.compositionItem?.composicao || '') +
          (item.itemBuy?.compositionItem?.descricao || ''),
        code_segundary: item.material.codigo_secundario,
        industry: item.materialCodigo?.marca || 'N/A',
        classification: item.materialCodigo?.classificacao || 'N/A',
        status:
          item.status === 0
            ? 'Reprovado'
            : item.status === 1
            ? 'Confirmado'
            : 'Sem Registro',
        user_aprove: item.log_user,
      };
    });

    return response;
  }
}
