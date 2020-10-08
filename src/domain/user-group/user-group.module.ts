import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupResolver } from './user-group.resolver';

@Module({
  imports: [],
  providers: [UserGroupService, UserGroupResolver],
  exports: [UserGroupService],
})
export class UserGroupModule {}
