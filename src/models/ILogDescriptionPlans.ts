export default interface ILogDescriptionPlans {
  listByDescriptionPlans: {
    id: number;
    id_cliente: number;
    id_subgrupo: number;
    id_familia: string;
    filiais: string;
    id_descricao_planos: number;
    id_app: string;
    descricao: string;
    acao: string;
    logo: Uint8Array<ArrayBufferLike>;
    log_date: Date;
    log_user: string;
    descriptionPlans: {
      plans: {
        task: {
          id: number;
          tarefa: string;
        };
      }[];
    };
  };
}
