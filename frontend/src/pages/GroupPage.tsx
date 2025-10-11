import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsService, groupService } from '../services/api';
import { IncidentReport, EventAnnouncement, Group } from '../types';

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [eventAnnouncements, setEventAnnouncements] = useState<EventAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return;

      try {
        const [groupData, postsData] = await Promise.all([
          groupService.getGroupById(groupId),
          postsService.getAllPostsByGroup(groupId)
        ]);

        setGroup(groupData);
        setIncidentReports(postsData.incidentReports);
        setEventAnnouncements(postsData.eventAnnouncements);
      } catch (err: any) {
        console.error('Failed to load group data:', err);
        setError('Failed to load group data');
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatIncidentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Group Not Found</h1>
              <p className="mt-2 text-gray-600">The requested group could not be found.</p>
              <Link to="/" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allPosts = [
    ...incidentReports.map(post => ({ ...post, type: 'incident' as const })),
    ...eventAnnouncements.map(post => ({ ...post, type: 'event' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-600">{group.city}, {group.state}</p>
              <p className="text-sm text-gray-500">{group.memberCount} members</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
              <Link
                to="/create-post"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {allPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to share an incident report or event announcement.
              </p>
              <div className="mt-6">
                <Link
                  to="/create-post"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Create Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {allPosts.map((post) => (
                <div key={`${post.type}-${post.id}`} className="bg-white shadow rounded-lg p-6">
                  {post.type === 'incident' ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            🚨 Incident Report
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {post.incidentCategory}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatIncidentDate(post.incidentTimestamp)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {post.incidentCategory} at {post.incidentAddress}
                      </h3>
                      <p className="text-gray-700 mb-4">{post.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Reported by {post.reportedBy.email}</span>
                        <span>Posted {formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            📢 Event Announcement
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {post.eventType}
                          </span>
                        </div>
                        {post.eventStartDate && (
                          <span className="text-sm text-gray-500">
                            {formatDate(post.eventStartDate)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{post.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Posted by {post.createdBy.email}</span>
                        <span>Posted {formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupPage;
