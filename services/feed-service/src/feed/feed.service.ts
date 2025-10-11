import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FeedQueryDto } from './dto/feed-query.dto';

@Injectable()
export class FeedService {
  private readonly communityServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.communityServiceUrl = this.configService.get<string>('COMMUNITY_SERVICE_URL', 'http://localhost:3000');
  }

  async getFeed(token: string, query: FeedQueryDto) {
    try {
      // TODO: Implement filtering based on query.type ('all', 'incidents', 'events')
      // Get user's groups first
      const groupsResponse = await axios.get(`${this.communityServiceUrl}/groups/my-groups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userGroups = groupsResponse.data;
      if (!userGroups || userGroups.length === 0) {
        return {
          incidentReports: [],
          eventAnnouncements: [],
          pagination: {
            offset: query.offset,
            limit: query.limit,
            total: 0,
            hasMore: false,
            nextOffset: null
          }
        };
      }

      // Get posts from all user's groups
      const allIncidentReports = [];
      const allEventAnnouncements = [];

      for (const group of userGroups) {
        try {
          const postsResponse = await axios.get(`${this.communityServiceUrl}/posts/group/${group.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (postsResponse.data.incidentReports) {
            allIncidentReports.push(...postsResponse.data.incidentReports);
          }
          if (postsResponse.data.eventAnnouncements) {
            allEventAnnouncements.push(...postsResponse.data.eventAnnouncements);
          }
        } catch (error) {
          console.error(`Error fetching posts for group ${group.id}:`, error.message);
        }
      }

      // Combine all posts and sort by priority: incidents first, then by recency
      const allPosts = [...allIncidentReports, ...allEventAnnouncements];
      
      // TODO: Implement geographic proximity sorting
      // Priority: Most recent incidents (within 5mi) -> Most recent events (within 5mi) -> Chronological incidents -> Chronological events
      allPosts.sort((a, b) => {
        // Incidents always come first
        if (a.incidentTimestamp && !b.incidentTimestamp) return -1;
        if (!a.incidentTimestamp && b.incidentTimestamp) return 1;
        
        // Within same type, sort by most recent
        const aTime = a.incidentTimestamp ? new Date(a.incidentTimestamp).getTime() : new Date(a.createdAt).getTime();
        const bTime = b.incidentTimestamp ? new Date(b.incidentTimestamp).getTime() : new Date(b.createdAt).getTime();
        return bTime - aTime;
      });

      // Apply continuous scroll pagination
      const startIndex = query.offset;
      const endIndex = startIndex + query.limit;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);

      // Separate back into incidents and events
      const paginatedIncidents = paginatedPosts.filter(post => post.incidentTimestamp);
      const paginatedEvents = paginatedPosts.filter(post => !post.incidentTimestamp);

      return {
        incidentReports: paginatedIncidents,
        eventAnnouncements: paginatedEvents,
        pagination: {
          offset: query.offset,
          limit: query.limit,
          total: allPosts.length,
          hasMore: endIndex < allPosts.length,
          nextOffset: endIndex < allPosts.length ? endIndex : null
        }
      };
    } catch (error) {
      throw new HttpException('Failed to fetch feed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getIncidentFeed(token: string, query: FeedQueryDto) {
    const feed = await this.getFeed(token, { ...query, type: 'incidents' });
    return {
      incidentReports: feed.incidentReports,
      pagination: feed.pagination
    };
  }

  async getEventFeed(token: string, query: FeedQueryDto) {
    const feed = await this.getFeed(token, { ...query, type: 'events' });
    return {
      eventAnnouncements: feed.eventAnnouncements,
      pagination: feed.pagination
    };
  }

}

