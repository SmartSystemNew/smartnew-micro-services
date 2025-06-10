import IServiceOrder from 'src/models/IServiceOrder';
import { DateService } from './data.service';
/**
 * This function retrieves the key associated with a given value in a mapper object.
 *
 * @param valueToFind - The value to search for in the mapper object.
 * @param mapper - A record (object) that maps values to keys.
 *
 * @returns The key associated with the given value in the mapper object.
 * If the value is not found in the mapper, it returns `undefined`.
 *
 * @example
 * const mapper = {
 *   'value1': 'key1',
 *   'value2': 'key2',
 *   'value3': 'key3',
 * };
 *
 * const valueToFind = 'value2';
 * const key = getKeyMapper(valueToFind, mapper);
 * // key will be: 'key2'
 */
export function getKeyMapper(
  valueToFind: string,
  mapper: Record<string, string>,
): string {
  const key = Object.keys(mapper).find((key) => mapper[key] === valueToFind);
  return key;
}
/**
 * This function maps an array of values to their corresponding keys in a given mapper object.
 *
 * @param valuesToFind - An array of values to be mapped.
 * @param mapper - A record (object) that maps values to keys.
 *
 * @returns A new array containing the corresponding keys for each value in the input array.
 * If a value does not have a corresponding key in the mapper, it will be mapped to `undefined`.
 *
 * @example
 * const mapper = {
 *   'value1': 'key1',
 *   'value2': 'key2',
 *   'value3': 'key3',
 * };
 *
 * const valuesToFind = ['value1', 'value2', 'value4'];
 * const mappedValues = getArrayMapper(valuesToFind, mapper);
 * // mappedValues will be: ['key1', 'key2', undefined]
 */
export function getArrayMapper(
  valuesToFind: string[],
  mapper: Record<string, string>,
): string[] {
  return (
    valuesToFind &&
    valuesToFind.map((value) => {
      return getKeyMapper(value, mapper);
    })
  );
}
/**
 * This function reverses a given mapper object.
 * It swaps the keys and values of the original mapper, creating a new object where the original values become keys and the original keys become values.
 *
 * @param mapper - A record (object) that maps field names from one system to another.
 * @returns A new record (object) where the keys and values of the original mapper are swapped.
 *
 * @example
 * const originalMapper = {
 *   id: 'ID',
 *   description: 'Descricao',
 * };
 *
 * const reversedMapper = reverseMapper(originalMapper);
 * // reversedMapper will be: { ID: 'id', Descricao: 'description' }
 */
export function reverseMapper(mapper: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(mapper).map(([mappedKey, key]) => [key, mappedKey]),
  );
}
/**
 * This function maps the properties of an input object based on a given mapper object.
 * It creates a new object with the keys and values swapped according to the mapper.
 *
 * @param obj - The input object from which properties will be mapped.
 * @param mapper - A record (object) that maps field names from the input object to their corresponding new field names.
 *
 * @returns A new object with the properties mapped according to the provided mapper.
 *
 * @example
 * const inputObject = {
 *   id: 1,
 *   description: 'Example',
 * };
 *
 * const mapper = {
 *   id: 'ID',
 *   description: 'Descricao',
 * };
 *
 * const mappedObject = setMapper(inputObject, mapper);
 * // mappedObject will be: { ID: 1, Descricao: 'Example' }
 */
export function setMapper(obj: any, mapper: Record<string, string>) {
  if (Object.keys(obj).length === 0) {
    return obj;
  }
  const result = Object.fromEntries(
    Object.entries(obj).map(([key, data]) => {
      let newkey = mapper[key];
      if (newkey === undefined) {
        newkey = key;
      }
      if (
        data !== null &&
        data !== undefined &&
        typeof data === 'object' &&
        !(data instanceof Date) &&
        !Array.isArray(data)
      ) {
        if (isNaN(data as any)) {
          return [newkey, setMapper(data, GenericMapper)];
        }
      }
      return [newkey, data];
    }),
  );
  return result;
}

export function unSetMapper(obj: any, mapper: Record<string, string>) {
  const newMapper = reverseMapper(mapper);
  return setMapper(obj, newMapper);
}
export function removeExtraFields(data: any, fields: string[]) {
  for (const key in data) {
    if (!fields.includes(key)) {
      delete data[key];
    }
  }
  return data;
}

type TMapJustification = {
  id: number;
  user: string;
  statusOld: {
    id: number;
    status: string;
    cor: string;
    corFont: string;
  } | null;
  statusNew: {
    id: number;
    status: string;
    cor: string;
    corFont: string;
  } | null;
  justification: string;
  date: string;
};

export function mapJustification(
  justificationStatus: IServiceOrder['listServiceOrder']['justifyStatus'],
): TMapJustification {
  if (justificationStatus.length === 0) {
    return null;
  }
  const dateService = new DateService();

  const lastJustification = justificationStatus[justificationStatus.length - 1];
  return {
    id: lastJustification.id,
    user: lastJustification.login,
    statusOld: lastJustification.id_status_antigo
      ? {
          id: lastJustification.id_status_antigo,
          status: lastJustification.status_old_service_order.status,
          cor: lastJustification.status_old_service_order.cor,
          corFont: lastJustification.status_old_service_order.cor_font,
        }
      : null,
    statusNew: lastJustification.id_status_novo
      ? {
          id: lastJustification.id_status_novo,
          status: lastJustification.status_new_service_order.status,
          cor: lastJustification.status_new_service_order.cor,
          corFont: lastJustification.status_new_service_order.cor_font,
        }
      : null,
    justification: lastJustification.justificativa,
    date: dateService
      .dayjs(lastJustification.log_date)
      .add(3, 'h')
      .format('DD/MM/YYYY HH:mm:ss'),
  };
}

const GenericMapper = {
  id: 'id',
  ID: 'id',
  Id: 'id',
  descricao: 'description',
  observacoes: 'comments',
  tarefas: 'tasks',
  data: 'date',
  log_date: 'dateEmission',
  log_user: 'username',
  nome: 'name',
  tipo_manutencao: 'typeMaintenance',
  id_cliente: 'idClient',
  ID_filial: 'idBranch',
  id_filial: 'idBranch',
  padrao: 'default',
  solicitante: 'requester',
  descricao_solicitacao: 'descriptionRequest',
  departamento: 'department',
  equipamento: 'equipment',
  modelo: 'model',
  mantenedores: 'maintainers',
  unidade: 'unit',
  componente: 'component',
  codigo: 'code',
  filial_numero: 'branchNumber',
  razao_social: 'companyName',
  equipamento_codigo: 'codeEquipment',
  custo: 'cost',
  valor_unitario: 'valueUnit',
  anexo: 'attachment',
  numero_serie: 'serialNumber',
};

export const NoteServiceOrderMapper = {
  id: 'id',
  descricao: 'description',
  observacoes: 'comments',
  tarefas: 'tasks',
  data: 'date',
  data_hora_inicio: 'dateStartHour',
  data_hora_inicio_timestamp: 'dateStartHourTimestamp',
  data_hora_termino: 'dateEndHour',
  data_hora_termino_timestamp: 'dateEndHourTimestamp',
  tempo_real: 'realTime',
  valor_hora: 'hourValue',
  tipo_manutencao: 'typeMaintenance',
  finalizado: 'finished',
  id_projeto: 'idProject',
  log_date: 'dateEmission',
  log_user: 'username',
  aux: 'aux',
  id_ordem: 'idServiceOrder',
  serviceOrder: 'relatedServiceOrder',
  id_status_os: 'idStatusServiceOrder',
  statusServiceOrder: 'relatedStatusServiceOrder',
  id_equipamento: 'idEquipment',
  equipment: 'relatedEquipment',
  id_cliente: 'idClient',
  company: 'relatedCompany',
  id_filial: 'idBranch',
  branch: 'relatedBranch',
  id_colaborador: 'idEmployee',
  employee: 'relatedEmployee',
};

export const NoteStopServiceOrderMapper = {
  id: 'id',
  data_hora_stop: 'dateEndHour',
  data_hora_start: 'dateStartHour',
  observacoes: 'comments',
  entrada: 'entrance',
  log_user: 'username',
  log_date: 'dateEmission',
  id_equipamento: 'idEquipment',
  equipment: 'relatedEquipment',
  id_ordem_servico: 'idServiceOrder',
  serviceOrder: 'relatedServiceOrder',
  id_causa: 'idCause',
  failureCause: 'relatedFailureCauseCause',
  id_setor_executante: 'idSectorExecutor',
  sectorExecutor: 'relatedSectorExecutor',
  id_lote: 'idBatch',
  noteStopBatch: 'relatedNoteStopBatch',
};

export const TypeMaintenanceMapper = {
  ID: 'id',
  ID_cliente: 'idClient',
  ID_filial: 'idBranch',
  sigla: 'sail',
  tipo_manutencao: 'typeMaintenance',
  padrao: 'default',
  id_grupo: 'idGroup',
  status: 'status',
  ordem_programada: 'programServiceOrder',
  observacoes: 'comments',
  notifica_encerramento: 'notificaClosure',
  incluir_solicitacao: 'includeRequest',
  id_plano_padrao: 'idDefaultPlan',
  log_user: 'username',
  log_date: 'dateEmission',
  aux: 'aux',
};

export const SectorExecutingMapper = {
  Id: 'id',
  id_cliente: 'idClient',
  id_grupo: 'idGroup',
  descricao: 'description',
  padrao: 'default',
  log_user: 'logUser',
  log_date: 'dateEmission',
};

export const ServiceOrderMapper = {
  ID: 'id',
  ordem: 'codeServiceOrder',
  data_hora_solicitacao: 'dateTimeRequest',
  data_hora_solicitacao_timestamp: 'dateTimeRequestTimestamp',
  log_user: 'username',
  log_date: 'dateEmission',
  log_date_timestamp: 'dateEmissionTimestamp',
  id_ordem_pai: 'idServiceOrderFather',
  ID_cliente: 'idClient',
  ID_filial: 'idBranch',
  id_equipamento: 'idEquipment',
  id_programacao: 'idProgram',
  id_cronograma: 'idSchedule',
  id_plano_manutencao: 'idMaintenancePlan',
  id_planejamento_manutencao: 'idPlanningMaintenance',
  ID_centro_custo: 'idCostCenter',
  ID_predio: 'idBuilding',
  ID_setor: 'idSector',
  ID_departamento: 'idDepartment',
  ID_familia: 'idFamilyEquipment',
  ID_tipo_eqto: 'idTypeEquipment',
  ordem_vinculada: 'LinkServiceOrder',
  filial: 'branch',
  predio: 'building',
  setor: 'sector',
  departamento: 'department',
  familia: 'familyEquipment',
  tipo_equipamento: 'typeEquipment',
  equipamento: 'equipment',
  modelo: 'model',
  descricao_solicitacao: 'descriptionRequest',
  descricao_servico_realizado: 'descriptionServicePerformed',
  observacoes: 'comments',
  observacoes_executante: 'observationsExecutor',
  tipo_manutencao: 'idTypeMaintenance',
  id_tpm_etiqueta: 'idTpmTAG',
  tpm_numero_etiqueta: 'codeTag',
  status_os: 'idStatusServiceOrder',
  retorno_checklist: 'returnCheckList',
  fechada: 'closed',
  status_equipamento: 'statusEquipment',
  status_cronograma: 'statusSchedule',
  status_execucao: 'statusExecutante',
  data_prevista_termino: 'dateExpectedEnd',
  data_inicio: 'dateStart',
  data_hora_encerramento: 'dateEnd',
  solicitante: 'requester',
  emissor: 'emission',
  id_subgrupo: 'idSubGroup',
  setor_executante: 'idSectorExecutor',
  mantenedores: 'maintainers',
  hh_previsto: 'hourPrev',
  hh_real: 'hourReal',
  custo_previsto: 'costPredicted',
  custo_horas: 'costHours',
  custo_materiais: 'costMaterial',
  custos_lancados: 'costReleased',
  tempo_maq_parada: 'timeMachineStop',
  dias_vencimento: 'dueDate',
  img_vencimento: 'imageExpiration',
  localizacao: 'location',
  cod_plano_manutencao: 'codePlanoMaintenance',
  sessao_id: 'idSession',
  carga_h_trabalho: 'hourWorkLoad',
  escala_trabalho: 'workScale',
  InicioFuncionamento: 'startOperation',
  TerminoFuncionamento: 'EndOperation',
  observacoes_cliente: 'clientComments',
  nota_avalicao_servico: 'noteEvaluationService',
  id_projeto: 'idProject',
  id_plano_acao: 'idActionPlan',
  maquina_parada: 'machineStop',
  horimetro: 'hourMeter',
  odometro: 'odometer',
  count_print: 'countPrint',
  prioridade: 'priority',
  classificacao: 'classification',
  data_equipamento_parou: 'dateEquipmentStop',
  data_acionamento_tecnico: 'dateTechnicalActivation',
  chegada_tecnico: 'arrivalTechnician',
  data_equipamento_funcionou: 'dateEquipmentWorked',
  ocorrencia: 'occurrence',
  causa_motivo: 'causeReason',
  status_falha: 'statusFailure',
  servico_pendente: 'servicePending',
  possui_anexo: 'hasAttachment',
  id_solicitacao_servico: 'idServiceRequest',
  id_registro_producao: 'idProductionRegistration',
  aux: 'aux',
  id_solicitante: 'idRequester',
  requester: 'relatedRequester',
};

export const MaterialMapper = {
  id: 'id',
  id_cliente: 'idClient',
  id_filial: 'idBranch',
  id_categoria: 'idCategory',
  codigo: 'code',
  unidade: 'unit',
  ativo: 'active',
  valor: 'value',
  Valor_venda: 'valueSales',
  fator: 'factors',
  estoque_min: 'stockMin',
  estoque_max: 'stockMax',
  estoque_real: 'stockCurrency',
  localizacao: 'location',
  log_date: 'dateEmission',
  log_user: 'username',
  sessao_id: 'idSession',
  DataEstoqueMin: 'dateStockMin',
};
export const MaterialServiceOrderMapper = {
  id: 'id',
  id_cliente: 'idClient',
  id_filial: 'idBranch',
  id_ordem_servico: 'idServiceOrder',
  id_tarefa_plano: 'idPlanTask',
  id_programacao_r2: 'idProgrammingR2',
  id_equipamento: 'idEquipment',
  categoria: 'category',
  codigo: 'code',
  material: 'idMaterial',
  id_codigo: 'idSecondary',
  quantidade: 'quantity',
  unidade: 'unit',
  valor_unidade: 'valueUnit',
  valor_total: 'valueTotal',
  utilizado: 'utilized',
  observacao: 'comments',
  data_uso: 'dateUse',
  n_serie_antigo: 'serialNumberOld',
  n_serie_novo: 'serialNumberNew',
  log_date: 'dateEmission',
  log_user: 'username',
  sessao_id: 'idSession',
  sofman_cad_materiais: 'relatedMaterial',
};
export const CostServiceOrderMapper = {
  id: 'id',
  id_ordem_servico: 'idServiceOrder',
  id_descricao_custo: 'idDescriptionCost',
  quantidade: 'quantity',
  valor_unitario: 'valueUnit',
  custo: 'cost',
  data_custo: 'dateCost',
  observacoes: 'comments',
  log_user: 'username',
  log_date: 'dateEmission',
  descriptionCostServiceOrder: 'relatedDescriptionCostServiceOrder',
};
export const FailureAnalysisServiceOrderMapper = {
  id: 'id',
  id_cliente: 'idClient',
  id_filial: 'idBranch',
  id_ordem_servico: 'idServiceOrder',
  id_familia: 'idFamilyEquipment',
  id_tipo_equipamento: 'idTypeEquipment',
  id_equipamento: 'idEquipment',
  id_componente: 'idComponent',
  id_sintoma: 'idSymptom',
  id_causa: 'idCause',
  id_acao: 'idAction',
  log_user: 'username',
  log_date: 'dateEmission',
  components: 'relatedComponent',
  failureSymptoms: 'relatedFailureSymptoms',
  failureCause: 'relatedFailureCause',
  failureAction: 'relatedFailureAction',
};
export const AttachmentsServiceOrderMapper = {
  id: 'id',
  id_cliente: 'idClient',
  id_filial: 'idBranch',
  id_ordem_servico: 'idServiceOrder',
  anexo: 'attachment',
  nome_anexo: 'nameAttachment',
  tamanho_anexo: 'sizeAttachment',
  observacao: 'comments',
  log_date: 'dateLog',
  log_user: 'username',
  url: 'url',
};
export const EquipmentMapper = {
  ID: 'id',
  tag_vinculada: 'idLinkTag',
  ID_cliente: 'idClient',
  ID_filial: 'idBranch',
  id_centro_custo: 'idCostCenter',
  ID_predios: 'idBuilding',
  ID_setores: 'idSector',
  ID_departamentos: 'idDepartment',
  ID_familia: 'idFamilyEquipment',
  id_categoria: 'idCategory',
  ID_tipoeqto: 'idTypeEquipment',
  centro_custo: 'CostCenter',
  equipamento_codigo: 'codeEquipment',
  n_patrimonio: 'numberHeritage',
  descricao: 'description',
  ficha_tecnica: '',
  familia: 'familyEquipment',
  tipo_equipamento: 'typeEquipment',
  localizacao: 'location',
  predio: 'building',
  setor: 'sector',
  departamento: 'department',
  fabricante: 'factor',
  marca: 'brand',
  n_serie: 'serialNumber',
  modelo: 'model',
  ano_fabricacao: 'yearFabric',
  ano_modelo: 'yearModel',
  garantia: 'guarantee',
  data_compra: 'datePurchase',
  n_nota_fiscal: 'numberInvoice',
  valor_aquisicao: 'valueAcquisition',
  carga_h_trabalho: 'hourWorkLoad',
  InicioFuncionamento: 'startOperation',
  TerminoFuncionamento: 'EndOperation',
  custo_hora: 'costHours',
  observacoes: 'comments',
  status_equipamento: 'statusEquipment',
  status_cronograma: 'statusSchedule',
  log_user: 'username',
  log_date: 'dateEmission',
  tipo_os_plano: 'typePlanServiceOrder',
  tipo_emissao_os: 'typeEmissionServiceOrder',
  chassi: 'chassis',
  placa: 'plate',
  cor: 'color',
  n_ct_finame: 'numberCtFiname',
  beneficiario: 'recipient',
  codigo_renavam: 'CodeRenavam',
  numero_crv: 'numberCrv',
  data_emisao_crv: 'dateEmissionCrv',
  licenciamento: 'licensing',
  apolice_seguro: 'insurancePolicy',
  vencimento_apolice_seguro: 'dateDueInsurancePolicy',
  tipo_fluido: 'typeFluid',
  quantidade_fluido: 'quantityFluid',
  imagem: 'image',
  status_funcionamento: 'statusOperation',
  classificacao: 'classification',
  criticidade: 'criticism',
  id_unidade_medida: 'idUnitMetric',
  limite_dia_unidade_medida: 'dateLimitUnitMetric',
  aux: 'aux',
  contador_abastecimento: 'supplyAccountant',
  consumo_previsto: 'plannedConsumption',
  tipo_consumo: 'typeConsumption',
  proprietario: 'propriety',
  frota: 'fleet',
  contador_arla: 'accountantArla ',
  tempo_sincronizacao: 'timeSynchronization',

  company: 'relatedClient',
  branch: 'relatedBranch',
  costCenter: 'relatedCostCenter',
  family: 'relatedFamilyEquipment',
  typeEquipment: 'relatedTypeEquipment',
  unityPlans: 'relatedUnityPlans',
};
export const PlanDescriptionMapper = {
  id: 'id',
  id_cliente: 'idClient',
  id_subgrupo: 'idSubGroup',
  filiais: 'branch',
  id_familia: 'idFamilyEquipe',
  descricao: 'description',
  logo: 'logo',
  log_date: 'dateEmission',
  log_user: 'username',
  familyEquipment: 'relatedFamilyEquipment',
  subGroup: 'relatedSubGroup',
  plan_x_branch: 'relatedPlanXBranch',
  plans: 'relatedPlans',
};
export const PlanMaintenanceMapper = {
  ID: 'id',
  id_plano_prev: 'idPlanDescription',
  seq: 'order',
  id_setor_executante: 'idSectorExecutor',
  id_componente: 'idComponent',
  unidade_dia: 'unitDay',
  periodicidade_dias: 'periodicityDay',
  obrigatorio: 'required',
  Tempo_hh: 'timeHH',
  requer_imagem: 'requireImage',
  log_date: 'dateEmission',
  log_user: 'username',
};

export const SubGroupMapper = {
  id: '',
  id_filial: 'idBranch',
  descricao: 'description',
  users: 'users',
  log_user: 'username',
  log_date: 'dateEmission',
};
