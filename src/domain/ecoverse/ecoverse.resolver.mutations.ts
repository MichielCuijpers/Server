import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Args, Mutation } from '@nestjs/graphql/dist/decorators';
import { GqlAuthGuard } from '../../utils/authentication/graphql.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Profiling } from '../../utils/logging/logging.profiling.decorator';
import { ChallengeInput } from '../challenge/challenge.dto';
import { Challenge } from '../challenge/challenge.entity';
import { IChallenge } from '../challenge/challenge.interface';
import { OrganisationInput } from '../organisation/organisation.dto';
import { Organisation } from '../organisation/organisation.entity';
import { IOrganisation } from '../organisation/organisation.interface';
import { TemplateInput } from '../template/template.dto';
import { Template } from '../template/template.entity';
import { ITemplate } from '../template/template.interface';
import {
  RestrictedGroupNames,
  UserGroup,
} from '../user-group/user-group.entity';
import { IUserGroup } from '../user-group/user-group.interface';
import { UserInput } from '../user/user.dto';
import { User } from '../user/user.entity';
import { IUser } from '../user/user.interface';
import { EcoverseInput } from './ecoverse.dto';
import { Ecoverse } from './ecoverse.entity';
import { IEcoverse } from './ecoverse.interface';
import { EcoverseService } from './ecoverse.service';

@Resolver()
export class EcoverseResolverMutations {
  constructor(
    @Inject(EcoverseService) private ecoverseService: EcoverseService
  ) {}

  @Roles(RestrictedGroupNames.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserGroup, {
    description: 'Creates a new user group at the ecoverse level',
  })
  @Profiling.api
  async createGroupOnEcoverse(
    @Args({ name: 'groupName', type: () => String }) groupName: string
  ): Promise<IUserGroup> {
    const group = await this.ecoverseService.createGroup(groupName);
    return group;
  }

  @Roles(RestrictedGroupNames.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Ecoverse, {
    description: 'Updates the Ecoverse with the provided data',
  })
  @Profiling.api
  async updateEcoverse(
    @Args('ecoverseData') ecoverseData: EcoverseInput
  ): Promise<IEcoverse> {
    const ctVerse = await this.ecoverseService.update(ecoverseData);
    return ctVerse;
  }

  @Roles(
    RestrictedGroupNames.CommunityAdmins,
    RestrictedGroupNames.EcoverseAdmins
  )
  @UseGuards(GqlAuthGuard)
  @Mutation(() => User, {
    description:
      'Creates a new user as a member of the ecoverse, including an account if enabled',
  })
  @Profiling.api
  async createUser(@Args('userData') userData: UserInput): Promise<IUser> {
    const user = await this.ecoverseService.createUser(userData);
    return user;
  }

  @Roles(RestrictedGroupNames.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Template, {
    description:
      'Creates a new template for the population of entities within tis ecoverse',
  })
  @Profiling.api
  async createTemplate(
    @Args('templateData') templateData: TemplateInput
  ): Promise<ITemplate> {
    const user = await this.ecoverseService.createTemplate(templateData);
    return user;
  }

  @Roles(
    RestrictedGroupNames.CommunityAdmins,
    RestrictedGroupNames.EcoverseAdmins
  )
  @UseGuards(GqlAuthGuard)
  @Mutation(() => User, {
    description:
      'Creates a new user as a member of the ecoverse, without an account',
  })
  @Profiling.api
  async createUserProfile(
    @Args('userData') userData: UserInput
  ): Promise<IUser> {
    const user = await this.ecoverseService.createUserProfile(userData);
    return user;
  }

  @Roles(
    RestrictedGroupNames.CommunityAdmins,
    RestrictedGroupNames.EcoverseAdmins
  )
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Removes the specified user from the ecoverse',
  })
  @Profiling.api
  async removeUser(@Args('userID') userID: number): Promise<boolean> {
    const success = await this.ecoverseService.removeUser(userID);
    return success;
  }

  @Roles(RestrictedGroupNames.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Challenge, {
    description: 'Creates a new challenge and registers it with the ecoverse',
  })
  @Profiling.api
  async createChallenge(
    @Args('challengeData') challengeData: ChallengeInput
  ): Promise<IChallenge> {
    const challenge = await this.ecoverseService.createChallenge(challengeData);

    return challenge;
  }

  @Roles(RestrictedGroupNames.EcoverseAdmins)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Organisation, {
    description:
      'Creates a new organisation and registers it with the ecoverse',
  })
  @Profiling.api
  async createOrganisation(
    @Args('organisationData') organisationData: OrganisationInput
  ): Promise<IOrganisation> {
    const organisation = await this.ecoverseService.createOrganisation(
      organisationData
    );

    return organisation;
  }
}
