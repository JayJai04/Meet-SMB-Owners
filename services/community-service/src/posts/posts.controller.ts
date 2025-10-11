import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { CreateEventAnnouncementDto } from './dto/create-event-announcement.dto';
import { User } from '../users/users.entity';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IncidentReport } from './entities/incident-report.entity';
import { EventAnnouncement } from './entities/event-announcement.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Incident Report endpoints
  @Post('incident-reports')
  @UseGuards(JwtAuthGuard)
  async createIncidentReport(
    @Body() createIncidentReportDto: CreateIncidentReportDto,
    @GetUser() user: User
  ): Promise<IncidentReport> {
    return this.postsService.createIncidentReport(createIncidentReportDto, user);
  }

  @Get('incident-reports/group/:groupId')
  @UseGuards(JwtAuthGuard)
  async getIncidentReportsByGroup(@Param('groupId') groupId: string): Promise<IncidentReport[]> {
    return this.postsService.getIncidentReportsByGroup(groupId);
  }

  @Get('incident-reports/my-reports')
  @UseGuards(JwtAuthGuard)
  async getMyIncidentReports(@GetUser() user: User): Promise<IncidentReport[]> {
    return this.postsService.getIncidentReportsByUser(user.id);
  }

  // Event Announcement endpoints
  @Post('event-announcements')
  @UseGuards(JwtAuthGuard)
  async createEventAnnouncement(
    @Body() createEventAnnouncementDto: CreateEventAnnouncementDto,
    @GetUser() user: User
  ): Promise<EventAnnouncement> {
    return this.postsService.createEventAnnouncement(createEventAnnouncementDto, user);
  }

  @Get('event-announcements/group/:groupId')
  @UseGuards(JwtAuthGuard)
  async getEventAnnouncementsByGroup(@Param('groupId') groupId: string): Promise<EventAnnouncement[]> {
    return this.postsService.getEventAnnouncementsByGroup(groupId);
  }

  @Get('event-announcements/my-events')
  @UseGuards(JwtAuthGuard)
  async getMyEventAnnouncements(@GetUser() user: User): Promise<EventAnnouncement[]> {
    return this.postsService.getEventAnnouncementsByUser(user.id);
  }

  // Combined posts endpoint
  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard)
  async getAllPostsByGroup(@Param('groupId') groupId: string) {
    return this.postsService.getAllPostsByGroup(groupId);
  }

  // Individual post management endpoints
  @Get('incident-reports/:id')
  @UseGuards(JwtAuthGuard)
  async getIncidentReportById(@Param('id') id: string): Promise<IncidentReport> {
    return this.postsService.getIncidentReportById(id);
  }

  @Put('incident-reports/:id')
  @UseGuards(JwtAuthGuard)
  async updateIncidentReport(
    @Param('id') id: string,
    @Body() updateIncidentReportDto: CreateIncidentReportDto,
    @GetUser() user: User
  ): Promise<IncidentReport> {
    return this.postsService.updateIncidentReport(id, updateIncidentReportDto, user);
  }

  @Delete('incident-reports/:id')
  @UseGuards(JwtAuthGuard)
  async deleteIncidentReport(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.postsService.deleteIncidentReport(id, user);
  }

  @Get('event-announcements/:id')
  @UseGuards(JwtAuthGuard)
  async getEventAnnouncementById(@Param('id') id: string): Promise<EventAnnouncement> {
    return this.postsService.getEventAnnouncementById(id);
  }

  @Put('event-announcements/:id')
  @UseGuards(JwtAuthGuard)
  async updateEventAnnouncement(
    @Param('id') id: string,
    @Body() updateEventAnnouncementDto: CreateEventAnnouncementDto,
    @GetUser() user: User
  ): Promise<EventAnnouncement> {
    return this.postsService.updateEventAnnouncement(id, updateEventAnnouncementDto, user);
  }

  @Delete('event-announcements/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEventAnnouncement(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.postsService.deleteEventAnnouncement(id, user);
  }
}

