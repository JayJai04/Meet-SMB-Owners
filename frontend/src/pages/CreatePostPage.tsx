import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsService, groupService } from '../services/api';
import { Group, IncidentCategory, EventType } from '../types';

const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [postType, setPostType] = useState<'incident' | 'event'>('incident');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Incident Report Form State
  const [incidentForm, setIncidentForm] = useState({
    incidentTimestamp: '',
    incidentAddress: '',
    latitude: 0,
    longitude: 0,
    incidentCategory: IncidentCategory.SHOPLIFTING,
    description: ''
  });

  // Event Announcement Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: EventType.SALE,
    eventStartDate: '',
    eventEndDate: '',
    location: '',
    latitude: 0,
    longitude: 0,
    isUrgent: false
  });

  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        const groupsData = await groupService.getMyGroups();
        setGroups(groupsData);
        if (groupsData.length > 0) {
          setSelectedGroup(groupsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load groups:', err);
        setError('Failed to load your groups');
      }
    };

    loadUserGroups();
  }, []);

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postsService.createIncidentReport({
        ...incidentForm,
        groupId: selectedGroup
      });
      navigate(`/group/${selectedGroup}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create incident report');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postsService.createEventAnnouncement({
        ...eventForm,
        groupId: selectedGroup
      });
      navigate(`/group/${selectedGroup}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleIncidentChange = (field: string, value: any) => {
    setIncidentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEventChange = (field: string, value: any) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
  };

  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">No Groups Available</h1>
              <p className="mt-2 text-gray-600">You need to be a member of a group to create posts.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
              <p className="mt-1 text-sm text-gray-600">Share an incident report or event announcement with your community</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Post Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Post Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setPostType('incident')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      postType === 'incident'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    🚨 Incident Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('event')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      postType === 'event'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    📢 Event Announcement
                  </button>
                </div>
              </div>

              {/* Group Selection */}
              <div className="mb-6">
                <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
                  Post to Group
                </label>
                <select
                  id="group"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} - {group.city}, {group.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Incident Report Form */}
              {postType === 'incident' && (
                <form onSubmit={handleIncidentSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="incidentTimestamp" className="block text-sm font-medium text-gray-700 mb-2">
                      When did this incident occur?
                    </label>
                    <input
                      type="datetime-local"
                      id="incidentTimestamp"
                      value={incidentForm.incidentTimestamp}
                      onChange={(e) => handleIncidentChange('incidentTimestamp', e.target.value)}
                      max={new Date().toISOString().slice(0, 16)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Incident reports are for past events only. Please select a date and time that has already occurred.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="incidentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Address where incident occurred
                    </label>
                    <input
                      type="text"
                      id="incidentAddress"
                      value={incidentForm.incidentAddress}
                      onChange={(e) => handleIncidentChange('incidentAddress', e.target.value)}
                      placeholder="e.g., 123 Main Street, City, State"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="incidentCategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Type
                    </label>
                    <select
                      id="incidentCategory"
                      value={incidentForm.incidentCategory}
                      onChange={(e) => handleIncidentChange('incidentCategory', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value={IncidentCategory.SHOPLIFTING}>Shoplifting</option>
                      <option value={IncidentCategory.VANDALISM}>Vandalism</option>
                      <option value={IncidentCategory.SUSPICIOUS_ACTIVITY}>Suspicious Activity</option>
                      <option value={IncidentCategory.THEFT}>Theft</option>
                      <option value={IncidentCategory.BREAK_IN}>Break In</option>
                      <option value={IncidentCategory.ASSAULT}>Assault</option>
                      <option value={IncidentCategory.FRAUD}>Fraud</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={incidentForm.description}
                      onChange={(e) => handleIncidentChange('description', e.target.value)}
                      placeholder="Provide detailed information about what happened..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Incident Report'}
                    </button>
                  </div>
                </form>
              )}

              {/* Event Announcement Form */}
              {postType === 'event' && (
                <form onSubmit={handleEventSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => handleEventChange('title', e.target.value)}
                      placeholder="e.g., Summer Sale, Grand Opening, Street Closure"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      value={eventForm.eventType}
                      onChange={(e) => handleEventChange('eventType', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value={EventType.SALE}>Sale</option>
                      <option value={EventType.GRAND_OPENING}>Grand Opening</option>
                      <option value={EventType.CLOSURE}>Closure</option>
                      <option value={EventType.COMMUNITY_EVENT}>Community Event</option>
                      <option value={EventType.STREET_CLOSURE}>Street Closure</option>
                      <option value={EventType.CONSTRUCTION}>Construction</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="eventDescription"
                      rows={4}
                      value={eventForm.description}
                      onChange={(e) => handleEventChange('description', e.target.value)}
                      placeholder="Provide details about the event..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="eventStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        id="eventStartDate"
                        value={eventForm.eventStartDate}
                        onChange={(e) => handleEventChange('eventStartDate', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        id="eventEndDate"
                        value={eventForm.eventEndDate}
                        onChange={(e) => handleEventChange('eventEndDate', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => handleEventChange('location', e.target.value)}
                      placeholder="e.g., Downtown Plaza, 456 Oak Street"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isUrgent"
                      type="checkbox"
                      checked={eventForm.isUrgent}
                      onChange={(e) => handleEventChange('isUrgent', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">
                      Mark as urgent
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Event Announcement'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
