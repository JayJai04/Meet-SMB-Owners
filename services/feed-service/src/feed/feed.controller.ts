import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetRawToken } from '../auth/get-raw-token.decorator';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@GetRawToken() token: string, @Query() query: FeedQueryDto) {
    return this.feedService.getFeed(token, query);
  }

  @Get('incidents')
  async getIncidentFeed(@GetRawToken() token: string, @Query() query: FeedQueryDto) {
    return this.feedService.getIncidentFeed(token, query);
  }

  @Get('events')
  async getEventFeed(@GetRawToken() token: string, @Query() query: FeedQueryDto) {
    return this.feedService.getEventFeed(token, query);
  }
}

