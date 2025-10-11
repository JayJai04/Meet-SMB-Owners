import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupService, locationService } from '../services/api';
import { City } from '../types';

const CreateGroupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState<City | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(true);

  useEffect(() => {
    const loadUserCity = async () => {
      if (!user?.cityId) {
        setError('No city information found. Please contact support.');
        setLoadingCity(false);
        return;
      }

      try {
        const cityData = await locationService.getCityById(user.cityId);
        setCity(cityData);
      } catch (err) {
        console.error('Failed to load city:', err);
        setError('Failed to load city information');
      } finally {
        setLoadingCity(false);
      }
    };

    loadUserCity();
  }, [user]);

  const handleCreateGroup = async () => {
    if (!user?.cityId || !city) {
      setError('City information is missing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await groupService.createGroup({
        groupName: `${city.name} Business Community`,
        cityId: user.cityId
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Business Community
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start a local business community for your city
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {city && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Create Community for
              </h3>
              <p className="text-xl font-semibold text-primary-600 mb-4">
                {city.name}, {city.state?.name || city.stateCode}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This will create a business community for your registered city. 
                Other business owners in {city.name} will be able to join this community.
              </p>
              
              <button
                onClick={handleCreateGroup}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Community...' : 'Create Community'}
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-500"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
