import { Injectable, ConflictException} from '@nestjs/common';
import { Group } from './groups.entity'
import { CreateGroupDto } from './dto/create-group.dto'
import { User } from '../users/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GroupsService {
constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
){}

async create(createGroupDto: CreateGroupDto, user: User):  Promise<Group>{
    const existingGroup = await this.groupsRepository.findOneBy({cityId: createGroupDto.cityId})
    if (!existingGroup) {
        const newGroup = new Group();
        newGroup.groupName = createGroupDto.groupName;
        newGroup.admin = user;
        newGroup.cityId = createGroupDto.cityId;

        return await this.groupsRepository.save(newGroup);
    }
    else {
        throw new ConflictException('Group already exists! Join the existing group!!!!');
    }

    
}
}