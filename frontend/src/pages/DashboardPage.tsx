import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupService } from '../services/api';
import { Group } from '../types';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupsData = await groupService.getMyGroups();
        setGroups(groupsData);
      } catch (err) {
        console.error('Failed to load groups:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SMB Connect</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Communities</h2>
            
            {groups.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No communities yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't joined any local business communities yet.
                </p>
                <div className="mt-6">
                  <Link
                    to="/create-group"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Create Group for Your City
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <div key={group.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {group.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {group.city}, {group.state}
                      </p>
                      {group.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {group.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {group.memberCount} members
                        </span>
                        <Link
                          to={`/group/${group.id}`}
                          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                        >
                          View Community →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
