export interface User {
  id: string;
  email: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  memberCount: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: string;
  user: User;
}

export interface IncidentReport {
  id: string;
  incidentTimestamp: string;
  incidentAddress: string;
  latitude: number;
  longitude: number;
  incidentCategory: IncidentCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
  reportedBy: User;
  group: Group;
}

export interface EventAnnouncement {
  id: string;
  title: string;
  description: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventType: EventType;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  group: Group;
}

export enum IncidentCategory {
  SHOPLIFTING = 'shoplifting',
  VANDALISM = 'vandalism',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  THEFT = 'theft',
  BREAK_IN = 'break_in',
  ASSAULT = 'assault',
  FRAUD = 'fraud'
}

export enum EventType {
  SALE = 'sale',
  GRAND_OPENING = 'grand_opening',
  CLOSURE = 'closure',
  COMMUNITY_EVENT = 'community_event',
  STREET_CLOSURE = 'street_closure',
  CONSTRUCTION = 'construction'
}

export interface City {
  id: number;
  name: string;
  stateId: number;
  stateCode: string;
  countryId: number;
  countryCode: string;
  latitude: number;
  longitude: number;
  state?: {
    id: number;
    name: string;
    countryId: number;
    countryCode: string;
    fipsCode: string;
    iso2: string;
    iso31662: string;
    type: string;
    level: number | null;
    parentId: number | null;
    native: string;
    latitude: number;
    longitude: number;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    flag: number;
    wikiDataId: string;
  };
  country?: {
    id: number;
    name: string;
    iso3: string;
    numericCode: number | null;
    iso2: string;
    phonecode: string;
    capital: string;
    currency: string;
    currencyName: string | null;
    currencySymbol: string | null;
    tld: string;
    native: string;
    population: string;
    gdp: string;
    region: string;
    regionId: number | null;
    subregion: string;
    subregionId: number | null;
    nationality: string;
    timezones: string;
    createdAt: string;
    updatedAt: string;
    flag: number;
    wikiDataId: string;
  };
}

export interface State {
  id: string;
  name: string;
  country: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  cityId: number;
}

export interface CreateIncidentReportRequest {
  groupId: string;
  incidentTimestamp: string;
  incidentAddress: string;
  latitude: number;
  longitude: number;
  incidentCategory: IncidentCategory;
  description: string;
}

export interface CreateEventAnnouncementRequest {
  groupId: string;
  title: string;
  description: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventType: EventType;
}
