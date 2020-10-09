import { Inject } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { Args } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserGroup } from '../user-group/user-group.entity';
import { OrganisationService } from './organisation.service';

@Resolver()
export class OrganisationResolver {
  constructor(
    @Inject(OrganisationService)
    private organisationService: OrganisationService
  ) {}

  ///// Mutations /////
  @Mutation(() => UserGroup, {
    description:
      'Creates a new user group for the organisation with the given id',
  })
  async createGroupOnOrganisation(
    @Args({ name: 'orgID', type: () => Float }) orgID: number,
    @Args({ name: 'groupName', type: () => String }) groupName: string
  ): Promise<UserGroup> {
    const group = await this.organisationService.createGroup(orgID, groupName);
    return group;
  }
}
