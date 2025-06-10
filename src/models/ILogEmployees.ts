export default interface ILogEmployees {
  listByClient: {
    id: number;
    id_colaborador: number;
    acao: string;
    nome: string;
    status: string;
    collaborator: {
      id: number;
      user: {
        login: string;
        name: string;
      }[];
    };
  };
}
