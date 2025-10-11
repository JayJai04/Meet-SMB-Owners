import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentReport, IncidentCategory } from './entities/incident-report.entity';
import { EventAnnouncement, EventType } from './entities/event-announcement.entity';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { CreateEventAnnouncementDto } from './dto/create-event-announcement.dto';
import { User } from '../users/users.entity';
import { Group } from '../groups/entities/groups.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(IncidentReport)
    private readonly incidentReportsRepository: Repository<IncidentReport>,
    @InjectRepository(EventAnnouncement)
    private readonly eventAnnouncementsRepository: Repository<EventAnnouncement>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  // Incident Report methods
  async createIncidentReport(createIncidentReportDto: CreateIncidentReportDto, user: User): Promise<IncidentReport> {
    // Verify user is member of the group
    const group = await this.groupsRepository.findOne({
      where: { id: createIncidentReportDto.groupId },
      relations: ['members']
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.some(member => member.userId === user.id);
    if (!isMember) {
      throw new ForbiddenException('You must be a member of this group to create incident reports');
    }

    const incidentReport = this.incidentReportsRepository.create({
      ...createIncidentReportDto,
      incidentTimestamp: new Date(createIncidentReportDto.incidentTimestamp),
      reportedBy: user,
      group: group
    });

    return this.incidentReportsRepository.save(incidentReport);
  }

  async getIncidentReportsByGroup(groupId: string): Promise<IncidentReport[]> {
    return this.incidentReportsRepository.find({
      where: { group: { id: groupId } },
      relations: ['reportedBy'],
      order: { incidentTimestamp: 'DESC' }
    });
  }

  async getIncidentReportsByUser(userId: string): Promise<IncidentReport[]> {
    return this.incidentReportsRepository.find({
      where: { reportedBy: { id: userId } },
      relations: ['group'],
      order: { incidentTimestamp: 'DESC' }
    });
  }

  // Event Announcement methods
  async createEventAnnouncement(createEventAnnouncementDto: CreateEventAnnouncementDto, user: User): Promise<EventAnnouncement> {
    // Verify user is member of the group
    const group = await this.groupsRepository.findOne({
      where: { id: createEventAnnouncementDto.groupId },
      relations: ['members']
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const isMember = group.members.some(member => member.userId === user.id);
    if (!isMember) {
      throw new ForbiddenException('You must be a member of this group to create event announcements');
    }

    const eventAnnouncement = this.eventAnnouncementsRepository.create({
      ...createEventAnnouncementDto,
      eventStartDate: createEventAnnouncementDto.eventStartDate ? new Date(createEventAnnouncementDto.eventStartDate) : null,
      eventEndDate: createEventAnnouncementDto.eventEndDate ? new Date(createEventAnnouncementDto.eventEndDate) : null,
      createdBy: user,
      group: group
    });

    return this.eventAnnouncementsRepository.save(eventAnnouncement);
  }

  async getEventAnnouncementsByGroup(groupId: string): Promise<EventAnnouncement[]> {
    return this.eventAnnouncementsRepository.find({
      where: { group: { id: groupId } },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' }
    });
  }

  async getEventAnnouncementsByUser(userId: string): Promise<EventAnnouncement[]> {
    return this.eventAnnouncementsRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['group'],
      order: { createdAt: 'DESC' }
    });
  }

  // Get all posts for a group (both incident reports and events)
  async getAllPostsByGroup(groupId: string) {
    const [incidentReports, eventAnnouncements] = await Promise.all([
      this.getIncidentReportsByGroup(groupId),
      this.getEventAnnouncementsByGroup(groupId)
    ]);

    return {
      incidentReports,
      eventAnnouncements
    };
  }

  // Individual post management methods
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    const incidentReport = await this.incidentReportsRepository.findOne({
      where: { id },
      relations: ['reportedBy', 'group']
    });

    if (!incidentReport) {
      throw new NotFoundException('Incident report not found');
    }

    return incidentReport;
  }

  async updateIncidentReport(id: string, updateIncidentReportDto: CreateIncidentReportDto, user: User): Promise<IncidentReport> {
    const incidentReport = await this.getIncidentReportById(id);

    // Check if user owns the incident report
    if (incidentReport.reportedBy.id !== user.id) {
      throw new ForbiddenException('You can only update your own incident reports');
    }

    // Update the incident report
    Object.assign(incidentReport, {
      ...updateIncidentReportDto,
      incidentTimestamp: new Date(updateIncidentReportDto.incidentTimestamp)
    });

    return this.incidentReportsRepository.save(incidentReport);
  }

  async deleteIncidentReport(id: string, user: User): Promise<void> {
    const incidentReport = await this.getIncidentReportById(id);

    // Check if user owns the incident report
    if (incidentReport.reportedBy.id !== user.id) {
      throw new ForbiddenException('You can only delete your own incident reports');
    }

    await this.incidentReportsRepository.remove(incidentReport);
  }

  async getEventAnnouncementById(id: string): Promise<EventAnnouncement> {
    const eventAnnouncement = await this.eventAnnouncementsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'group']
    });

    if (!eventAnnouncement) {
      throw new NotFoundException('Event announcement not found');
    }

    return eventAnnouncement;
  }

  async updateEventAnnouncement(id: string, updateEventAnnouncementDto: CreateEventAnnouncementDto, user: User): Promise<EventAnnouncement> {
    const eventAnnouncement = await this.getEventAnnouncementById(id);

    // Check if user owns the event announcement
    if (eventAnnouncement.createdBy.id !== user.id) {
      throw new ForbiddenException('You can only update your own event announcements');
    }

    // Update the event announcement
    Object.assign(eventAnnouncement, {
      ...updateEventAnnouncementDto,
      eventStartDate: updateEventAnnouncementDto.eventStartDate ? new Date(updateEventAnnouncementDto.eventStartDate) : null,
      eventEndDate: updateEventAnnouncementDto.eventEndDate ? new Date(updateEventAnnouncementDto.eventEndDate) : null
    });

    return this.eventAnnouncementsRepository.save(eventAnnouncement);
  }

  async deleteEventAnnouncement(id: string, user: User): Promise<void> {
    const eventAnnouncement = await this.getEventAnnouncementById(id);

    // Check if user owns the event announcement
    if (eventAnnouncement.createdBy.id !== user.id) {
      throw new ForbiddenException('You can only delete your own event announcements');
    }

    await this.eventAnnouncementsRepository.remove(eventAnnouncement);
  }
}

