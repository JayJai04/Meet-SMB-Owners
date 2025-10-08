import { Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import { Group } from './entities/groups.entity'
import { GroupMember } from './entities/group-members.entity'
import { CreateGroupDto } from './dto/create-group.dto'
import { User } from '../users/users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GroupsService {
constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMembersRepository: Repository<GroupMember>,
){}

async createOrJoin(createGroupDto: CreateGroupDto, user: User): Promise<{ group: Group; isNewGroup: boolean; message: string }> {
    // Check if group already exists for this city
    const existingGroup = await this.groupsRepository.findOne({
        where: { cityId: createGroupDto.cityId },
        relations: ['members']
    });
    
    if (existingGroup) {
        // Group exists - check if user is already a member
        const existingMember = existingGroup.members.find(member => member.userId === user.id);

        if (existingMember) {
            throw new ConflictException('You are already a member of this group!');
        }

        // Add user to existing group
        const groupMember = new GroupMember();
        groupMember.groupId = existingGroup.id;
        groupMember.userId = user.id;
        groupMember.role = 'member';
        
        await this.groupMembersRepository.save(groupMember);

        return {
            group: existingGroup,
            isNewGroup: false,
            message: 'Successfully joined existing group!'
        };
    } else {
        // Group doesn't exist - create new group
        const newGroup = new Group();
        newGroup.groupName = createGroupDto.groupName;
        newGroup.admin = user;
        newGroup.cityId = createGroupDto.cityId;

        const savedGroup = await this.groupsRepository.save(newGroup);

        // Add creator as admin member
        const groupMember = new GroupMember();
        groupMember.groupId = savedGroup.id;
        groupMember.userId = user.id;
        groupMember.role = 'admin';
        
        await this.groupMembersRepository.save(groupMember);

        return {
            group: savedGroup,
            isNewGroup: true,
            message: 'Successfully created new group!'
        };
    }
}

async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const group = await this.groupsRepository.findOne({
        where: { id: groupId },
        relations: ['members', 'members.user']
    });
    
    return group ? group.members : [];
}

async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = await this.groupMembersRepository.find({
        where: { userId },
        relations: ['group']
    });
    
    return memberships.map(membership => membership.group);
}
}