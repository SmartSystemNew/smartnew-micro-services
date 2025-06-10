export default interface IUserGroup {
  listByGroup: {
    login: string;
    users: {
      name: string;
      login: string;
    };
  };
}
