import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import {GroupsService} from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/groups.entity';
import { GroupMember } from './entities/group-members.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Group, GroupMember])],
    controllers: [GroupsController],
    providers: [GroupsService]
})
export class GroupsModule {
}