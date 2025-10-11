import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { IncidentReport } from './entities/incident-report.entity';
import { EventAnnouncement } from './entities/event-announcement.entity';
import { Group } from '../groups/entities/groups.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncidentReport, EventAnnouncement, Group])
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}

