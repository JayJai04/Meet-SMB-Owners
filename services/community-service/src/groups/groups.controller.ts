import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto} from './dto/create-group.dto';
import { User } from '../users/users.entity';
import { Group } from './entities/groups.entity';
import { GroupMember } from './entities/group-members.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator'

@Controller('groups')
export class GroupsController {
    constructor (
        private readonly groupsService: GroupsService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createOrJoin(@Body() createGroupDto: CreateGroupDto, @GetUser() user: User) {
        return this.groupsService.createOrJoin(createGroupDto, user);
    }

    @Get('my-groups')
    @UseGuards(JwtAuthGuard)
    async getMyGroups(@GetUser() user: User): Promise<Group[]> {
        return this.groupsService.getUserGroups(user.id);
    }

    @Get(':groupId/members')
    @UseGuards(JwtAuthGuard)
    async getGroupMembers(@Param('groupId') groupId: string): Promise<GroupMember[]> {
        return this.groupsService.getGroupMembers(groupId);
    }
}
