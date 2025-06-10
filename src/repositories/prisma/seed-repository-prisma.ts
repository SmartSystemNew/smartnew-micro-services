import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ISeed } from 'src/models/ISeed';
import SeedRepository from '../seed-repository';
//import * as dayjs from 'dayjs';

@Injectable()
export default class SeedRepositoryPrisma implements SeedRepository {
  constructor(private prismaService: PrismaService) {}

  async local(data: ISeed['local']): Promise<boolean> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        //Sistema
        const company = await tx.cadastro_de_empresas.create({
          data: {
            razao_social: data.company.companyName,
            nome_fantasia: data.company.fantasyName,
            cnpj: data.company.cnpj,
          },
        });

        const branch = await tx.cadastro_de_filiais.create({
          data: {
            ID_cliente: company.ID,
            razao_social: data.branch.branchName,
            filial_numero: data.branch.branchName,
            nome_fantasia: data.branch.fantasyName,
            cnpj: data.branch.cnpj,
          },
        });

        const user = await tx.sec_users.create({
          data: {
            login: data.login.name,
            pswd: data.login.pswd,
            id_cliente: company.ID,
            id_filial: branch.ID,
          },
        });

        // Filial x usuarios
        await tx.sofman_filiais_x_usuarios.create({
          data: {
            id_cliente: company.ID,
            id_filial: branch.ID,
            id_user: user.login,
            log_user: user.login,
          },
        });

        // Grupo
        const group = await tx.sec_groups.create({
          data: {
            id_cliente: company.ID,
            description: data.group.name,
          },
        });

        //Grupo do usuario
        await tx.sec_users_groups.create({
          data: {
            id_cliente: company.ID,
            group_id: group.group_id,
            login: user.login,
          },
        });

        for await (const department of data.module) {
          await tx.smartnewsystem_modulo_nome.create({
            data: {
              clientes: company.ID.toString(),
              icone: department.icon,
              nome: department.name,
              grupos: group.group_id.toString(),
              ordem: department.order,
            },
          });
        }

        //Fornecedor
        await tx.sofman_cad_fornecedores.create({
          data: {
            ID_cliente: company.ID,
            id_filial: branch.ID,
            razao_social: data.provider.name,
            nome_fantasia: data.provider.fantasyName,
            cnpj: data.provider.cnpj,
            categoria: data.provider.category,
            dias: data.provider.day,
          },
        });

        //Financeiro
        // Centro de Custo
        const descriptionCostCenter =
          await tx.sofman_descricao_centro_custo.create({
            data: {
              id_cliente: company.ID,
              id_filial: branch.ID,
              descricao_centro_custo: data.descriptionCostCenter.name,
            },
          });

        const costCenter = await tx.cadastro_de_centros_de_custo.create({
          data: {
            ID_cliente: company.ID,
            ID_centro_custo: descriptionCostCenter.id,
            centro_custo: data.costCenter.code,
            descricao: data.costCenter.name,
            log_user: user.login,
            ativo: 1,
          },
        });

        const compositionGroup =
          await tx.smartnewsystem_composicao_grupo.create({
            data: {
              id_cliente: company.ID,
              id_centro_custo: costCenter.ID,
              composicao: data.compositionGroup.code,
              descricao: data.compositionGroup.name,
              log_user: user.login,
            },
          });

        await tx.smartnewsystem_composicao_item.create({
          data: {
            id_cliente: company.ID,
            id_centro_custo: compositionGroup.id,
            id_descricao_centro_custo: descriptionCostCenter.id,
            composicao: data.compositionItem.code,
            descricao: data.compositionItem.name,
            log_user: user.login,
          },
        });

        //Tipo de documento
        for await (const type of data.typeDocument) {
          await tx.smartnewsystem_financeiro_tipo_documento.create({
            data: {
              id_cliente: company.ID,
              descricao: type.name,
              requer_chave: type.key,
              numeracao_automatica: type.auto,
            },
          });
        }

        // Tipo de pagamento
        for await (const type of data.typePayment) {
          await tx.smartnewsystem_financeiro_tipos_pagamento.create({
            data: {
              id_cliente: company.ID,
              descricao: type.name,
              parcela: type.split ? 1 : 0,
            },
          });
        }

        // Status Parcela
        await tx.smartnewsystem_financeiro_status_parcela.createMany({
          data: [
            {
              descricao: 'A VENCER',
            },
            {
              descricao: 'VENCIDO',
            },
            {
              descricao: 'PAGO',
            },
          ],
        });

        // Categoria Material
        const category = await tx.sofman_cad_categorias_materiais.create({
          data: {
            id_cliente: company.ID,
            descricao: data.category.name,
            log_user: user.login,
          },
        });

        // Material
        for await (const material of data.material) {
          await tx.sofman_cad_materiais.create({
            data: {
              id_cliente: company.ID,
              id_filial: branch.ID,
              id_categoria: category.id,
              codigo: material.code,
              tipo: material.tipo,
              material: material.name,
              unidade: material.unity,
              ativo: material.active ? 1 : 0,
              valor: material.value,
              fator: 0,
              Valor_venda: 0,
            },
          });
        }

        // Tipo Insumo
        for await (const input of data.input) {
          await tx.smartnewsystem_contrato_tipo_insumo.create({
            data: {
              id_cliente: company.ID,
              insumo: input.name,
            },
          });
        }

        //Banco
        for await (const bank of data.bank) {
          await tx.smartnewsystem_financeiro_bancos.create({
            data: {
              id_cliente: company.ID,
              nome: bank.name,
              //dono: company.ID,
              numero_conta: bank.number,
              digito: bank.digit,
              agencia: bank.agency,
              digito_agencia: bank.digitAgency,
              saldo: bank.balance,
              negativo: bank.negative ? 1 : 0,
              status: bank.status,
            },
          });
        }

        //Tributação
        for await (const taxation of data.taxation) {
          await tx.smartnewsystem_financeiro_tributacoes.create({
            data: {
              id_cliente: company.ID,
              descricao: taxation,
            },
          });
        }

        // Criar view Pagar e Receber
        await tx.$executeRaw`
          CREATE
          ALGORITHM = UNDEFINED VIEW smartnewsystem_view_financeiro_receber AS
          select
              dt.id_cliente AS id_cliente,
              tp.id AS id,
              tp.id_titulo AS id_titulo,
              dt.documento_numero AS documento_numero,
              dt.numero_fiscal AS numero_fiscal,
              dt.data_emissao AS data_emissao,
              (
              select
                  concat(cadastro_de_filiais.filial_numero, ' ', cadastro_de_filiais.cnpj)
              from
                  cadastro_de_filiais
              where
                  cadastro_de_filiais.ID = dt.emitente) AS emitente,
              (
              select
                  sofman_cad_fornecedores.razao_social
              from
                  sofman_cad_fornecedores
              where
                  sofman_cad_fornecedores.ID = dt.remetente) AS remetente,
              tp.vencimento AS vencimento,
              tp.prorrogacao AS prorrogacao,
              tp.valor_a_pagar AS valor_a_pagar,
              tp.valor_parcela AS valor_parcela,
              tp.parcela AS parcela,
              tp.status AS status,
              sp.descricao AS descricao,
              (
              select
                  sum(sftd.total)
              from
                  smartnewsystem_financeiro_titulos_dados sftd
              where
                  sftd.id_titulo = dt.id) AS totalItem,
              scpf.id_pedido AS id_pedido,
              scnf.numero AS numero,
              em.data_vencimento AS data_vencimento,
              sftp.id AS tipo_pagamento_id,
              sftp.descricao AS tipo_pagamento,
              sfb.id AS banco_id,
              sfb.nome AS banco_nome
          from
              ((((((((smartnewsystem_financeiro_titulo_pagamento tp
          join smartnewsystem_financeiro_descricao_titulos dt on
              (dt.id = tp.id_titulo))
          join smartnewsystem_financeiro_tipos_pagamento sftp on
              (sftp.id = dt.documento_tipo))
          join smartnewsystem_financeiro_status_parcela sp on
              (sp.id = tp.status))
          left join smartnewsystem_compras_pedido_fornecedor scpf on
              (scpf.id_finance = tp.id_titulo))
          left join smartnewsystem_compras_numeros_fiscais scnf on
              (scnf.id = scpf.id_pedido))
          left join smartnewsystem_financeiro_emissao_itens emi on
              (emi.id_pagamento = tp.id))
          left join smartnewsystem_financeiro_emissao em on
              (em.id = emi.id_emissao))
          left join smartnewsystem_financeiro_bancos sfb on
              (sfb.id = em.id_banco))
          where
              dt.direcao = 'receber'
              and dt.status <> 'ABERTO';
        `;

        await tx.$executeRaw`
        CREATE OR REPLACE
        ALGORITHM = UNDEFINED VIEW smartnewsystem_view_financeiro_pagar AS
        select
            dt.id_cliente AS id_cliente,
            tp.id AS id,
            tp.id_titulo AS id_titulo,
            dt.documento_numero AS documento_numero,
            dt.numero_fiscal AS numero_fiscal,
            dt.data_emissao AS data_emissao,
            (
            select
                sofman_cad_fornecedores.razao_social
            from
                sofman_cad_fornecedores
            where
                sofman_cad_fornecedores.ID = dt.emitente) AS emitente,
            (
            select
                concat(cadastro_de_filiais.filial_numero, ' ', cadastro_de_filiais.cnpj)
            from
                cadastro_de_filiais
            where
                cadastro_de_filiais.ID = dt.remetente) AS remetente,
            tp.vencimento AS vencimento,
            tp.prorrogacao AS prorrogacao,
            tp.valor_a_pagar AS valor_a_pagar,
            tp.valor_parcela AS valor_parcela,
            tp.parcela AS parcela,
            tp.status AS status,
            sp.descricao AS descricao,
            (
            select
                sum(sftd.total)
            from
                smartnewsystem_financeiro_titulos_dados sftd
            where
                sftd.id_titulo = dt.id) AS totalItem,
            scpf.id_pedido AS id_pedido,
            scnf.numero AS numero,
            em.data_vencimento AS data_vencimento,
            sftp.id AS tipo_pagamento_id,
            sftp.descricao AS tipo_pagamento,
            sfb.id AS banco_id,
            sfb.nome AS banco_nome
        from
            ((((((((smartnewsystem_financeiro_titulo_pagamento tp
        join smartnewsystem_financeiro_descricao_titulos dt on
            (dt.id = tp.id_titulo))
        join smartnewsystem_financeiro_tipos_pagamento sftp on
            (sftp.id = dt.documento_tipo))
        join smartnewsystem_financeiro_status_parcela sp on
            (sp.id = tp.status))
        left join smartnewsystem_compras_pedido_fornecedor scpf on
            (scpf.id_finance = tp.id_titulo))
        left join smartnewsystem_compras_numeros_fiscais scnf on
            (scnf.id = scpf.id_pedido))
        left join smartnewsystem_financeiro_emissao_itens emi on
            (emi.id_pagamento = tp.id))
        left join smartnewsystem_financeiro_emissao em on
            (em.id = emi.id_emissao))
        left join smartnewsystem_financeiro_bancos sfb on
            (sfb.id = em.id_banco))
        where
            dt.direcao = 'pagar'
            and dt.status <> 'ABERTO';
        `;

        //Compras

        // Status Compras
        await tx.smartnewsystem_compras_status.createMany({
          data: [
            {
              descricao: 'ABERTO',
              icone: 'book-open',
            },
            {
              descricao: 'SOLICITADO',
              icone: 'git-pull-request',
            },
            {
              descricao: 'AGUARDANDO FECHAMENTO',
              icone: 'tag',
            },
            {
              descricao: 'AGUARDANDO APROVACAO',
              icone: 'check',
            },
            {
              descricao: 'PARCIAL',
              icone: 'placeholder',
            },
            {
              descricao: 'SOLICITACAO APROVADA',
              icone: 'list-checks',
            },
            {
              descricao: 'SOLICITACAO APROVADA (PARCIAL)',
              icone: 'circles-three-plus',
            },
            {
              descricao: 'CANCELADO',
              icone: 'receipt-x',
            },
            {
              descricao: 'SOLICITACAO REPROVADA',
              icone: 'file-x',
            },
          ],
        });
      });
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  async blank(data: ISeed['blank']): Promise<boolean> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const group = await tx.sec_groups.findFirst();

        await tx.sec_apps.create({
          data: {
            app_name: data.name,
            cria_menu: data.boundMenu,
            id_modulo: data.moduleId,
            app_type: data.type,
            type_view: data.typeView,
            description: data.description,
          },
        });

        if (data.boundMenu && data.menu) {
          const { menu } = data;
          const menuItem = await tx.smartnewsystem_menu_itens.create({
            data: {
              id_modulo: data.moduleId,
              icone: menu.icon,
              nome: menu.name,
              aplicacao: data.name,
              target: menu.target,
              ordem: menu.order,
              tipo: menu.type,
              dispositivo: 'ALL',
              grupos: group.group_id.toString(),
              id_pai: 0,
            },
          });

          await tx.mod_seguranca_permissoes.create({
            data: {
              group_id: group.group_id,
              id_modulo: data.moduleId,
              id_menu: menuItem.id,
              access: 'Y',
              insert: 'Y',
              update: 'Y',
              delete: 'Y',
              export: 'Y',
              print: 'Y',
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  async order(data: ISeed['order']): Promise<boolean> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.controle_de_ordens_de_servico.create({
          data: {
            ID_cliente: data.clientId,
            ID_filial: data.branchId,
            ordem: data.code,
            descricao_solicitacao: data.description,
            id_equipamento: data.equipmentId,
          },
        });

        return true;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async equipment(data: ISeed['equipment']): Promise<boolean> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const family = await tx.cadastro_de_familias_de_equipamento.create({
          data: {
            ID_cliente: data.clientId,
            ID_filial: data.branchId,
            familia: data.family.description,
            log_user: data.family.user,
          },
        });

        await tx.cadastro_de_equipamentos.create({
          data: {
            ID_cliente: data.clientId,
            ID_filial: data.branchId,
            equipamento_codigo: data.code,
            descricao: data.description,
            frota: data.frota,
            ID_familia: family.ID,
          },
        });

        return true;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async branchForCompany(data: ISeed['branchForCompany']): Promise<boolean> {
    try {
      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            include: {
              company: true,
            },
            where: {
              ID: data.id,
            },
          });

          const newCompany = await tx.cadastro_de_empresas.create({
            data: {
              razao_social: branch.razao_social,
              nome_fantasia: branch.nome_fantasia,
              cnpj: branch.cnpj,
            },
          });

          const newBranch = await tx.cadastro_de_filiais.create({
            data: {
              ID_cliente: newCompany.ID,
              razao_social: 'Matriz',
              nome_fantasia: 'Matriz',
              cnpj: branch.cnpj,
            },
          });

          const allProvider = await tx.sofman_cad_fornecedores.findMany({
            where: {
              ID_cliente: branch.ID_cliente,
            },
          });

          for await (const provider of allProvider) {
            await tx.sofman_cad_fornecedores.create({
              data: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                razao_social: provider.razao_social,
                nome_fantasia: provider.nome_fantasia,
                cnpj: provider.cnpj,
                cep: provider.cep,
                endereco: provider.cep,
                bairro: provider.bairro,
                cidade: provider.cidade,
                estado: provider.estado,
                telefone: provider.telefone,
                site: provider.site,
                log_user: provider.log_user,
                categoria: provider.categoria,
                inscricao_estadual: provider.inscricao_estadual,
                inscricao_municipal: provider.inscricao_municipal,
                dias: provider.dias,
              },
            });
          }

          // Tributo financeiro
          const allTributes =
            await tx.smartnewsystem_financeiro_tributacoes.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const tribute of allTributes) {
            await tx.smartnewsystem_financeiro_tributacoes.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: tribute.descricao,
              },
            });
          }

          // insumo e escopo
          const allContractTypeInput =
            await tx.smartnewsystem_contrato_tipo_insumo.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const contractTypeInput of allContractTypeInput) {
            const newContractTypeInput =
              await tx.smartnewsystem_contrato_tipo_insumo.create({
                data: {
                  id_cliente: newCompany.ID,
                  insumo: contractTypeInput.insumo,
                },
              });

            const allScope =
              await tx.smartnewsystem_contrato_escopo_item.findMany({
                where: {
                  id_insumo: contractTypeInput.id,
                },
              });

            for await (const scope of allScope) {
              await tx.smartnewsystem_contrato_escopo_item.create({
                data: {
                  id_insumo: newContractTypeInput.id,
                  descricao: scope.descricao,
                },
              });
            }
          }

          const allDescriptionCostCenter =
            await tx.sofman_descricao_centro_custo.findMany({
              include: {
                costCenter: {
                  include: {
                    compositionGroup: {
                      include: {
                        compositionGroupItem: true,
                      },
                    },
                  },
                },
              },
              where: {
                id_filial: branch.ID,
              },
            });

          for await (const descriptionCostCenter of allDescriptionCostCenter) {
            const newDescriptionCostCenter =
              await tx.sofman_descricao_centro_custo.create({
                data: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  descricao_centro_custo:
                    descriptionCostCenter.descricao_centro_custo,
                  log_user: descriptionCostCenter.log_user,
                },
              });

            const allCostCenter =
              await tx.cadastro_de_centros_de_custo.findMany({
                where: {
                  ID_centro_custo: descriptionCostCenter.id,
                },
              });

            for await (const costCenter of allCostCenter) {
              const newCostCenter =
                await tx.cadastro_de_centros_de_custo.create({
                  data: {
                    ID_cliente: newCompany.ID,
                    ID_centro_custo: newDescriptionCostCenter.id,
                    centro_custo: costCenter.centro_custo,
                    descricao: costCenter.descricao,
                    ativo: costCenter.ativo,
                    log_user: costCenter.log_user,
                  },
                });

              const allCompositionGroup =
                await tx.smartnewsystem_composicao_grupo.findMany({
                  where: {
                    id_centro_custo: costCenter.ID,
                  },
                });

              for await (const compositionGroup of allCompositionGroup) {
                const newCompositionGroup =
                  await tx.smartnewsystem_composicao_grupo.create({
                    data: {
                      id_cliente: newCompany.ID,
                      composicao: compositionGroup.composicao,
                      descricao: compositionGroup.descricao,
                      id_centro_custo: newCostCenter.ID,
                      log_user: compositionGroup.log_user,
                    },
                  });

                const allCompositionItem =
                  await tx.smartnewsystem_composicao_item.findMany({
                    where: {
                      id_centro_custo: compositionGroup.id,
                    },
                  });

                for await (const compositionItem of allCompositionItem) {
                  await tx.smartnewsystem_composicao_item.create({
                    data: {
                      id_cliente: newCompany.ID,
                      id_centro_custo: newCompositionGroup.id,
                      id_descricao_centro_custo: newDescriptionCostCenter.id,
                      composicao: compositionItem.composicao,
                      descricao: compositionItem.descricao,
                      log_user: compositionItem.log_user,
                    },
                  });
                }
              }
            }
          }

          //Equipamento

          // Familia Equipamento
          const allFamily =
            await tx.cadastro_de_familias_de_equipamento.findMany({
              where: {
                ID_cliente: branch.ID_cliente,
              },
            });

          for await (const family of allFamily) {
            await tx.cadastro_de_familias_de_equipamento.create({
              data: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                familia: family.familia,
                log_user: family.log_user,
                imagem: family.imagem,
              },
            });
          }

          // Tipo Equipamento
          const allTypeEquipment =
            await tx.cadastro_de_tipos_de_equipamentos.findMany({
              where: {
                ID_cliente: branch.ID_cliente,
              },
            });

          for await (const typeEquipment of allTypeEquipment) {
            await tx.cadastro_de_tipos_de_equipamentos.create({
              data: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                tipo_equipamento: typeEquipment.tipo_equipamento,
                log_user: typeEquipment.log_user,
              },
            });
          }

          // Unidade Planos Prev
          const allUnity = await tx.sofman_unidade_medida_planos_prev.findMany({
            where: {
              id_cliente: branch.ID_cliente,
            },
          });

          for await (const unity of allUnity) {
            await tx.sofman_unidade_medida_planos_prev.create({
              data: {
                id_cliente: newCompany.ID,
                unidade: unity.unidade,
              },
            });
          }

          // Categoria Equipamento

          const allCategoryEquipment =
            await tx.smartnewsystem_equipamento_categoria.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const categoryEquipment of allCategoryEquipment) {
            await tx.smartnewsystem_equipamento_categoria.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: categoryEquipment.descricao,
                log_user: categoryEquipment.log_user,
              },
            });
          }

          const allEquipment = await tx.cadastro_de_equipamentos.findMany({
            include: {
              family: true,
              typeEquipment: true,
              criticalityEquipment: true,
              categoryEquipment: true,
            },
            where: {
              ID_filial: branch.ID,
            },
          });

          for await (const equipment of allEquipment) {
            const newFamily =
              await tx.cadastro_de_familias_de_equipamento.findFirst({
                where: {
                  familia: equipment.family.familia,
                  ID_cliente: newCompany.ID,
                  ID_filial: newBranch.ID,
                },
              });

            if (!newFamily) {
              return false;
            }

            const newTypeEquipment =
              await tx.cadastro_de_tipos_de_equipamentos.findFirst({
                where: {
                  tipo_equipamento: equipment.typeEquipment.tipo_equipamento,
                  ID_cliente: newCompany.ID,
                  ID_filial: newBranch.ID,
                },
              });

            if (!newTypeEquipment) {
              return false;
            }

            let newCategoryEquipment = { id: null };

            if (equipment.id_categoria) {
              newCategoryEquipment =
                await tx.smartnewsystem_equipamento_categoria.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: equipment.categoryEquipment.descricao,
                  },
                });
            }

            await tx.cadastro_de_equipamentos.create({
              data: {
                frota: equipment.frota,
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                ID_familia: newFamily.ID,
                id_categoria: newCategoryEquipment.id,
                ID_tipoeqto: newTypeEquipment.ID,
                centro_custo: equipment.centro_custo,
                equipamento_codigo: equipment.equipamento_codigo,
                descricao: equipment.descricao,
                familia: equipment.familia,
                tipo_equipamento: equipment.tipo_equipamento,
                fabricante: equipment.fabricante,
                marca: equipment.marca,
                n_serie: equipment.n_serie,
                modelo: equipment.modelo,
                ano_fabricacao: equipment.ano_fabricacao,
                ano_modelo: equipment.ano_modelo,
                garantia: equipment.garantia,
                data_compra: equipment.data_compra,
                n_nota_fiscal: equipment.n_nota_fiscal,
                valor_aquisicao: equipment.valor_aquisicao,
                observacoes: equipment.observacoes,
                status_equipamento: equipment.status_equipamento,
                log_user: equipment.log_user,
                chassi: equipment.chassi,
                placa: equipment.placa,
                cor: equipment.cor,
                n_ct_finame: equipment.n_ct_finame,
                beneficiario: equipment.beneficiario,
                codigo_renavam: equipment.codigo_renavam,
                consumo_previsto: equipment.consumo_previsto,
                tipo_consumo: equipment.tipo_consumo,
                proprietario: equipment.proprietario,
                tempo_sincronizacao: equipment.tempo_sincronizacao,
              },
            });
          }

          // setor Executante
          const allSector = await tx.sofman_cad_setor_executante.findMany({
            where: {
              id_cliente: branch.ID_cliente,
            },
          });

          for await (const sector of allSector) {
            await tx.sofman_cad_setor_executante.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: sector.descricao,
                log_user: sector.log_user,
              },
            });
          }

          // Grupo tipo manutencao
          const allGroupMaintenance =
            await tx.sofman_grupo_tipo_manutencao.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const groupMaintenance of allGroupMaintenance) {
            await tx.sofman_grupo_tipo_manutencao.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: groupMaintenance.descricao,
                log_user: groupMaintenance.log_user,
              },
            });
          }

          // Tipo manutencao
          const allTypeMaintenance =
            await tx.sofman_cad_tipos_manutencao.findMany({
              include: {
                groupMaintenance: true,
              },
              where: {
                ID_cliente: branch.ID_cliente,
              },
            });

          for await (const typeMaintenance of allTypeMaintenance) {
            let newGroup = { id: null };

            if (typeMaintenance.groupMaintenance) {
              newGroup = await tx.sofman_grupo_tipo_manutencao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: typeMaintenance.groupMaintenance.descricao,
                },
              });

              if (!newGroup) {
                return false;
              }
            }

            const validDuplicate =
              await tx.sofman_cad_tipos_manutencao.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  //ID_filial: newBranch.ID,
                  tipo_manutencao: typeMaintenance.tipo_manutencao,
                },
              });

            if (validDuplicate) {
              continue;
            }
            await tx.sofman_cad_tipos_manutencao.create({
              data: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                sigla: typeMaintenance.sigla,
                tipo_manutencao: typeMaintenance.tipo_manutencao,
                id_grupo: newGroup.id,
                status: typeMaintenance.status,
                ordem_programada: typeMaintenance.ordem_programada,
                notifica_encerramento: typeMaintenance.notifica_encerramento,
                incluir_solicitacao: typeMaintenance.incluir_solicitacao,
                log_user: typeMaintenance.log_user,
              },
            });
          }

          // Descricao Planejamento Manutencao

          const allDescriptionMaintenance =
            await tx.sofman_descricao_planejamento_manutencao.findMany({
              include: {
                equipment: true,
                sectorExecutor: true,
                subGroup: true,
                typeMaintenance: true,
              },
              where: {
                id_filial: branch.ID,
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const descriptionMaintenance of allDescriptionMaintenance) {
            const newEquipment = await tx.cadastro_de_equipamentos.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                equipamento_codigo:
                  descriptionMaintenance.equipment.equipamento_codigo,
                descricao: descriptionMaintenance.equipment.descricao,
              },
            });

            if (!newEquipment) {
              return false;
            }

            const newSectorExecuting =
              await tx.sofman_cad_setor_executante.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: descriptionMaintenance.sectorExecutor.descricao,
                },
              });

            if (!newEquipment) {
              return false;
            }

            const newTypeMaintenance =
              await tx.sofman_cad_tipos_manutencao.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  tipo_manutencao:
                    descriptionMaintenance.typeMaintenance.tipo_manutencao,
                },
              });

            if (!newTypeMaintenance) {
              return false;
            }

            await tx.sofman_descricao_planejamento_manutencao.create({
              data: {
                nome_assinatura: descriptionMaintenance.nome_assinatura,
                assinatura: descriptionMaintenance.assinatura,
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                id_equipamento: newEquipment.ID,
                id_setor_executante: newSectorExecuting.Id,
                id_tipo_manutencao: newTypeMaintenance.ID,
                descricao: descriptionMaintenance.descricao,
                prioridade: descriptionMaintenance.prioridade,
                pula_fds: descriptionMaintenance.pula_fds,
                status_programacao: descriptionMaintenance.status_programacao,
                processamento: descriptionMaintenance.processamento,
                incremento: descriptionMaintenance.incremento,
                log_user: descriptionMaintenance.log_user,
              },
            });
          }

          // status Ordem de Servico
          const allStatusOrderService =
            await tx.sofman_status_ordem_servico.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const statusOrderService of allStatusOrderService) {
            const validStatusOrderService =
              await tx.sofman_status_ordem_servico.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  status: statusOrderService.status,
                },
              });

            if (validStatusOrderService) {
              continue;
            }

            await tx.sofman_status_ordem_servico.create({
              data: {
                id_cliente: newCompany.ID,
                status: statusOrderService.status,
                requer_justificativa: statusOrderService.requer_justificativa,
                notifica_solicitante: statusOrderService.notifica_solicitante,
                cor: statusOrderService.cor,
                cor_font: statusOrderService.cor_font,
                finalizacao: statusOrderService.finalizacao,
                mostra_mantenedor: statusOrderService.mostra_mantenedor,
              },
            });
          }

          // prioridade ordem servico
          const allPriorityOrder =
            await tx.sofman_cad_prioridades_ordem_servico.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const priorityOrder of allPriorityOrder) {
            await tx.sofman_cad_prioridades_ordem_servico.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: priorityOrder.descricao,
              },
            });
          }

          // Ordem de Servico
          const allOrder = await tx.controle_de_ordens_de_servico.findMany({
            select: {
              ordem: true,
              data_hora_solicitacao: true,
              log_user: true,
              ID_cliente: true,
              ID_filial: true,
              id_equipamento: true,
              id_planejamento_manutencao: true,
              familia: true,
              tipo_equipamento: true,
              equipamento: true,
              modelo: true,
              descricao_solicitacao: true,
              descricao_servico_realizado: true,
              observacoes: true,
              tipo_manutencao: true,
              status_os: true,
              retorno_checklist: true,
              fechada: true,
              status_equipamento: true,
              data_prevista_termino: true,
              data_hora_encerramento: true,
              solicitante: true,
              emissor: true,
              setor_executante: true,
              hh_previsto: true,
              hh_real: true,
              custo_materiais: true,
              sessao_id: true,
              carga_h_trabalho: true,
              maquina_parada: true,
              horimetro: true,
              odometro: true,
              count_print: true,
              prioridade: true,
              data_equipamento_parou: true,
              data_acionamento_tecnico: true,
              chegada_tecnico: true,
              data_equipamento_funcionou: true,
              aux: true,
              equipment: true,
              descriptionMaintenance: true,
              typeMaintenance: true,
              statusOrderService: true,
              sectorExecutor: true,
              priorityOrderService: true,
            },
            where: {
              ID_cliente: branch.ID_cliente,
              ID_filial: branch.ID,
            },
          });

          for await (const order of allOrder) {
            const newEquipment = await tx.cadastro_de_equipamentos.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                equipamento_codigo: order.equipment.equipamento_codigo,
                descricao: order.equipment.descricao,
              },
            });

            if (!newEquipment) {
              return false;
            }

            let newDescriptionMaintenance = { id: null };

            if (order.id_planejamento_manutencao) {
              newDescriptionMaintenance =
                await tx.sofman_descricao_planejamento_manutencao.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    descricao: order.descriptionMaintenance.descricao,
                    id_equipamento: newEquipment.ID,
                  },
                });

              if (!newDescriptionMaintenance) {
                return false;
              }
            }

            const newTypeMaintenance =
              await tx.sofman_cad_tipos_manutencao.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  ID_filial: newBranch.ID,
                  tipo_manutencao: order.typeMaintenance.tipo_manutencao,
                },
              });

            if (!newTypeMaintenance) {
              return false;
            }

            const newPriorityOrder =
              await tx.sofman_cad_prioridades_ordem_servico.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: order.priorityOrderService.descricao,
                },
              });

            if (!newPriorityOrder) {
              return false;
            }

            const newStatusOrderService =
              await tx.sofman_status_ordem_servico.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  status: order.statusOrderService.status,
                },
              });

            if (!newStatusOrderService) {
              return false;
            }

            const newSectorExecuting =
              await tx.sofman_cad_setor_executante.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: order.sectorExecutor.descricao,
                },
              });

            if (!newStatusOrderService) {
              return false;
            }

            await tx.controle_de_ordens_de_servico.create({
              data: {
                ordem: order.ordem,
                data_hora_solicitacao: order.data_hora_solicitacao,
                log_user: order.log_user,
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                id_equipamento: newEquipment.ID,
                id_planejamento_manutencao: newDescriptionMaintenance.id,
                familia: order.familia,
                tipo_equipamento: order.tipo_equipamento,
                equipamento: order.equipamento,
                modelo: order.modelo,
                descricao_solicitacao: order.descricao_solicitacao,
                descricao_servico_realizado: order.descricao_servico_realizado,
                observacoes: order.observacoes,
                tipo_manutencao: newTypeMaintenance.ID,
                status_os: newStatusOrderService.id,
                retorno_checklist: order.retorno_checklist,
                fechada: order.fechada,
                status_equipamento: order.status_equipamento,
                data_prevista_termino: order.data_prevista_termino,
                data_hora_encerramento: order.data_hora_encerramento,
                solicitante: order.solicitante,
                emissor: order.emissor,
                setor_executante: newSectorExecuting.Id,
                hh_previsto: order.hh_previsto,
                hh_real: order.hh_real,
                custo_materiais: order.custo_materiais,
                sessao_id: order.sessao_id,
                carga_h_trabalho: order.carga_h_trabalho,
                maquina_parada: order.maquina_parada,
                horimetro: order.horimetro,
                odometro: order.odometro,
                count_print: order.count_print,
                prioridade: newPriorityOrder.id,
                data_equipamento_parou: order.data_equipamento_parou,
                data_acionamento_tecnico: order.data_acionamento_tecnico,
                chegada_tecnico: order.chegada_tecnico,
                data_equipamento_funcionou: order.data_equipamento_funcionou,
                aux: order.aux,
              },
            });
          }

          //Financeiro
          //Tipo pagamento

          const allTypePayment =
            await tx.smartnewsystem_financeiro_tipos_pagamento.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const typePayment of allTypePayment) {
            await tx.smartnewsystem_financeiro_tipos_pagamento.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: typePayment.descricao,
              },
            });
          }

          const allTypeDocument =
            await tx.smartnewsystem_financeiro_tipo_documento.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const typeDocument of allTypeDocument) {
            await tx.smartnewsystem_financeiro_tipo_documento.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: typeDocument.descricao,
                numeracao_automatica: typeDocument.numeracao_automatica,
                requer_chave: typeDocument.requer_chave,
              },
            });
          }

          const allFinancePay =
            await tx.smartnewsystem_financeiro_descricao_titulos.findMany({
              select: {
                id: true,
                id_cliente: true,
                id_filial: true,
                id_documento_tipo: true,
                direcao: true,
                id_fornecedor: true,
                id_filial_pagador: true,
                descricao: true,
                documento_numero: true,
                numero_fiscal: true,
                documento_tipo: true,
                frequencia_pagamento: true,
                documento_valor: true,
                parcelar: true,
                quantidade_parcela: true,
                data_vencimento: true,
                observacoes: true,
                log_user: true,
                data_emissao: true,
                data_lancamento: true,
                emitente: true,
                remetente: true,
                chave: true,
                status: true,
                total_acrescimo: true,
                total_desconto: true,
                acrescimo_desconto: true,
                total_liquido: true,
                documentType: true,
                paymentType: true,
              },
              where: {
                id_cliente: branch.ID_cliente,
                remetente: branch.ID,
              },
            });

          for await (const financePay of allFinancePay) {
            const newTypeDocument =
              await tx.smartnewsystem_financeiro_tipo_documento.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: financePay.documentType.descricao,
                },
              });

            if (!newTypeDocument) {
              return false;
            }

            const provider = await tx.sofman_cad_fornecedores.findUnique({
              where: {
                ID: financePay.emitente,
              },
            });

            const newIssue = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: provider.nome_fantasia,
                razao_social: provider.razao_social,
                cnpj: provider.cnpj,
              },
            });

            if (!newIssue) {
              return false;
            }

            const newTypePayment =
              await tx.smartnewsystem_financeiro_tipos_pagamento.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: financePay.paymentType.descricao,
                },
              });

            if (!newTypePayment) {
              return false;
            }

            const newFinancePay =
              await tx.smartnewsystem_financeiro_descricao_titulos.create({
                data: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  id_documento_tipo: newTypeDocument.id,
                  direcao: financePay.direcao,
                  id_fornecedor: financePay.id_fornecedor,
                  id_filial_pagador: financePay.id_filial_pagador,
                  descricao: financePay.descricao,
                  documento_numero: financePay.documento_numero,
                  numero_fiscal: financePay.numero_fiscal,
                  documento_tipo: newTypePayment.id,
                  frequencia_pagamento: financePay.frequencia_pagamento,
                  documento_valor: financePay.documento_valor,
                  parcelar: financePay.parcelar,
                  quantidade_parcela: financePay.quantidade_parcela,
                  data_vencimento: financePay.data_vencimento,
                  observacoes: financePay.observacoes,
                  log_user: financePay.log_user,
                  data_emissao: financePay.data_emissao,
                  data_lancamento: financePay.data_lancamento,
                  emitente: newIssue.ID,
                  remetente: newBranch.ID,
                  chave: financePay.chave,
                  status: financePay.status,
                  total_acrescimo: financePay.total_acrescimo,
                  total_desconto: financePay.total_desconto,
                  acrescimo_desconto: financePay.acrescimo_desconto,
                  total_liquido: financePay.total_liquido,
                },
              });

            const allFinanceItem =
              await tx.smartnewsystem_financeiro_titulos_dados.findMany({
                include: {
                  compositionItem: true,
                  order: true,
                  equipment: true,
                },
                where: {
                  id_titulo: financePay.id,
                },
              });

            for await (const financeItem of allFinanceItem) {
              const material = await tx.sofman_cad_materiais.findUnique({
                where: {
                  id: financeItem.id_insumo,
                },
              });

              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  material: material.material,
                },
              });

              if (!newMaterial) {
                return false;
              }

              const newCompositionItem =
                await tx.smartnewsystem_composicao_item.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeItem.compositionItem.descricao,
                    composicao: financeItem.compositionItem.composicao,
                    log_user: financeItem.compositionItem.log_user,
                  },
                });

              if (!newCompositionItem) {
                return false;
              }

              let newOrder = { ID: null };

              if (financeItem.id_os) {
                newOrder = await tx.controle_de_ordens_de_servico.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ordem: financeItem.order.ordem,
                    descricao_solicitacao:
                      financeItem.order.descricao_solicitacao,
                  },
                });

                if (!newOrder) {
                  return false;
                }
              }

              let newEquipment = { ID: null };

              if (financeItem.id_equipamento) {
                newEquipment = await tx.cadastro_de_equipamentos.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    equipamento_codigo:
                      financeItem.equipment.equipamento_codigo,
                    descricao: financeItem.equipment.descricao,
                  },
                });

                if (!newEquipment) {
                  return false;
                }
              }

              await tx.smartnewsystem_financeiro_titulos_dados.create({
                data: {
                  id_titulo: newFinancePay.id,
                  id_insumo: newMaterial.id,
                  id_item_centro_custo: newCompositionItem.id,
                  item: financeItem.item,
                  vinculo: financeItem.vinculo,
                  id_os: newOrder.ID,
                  id_equipamento: newEquipment.ID,
                  preco_unitario: financeItem.preco_unitario,
                  quantidade: financeItem.quantidade,
                  total: financeItem.total,
                  log_user: financeItem.log_user,
                },
              });
            }

            const allFinanceRegister =
              await tx.smartnewsystem_financeiro_registro_tributo.findMany({
                include: {
                  tribute: true,
                },
                where: {
                  id_titulo: financePay.id,
                },
              });

            for await (const financeRegister of allFinanceRegister) {
              const newTribute =
                await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeRegister.tribute.descricao,
                  },
                });

              if (!newTribute) {
                return false;
              }

              await tx.smartnewsystem_financeiro_registro_tributo.create({
                data: {
                  id_titulo: newFinancePay.id,
                  id_tributo: newTribute.id,
                  valor: financeRegister.valor,
                  descricao: financeRegister.descricao,
                  tipo: financeRegister.tipo,
                },
              });
            }

            const allSplitPayment =
              await tx.smartnewsystem_financeiro_titulo_pagamento.findMany({
                where: {
                  id_titulo: financePay.id,
                },
              });

            for await (const splitPayment of allSplitPayment) {
              await tx.smartnewsystem_financeiro_titulo_pagamento.create({
                data: {
                  id_titulo: newFinancePay.id,
                  parcela: splitPayment.parcela,
                  vencimento: splitPayment.vencimento,
                  valor_a_pagar: splitPayment.valor_a_pagar,
                  acrescimo: splitPayment.acrescimo,
                  motivo_acrescimo: splitPayment.motivo_acrescimo,
                  desconto: splitPayment.desconto,
                  motivo_desconto: splitPayment.motivo_desconto,
                  valor_parcela: splitPayment.valor_parcela,
                  prorrogacao: splitPayment.prorrogacao,
                  status: splitPayment.status,
                },
              });
            }

            const allEmission =
              await tx.smartnewsystem_financeiro_emissao.findMany({
                include: {
                  bank: true,
                },
                where: {
                  id_cliente: newCompany.ID,
                  emissionItem: {
                    every: {
                      installmentFinance: {
                        id_titulo: financePay.id,
                      },
                    },
                  },
                },
              });

            for await (const emission of allEmission) {
              const newBank =
                await tx.smartnewsystem_financeiro_bancos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    nome: emission.bank.nome,
                    agencia: emission.bank.agencia,
                    numero_conta: emission.bank.numero_conta,
                  },
                });

              if (!newBank) {
                return false;
              }

              const newEmission =
                await tx.smartnewsystem_financeiro_emissao.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_banco: newBank.id,
                    data_vencimento: emission.data_vencimento,
                    pago: emission.pago,
                    log_user: emission.log_user,
                  },
                });

              const allEmissionItem =
                await tx.smartnewsystem_financeiro_emissao_itens.findMany({
                  include: {
                    installmentFinance: true,
                  },
                  where: {
                    id_emissao: emission.id,
                  },
                });

              for await (const emissionItem of allEmissionItem) {
                const newInstallmentFinance =
                  await tx.smartnewsystem_financeiro_titulo_pagamento.findFirst(
                    {
                      where: {
                        parcela: emissionItem.installmentFinance.parcela,
                        vencimento: emissionItem.installmentFinance.vencimento,
                        valor_a_pagar:
                          emissionItem.installmentFinance.valor_a_pagar,
                      },
                    },
                  );

                if (!newInstallmentFinance) {
                  return false;
                }

                await tx.smartnewsystem_financeiro_emissao_itens.create({
                  data: {
                    id_emissao: newEmission.id,
                    id_pagamento: newInstallmentFinance.id,
                  },
                });

                const allRegisterTributeItem =
                  await tx.smartnewsystem_financeiro_emissao_tributos.findMany({
                    include: {
                      taxation: true,
                    },
                    where: {
                      id_emissao: emission.id,
                      id_pagamento: emissionItem.id_pagamento,
                    },
                  });

                for await (const registerTributeItem of allRegisterTributeItem) {
                  const newTribute =
                    await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                      where: {
                        id_cliente: newCompany.ID,
                        descricao: registerTributeItem.taxation.descricao,
                      },
                    });

                  if (!newTribute) {
                    return false;
                  }

                  await tx.smartnewsystem_financeiro_emissao_tributos.create({
                    data: {
                      id_emissao: newEmission.id,
                      id_pagamento: newInstallmentFinance.id,
                      id_atributo: newTribute.id,
                      valor: registerTributeItem.valor,
                      observacao: registerTributeItem.observacao,
                      tipo: registerTributeItem.tipo,
                    },
                  });
                }
              }
            }
          }

          const allFinanceReceive =
            await tx.smartnewsystem_financeiro_descricao_titulos.findMany({
              select: {
                id: true,
                id_cliente: true,
                id_filial: true,
                id_documento_tipo: true,
                direcao: true,
                id_fornecedor: true,
                id_filial_pagador: true,
                descricao: true,
                documento_numero: true,
                numero_fiscal: true,
                documento_tipo: true,
                frequencia_pagamento: true,
                documento_valor: true,
                parcelar: true,
                quantidade_parcela: true,
                data_vencimento: true,
                observacoes: true,
                log_user: true,
                data_emissao: true,
                data_lancamento: true,
                emitente: true,
                remetente: true,
                chave: true,
                status: true,
                total_acrescimo: true,
                total_desconto: true,
                total_liquido: true,
                acrescimo_desconto: true,
                documentType: true,
                paymentType: true,
              },
              where: {
                id_cliente: branch.ID_cliente,
                emitente: branch.ID,
              },
            });

          for await (const financeReceive of allFinanceReceive) {
            const newTypeDocument =
              await tx.smartnewsystem_financeiro_tipo_documento.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: financeReceive.documentType.descricao,
                },
              });

            if (!newTypeDocument) {
              return false;
            }

            const provider = await tx.sofman_cad_fornecedores.findUnique({
              where: {
                ID: financeReceive.remetente,
              },
            });

            const newIssue = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: provider.nome_fantasia,
                razao_social: provider.razao_social,
                cnpj: provider.cnpj,
              },
            });

            if (!newIssue) {
              return false;
            }

            const newTypePayment =
              await tx.smartnewsystem_financeiro_tipos_pagamento.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: financeReceive.paymentType.descricao,
                },
              });

            if (!newTypePayment) {
              return false;
            }

            const newFinanceReceive =
              await tx.smartnewsystem_financeiro_descricao_titulos.create({
                data: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  id_documento_tipo: newTypeDocument.id,
                  direcao: financeReceive.direcao,
                  id_fornecedor: financeReceive.id_fornecedor,
                  id_filial_pagador: financeReceive.id_filial_pagador,
                  descricao: financeReceive.descricao,
                  documento_numero: financeReceive.documento_numero,
                  numero_fiscal: financeReceive.numero_fiscal,
                  documento_tipo: newTypePayment.id,
                  frequencia_pagamento: financeReceive.frequencia_pagamento,
                  documento_valor: financeReceive.documento_valor,
                  parcelar: financeReceive.parcelar,
                  quantidade_parcela: financeReceive.quantidade_parcela,
                  data_vencimento: financeReceive.data_vencimento,
                  observacoes: financeReceive.observacoes,
                  log_user: financeReceive.log_user,
                  data_emissao: financeReceive.data_emissao,
                  data_lancamento: financeReceive.data_lancamento,
                  remetente: newIssue.ID,
                  emitente: newBranch.ID,
                  chave: financeReceive.chave,
                  status: financeReceive.status,
                  total_acrescimo: financeReceive.total_acrescimo,
                  total_desconto: financeReceive.total_desconto,
                  acrescimo_desconto: financeReceive.acrescimo_desconto,
                  total_liquido: financeReceive.total_liquido,
                },
              });

            const allFinanceItem =
              await tx.smartnewsystem_financeiro_titulos_dados.findMany({
                include: {
                  compositionItem: true,
                  order: true,
                  equipment: true,
                },
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const financeItem of allFinanceItem) {
              const input =
                await tx.smartnewsystem_contrato_tipo_insumo.findUnique({
                  where: {
                    id: financeItem.id_insumo,
                  },
                });

              const newInput =
                await tx.smartnewsystem_contrato_tipo_insumo.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    insumo: input.insumo,
                  },
                });

              if (!newInput) {
                return false;
              }

              const newCompositionItem =
                await tx.smartnewsystem_composicao_item.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeItem.compositionItem.descricao,
                    composicao: financeItem.compositionItem.composicao,
                    log_user: financeItem.compositionItem.log_user,
                  },
                });

              if (!newCompositionItem) {
                return false;
              }

              let newOrder = { ID: null };

              if (financeItem.id_os) {
                newOrder = await tx.controle_de_ordens_de_servico.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ordem: financeItem.order.ordem,
                    descricao_solicitacao:
                      financeItem.order.descricao_solicitacao,
                  },
                });

                if (!newOrder) {
                  return false;
                }
              }

              let newEquipment = { ID: null };

              if (financeItem.id_equipamento) {
                newEquipment = await tx.cadastro_de_equipamentos.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    equipamento_codigo:
                      financeItem.equipment.equipamento_codigo,
                    descricao: financeItem.equipment.descricao,
                  },
                });

                if (!newEquipment) {
                  return false;
                }
              }

              await tx.smartnewsystem_financeiro_titulos_dados.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  id_insumo: newInput.id,
                  id_item_centro_custo: newCompositionItem.id,
                  item: financeItem.item,
                  vinculo: financeItem.vinculo,
                  id_os: newOrder.ID,
                  id_equipamento: newEquipment.ID,
                  preco_unitario: financeItem.preco_unitario,
                  quantidade: financeItem.quantidade,
                  total: financeItem.total,
                  log_user: financeItem.log_user,
                },
              });
            }

            const allFinanceRegister =
              await tx.smartnewsystem_financeiro_registro_tributo.findMany({
                include: {
                  tribute: true,
                },
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const financeRegister of allFinanceRegister) {
              const newTribute =
                await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeRegister.tribute.descricao,
                  },
                });

              if (!newTribute) {
                return false;
              }

              await tx.smartnewsystem_financeiro_registro_tributo.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  id_tributo: newTribute.id,
                  valor: financeRegister.valor,
                  descricao: financeRegister.descricao,
                  tipo: financeRegister.tipo,
                },
              });
            }

            const allSplitPayment =
              await tx.smartnewsystem_financeiro_titulo_pagamento.findMany({
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const splitPayment of allSplitPayment) {
              await tx.smartnewsystem_financeiro_titulo_pagamento.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  parcela: splitPayment.parcela,
                  vencimento: splitPayment.vencimento,
                  valor_a_pagar: splitPayment.valor_a_pagar,
                  acrescimo: splitPayment.acrescimo,
                  motivo_acrescimo: splitPayment.motivo_acrescimo,
                  desconto: splitPayment.desconto,
                  motivo_desconto: splitPayment.motivo_desconto,
                  valor_parcela: splitPayment.valor_parcela,
                  prorrogacao: splitPayment.prorrogacao,
                  status: splitPayment.status,
                },
              });
            }

            const allEmission =
              await tx.smartnewsystem_financeiro_emissao.findMany({
                include: {
                  bank: true,
                },
                where: {
                  id_cliente: newCompany.ID,
                  emissionItem: {
                    every: {
                      installmentFinance: {
                        id_titulo: financeReceive.id,
                      },
                    },
                  },
                },
              });

            for await (const emission of allEmission) {
              const newBank =
                await tx.smartnewsystem_financeiro_bancos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    nome: emission.bank.nome,
                    agencia: emission.bank.agencia,
                    numero_conta: emission.bank.numero_conta,
                  },
                });

              if (!newBank) {
                return false;
              }

              const newEmission =
                await tx.smartnewsystem_financeiro_emissao.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_banco: newBank.id,
                    data_vencimento: emission.data_vencimento,
                    pago: emission.pago,
                    log_user: emission.log_user,
                  },
                });

              const allEmissionItem =
                await tx.smartnewsystem_financeiro_emissao_itens.findMany({
                  include: {
                    installmentFinance: true,
                  },
                  where: {
                    id_emissao: emission.id,
                  },
                });

              for await (const emissionItem of allEmissionItem) {
                const newInstallmentFinance =
                  await tx.smartnewsystem_financeiro_titulo_pagamento.findFirst(
                    {
                      where: {
                        parcela: emissionItem.installmentFinance.parcela,
                        vencimento: emissionItem.installmentFinance.vencimento,
                        valor_a_pagar:
                          emissionItem.installmentFinance.valor_a_pagar,
                      },
                    },
                  );

                if (!newInstallmentFinance) {
                  return false;
                }

                await tx.smartnewsystem_financeiro_emissao_itens.create({
                  data: {
                    id_emissao: newEmission.id,
                    id_pagamento: newInstallmentFinance.id,
                  },
                });

                const allRegisterTributeItem =
                  await tx.smartnewsystem_financeiro_emissao_tributos.findMany({
                    include: {
                      taxation: true,
                    },
                    where: {
                      id_emissao: emission.id,
                      id_pagamento: emissionItem.id_pagamento,
                    },
                  });

                for await (const registerTributeItem of allRegisterTributeItem) {
                  const newTribute =
                    await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                      where: {
                        id_cliente: newCompany.ID,
                        descricao: registerTributeItem.taxation.descricao,
                      },
                    });

                  if (!newTribute) {
                    return false;
                  }

                  await tx.smartnewsystem_financeiro_emissao_tributos.create({
                    data: {
                      id_emissao: newEmission.id,
                      id_pagamento: newInstallmentFinance.id,
                      id_atributo: newTribute.id,
                      valor: registerTributeItem.valor,
                      observacao: registerTributeItem.observacao,
                      tipo: registerTributeItem.tipo,
                    },
                  });
                }
              }
            }
          }

          // Compras
          // Solicitacao
          const allPriorityBuy =
            await tx.smartnewsystem_compras_prioridade.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const priorityBuy of allPriorityBuy) {
            await tx.smartnewsystem_compras_prioridade.create({
              data: {
                id_cliente: newCompany.ID,
                name: priorityBuy.name,
                prazo: priorityBuy.prazo,
              },
            });
          }

          // material
          // categoria
          const allCategoryMaterial =
            await tx.sofman_cad_categorias_materiais.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const categoryMaterial of allCategoryMaterial) {
            await tx.sofman_cad_categorias_materiais.create({
              data: {
                id_cliente: newCompany.ID,
                descricao: categoryMaterial.descricao,
                log_user: categoryMaterial.log_user,
              },
            });
          }

          const allMaterial = await tx.sofman_cad_materiais.findMany({
            include: {
              categoryMaterial: true,
            },
            where: {
              id_cliente: branch.ID_cliente,
            },
          });

          for await (const material of allMaterial) {
            let newCategoryMaterial = { id: null };

            if (material.categoryMaterial) {
              newCategoryMaterial =
                await tx.sofman_cad_categorias_materiais.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: material.categoryMaterial.descricao,
                  },
                });

              if (!newCategoryMaterial) {
                return false;
              }
            }

            await tx.sofman_cad_materiais.create({
              data: {
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                id_categoria: newCategoryMaterial.id,
                codigo: material.codigo,
                material: material.material,
                ativo: material.ativo,
                tipo: material.tipo,
                unidade: material.unidade,
                valor: material.valor,
                Valor_venda: material.Valor_venda,
                fator: material.fator,
                estoque_min: material.estoque_min,
                estoque_max: material.estoque_max,
                estoque_real: material.estoque_real,
                localizacao: material.localizacao,
                log_user: material.log_user,
                DataEstoqueMin: material.DataEstoqueMin,
              },
            });
          }

          const allDepartment =
            await tx.smartnewsystem_departamento_compras.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const department of allDepartment) {
            const newDepartment =
              await tx.smartnewsystem_departamento_compras.create({
                data: {
                  id_cliente: newCompany.ID,
                  descricao: department.descricao,
                },
              });

            const allDepartmentBuyCategory =
              await tx.smartnewsystem_compras_departamento_categoria.findMany({
                include: {
                  departmentBuy: true,
                  categoryMaterial: true,
                },
                where: {
                  id_departamento_compra: department.id,
                },
              });

            for await (const departmentBuy of allDepartmentBuyCategory) {
              const newCategoryMaterial =
                await tx.sofman_cad_categorias_materiais.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: departmentBuy.categoryMaterial.descricao,
                  },
                });

              if (!newCategoryMaterial) {
                return false;
              }

              await tx.smartnewsystem_compras_departamento_categoria.create({
                data: {
                  id_categoria: newCategoryMaterial.id,
                  id_departamento_compra: newDepartment.id,
                },
              });

              const allResponsibleQuotation =
                await tx.smartnewsystem_compras_responsavel_cotacao.findMany({
                  where: {
                    id_filial: branch.ID,
                    id_departamento: department.id,
                  },
                });

              for await (const responsibleQuotation of allResponsibleQuotation) {
                await tx.smartnewsystem_compras_responsavel_cotacao.create({
                  data: {
                    id_filial: newBranch.ID,
                    login: responsibleQuotation.login,
                    id_departamento: newDepartment.id,
                  },
                });
              }
            }
          }

          // numeros Pedido
          const allNumbersRequest =
            await tx.smartnewsystem_compras_numeracao_pedido.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          await tx.smartnewsystem_compras_numeracao_pedido.deleteMany({
            where: {
              id_cliente: newCompany.ID,
            },
          });

          for await (const numbersRequest of allNumbersRequest) {
            await tx.smartnewsystem_compras_numeracao_pedido.create({
              data: {
                id_cliente: newCompany.ID,
                numero: numbersRequest.numero,
              },
            });
          }

          // compras pedido status
          const allRequestStatus =
            await tx.smartnewsystem_compras_pedido_status.findMany({
              where: {
                id_cliente: branch.ID_cliente,
              },
            });

          await tx.smartnewsystem_compras_pedido_status.deleteMany({
            where: {
              id_cliente: newCompany.ID,
            },
          });

          for await (const requestStatus of allRequestStatus) {
            await tx.smartnewsystem_compras_pedido_status.create({
              data: {
                id_cliente: newCompany.ID,
                status: requestStatus.status,
                finaliza: requestStatus.finaliza,
                icone: requestStatus.icone,
              },
            });
          }

          const allBuy = await tx.smartnewsystem_compras_solicitacao.findMany({
            where: {
              id_filial: branch.ID,
            },
          });

          await tx.smartnewsystem_compras_pedido_fornecedor.deleteMany({
            where: {
              requestBuy: {
                buy: {
                  id_filial: newBranch.ID,
                },
              },
            },
          });

          await tx.smartnewsystem_compras_pedidos_item.deleteMany({
            where: {
              quotationItem: {
                item: {
                  buy: {
                    id_filial: newBranch.ID,
                  },
                },
              },
            },
          });

          await tx.smartnewsystem_compras_numeros_fiscais.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_aprovacao.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_cotacao_selecionada.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_cotacao_item.deleteMany({
            where: {
              item: {
                buy: {
                  id_filial: newBranch.ID,
                },
              },
            },
          });

          await tx.smartnewsystem_compras_cotacao_desconto.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_cotacao.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_cotacao.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_item_solicitacao.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          await tx.smartnewsystem_compras_solicitacao.deleteMany({
            where: {
              id_filial: newBranch.ID,
            },
          });

          for await (const buy of allBuy) {
            let newBuy = await tx.smartnewsystem_compras_solicitacao.findFirst({
              where: {
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                numero: buy.numero,
                observacao: buy.observacao,
              },
            });

            if (!newBuy) {
              newBuy = await tx.smartnewsystem_compras_solicitacao.create({
                data: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  numero: buy.numero,
                  observacao: buy.observacao,
                  status: buy.status,
                  log_user: buy.log_user,
                  log_date: buy.log_date,
                  responsavel_fechamento: buy.responsavel_fechamento,
                  fechamento: buy.fechamento,
                },
              });
            }

            const allItems =
              await tx.smartnewsystem_compras_item_solicitacao.findMany({
                include: {
                  material: true,
                  compositionItem: true,
                  serviceOrder: true,
                  equipment: true,
                  priority: true,
                },
                where: {
                  id_solicitacao: buy.id,
                },
              });

            for await (const itemBuy of allItems) {
              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  material: itemBuy.material.material,
                  id_filial: newBranch.ID,
                },
              });

              if (!newMaterial) {
                return false;
              }

              const newCompositionItem =
                await tx.smartnewsystem_composicao_item.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    composicao: itemBuy.compositionItem.composicao,
                    descricao: itemBuy.compositionItem.descricao,
                  },
                });

              if (!newCompositionItem) {
                return false;
              }

              let newOrder = { ID: null };

              if (itemBuy.id_os) {
                newOrder = await tx.controle_de_ordens_de_servico.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ordem: itemBuy.serviceOrder.ordem,
                    descricao_solicitacao:
                      itemBuy.serviceOrder.descricao_solicitacao,
                  },
                });

                if (!newOrder) {
                  return false;
                }
              }

              let newEquipment = { ID: null };

              if (itemBuy.id_equipamento) {
                newEquipment = await tx.cadastro_de_equipamentos.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    equipamento_codigo: itemBuy.equipment.equipamento_codigo,
                    descricao: itemBuy.equipment.descricao,
                  },
                });

                if (!newEquipment) {
                  return false;
                }
              }

              const newPriorityBuy =
                await tx.smartnewsystem_compras_prioridade.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    name: itemBuy.priority.name,
                  },
                });

              if (!newPriorityBuy) {
                return false;
              }

              await tx.smartnewsystem_compras_item_solicitacao.create({
                data: {
                  sequencia: itemBuy.sequencia,
                  id_solicitacao: newBuy.id,
                  id_composicao_item: newCompositionItem.id,
                  id_material: newMaterial.id,
                  id_os: newOrder.ID,
                  id_equipamento: newEquipment.ID,
                  quantidade: itemBuy.quantidade,
                  vinculo: itemBuy.vinculo,
                  id_prioridade: newPriorityBuy.id,
                  observacao: itemBuy.observacao,
                },
              });
            }

            await tx.smartnewsystem_compras_pre_financeiro_pagamento.deleteMany(
              {
                where: {
                  buyPreFinance: {
                    buy: {
                      id_filial: newBranch.ID,
                    },
                  },
                },
              },
            );

            await tx.smartnewsystem_compras_pre_financeiro.deleteMany({
              where: {
                buy: {
                  id_filial: newBranch.ID,
                },
              },
            });

            const allBuyPreFinance =
              await tx.smartnewsystem_compras_pre_financeiro.findMany({
                where: {
                  id_compra: buy.id,
                  emitente: buy.id_filial,
                },
              });

            for await (const buyPreFinance of allBuyPreFinance) {
              const newBuyPreFinance =
                await tx.smartnewsystem_compras_pre_financeiro.create({
                  data: {
                    id_compra: newBuy.id,
                    emitente: newBranch.ID,
                  },
                });

              const allBuyPreFinancePayment =
                await tx.smartnewsystem_compras_pre_financeiro_pagamento.findMany(
                  {
                    include: {
                      provider: true,
                      paymentType: true,
                    },
                    where: {
                      id_pre_financeiro: buyPreFinance.id,
                    },
                  },
                );

              for await (const buyPreFinancePayment of allBuyPreFinancePayment) {
                const newProvider = await tx.sofman_cad_fornecedores.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    nome_fantasia: buyPreFinancePayment.provider.nome_fantasia,
                    razao_social: buyPreFinancePayment.provider.razao_social,
                    cnpj: buyPreFinancePayment.provider.cnpj,
                  },
                });

                if (!newProvider) {
                  return false;
                }

                const newTypePayment =
                  await tx.smartnewsystem_financeiro_tipos_pagamento.findFirst({
                    where: {
                      id_cliente: newCompany.ID,
                      descricao: buyPreFinancePayment.paymentType.descricao,
                    },
                  });

                if (!newTypePayment) {
                  return false;
                }

                await tx.smartnewsystem_compras_pre_financeiro_pagamento.create(
                  {
                    data: {
                      id_pre_financeiro: newBuyPreFinance.id,
                      id_fornecedor: newProvider.ID,
                      id_pagamento: newTypePayment.id,
                      vencimento: buyPreFinancePayment.vencimento,
                      quantidade_parcela:
                        buyPreFinancePayment.quantidade_parcela,
                      parcelar: buyPreFinancePayment.parcelar,
                      frequencia: buyPreFinancePayment.frequencia,
                      log_user: buyPreFinancePayment.log_user,
                    },
                  },
                );
              }
            }
          }

          const allQuotation = await tx.smartnewsystem_compras_cotacao.findMany(
            {
              include: {
                provider: true,
                buy: true,
              },
              where: {
                buy: {
                  id_filial: branch.ID,
                },
              },
            },
          );

          for await (const quotation of allQuotation) {
            const newBuy =
              await tx.smartnewsystem_compras_solicitacao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  numero: quotation.buy.numero,
                  observacao: quotation.buy.observacao,
                },
              });

            if (!newBuy) {
              throw 'Compras nao encontrado';
            }

            const newProvider = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: quotation.provider.nome_fantasia,
                razao_social: quotation.provider.razao_social,
                cnpj: quotation.provider.cnpj,
              },
            });

            if (!newProvider) {
              return false;
            }

            const newQuotation = await tx.smartnewsystem_compras_cotacao.create(
              {
                data: {
                  id_cliente: newCompany.ID,
                  id_fornecedor: newProvider.ID,
                  id_compra: newBuy.id,
                },
              },
            );

            const allQuotationDiscount =
              await tx.smartnewsystem_compras_cotacao_desconto.findMany({
                include: {
                  tribute: true,
                },
                where: {
                  id_compra: quotation.buy.id,
                  id_fornecedor: quotation.id_fornecedor,
                },
              });

            for await (const quotationDiscount of allQuotationDiscount) {
              const newTribute =
                await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: quotationDiscount.tribute.descricao,
                  },
                });

              if (!newTribute) {
                return false;
              }

              await tx.smartnewsystem_compras_cotacao_desconto.create({
                data: {
                  id_compra: newBuy.id,
                  id_fornecedor: newProvider.ID,
                  id_tributo: newTribute.id,
                  valor: quotationDiscount.valor,
                  motivo: quotationDiscount.motivo,
                  tipo: quotationDiscount.tipo,
                },
              });
            }

            const allQuotationItem =
              await tx.smartnewsystem_compras_cotacao_item.findMany({
                include: {
                  item: {
                    include: {
                      material: true,
                    },
                  },
                },
                where: {
                  id_cotacao: quotation.id,
                },
              });

            for await (const quotationItem of allQuotationItem) {
              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  material: quotationItem.item.material.material,
                },
              });

              if (!newMaterial) {
                return false;
              }

              const newItem =
                await tx.smartnewsystem_compras_item_solicitacao.findFirst({
                  where: {
                    id_solicitacao: newBuy.id,
                    sequencia: quotationItem.item.sequencia,
                    id_material: newMaterial.id,
                    quantidade: quotationItem.item.quantidade,
                    observacao: quotationItem.item.observacao,
                  },
                });

              if (!newItem) {
                return false;
              }

              const newQuotationItem =
                await tx.smartnewsystem_compras_cotacao_item.create({
                  data: {
                    id_cotacao: newQuotation.id,
                    id_item: newItem.id,
                    observacao: quotationItem.observacao,
                    quantidade: quotationItem.quantidade,
                    valor: quotationItem.valor,
                  },
                });

              const allQuotationSelect =
                await tx.smartnewsystem_compras_cotacao_selecionada.findMany({
                  where: {
                    id_item_cotacao: quotationItem.id,
                  },
                });

              for await (const quotationSelect of allQuotationSelect) {
                await tx.smartnewsystem_compras_cotacao_selecionada.create({
                  data: {
                    id_compra: newBuy.id,
                    id_item_cotacao: newQuotationItem.id,
                    aprovado: quotationSelect.aprovado,
                  },
                });
              }
            }
          }

          const allApprove = await tx.smartnewsystem_compras_aprovacao.findMany(
            {
              include: {
                buy: true,
              },
              where: {
                buy: {
                  id_filial: branch.ID,
                },
              },
            },
          );

          await tx.smartnewsystem_compras_aprovacao.deleteMany({
            where: {
              buy: {
                id_filial: newBranch.ID,
              },
            },
          });

          for await (const approve of allApprove) {
            const newBuy =
              await tx.smartnewsystem_compras_solicitacao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  numero: approve.buy.numero,
                  observacao: approve.buy.observacao,
                },
              });

            if (!newBuy) {
              throw 'Compras nao encontrado aprovacao';
            }

            await tx.smartnewsystem_compras_aprovacao.create({
              data: {
                id_compra: newBuy.id,
                aprovador: approve.aprovador,
                aprovado: approve.aprovado,
                log_date: approve.log_date,
                assinatura: approve.assinatura,
                observacao: approve.observacao,
              },
            });
          }

          const allRequest =
            await tx.smartnewsystem_compras_numeros_fiscais.findMany({
              include: {
                provider: true,
                buy: true,
              },
              where: {
                buy: {
                  id_filial: branch.ID,
                },
              },
            });

          for await (const request of allRequest) {
            const newBuy =
              await tx.smartnewsystem_compras_solicitacao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  numero: request.buy.numero,
                  observacao: request.buy.observacao,
                },
              });

            if (!newBuy) {
              throw 'Compras nao encontrado em pedido';
            }

            let newProvider = { ID: null };

            if (request.provider) {
              newProvider = await tx.sofman_cad_fornecedores.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  nome_fantasia: request.provider.nome_fantasia,
                  razao_social: request.provider.razao_social,
                  cnpj: request.provider.cnpj,
                },
              });

              if (!newProvider) {
                return false;
              }
            }

            const newRequest =
              await tx.smartnewsystem_compras_numeros_fiscais.create({
                data: {
                  id_cliente: newCompany.ID,
                  id_compra: newBuy.id,
                  id_fornecedor: newProvider.ID,
                  log_user: request.log_user,
                  numero: request.numero,
                },
              });

            const allRequestItem =
              await tx.smartnewsystem_compras_pedidos_item.findMany({
                include: {
                  quotationItem: {
                    include: {
                      item: {
                        include: {
                          material: true,
                        },
                      },
                    },
                  },
                  status: true,
                },
                where: {
                  id_pedido: request.id,
                },
              });

            for await (const requestItem of allRequestItem) {
              const newQuotation =
                await tx.smartnewsystem_compras_cotacao.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_compra: newBuy.id,
                    id_fornecedor: newProvider.ID,
                  },
                });

              if (!newQuotation) {
                return false;
              }

              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  material: requestItem.quotationItem.item.material.material,
                },
              });

              if (!newMaterial) {
                return false;
              }

              const newItem =
                await tx.smartnewsystem_compras_item_solicitacao.findFirst({
                  where: {
                    id_solicitacao: newBuy.id,
                    sequencia: requestItem.quotationItem.item.sequencia,
                    id_material: newMaterial.id,
                    quantidade: requestItem.quotationItem.item.quantidade,
                    observacao: requestItem.quotationItem.item.observacao,
                  },
                });

              if (!newItem) {
                return false;
              }

              const newRequestStatus =
                await tx.smartnewsystem_compras_pedido_status.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    status: requestItem.status.status,
                  },
                });

              if (!newRequestStatus) {
                return false;
              }

              const newQuotationItem =
                await tx.smartnewsystem_compras_cotacao_item.findFirst({
                  where: {
                    id_cotacao: newQuotation.id,
                    id_item: newItem.id,
                  },
                });

              if (!newQuotationItem) {
                return false;
              }

              await tx.smartnewsystem_compras_pedidos_item.create({
                data: {
                  id_pedido: newRequest.id,
                  id_item: newQuotationItem.id,
                  id_status: newRequestStatus.id,
                  log_user: requestItem.log_user,
                },
              });
            }
            //continuar compras fornecedor

            const allBuyProvider =
              await tx.smartnewsystem_compras_pedido_fornecedor.findMany({
                include: {
                  provider: true,
                  finance: true,
                },
                where: {
                  id_pedido: request.id,
                },
              });

            for await (const buyProvider of allBuyProvider) {
              const newProvider = await tx.sofman_cad_fornecedores.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  nome_fantasia: buyProvider.provider.nome_fantasia,
                  razao_social: buyProvider.provider.razao_social,
                  cnpj: buyProvider.provider.cnpj,
                },
              });

              if (!newProvider) {
                return false;
              }

              let newIssue = { ID: null };
              let newSender = { ID: null };

              if (buyProvider.finance.direcao === 'pagar') {
                const provider = await tx.sofman_cad_fornecedores.findUnique({
                  where: {
                    ID: buyProvider.finance.emitente,
                  },
                });

                newIssue = await tx.sofman_cad_fornecedores.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    nome_fantasia: provider.nome_fantasia,
                    razao_social: provider.razao_social,
                    cnpj: provider.cnpj,
                  },
                });

                if (newIssue.ID === null) {
                  return false;
                }

                newSender.ID = newBranch.ID;
              } else {
                const provider = await tx.sofman_cad_fornecedores.findUnique({
                  where: {
                    ID: buyProvider.finance.remetente,
                  },
                });

                newSender = await tx.sofman_cad_fornecedores.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    nome_fantasia: provider.nome_fantasia,
                    razao_social: provider.razao_social,
                    cnpj: provider.cnpj,
                  },
                });

                if (newSender.ID === null) {
                  return false;
                }

                newIssue.ID = newBranch.ID;
              }

              const newFinance =
                await tx.smartnewsystem_financeiro_descricao_titulos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    numero_fiscal: buyProvider.finance.numero_fiscal,
                    direcao: buyProvider.finance.direcao,
                    emitente: newIssue.ID,
                    remetente: newSender.ID,
                  },
                });

              if (!newFinance) {
                return false;
              }

              await tx.smartnewsystem_compras_pedido_fornecedor.create({
                data: {
                  id_pedido: newRequest.id,
                  id_fornecedor: newProvider.ID,
                  id_finance: newFinance.id,
                },
              });
            }
          }
        },
        {
          timeout: 2800000,
        },
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async launchItemFinanceInHeaderImportForBranch(
    data: ISeed['launchItemFinanceInHeaderImportForBranch'],
  ): Promise<boolean> {
    try {
      const newCompany = { ID: data.newCompanyId };
      const newBranch = { ID: data.newBranchId };
      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: data.id,
            },
          });

          const newDescriptionCostCenter =
            await tx.sofman_descricao_centro_custo.findFirst({
              where: {
                id_filial: newBranch.ID,
              },
            });

          const allBank = await tx.smartnewsystem_financeiro_bancos.findMany({
            where: {
              id_cliente: branch.ID_cliente,
            },
          });

          for await (const bank of allBank) {
            const validDuplicate =
              await tx.smartnewsystem_financeiro_bancos.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  nome: bank.nome,
                  agencia: bank.agencia,
                  numero_conta: bank.numero_conta,
                },
              });

            if (validDuplicate) {
              continue;
            }

            await tx.smartnewsystem_financeiro_bancos.create({
              data: {
                agencia: bank.agencia,
                digito: bank.digito,
                digito_agencia: bank.digito_agencia,
                //dono: bank.dono,
                nome: bank.nome,
                numero_conta: bank.numero_conta,
                saldo: bank.saldo,
                id_cliente: newCompany.ID,
                negativo: bank.negativo,
                status: bank.status,
              },
            });
          }

          const allFinancePay =
            await tx.smartnewsystem_financeiro_descricao_titulos.findMany({
              include: {
                documentType: true,
                paymentType: true,
              },
              where: {
                remetente: branch.ID,
                //id: 19920,
                log_date: {
                  gte: new Date('2024-03-22'),
                },
              },
            });

          for await (const financePay of allFinancePay) {
            const provider = await tx.sofman_cad_fornecedores.findUnique({
              where: {
                ID: financePay.emitente,
              },
            });

            const newIssue = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: provider.nome_fantasia,
                razao_social: provider.razao_social,
                cnpj: provider.cnpj,
              },
            });

            if (!newIssue) {
              return false;
            }

            let newFinancePay =
              await tx.smartnewsystem_financeiro_descricao_titulos.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  numero_fiscal: financePay.numero_fiscal,
                  direcao: financePay.direcao,
                  emitente: newIssue.ID,
                  remetente: newBranch.ID,
                },
              });

            if (!newFinancePay) {
              const newTypeDocument =
                await tx.smartnewsystem_financeiro_tipo_documento.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financePay.documentType.descricao,
                  },
                });

              if (!newTypeDocument) {
                return false;
              }

              const newTypePayment =
                await tx.smartnewsystem_financeiro_tipos_pagamento.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financePay.paymentType.descricao,
                  },
                });

              if (!newTypePayment) {
                return false;
              }

              newFinancePay =
                await tx.smartnewsystem_financeiro_descricao_titulos.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    id_documento_tipo: newTypeDocument.id,
                    direcao: financePay.direcao,
                    id_fornecedor: financePay.id_fornecedor,
                    id_filial_pagador: financePay.id_filial_pagador,
                    descricao: financePay.descricao,
                    documento_numero: financePay.documento_numero,
                    numero_fiscal: financePay.numero_fiscal,
                    documento_tipo: newTypePayment.id,
                    frequencia_pagamento: financePay.frequencia_pagamento,
                    documento_valor: financePay.documento_valor,
                    parcelar: financePay.parcelar,
                    quantidade_parcela: financePay.quantidade_parcela,
                    data_vencimento: financePay.data_vencimento,
                    observacoes: financePay.observacoes,
                    log_user: financePay.log_user,
                    data_emissao: financePay.data_emissao,
                    data_lancamento: financePay.data_lancamento,
                    emitente: newIssue.ID,
                    remetente: newBranch.ID,
                    chave: financePay.chave,
                    status: financePay.status,
                    total_acrescimo: financePay.total_acrescimo,
                    total_desconto: financePay.total_desconto,
                    acrescimo_desconto: financePay.acrescimo_desconto,
                    total_liquido: financePay.total_liquido,
                  },
                });
            }

            const allFinanceItem =
              await tx.smartnewsystem_financeiro_titulos_dados.findMany({
                select: {
                  id_titulo: true,
                  id_insumo: true,
                  id_item_centro_custo: true,
                  item: true,
                  vinculo: true,
                  id_os: true,
                  id_equipamento: true,
                  preco_unitario: true,
                  quantidade: true,
                  total: true,
                  log_user: true,
                  compositionItem: {
                    select: {
                      descricao: true,
                      composicao: true,
                      log_user: true,
                      compositionGroup: {
                        select: {
                          id: true,
                          composicao: true,
                          descricao: true,
                          costCenter: true,
                        },
                      },
                    },
                  },
                  order: {
                    select: {
                      ordem: true,
                      descricao_solicitacao: true,
                    },
                  },
                  equipment: true,
                },
                where: {
                  id_titulo: financePay.id,
                },
              });

            await tx.smartnewsystem_financeiro_titulos_dados.deleteMany({
              where: {
                id_titulo: newFinancePay.id,
              },
            });

            for await (const financeItem of allFinanceItem) {
              const material = await tx.sofman_cad_materiais.findUnique({
                where: {
                  id: financeItem.id_insumo,
                },
              });

              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  material: material.material,
                },
              });

              if (!newMaterial) {
                return false;
              }

              let newCostCenter =
                await tx.cadastro_de_centros_de_custo.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    centro_custo:
                      financeItem.compositionItem.compositionGroup.costCenter
                        .centro_custo,
                    descricao:
                      financeItem.compositionItem.compositionGroup.costCenter
                        .descricao,
                  },
                });

              if (!newCostCenter) {
                if (financeItem.compositionItem) {
                  newCostCenter = await tx.cadastro_de_centros_de_custo.create({
                    data: {
                      ID_cliente: newCompany.ID,
                      ID_centro_custo: newDescriptionCostCenter.id,
                      centro_custo:
                        financeItem.compositionItem.compositionGroup.costCenter
                          .centro_custo,
                      descricao:
                        financeItem.compositionItem.compositionGroup.costCenter
                          .descricao,
                      log_user:
                        financeItem.compositionItem.compositionGroup.costCenter
                          .log_user,
                    },
                  });
                } else {
                  return false;
                }
              }

              let newCompositionGroup =
                await tx.smartnewsystem_composicao_grupo.findFirst({
                  where: {
                    id_centro_custo: newCostCenter.ID,
                    composicao:
                      financeItem.compositionItem.compositionGroup.composicao,
                    descricao:
                      financeItem.compositionItem.compositionGroup.descricao,
                  },
                });

              if (!newCompositionGroup) {
                if (financeItem.compositionItem) {
                  newCompositionGroup =
                    await tx.smartnewsystem_composicao_grupo.create({
                      data: {
                        id_cliente: newCompany.ID,
                        log_user: financeItem.compositionItem.log_user,
                        id_centro_custo: newCostCenter.ID,
                        composicao:
                          financeItem.compositionItem.compositionGroup
                            .composicao,
                        descricao:
                          financeItem.compositionItem.compositionGroup
                            .descricao,
                      },
                    });
                } else {
                  return false;
                }
              }

              let newCompositionItem =
                await tx.smartnewsystem_composicao_item.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_centro_custo: newCompositionGroup.id,
                    descricao: financeItem.compositionItem.descricao,
                    //composicao: financeItem.compositionItem.composicao,
                    log_user: financeItem.compositionItem.log_user,
                  },
                });

              if (!newCompositionItem) {
                if (financeItem.compositionItem) {
                  newCompositionItem =
                    await tx.smartnewsystem_composicao_item.create({
                      data: {
                        id_cliente: newCompany.ID,
                        id_centro_custo: newCompositionGroup.id,
                        descricao: financeItem.compositionItem.descricao,
                        composicao: financeItem.compositionItem.composicao,
                        log_user: financeItem.compositionItem.log_user,
                        id_descricao_centro_custo:
                          newCostCenter.ID_centro_custo,
                      },
                    });
                } else {
                  return false;
                }
              }

              let newOrder = { ID: null };

              if (financeItem.id_os) {
                newOrder = await tx.controle_de_ordens_de_servico.findFirst({
                  select: {
                    ID: true,
                  },
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ordem: financeItem.order.ordem,
                    descricao_solicitacao:
                      financeItem.order.descricao_solicitacao,
                  },
                });

                if (!newOrder) {
                  return false;
                }
              }

              let newEquipment = { ID: null };

              if (financeItem.id_equipamento) {
                newEquipment = await tx.cadastro_de_equipamentos.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    equipamento_codigo:
                      financeItem.equipment.equipamento_codigo,
                    descricao: financeItem.equipment.descricao,
                  },
                });

                if (!newEquipment) {
                  return false;
                }
              }

              const validateItem =
                await tx.smartnewsystem_financeiro_titulos_dados.findFirst({
                  where: {
                    id_titulo: newFinancePay.id,
                    id_insumo: newMaterial.id,
                    id_item_centro_custo: newCompositionItem.id,
                    item: financeItem.item,
                    vinculo: financeItem.vinculo,
                    id_os: newOrder.ID,
                    id_equipamento: newEquipment.ID,
                  },
                });

              if (validateItem) {
                continue;
              }

              await tx.smartnewsystem_financeiro_titulos_dados.create({
                data: {
                  id_titulo: newFinancePay.id,
                  id_insumo: newMaterial.id,
                  id_item_centro_custo: newCompositionItem.id,
                  item: financeItem.item,
                  vinculo: financeItem.vinculo,
                  id_os: newOrder.ID,
                  id_equipamento: newEquipment.ID,
                  preco_unitario: financeItem.preco_unitario,
                  quantidade: financeItem.quantidade,
                  total: financeItem.total,
                  log_user: financeItem.log_user,
                },
              });
            }

            const allFinanceRegister =
              await tx.smartnewsystem_financeiro_registro_tributo.findMany({
                include: {
                  tribute: true,
                },
                where: {
                  id_titulo: financePay.id,
                },
              });

            await tx.smartnewsystem_financeiro_registro_tributo.deleteMany({
              where: {
                id_titulo: newFinancePay.id,
              },
            });

            for await (const financeRegister of allFinanceRegister) {
              const newTribute =
                await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeRegister.tribute.descricao,
                  },
                });

              if (!newTribute) {
                return false;
              }

              const validRegister =
                await tx.smartnewsystem_financeiro_registro_tributo.findFirst({
                  where: {
                    id_titulo: newFinancePay.id,
                    id_tributo: newTribute.id,
                    valor: financeRegister.valor,
                    descricao: financeRegister.descricao,
                    tipo: financeRegister.tipo,
                  },
                });

              if (validRegister) {
                continue;
              }

              await tx.smartnewsystem_financeiro_registro_tributo.create({
                data: {
                  id_titulo: newFinancePay.id,
                  id_tributo: newTribute.id,
                  valor: financeRegister.valor,
                  descricao: financeRegister.descricao,
                  tipo: financeRegister.tipo,
                },
              });
            }

            const allSplitPayment =
              await tx.smartnewsystem_financeiro_titulo_pagamento.findMany({
                where: {
                  id_titulo: financePay.id,
                },
              });

            await tx.smartnewsystem_financeiro_emissao_tributos.deleteMany({
              where: {
                payment: {
                  id_titulo: newFinancePay.id,
                },
              },
            });

            await tx.smartnewsystem_financeiro_emissao_itens.deleteMany({
              where: {
                installmentFinance: {
                  id_titulo: newFinancePay.id,
                },
              },
            });

            await tx.smartnewsystem_financeiro_titulo_pagamento.deleteMany({
              where: {
                id_titulo: newFinancePay.id,
              },
            });

            for await (const splitPayment of allSplitPayment) {
              const validSplit =
                await tx.smartnewsystem_financeiro_titulo_pagamento.findFirst({
                  where: {
                    id_titulo: newFinancePay.id,
                    parcela: splitPayment.parcela,
                    vencimento: splitPayment.vencimento,
                    valor_a_pagar: splitPayment.valor_a_pagar,
                  },
                });

              if (validSplit) {
                continue;
              }

              await tx.smartnewsystem_financeiro_titulo_pagamento.create({
                data: {
                  id_titulo: newFinancePay.id,
                  parcela: splitPayment.parcela,
                  vencimento: splitPayment.vencimento,
                  valor_a_pagar: splitPayment.valor_a_pagar,
                  acrescimo: splitPayment.acrescimo,
                  motivo_acrescimo: splitPayment.motivo_acrescimo,
                  desconto: splitPayment.desconto,
                  motivo_desconto: splitPayment.motivo_desconto,
                  valor_parcela: splitPayment.valor_parcela,
                  prorrogacao: splitPayment.prorrogacao,
                  status: splitPayment.status,
                },
              });
            }

            const allEmission =
              await tx.smartnewsystem_financeiro_emissao.findMany({
                include: {
                  bank: true,
                },
                where: {
                  id_cliente: newCompany.ID,
                  emissionItem: {
                    every: {
                      installmentFinance: {
                        id_titulo: financePay.id,
                      },
                    },
                  },
                },
              });

            for await (const emission of allEmission) {
              const newBank =
                await tx.smartnewsystem_financeiro_bancos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    nome: emission.bank.nome,
                    agencia: emission.bank.agencia,
                    numero_conta: emission.bank.numero_conta,
                  },
                });

              if (!newBank) {
                return false;
              }

              const validEmission =
                await tx.smartnewsystem_financeiro_emissao.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_banco: newBank.id,
                    data_vencimento: emission.data_vencimento,
                    pago: emission.pago,
                    log_user: emission.log_user,
                  },
                });

              if (validEmission) {
                continue;
              }

              const newEmission =
                await tx.smartnewsystem_financeiro_emissao.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_banco: newBank.id,
                    data_vencimento: emission.data_vencimento,
                    pago: emission.pago,
                    log_user: emission.log_user,
                  },
                });

              const allEmissionItem =
                await tx.smartnewsystem_financeiro_emissao_itens.findMany({
                  include: {
                    installmentFinance: true,
                  },
                  where: {
                    id_emissao: emission.id,
                  },
                });

              for await (const emissionItem of allEmissionItem) {
                const newInstallmentFinance =
                  await tx.smartnewsystem_financeiro_titulo_pagamento.findFirst(
                    {
                      where: {
                        parcela: emissionItem.installmentFinance.parcela,
                        vencimento: emissionItem.installmentFinance.vencimento,
                        valor_a_pagar:
                          emissionItem.installmentFinance.valor_a_pagar,
                      },
                    },
                  );

                if (!newInstallmentFinance) {
                  return false;
                }

                const validEmissionItem =
                  await tx.smartnewsystem_financeiro_emissao_itens.findFirst({
                    where: {
                      id_emissao: newEmission.id,
                      id_pagamento: newInstallmentFinance.id,
                    },
                  });

                if (validEmissionItem) {
                  continue;
                }

                await tx.smartnewsystem_financeiro_emissao_itens.create({
                  data: {
                    id_emissao: newEmission.id,
                    id_pagamento: newInstallmentFinance.id,
                  },
                });

                const allRegisterTributeItem =
                  await tx.smartnewsystem_financeiro_emissao_tributos.findMany({
                    include: {
                      taxation: true,
                    },
                    where: {
                      id_emissao: emission.id,
                      id_pagamento: emissionItem.id_pagamento,
                    },
                  });

                for await (const registerTributeItem of allRegisterTributeItem) {
                  const newTribute =
                    await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                      where: {
                        id_cliente: newCompany.ID,
                        descricao: registerTributeItem.taxation.descricao,
                      },
                    });

                  if (!newTribute) {
                    return false;
                  }

                  const validEmissionTribute =
                    await tx.smartnewsystem_financeiro_emissao_tributos.findFirst(
                      {
                        where: {
                          id_emissao: newEmission.id,
                          id_pagamento: newInstallmentFinance.id,
                          id_atributo: newTribute.id,
                          valor: registerTributeItem.valor,
                          observacao: registerTributeItem.observacao,
                          tipo: registerTributeItem.tipo,
                        },
                      },
                    );

                  if (validEmissionTribute) {
                    continue;
                  }

                  await tx.smartnewsystem_financeiro_emissao_tributos.create({
                    data: {
                      id_emissao: newEmission.id,
                      id_pagamento: newInstallmentFinance.id,
                      id_atributo: newTribute.id,
                      valor: registerTributeItem.valor,
                      observacao: registerTributeItem.observacao,
                      tipo: registerTributeItem.tipo,
                    },
                  });
                }
              }
            }
          }

          const allFinanceReceive =
            await tx.smartnewsystem_financeiro_descricao_titulos.findMany({
              where: {
                emitente: branch.ID,
              },
            });

          for await (const financeReceive of allFinanceReceive) {
            const provider = await tx.sofman_cad_fornecedores.findUnique({
              where: {
                ID: financeReceive.remetente,
              },
            });

            const newIssue = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: provider.nome_fantasia,
                razao_social: provider.razao_social,
                cnpj: provider.cnpj,
              },
            });

            if (!newIssue) {
              return false;
            }

            const newFinanceReceive =
              await tx.smartnewsystem_financeiro_descricao_titulos.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  numero_fiscal: financeReceive.numero_fiscal,
                  direcao: financeReceive.direcao,
                  emitente: newBranch.ID,
                  remetente: newIssue.ID,
                },
              });

            const allFinanceItem =
              await tx.smartnewsystem_financeiro_titulos_dados.findMany({
                include: {
                  compositionItem: true,
                  order: true,
                  equipment: true,
                },
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const financeItem of allFinanceItem) {
              const input =
                await tx.smartnewsystem_contrato_tipo_insumo.findUnique({
                  where: {
                    id: financeItem.id_insumo,
                  },
                });

              const newInput =
                await tx.smartnewsystem_contrato_tipo_insumo.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    insumo: input.insumo,
                  },
                });

              if (!newInput) {
                return false;
              }

              const newCompositionItem =
                await tx.smartnewsystem_composicao_item.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeItem.compositionItem.descricao,
                    composicao: financeItem.compositionItem.composicao,
                    log_user: financeItem.compositionItem.log_user,
                  },
                });

              if (!newCompositionItem) {
                return false;
              }

              let newOrder = { ID: null };

              if (financeItem.id_os) {
                newOrder = await tx.controle_de_ordens_de_servico.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ordem: financeItem.order.ordem,
                    descricao_solicitacao:
                      financeItem.order.descricao_solicitacao,
                  },
                });

                if (!newOrder) {
                  return false;
                }
              }

              let newEquipment = { ID: null };

              if (financeItem.id_equipamento) {
                newEquipment = await tx.cadastro_de_equipamentos.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    equipamento_codigo:
                      financeItem.equipment.equipamento_codigo,
                    descricao: financeItem.equipment.descricao,
                  },
                });

                if (!newEquipment) {
                  return false;
                }
              }

              await tx.smartnewsystem_financeiro_titulos_dados.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  id_insumo: newInput.id,
                  id_item_centro_custo: newCompositionItem.id,
                  item: financeItem.item,
                  vinculo: financeItem.vinculo,
                  id_os: newOrder.ID,
                  id_equipamento: newEquipment.ID,
                  preco_unitario: financeItem.preco_unitario,
                  quantidade: financeItem.quantidade,
                  total: financeItem.total,
                  log_user: financeItem.log_user,
                },
              });
            }

            const allFinanceRegister =
              await tx.smartnewsystem_financeiro_registro_tributo.findMany({
                include: {
                  tribute: true,
                },
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const financeRegister of allFinanceRegister) {
              const newTribute =
                await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: financeRegister.tribute.descricao,
                  },
                });

              if (!newTribute) {
                return false;
              }

              await tx.smartnewsystem_financeiro_registro_tributo.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  id_tributo: newTribute.id,
                  valor: financeRegister.valor,
                  descricao: financeRegister.descricao,
                  tipo: financeRegister.tipo,
                },
              });
            }

            const allSplitPayment =
              await tx.smartnewsystem_financeiro_titulo_pagamento.findMany({
                where: {
                  id_titulo: financeReceive.id,
                },
              });

            for await (const splitPayment of allSplitPayment) {
              await tx.smartnewsystem_financeiro_titulo_pagamento.create({
                data: {
                  id_titulo: newFinanceReceive.id,
                  parcela: splitPayment.parcela,
                  vencimento: splitPayment.vencimento,
                  valor_a_pagar: splitPayment.valor_a_pagar,
                  acrescimo: splitPayment.acrescimo,
                  motivo_acrescimo: splitPayment.motivo_acrescimo,
                  desconto: splitPayment.desconto,
                  motivo_desconto: splitPayment.motivo_desconto,
                  valor_parcela: splitPayment.valor_parcela,
                  prorrogacao: splitPayment.prorrogacao,
                  status: splitPayment.status,
                },
              });
            }

            const allEmission =
              await tx.smartnewsystem_financeiro_emissao.findMany({
                include: {
                  bank: true,
                },
                where: {
                  id_cliente: newCompany.ID,
                  emissionItem: {
                    every: {
                      installmentFinance: {
                        id_titulo: financeReceive.id,
                      },
                    },
                  },
                },
              });

            for await (const emission of allEmission) {
              const newBank =
                await tx.smartnewsystem_financeiro_bancos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    nome: emission.bank.nome,
                    agencia: emission.bank.agencia,
                    numero_conta: emission.bank.numero_conta,
                  },
                });

              if (!newBank) {
                return false;
              }

              const newEmission =
                await tx.smartnewsystem_financeiro_emissao.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_banco: newBank.id,
                    data_vencimento: emission.data_vencimento,
                    pago: emission.pago,
                    log_user: emission.log_user,
                  },
                });

              const allEmissionItem =
                await tx.smartnewsystem_financeiro_emissao_itens.findMany({
                  include: {
                    installmentFinance: true,
                  },
                  where: {
                    id_emissao: emission.id,
                  },
                });

              for await (const emissionItem of allEmissionItem) {
                const newInstallmentFinance =
                  await tx.smartnewsystem_financeiro_titulo_pagamento.findFirst(
                    {
                      where: {
                        parcela: emissionItem.installmentFinance.parcela,
                        vencimento: emissionItem.installmentFinance.vencimento,
                        valor_a_pagar:
                          emissionItem.installmentFinance.valor_a_pagar,
                      },
                    },
                  );

                if (!newInstallmentFinance) {
                  return false;
                }

                await tx.smartnewsystem_financeiro_emissao_itens.create({
                  data: {
                    id_emissao: newEmission.id,
                    id_pagamento: newInstallmentFinance.id,
                  },
                });

                const allRegisterTributeItem =
                  await tx.smartnewsystem_financeiro_emissao_tributos.findMany({
                    include: {
                      taxation: true,
                    },
                    where: {
                      id_emissao: emission.id,
                      id_pagamento: emissionItem.id_pagamento,
                    },
                  });

                for await (const registerTributeItem of allRegisterTributeItem) {
                  const newTribute =
                    await tx.smartnewsystem_financeiro_tributacoes.findFirst({
                      where: {
                        id_cliente: newCompany.ID,
                        descricao: registerTributeItem.taxation.descricao,
                      },
                    });

                  if (!newTribute) {
                    return false;
                  }

                  await tx.smartnewsystem_financeiro_emissao_tributos.create({
                    data: {
                      id_emissao: newEmission.id,
                      id_pagamento: newInstallmentFinance.id,
                      id_atributo: newTribute.id,
                      valor: registerTributeItem.valor,
                      observacao: registerTributeItem.observacao,
                      tipo: registerTributeItem.tipo,
                    },
                  });
                }
              }
            }
          }
        },
        {
          timeout: 2800000,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async launchOrderServiceImportForBranch(
    data: ISeed['launchOrderServiceImportForBranch'],
  ): Promise<boolean> {
    try {
      const newCompany = { ID: data.newCompanyId };
      const newBranch = { ID: data.newBranchId };

      await this.prismaService.$transaction(
        async (tx) => {
          await tx.$executeRaw`set @exec:= false;`;

          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: data.id,
            },
          });

          // sofman_descricao_planejamento_manutencao

          const allDescriptionMaintenance =
            await tx.sofman_descricao_planejamento_manutencao.findMany({
              include: {
                equipment: true,
                sectorExecutor: true,
                subGroup: true,
                typeMaintenance: true,
              },
              where: {
                id_filial: branch.ID,
                id_cliente: branch.ID_cliente,
              },
            });

          for await (const descriptionMaintenance of allDescriptionMaintenance) {
            const newEquipment = await tx.cadastro_de_equipamentos.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                equipamento_codigo:
                  descriptionMaintenance.equipment.equipamento_codigo,
                descricao: descriptionMaintenance.equipment.descricao,
              },
            });

            if (!newEquipment) {
              return false;
            }

            const newSectorExecuting =
              await tx.sofman_cad_setor_executante.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: descriptionMaintenance.sectorExecutor.descricao,
                },
              });

            if (!newEquipment) {
              return false;
            }

            const newTypeMaintenance =
              await tx.sofman_cad_tipos_manutencao.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  tipo_manutencao:
                    descriptionMaintenance.typeMaintenance.tipo_manutencao,
                },
              });

            if (!newTypeMaintenance) {
              return false;
            }

            const validMaintenance =
              await tx.sofman_descricao_planejamento_manutencao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  id_equipamento: newEquipment.ID,
                  id_setor_executante: newSectorExecuting.Id,
                  id_tipo_manutencao: newTypeMaintenance.ID,
                  descricao: descriptionMaintenance.descricao,
                },
              });

            if (validMaintenance) {
              continue;
            }

            await tx.sofman_descricao_planejamento_manutencao.create({
              data: {
                nome_assinatura: descriptionMaintenance.nome_assinatura,
                assinatura: descriptionMaintenance.assinatura,
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                id_equipamento: newEquipment.ID,
                id_setor_executante: newSectorExecuting.Id,
                id_tipo_manutencao: newTypeMaintenance.ID,
                descricao: descriptionMaintenance.descricao,
                prioridade: descriptionMaintenance.prioridade,
                pula_fds: descriptionMaintenance.pula_fds,
                status_programacao: descriptionMaintenance.status_programacao,
                processamento: descriptionMaintenance.processamento,
                incremento: descriptionMaintenance.incremento,
                log_user: descriptionMaintenance.log_user,
              },
            });
          }

          // Ordem de Servico
          const allOrder = await tx.controle_de_ordens_de_servico.findMany({
            select: {
              ordem: true,
              data_hora_solicitacao: true,
              log_date: true,
              log_user: true,
              ID_cliente: true,
              ID_filial: true,
              id_equipamento: true,
              id_planejamento_manutencao: true,
              familia: true,
              tipo_equipamento: true,
              equipamento: true,
              modelo: true,
              descricao_solicitacao: true,
              descricao_servico_realizado: true,
              observacoes: true,
              tipo_manutencao: true,
              status_os: true,
              retorno_checklist: true,
              fechada: true,
              status_equipamento: true,
              data_prevista_termino: true,
              data_hora_encerramento: true,
              solicitante: true,
              emissor: true,
              setor_executante: true,
              hh_previsto: true,
              hh_real: true,
              custo_materiais: true,
              sessao_id: true,
              carga_h_trabalho: true,
              maquina_parada: true,
              horimetro: true,
              odometro: true,
              count_print: true,
              prioridade: true,
              data_equipamento_parou: true,
              data_acionamento_tecnico: true,
              chegada_tecnico: true,
              data_equipamento_funcionou: true,
              aux: true,
              equipment: {
                include: {
                  typeEquipment: true,
                  categoryEquipment: true,
                  family: true,
                },
              },
              descriptionMaintenance: true,
              typeMaintenance: true,
              statusOrderService: true,
              sectorExecutor: true,
              priorityOrderService: true,
            },
            where: {
              ID_cliente: branch.ID_cliente,
              ID_filial: branch.ID,
            },
          });

          for await (const order of allOrder) {
            let newEquipment = await tx.cadastro_de_equipamentos.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                ID_filial: newBranch.ID,
                equipamento_codigo: order.equipment.equipamento_codigo,
                descricao: order.equipment.descricao,
              },
            });

            if (!newEquipment) {
              if (order.equipment) {
                const equipment = order.equipment;
                const newFamily =
                  await tx.cadastro_de_familias_de_equipamento.findFirst({
                    where: {
                      familia: equipment.family.familia,
                      ID_cliente: newCompany.ID,
                      ID_filial: newBranch.ID,
                    },
                  });

                if (!newFamily) {
                  return false;
                }

                const newTypeEquipment =
                  await tx.cadastro_de_tipos_de_equipamentos.findFirst({
                    where: {
                      tipo_equipamento:
                        equipment.typeEquipment.tipo_equipamento,
                      ID_cliente: newCompany.ID,
                      ID_filial: newBranch.ID,
                    },
                  });

                if (!newTypeEquipment) {
                  return false;
                }

                let newCategoryEquipment = { id: null };

                if (equipment.id_categoria) {
                  newCategoryEquipment =
                    await tx.smartnewsystem_equipamento_categoria.findFirst({
                      where: {
                        id_cliente: newCompany.ID,
                        descricao: equipment.categoryEquipment.descricao,
                      },
                    });
                }

                newEquipment = await tx.cadastro_de_equipamentos.create({
                  data: {
                    frota: equipment.frota,
                    ID_cliente: newCompany.ID,
                    ID_filial: newBranch.ID,
                    ID_familia: newFamily.ID,
                    id_categoria: newCategoryEquipment.id,
                    ID_tipoeqto: newTypeEquipment.ID,
                    centro_custo: equipment.centro_custo,
                    equipamento_codigo: equipment.equipamento_codigo,
                    descricao: equipment.descricao,
                    familia: equipment.familia,
                    tipo_equipamento: equipment.tipo_equipamento,
                    fabricante: equipment.fabricante,
                    marca: equipment.marca,
                    n_serie: equipment.n_serie,
                    modelo: equipment.modelo,
                    ano_fabricacao: equipment.ano_fabricacao,
                    ano_modelo: equipment.ano_modelo,
                    garantia: equipment.garantia,
                    data_compra: equipment.data_compra,
                    n_nota_fiscal: equipment.n_nota_fiscal,
                    valor_aquisicao: equipment.valor_aquisicao,
                    observacoes: equipment.observacoes,
                    status_equipamento: equipment.status_equipamento,
                    log_user: equipment.log_user,
                    chassi: equipment.chassi,
                    placa: equipment.placa,
                    cor: equipment.cor,
                    n_ct_finame: equipment.n_ct_finame,
                    beneficiario: equipment.beneficiario,
                    codigo_renavam: equipment.codigo_renavam,
                    consumo_previsto: equipment.consumo_previsto,
                    tipo_consumo: equipment.tipo_consumo,
                    proprietario: equipment.proprietario,
                    tempo_sincronizacao: equipment.tempo_sincronizacao,
                  },
                });
              } else {
                return false;
              }
            }

            let newDescriptionMaintenance = { id: null };

            if (order.id_planejamento_manutencao) {
              newDescriptionMaintenance =
                await tx.sofman_descricao_planejamento_manutencao.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    descricao: order.descriptionMaintenance.descricao,
                    id_equipamento: newEquipment.ID,
                  },
                });

              if (!newDescriptionMaintenance) {
                return false;
              }
            }

            const newTypeMaintenance =
              await tx.sofman_cad_tipos_manutencao.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  //ID_filial: newBranch.ID,
                  tipo_manutencao: order.typeMaintenance.tipo_manutencao,
                },
              });

            if (!newTypeMaintenance) {
              return false;
            }

            let newPriorityOrder = { id: null };

            if (order.priorityOrderService) {
              newPriorityOrder =
                await tx.sofman_cad_prioridades_ordem_servico.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: order.priorityOrderService.descricao,
                  },
                });

              if (!newPriorityOrder) {
                return false;
              }
            }

            const newStatusOrderService =
              await tx.sofman_status_ordem_servico.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  status: order.statusOrderService.status,
                },
              });

            if (!newStatusOrderService) {
              return false;
            }

            const newSectorExecuting =
              await tx.sofman_cad_setor_executante.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  descricao: order.sectorExecutor.descricao,
                },
              });

            if (!newStatusOrderService) {
              return false;
            }

            const validOrderService =
              await tx.controle_de_ordens_de_servico.findFirst({
                where: {
                  ordem: order.ordem,
                  ID_cliente: newCompany.ID,
                  ID_filial: newBranch.ID,
                  id_equipamento: newEquipment.ID,
                  descricao_solicitacao: order.descricao_solicitacao,
                },
              });

            if (validOrderService) {
              continue;
            }

            const newOrderService =
              await tx.controle_de_ordens_de_servico.create({
                select: {
                  ID: true,
                },
                data: {
                  ordem: order.ordem,
                  data_hora_solicitacao: order.data_hora_solicitacao,
                  log_date: order.log_date,
                  log_user: order.log_user,
                  ID_cliente: newCompany.ID,
                  ID_filial: newBranch.ID,
                  id_equipamento: newEquipment.ID,
                  id_planejamento_manutencao: newDescriptionMaintenance.id,
                  familia: order.familia,
                  tipo_equipamento: order.tipo_equipamento,
                  equipamento: order.equipamento,
                  modelo: order.modelo,
                  descricao_solicitacao: order.descricao_solicitacao,
                  descricao_servico_realizado:
                    order.descricao_servico_realizado,
                  observacoes: order.observacoes,
                  tipo_manutencao: newTypeMaintenance.ID,
                  status_os: newStatusOrderService.id,
                  retorno_checklist: order.retorno_checklist,
                  fechada: order.fechada,
                  status_equipamento: order.status_equipamento,
                  data_prevista_termino: order.data_prevista_termino,
                  data_hora_encerramento: order.data_hora_encerramento,
                  solicitante: order.solicitante,
                  emissor: order.emissor,
                  setor_executante: newSectorExecuting.Id,
                  hh_previsto: order.hh_previsto,
                  hh_real: order.hh_real,
                  custo_materiais: order.custo_materiais,
                  sessao_id: order.sessao_id,
                  carga_h_trabalho: order.carga_h_trabalho,
                  maquina_parada: order.maquina_parada,
                  horimetro: order.horimetro,
                  odometro: order.odometro,
                  count_print: order.count_print,
                  prioridade: newPriorityOrder.id,
                  data_equipamento_parou: order.data_equipamento_parou,
                  data_acionamento_tecnico: order.data_acionamento_tecnico,
                  chegada_tecnico: order.chegada_tecnico,
                  data_equipamento_funcionou: order.data_equipamento_funcionou,
                  aux: order.aux,
                },
              });

            await tx.controle_de_ordens_de_servico.update({
              data: {
                ordem: order.ordem,
              },
              where: {
                ID: newOrderService.ID,
              },
            });
          }

          await tx.$executeRaw`set @exec:= null;`;
        },
        {
          timeout: 180000,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async launchMaterialImportForBranch(
    data: ISeed['launchMaterialImportForBranch'],
  ): Promise<boolean> {
    try {
      const newCompany = { ID: data.newCompanyId };
      const newBranch = { ID: data.newBranchId };

      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: data.id,
            },
          });

          const allMaterial = await tx.sofman_cad_materiais.findMany({
            include: {
              categoryMaterial: true,
            },
            where: {
              id_cliente: branch.ID_cliente,
            },
          });

          for await (const material of allMaterial) {
            let newCategoryMaterial = { id: null };

            if (material.categoryMaterial) {
              newCategoryMaterial =
                await tx.sofman_cad_categorias_materiais.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    descricao: material.categoryMaterial.descricao,
                  },
                });

              if (!newCategoryMaterial) {
                return false;
              }
            }

            const validMaterial = await tx.sofman_cad_materiais.findFirst({
              where: {
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                id_categoria: newCategoryMaterial.id,
                codigo: material.codigo,
                material: material.material,
                ativo: material.ativo,
              },
            });

            if (validMaterial) {
              continue;
            }

            await tx.sofman_cad_materiais.create({
              data: {
                id_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                id_categoria: newCategoryMaterial.id,
                codigo: material.codigo,
                material: material.material,
                ativo: material.ativo,
                tipo: material.tipo,
                unidade: material.unidade,
                valor: material.valor,
                Valor_venda: material.Valor_venda,
                fator: material.fator,
                estoque_min: material.estoque_min,
                estoque_max: material.estoque_max,
                estoque_real: material.estoque_real,
                localizacao: material.localizacao,
                log_user: material.log_user,
                DataEstoqueMin: material.DataEstoqueMin,
              },
            });
          }
        },
        {
          timeout: 2800000,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async launchProviderImportForBranch(
    data: ISeed['launchProviderImportForBranch'],
  ): Promise<boolean> {
    try {
      const newCompany = { ID: data.newCompanyId };
      const newBranch = { ID: data.newBranchId };

      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: data.id,
            },
          });

          const allProvider = await tx.sofman_cad_fornecedores.findMany({
            where: {
              ID_cliente: branch.ID_cliente,
            },
          });

          for await (const provider of allProvider) {
            const validProvider = await tx.sofman_cad_fornecedores.findFirst({
              where: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                nome_fantasia: provider.nome_fantasia,
                razao_social: provider.razao_social,
                cnpj: provider.cnpj,
              },
            });

            if (validProvider) {
              continue;
            }

            await tx.sofman_cad_fornecedores.create({
              data: {
                ID_cliente: newCompany.ID,
                id_filial: newBranch.ID,
                razao_social: provider.razao_social,
                nome_fantasia: provider.nome_fantasia,
                cnpj: provider.cnpj,
                cep: provider.cep,
                endereco: provider.cep,
                bairro: provider.bairro,
                cidade: provider.cidade,
                estado: provider.estado,
                telefone: provider.telefone,
                site: provider.site,
                log_user: provider.log_user,
                categoria: provider.categoria,
                inscricao_estadual: provider.inscricao_estadual,
                inscricao_municipal: provider.inscricao_municipal,
                dias: provider.dias,
              },
            });
          }

          return true;
        },
        {
          timeout: 180000,
        },
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async launchBuyImportForBranch(
    data: ISeed['launchBuyImportForBranch'],
  ): Promise<boolean> {
    try {
      const newCompany = { ID: data.newCompanyId };
      const newBranch = { ID: data.newBranchId };

      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: data.id,
            },
          });

          const registerQuotationLog = [];
          const logFinance = [];

          const allRequest =
            await tx.smartnewsystem_compras_numeros_fiscais.findMany({
              include: {
                provider: true,
                buy: true,
              },
              where: {
                buy: {
                  id_filial: branch.ID,
                },
              },
            });

          for await (const request of allRequest) {
            const newBuy =
              await tx.smartnewsystem_compras_solicitacao.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  numero: request.buy.numero,
                  observacao: request.buy.observacao,
                },
              });

            if (!newBuy) {
              throw 'Compras nao encontrado em pedido';
            }

            let newProvider = { ID: null };

            if (request.provider) {
              newProvider = await tx.sofman_cad_fornecedores.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  nome_fantasia: request.provider.nome_fantasia,
                  razao_social: request.provider.razao_social,
                  cnpj: request.provider.cnpj,
                },
              });

              if (!newProvider) {
                throw 'Fornecedor nao encontrado';
              }
            }

            let newRequest =
              await tx.smartnewsystem_compras_numeros_fiscais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_compra: newBuy.id,
                  id_fornecedor: newProvider.ID,
                  log_user: request.log_user,
                  numero: request.numero,
                },
              });

            if (!newRequest) {
              newRequest =
                await tx.smartnewsystem_compras_numeros_fiscais.create({
                  data: {
                    id_cliente: newCompany.ID,
                    id_compra: newBuy.id,
                    id_fornecedor: newProvider.ID,
                    log_user: request.log_user,
                    numero: request.numero,
                  },
                });
            }

            const allRequestItem =
              await tx.smartnewsystem_compras_pedidos_item.findMany({
                include: {
                  quotationItem: {
                    include: {
                      item: {
                        include: {
                          material: true,
                        },
                      },
                    },
                  },
                  status: true,
                },
                where: {
                  id_pedido: request.id,
                },
              });

            for await (const requestItem of allRequestItem) {
              const newQuotation =
                await tx.smartnewsystem_compras_cotacao.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    id_compra: newBuy.id,
                    id_fornecedor: newProvider.ID,
                  },
                });

              if (newProvider.ID === null) {
                registerQuotationLog.push(requestItem);
                continue;
              }

              if (!newQuotation) {
                throw 'nao encontrei cotacao';
              }

              const newMaterial = await tx.sofman_cad_materiais.findFirst({
                where: {
                  id_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  material: requestItem.quotationItem.item.material.material,
                },
              });

              if (!newMaterial) {
                throw 'Nenhuma material encontrado no item cotacao';
              }

              const newItem =
                await tx.smartnewsystem_compras_item_solicitacao.findFirst({
                  where: {
                    id_solicitacao: newBuy.id,
                    sequencia: requestItem.quotationItem.item.sequencia,
                    id_material: newMaterial.id,
                    quantidade: requestItem.quotationItem.item.quantidade,
                    observacao: requestItem.quotationItem.item.observacao,
                  },
                });

              if (!newItem) {
                throw 'Nenhuma item na cotacao item ';
              }

              const newRequestStatus =
                await tx.smartnewsystem_compras_pedido_status.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    status: requestItem.status.status,
                  },
                });

              if (!newRequestStatus) {
                throw 'Nenhuma status na cotacao item ';
              }

              const newQuotationItem =
                await tx.smartnewsystem_compras_cotacao_item.findFirst({
                  where: {
                    id_cotacao: newQuotation.id,
                    id_item: newItem.id,
                  },
                });

              if (!newQuotationItem) {
                throw 'nenhum cotacao item encontrado no pedido item ';
              }

              const valid =
                await tx.smartnewsystem_compras_pedidos_item.findFirst({
                  where: {
                    id_pedido: newRequest.id,
                    id_item: newQuotationItem.id,
                    id_status: newRequestStatus.id,
                  },
                });

              if (valid) {
                continue;
              }

              await tx.smartnewsystem_compras_pedidos_item.create({
                data: {
                  id_pedido: newRequest.id,
                  id_item: newQuotationItem.id,
                  id_status: newRequestStatus.id,
                  log_user: requestItem.log_user,
                },
              });
            }
            //continuar compras fornecedor

            const allBuyProvider =
              await tx.smartnewsystem_compras_pedido_fornecedor.findMany({
                include: {
                  provider: true,
                  finance: true,
                },
                where: {
                  id_pedido: request.id,
                },
              });

            for await (const buyProvider of allBuyProvider) {
              const newProvider = await tx.sofman_cad_fornecedores.findFirst({
                where: {
                  ID_cliente: newCompany.ID,
                  id_filial: newBranch.ID,
                  nome_fantasia: buyProvider.provider.nome_fantasia,
                  razao_social: buyProvider.provider.razao_social,
                  cnpj: buyProvider.provider.cnpj,
                },
              });

              if (!newProvider) {
                throw 'Fornecedor nao encontrado';
              }

              let newIssue = { ID: null };
              let newSender = { ID: null };

              if (buyProvider.finance.direcao === 'pagar') {
                const provider = await tx.sofman_cad_fornecedores.findUnique({
                  where: {
                    ID: buyProvider.finance.emitente,
                  },
                });

                newIssue = await tx.sofman_cad_fornecedores.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    nome_fantasia: provider.nome_fantasia,
                    razao_social: provider.razao_social,
                    cnpj: provider.cnpj,
                  },
                });

                if (newIssue.ID === null) {
                  throw 'financeiro nao encontrado!';
                }

                newSender.ID = newBranch.ID;
              } else {
                const provider = await tx.sofman_cad_fornecedores.findUnique({
                  where: {
                    ID: buyProvider.finance.remetente,
                  },
                });

                newSender = await tx.sofman_cad_fornecedores.findFirst({
                  where: {
                    ID_cliente: newCompany.ID,
                    id_filial: newBranch.ID,
                    nome_fantasia: provider.nome_fantasia,
                    razao_social: provider.razao_social,
                    cnpj: provider.cnpj,
                  },
                });

                if (newSender.ID === null) {
                  throw 'financeiro nao encontrado!';
                }

                newIssue.ID = newBranch.ID;
              }

              const newFinance =
                await tx.smartnewsystem_financeiro_descricao_titulos.findFirst({
                  where: {
                    id_cliente: newCompany.ID,
                    numero_fiscal: buyProvider.finance.numero_fiscal,
                    direcao: buyProvider.finance.direcao,
                    emitente: newIssue.ID,
                    remetente: newSender.ID,
                  },
                });

              if (!newFinance) {
                logFinance.push(buyProvider.finance);
                continue;
                throw 'Financeiro nao encontrado em compras pedido fornecedor';
              }

              const valid =
                await tx.smartnewsystem_compras_pedido_fornecedor.findFirst({
                  where: {
                    id_pedido: newRequest.id,
                    id_fornecedor: newProvider.ID,
                    id_finance: newFinance.id,
                  },
                });

              if (valid) {
                continue;
              }

              await tx.smartnewsystem_compras_pedido_fornecedor.create({
                data: {
                  id_pedido: newRequest.id,
                  id_fornecedor: newProvider.ID,
                  id_finance: newFinance.id,
                },
              });
            }
          }
        },
        {
          timeout: 20800000,
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createEquipmentById(
    equipmentId: number,
    branchId: number,
  ): Promise<boolean> {
    try {
      await this.prismaService.$transaction(
        async (tx) => {
          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: branchId,
            },
          });

          const equipment = await tx.cadastro_de_equipamentos.findUnique({
            include: {
              family: true,
              typeEquipment: true,
              categoryEquipment: true,
            },
            where: {
              ID: equipmentId,
            },
          });

          const newFamily =
            await tx.cadastro_de_familias_de_equipamento.findFirst({
              where: {
                familia: equipment.family.familia,
                ID_cliente: branch.ID_cliente,
                ID_filial: branch.ID,
              },
            });

          if (!newFamily) {
            return false;
          }

          const newTypeEquipment =
            await tx.cadastro_de_tipos_de_equipamentos.findFirst({
              where: {
                tipo_equipamento: equipment.typeEquipment.tipo_equipamento,
                ID_cliente: branch.ID_cliente,
                ID_filial: branch.ID,
              },
            });

          if (!newTypeEquipment) {
            return false;
          }

          let newCategoryEquipment = { id: null };

          if (equipment.id_categoria) {
            newCategoryEquipment =
              await tx.smartnewsystem_equipamento_categoria.findFirst({
                where: {
                  id_cliente: branch.ID_cliente,
                  descricao: equipment.categoryEquipment.descricao,
                },
              });
          }

          await tx.cadastro_de_equipamentos.create({
            data: {
              frota: equipment.frota,
              ID_cliente: branch.ID_cliente,
              ID_filial: branch.ID,
              ID_familia: newFamily.ID,
              id_categoria: newCategoryEquipment.id,
              ID_tipoeqto: newTypeEquipment.ID,
              centro_custo: equipment.centro_custo,
              equipamento_codigo: equipment.equipamento_codigo,
              descricao: equipment.descricao,
              familia: equipment.familia,
              tipo_equipamento: equipment.tipo_equipamento,
              fabricante: equipment.fabricante,
              marca: equipment.marca,
              n_serie: equipment.n_serie,
              modelo: equipment.modelo,
              ano_fabricacao: equipment.ano_fabricacao,
              ano_modelo: equipment.ano_modelo,
              garantia: equipment.garantia,
              data_compra: equipment.data_compra,
              n_nota_fiscal: equipment.n_nota_fiscal,
              valor_aquisicao: equipment.valor_aquisicao,
              observacoes: equipment.observacoes,
              status_equipamento: equipment.status_equipamento,
              log_user: equipment.log_user,
              chassi: equipment.chassi,
              placa: equipment.placa,
              cor: equipment.cor,
              n_ct_finame: equipment.n_ct_finame,
              beneficiario: equipment.beneficiario,
              codigo_renavam: equipment.codigo_renavam,
              consumo_previsto: equipment.consumo_previsto,
              tipo_consumo: equipment.tipo_consumo,
              proprietario: equipment.proprietario,
              tempo_sincronizacao: equipment.tempo_sincronizacao,
            },
          });
        },
        {
          timeout: 280000,
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createOrderServiceById(
    orderId: number,
    branchId: number,
  ): Promise<{ ID: null | number }> {
    const response = { ID: null };
    try {
      await this.prismaService.$transaction(
        async (tx) => {
          await tx.$executeRaw`set @exec:= false;`;

          const branch = await tx.cadastro_de_filiais.findUnique({
            where: {
              ID: branchId,
            },
          });

          const order = await tx.controle_de_ordens_de_servico.findUnique({
            include: {
              typeMaintenance: true,
              statusOrderService: true,
              priorityOrderService: true,
              descriptionMaintenance: true,
              sectorExecutor: true,
              equipment: {
                include: {
                  family: true,
                  typeEquipment: true,
                  categoryEquipment: true,
                },
              },
            },
            where: {
              ID: orderId,
            },
          });

          let newEquipment = await tx.cadastro_de_equipamentos.findFirst({
            include: {
              family: true,
              typeEquipment: true,
            },
            where: {
              ID_cliente: branch.ID_cliente,
              ID_filial: branch.ID,
              equipamento_codigo: order.equipment.equipamento_codigo,
              descricao: order.equipment.descricao,
            },
          });

          if (!newEquipment) {
            if (order.equipment) {
              const equipment = order.equipment;
              const newFamily =
                await tx.cadastro_de_familias_de_equipamento.findFirst({
                  where: {
                    familia: equipment.family.familia,
                    ID_cliente: branch.ID_cliente,
                    ID_filial: branch.ID,
                  },
                });

              if (!newFamily) {
                return false;
              }

              const newTypeEquipment =
                await tx.cadastro_de_tipos_de_equipamentos.findFirst({
                  where: {
                    tipo_equipamento: equipment.typeEquipment.tipo_equipamento,
                    ID_cliente: branch.ID_cliente,
                    ID_filial: branch.ID,
                  },
                });

              if (!newTypeEquipment) {
                return false;
              }

              let newCategoryEquipment = { id: null };

              if (equipment.id_categoria) {
                newCategoryEquipment =
                  await tx.smartnewsystem_equipamento_categoria.findFirst({
                    where: {
                      id_cliente: branch.ID_cliente,
                      descricao: equipment.categoryEquipment.descricao,
                    },
                  });
              }

              newEquipment = await tx.cadastro_de_equipamentos.create({
                include: {
                  family: true,
                  typeEquipment: true,
                },
                data: {
                  frota: equipment.frota,
                  ID_cliente: branch.ID_cliente,
                  ID_filial: branch.ID,
                  ID_familia: newFamily.ID,
                  id_categoria: newCategoryEquipment.id,
                  ID_tipoeqto: newTypeEquipment.ID,
                  centro_custo: equipment.centro_custo,
                  equipamento_codigo: equipment.equipamento_codigo,
                  descricao: equipment.descricao,
                  familia: equipment.familia,
                  tipo_equipamento: equipment.tipo_equipamento,
                  fabricante: equipment.fabricante,
                  marca: equipment.marca,
                  n_serie: equipment.n_serie,
                  modelo: equipment.modelo,
                  ano_fabricacao: equipment.ano_fabricacao,
                  ano_modelo: equipment.ano_modelo,
                  garantia: equipment.garantia,
                  data_compra: equipment.data_compra,
                  n_nota_fiscal: equipment.n_nota_fiscal,
                  valor_aquisicao: equipment.valor_aquisicao,
                  observacoes: equipment.observacoes,
                  status_equipamento: equipment.status_equipamento,
                  log_user: equipment.log_user,
                  chassi: equipment.chassi,
                  placa: equipment.placa,
                  cor: equipment.cor,
                  n_ct_finame: equipment.n_ct_finame,
                  beneficiario: equipment.beneficiario,
                  codigo_renavam: equipment.codigo_renavam,
                  consumo_previsto: equipment.consumo_previsto,
                  tipo_consumo: equipment.tipo_consumo,
                  proprietario: equipment.proprietario,
                  tempo_sincronizacao: equipment.tempo_sincronizacao,
                },
              });
            } else {
              return false;
            }
          }

          let newDescriptionMaintenance = { id: null };

          if (order.id_planejamento_manutencao) {
            newDescriptionMaintenance =
              await tx.sofman_descricao_planejamento_manutencao.findFirst({
                where: {
                  id_cliente: branch.ID_cliente,
                  id_filial: branch.ID,
                  descricao: order.descriptionMaintenance.descricao,
                  id_equipamento: newEquipment.ID,
                },
              });

            if (!newDescriptionMaintenance) {
              return false;
            }
          }

          const newTypeMaintenance =
            await tx.sofman_cad_tipos_manutencao.findFirst({
              where: {
                ID_cliente: branch.ID_cliente,
                //ID_filial: newBranch.ID,
                tipo_manutencao: order.typeMaintenance.tipo_manutencao,
              },
            });

          if (!newTypeMaintenance) {
            return false;
          }

          let newPriorityOrder = { id: null };

          if (order.priorityOrderService) {
            newPriorityOrder =
              await tx.sofman_cad_prioridades_ordem_servico.findFirst({
                where: {
                  id_cliente: branch.ID_cliente,
                  descricao: order.priorityOrderService.descricao,
                },
              });

            if (!newPriorityOrder) {
              return false;
            }
          }

          const newStatusOrderService =
            await tx.sofman_status_ordem_servico.findFirst({
              where: {
                id_cliente: branch.ID_cliente,
                status: order.statusOrderService.status,
              },
            });

          if (!newStatusOrderService) {
            return false;
          }

          const newSectorExecuting =
            await tx.sofman_cad_setor_executante.findFirst({
              where: {
                id_cliente: branch.ID_cliente,
                descricao: order.sectorExecutor.descricao,
              },
            });

          if (!newStatusOrderService) {
            return false;
          }

          const validOrderService =
            await tx.controle_de_ordens_de_servico.findFirst({
              where: {
                ordem: order.ordem,
                ID_cliente: branch.ID_cliente,
                ID_filial: branch.ID,
                id_equipamento: newEquipment.ID,
                descricao_solicitacao: order.descricao_solicitacao,
              },
            });

          if (validOrderService) {
            return true;
          }

          const newOrderService = await tx.controle_de_ordens_de_servico.create(
            {
              select: {
                ID: true,
              },
              data: {
                ordem: order.ordem,
                data_hora_solicitacao: order.data_hora_solicitacao,
                log_date: order.log_date,
                log_user: order.log_user,
                ID_cliente: branch.ID_cliente,
                ID_filial: branch.ID,
                id_equipamento: newEquipment.ID,
                id_planejamento_manutencao: newDescriptionMaintenance.id,
                familia: order.familia,
                tipo_equipamento: order.tipo_equipamento,
                equipamento: order.equipamento,
                modelo: order.modelo,
                descricao_solicitacao: order.descricao_solicitacao,
                descricao_servico_realizado: order.descricao_servico_realizado,
                observacoes: order.observacoes,
                tipo_manutencao: newTypeMaintenance.ID,
                status_os: newStatusOrderService.id,
                retorno_checklist: order.retorno_checklist,
                fechada: order.fechada,
                status_equipamento: order.status_equipamento,
                data_prevista_termino: order.data_prevista_termino,
                data_hora_encerramento: order.data_hora_encerramento,
                solicitante: order.solicitante,
                emissor: order.emissor,
                setor_executante: newSectorExecuting.Id,
                hh_previsto: order.hh_previsto,
                hh_real: order.hh_real,
                custo_materiais: order.custo_materiais,
                sessao_id: order.sessao_id,
                carga_h_trabalho: order.carga_h_trabalho,
                maquina_parada: order.maquina_parada,
                horimetro: order.horimetro,
                odometro: order.odometro,
                count_print: order.count_print,
                prioridade: newPriorityOrder.id,
                data_equipamento_parou: order.data_equipamento_parou,
                data_acionamento_tecnico: order.data_acionamento_tecnico,
                chegada_tecnico: order.chegada_tecnico,
                data_equipamento_funcionou: order.data_equipamento_funcionou,
                aux: order.aux,
              },
            },
          );

          await tx.controle_de_ordens_de_servico.update({
            data: {
              ordem: order.ordem,
            },
            where: {
              ID: newOrderService.ID,
            },
          });

          await tx.$executeRaw`set @exec:= null;`;
          response.ID = newOrderService.ID;
        },
        {
          timeout: 280000,
        },
      );

      return response;
    } catch (error) {
      console.log(error);
      return response;
    }
  }
}
