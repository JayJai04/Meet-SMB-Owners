import { Module } from '@nestjs/common'
import { GroupsController } from './groups.controller'
import {GroupsService} from './groups.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Group } from './groups.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Group])],
    controllers: [GroupsController],
    providers: [GroupsService]
})
export class GroupsModule {
}