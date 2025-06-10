import IUserGroup from 'src/models/IUserGroup';

export default abstract class UserGroupRepository {
  abstract listByGroup(groupId: number): Promise<IUserGroup['listByGroup'][]>;
}
