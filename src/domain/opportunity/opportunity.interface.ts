import { IActorGroup } from '../actor-group/actor-group.interface';
import { IAspect } from '../aspect/aspect.interface';
import { IProfile } from '../profile/profile.interface';
import { IProject } from '../project/project.interface';
import { IRelation } from '../relation/relation.interface';
import { IUserGroup } from '../user-group/user-group.interface';

export interface IOpportunity {
  id: number;
  name: string;
  textID: string;
  state: string;
  projects?: IProject[];
  actorGroups?: IActorGroup[];
  profile: IProfile;
  groups?: IUserGroup[];
  restrictedActorGroupNames: string[];
  restrictedGroupNames: string[];
  aspects?: IAspect[];
  relations?: IRelation[];
}
