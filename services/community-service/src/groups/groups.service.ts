import { Injectable, ConflictException} from '@nestjs/common';
import { Group } from './entities/groups.entity'
import { GroupMember } from './entities/group-members.entity'
import { CreateGroupDto } from './dto/create-group.dto'
import { User } from '../users/users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LocationsService } from '../locations/locations.service'

@Injectable()
export class GroupsService {
constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMembersRepository: Repository<GroupMember>,
    private readonly locationsService: LocationsService
){}

async createOrJoin(createGroupDto: CreateGroupDto, user: User): Promise<{ group: Group; isNewGroup: boolean; message: string }> {
    console.log(`Checking for existing group in city ${createGroupDto.cityId}`);
    
    // Check if group already exists for this city
    const existingGroup = await this.groupsRepository.findOne({
        where: { cityId: createGroupDto.cityId },
        relations: ['members']
    });
    
    console.log(`Existing group found:`, existingGroup ? 'Yes' : 'No');
    
    if (existingGroup) {
        console.log(`Group ${existingGroup.groupName} exists with ${existingGroup.members.length} members`);
        
        // Group exists - check if user is already a member
        const existingMember = existingGroup.members.find(member => member.userId === user.id);

        if (existingMember) {
            console.log(`User ${user.email} is already a member of group ${existingGroup.groupName}`);
            throw new ConflictException('You are already a member of this group!');
        }

        console.log(`Adding user ${user.email} to existing group ${existingGroup.groupName}`);
        
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
        console.log(`Creating new group: ${createGroupDto.groupName} for city ${createGroupDto.cityId}`);
        
        // Group doesn't exist - create new group
        const newGroup = new Group();
        newGroup.groupName = createGroupDto.groupName;
        newGroup.adminId = user.id;
        newGroup.cityId = createGroupDto.cityId;

        const savedGroup = await this.groupsRepository.save(newGroup);
        console.log(`Created new group: ${savedGroup.id}`);

        // Add creator as admin member
        const groupMember = new GroupMember();
        groupMember.groupId = savedGroup.id;
        groupMember.userId = user.id;
        groupMember.role = 'admin';
        
        await this.groupMembersRepository.save(groupMember);
        console.log(`Added user ${user.email} as admin to new group`);

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

async getUserGroups(userId: string): Promise<any[]> {
    const memberships = await this.groupMembersRepository.find({
        where: { userId },
        relations: ['group']
    });
    
    const groupsWithDetails = await Promise.all(
        memberships.map(async (membership) => {
            const group = membership.group;
            
            // Get city information
            const city = await this.locationsService.findCityById(group.cityId);
            
            // Get member count
            const memberCount = await this.groupMembersRepository.count({
                where: { groupId: group.id }
            });
            
            // Transform to match frontend interface
            return {
                id: group.id,
                name: group.groupName,
                city: city?.name || 'Unknown',
                state: city?.state?.name || city?.stateCode || 'Unknown',
                country: city?.country?.name || 'Unknown',
                latitude: city?.latitude || 0,
                longitude: city?.longitude || 0,
                createdAt: group.createdAt.toISOString(),
                updatedAt: group.createdAt.toISOString(), // Groups don't have updatedAt yet
                adminId: group.adminId,
                memberCount: memberCount
            };
        })
    );
    
    return groupsWithDetails;
}

async getGroupById(groupId: string): Promise<any> {
    const group = await this.groupsRepository.findOne({
        where: { id: groupId }
    });
    
    if (!group) {
        return null;
    }
    
    // Get city information
    const city = await this.locationsService.findCityById(group.cityId);
    
    // Get member count
    const memberCount = await this.groupMembersRepository.count({
        where: { groupId: group.id }
    });
    
    // Transform to match frontend interface
    return {
        id: group.id,
        name: group.groupName,
        city: city?.name || 'Unknown',
        state: city?.state?.name || city?.stateCode || 'Unknown',
        country: city?.country?.name || 'Unknown',
        latitude: city?.latitude || 0,
        longitude: city?.longitude || 0,
        createdAt: group.createdAt.toISOString(),
        updatedAt: group.createdAt.toISOString(), // Groups don't have updatedAt yet
        adminId: group.adminId,
        memberCount: memberCount
    };
}
}