import { IChallenge } from '../challenge/challenge.interface';
import { IDID } from '../did/did.interface';
import { ITag } from '../tag/tag.interface';
import { IUserGroup } from '../user-group/user-group.interface';
import { IUser } from '../user/user.interface';

export interface IOrganisation {
  id: number;
  name: string;
  DID: IDID;
  tags?: ITag[];
  members?: IUser[];
  challenges?: IChallenge[];
  groups?: IUserGroup[];
  restrictedGroupNames?: string[];
}