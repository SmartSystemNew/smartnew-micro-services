import {
  cadastro_de_familias_de_equipamento,
  sofman_cad_localizacoes,
} from '@prisma/client';

export interface ICheckListListByClient {
  id: number;
  descricao: string;
  familyEquipment: cadastro_de_familias_de_equipamento;
  location: sofman_cad_localizacoes;
  automatico: number;
  periocidade: number;
  data_base: Date;
  antecipacao: number;
  hora_base: number;
  typePeriodicity: {
    id: number;
    descricao: string;
  };
  checkListItens: {
    id: number;
    checkListTask: {
      id: number;
      descricao: string;
    };
    checkListControl: {
      id: number;
      descricao: string;
    };
  }[];
}

export interface ICheckList {
  findById: {
    id: number;
    descricao: string;
    familyEquipment: cadastro_de_familias_de_equipamento;
    location: sofman_cad_localizacoes;
    automatico: number;
    periocidade: number;
    data_base: Date;
    antecipacao: number;
    hora_base: number;
    verifica_finalizado: number | null;
    typePeriodicity: {
      id: number;
      descricao: string;
    };
    checkListItens: {
      id: number;
      checkListControl: {
        id: number;
        descricao: string;
      };
      checkListTask: {
        id: number;
        descricao: string;
      };
    }[];
    boundPeriodicity: {
      id: number;
      equipment: {
        ID: number;
        equipamento_codigo: string;
        descricao: string;
      } | null;
      diverse: {
        id: number;
        localizacao: string;
      } | null;
    }[];
  };
  findByFamilyAndDescription: {
    id: number;
    descricao: string;
    familyEquipment: cadastro_de_familias_de_equipamento;
    location: sofman_cad_localizacoes;
  };
  findByLocationAndDescription: {
    id: number;
    descricao: string;
    familyEquipment: cadastro_de_familias_de_equipamento;
    location: sofman_cad_localizacoes;
  };
}
