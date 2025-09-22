import { Controller, Post, Body, Req } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto} from './dto/create-group.dto'
import { User } from '../users/user.entity'
import { Group } from './groups.entity'

@Controller('groups')
export class GroupsController {
    constructor (
        private readonly groupsService: GroupsService
    ) {}

    @Post()
    async create(@Body() createGroupDto: CreateGroupDto, @Req() request: Request): Promise<Group> {
        const tempUser = { id : "096516e8-c806-464d-95b3-9126a80ec395"} //for testing
        // user = new User(this.request)
        return this.groupsService.create(createGroupDto, tempUser as User);
    }
}
