import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  Group, 
  City, 
  State, 
  Country,
  IncidentReport,
  EventAnnouncement,
  CreateIncidentReportRequest,
  CreateEventAnnouncementRequest
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const locationService = {
  getCities: async (search?: string): Promise<City[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/locations/cities', { params });
    return response.data;
  },

  getCityById: async (id: number): Promise<City> => {
    const response = await api.get(`/locations/cities/${id}`);
    return response.data;
  },

  getStates: async (): Promise<State[]> => {
    const response = await api.get('/locations/states');
    return response.data;
  },

  getCountries: async (): Promise<Country[]> => {
    const response = await api.get('/locations/countries');
    return response.data;
  },
};

export const groupService = {
  createGroup: async (groupData: { groupName: string; cityId: number }): Promise<Group> => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  joinGroup: async (groupId: string): Promise<void> => {
    await api.post(`/groups/${groupId}/join`);
  },

  getMyGroups: async (): Promise<Group[]> => {
    const response = await api.get('/groups/my-groups');
    return response.data;
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
};

export const postsService = {
  createIncidentReport: async (data: CreateIncidentReportRequest): Promise<IncidentReport> => {
    const response = await api.post('/posts/incident-reports', data);
    return response.data;
  },

  createEventAnnouncement: async (data: CreateEventAnnouncementRequest): Promise<EventAnnouncement> => {
    const response = await api.post('/posts/event-announcements', data);
    return response.data;
  },

  getIncidentReportsByGroup: async (groupId: string): Promise<IncidentReport[]> => {
    const response = await api.get(`/posts/incident-reports/group/${groupId}`);
    return response.data;
  },

  getEventAnnouncementsByGroup: async (groupId: string): Promise<EventAnnouncement[]> => {
    const response = await api.get(`/posts/event-announcements/group/${groupId}`);
    return response.data;
  },

  getAllPostsByGroup: async (groupId: string): Promise<{ incidentReports: IncidentReport[]; eventAnnouncements: EventAnnouncement[] }> => {
    const response = await api.get(`/posts/group/${groupId}`);
    return response.data;
  },

  deleteIncidentReport: async (id: string): Promise<void> => {
    await api.delete(`/posts/incident-reports/${id}`);
  },

  deleteEventAnnouncement: async (id: string): Promise<void> => {
    await api.delete(`/posts/event-announcements/${id}`);
  },
};

export default api;
