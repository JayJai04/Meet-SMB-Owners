import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import {GroupsService} from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/groups.entity';
import { GroupMember } from './entities/group-members.entity';
import { LocationsModule } from '../locations/locations.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Group, GroupMember]),
        LocationsModule
    ],
    controllers: [GroupsController],
    providers: [GroupsService],
    exports: [GroupsService]
})
export class GroupsModule {
}