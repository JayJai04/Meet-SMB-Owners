import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { locationService } from '../services/api';
import { RegisterRequest, City } from '../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    cityId: 0,
  });
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCitySearchTerm, setSelectedCitySearchTerm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCities = async () => {
      try {
        if (citySearch.length > 2) {
          // Use backend search for better results
          const citiesData = await locationService.getCities(citySearch);
          setFilteredCities(citiesData);
        } else {
          // Load initial cities when search is short
          const citiesData = await locationService.getCities();
          setCities(citiesData);
          setFilteredCities(citiesData);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };

    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(loadCities, 300);
    return () => clearTimeout(timeoutId);
  }, [citySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCity) {
      setError('Please select your city');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        ...formData,
        cityId: Number(selectedCity.id),
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    const searchTerm = `${city.name}, ${city.state?.name || city.stateCode}`;
    setCitySearch(searchTerm);
    setSelectedCitySearchTerm(searchTerm);
    setShowCityDropdown(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join SMB Connect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with local business owners in your community
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Your City
              </label>
              <input
                id="city"
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search for your city..."
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowCityDropdown(true);
                  // Only clear selected city if the search term is different from the selected city's search term
                  if (e.target.value !== selectedCitySearchTerm) {
                    setSelectedCity(null);
                    setSelectedCitySearchTerm('');
                  }
                }}
                onFocus={() => setShowCityDropdown(true)}
                required
              />
              
              {showCityDropdown && filteredCities.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {filteredCities.slice(0, 10).map((city) => (
                    <div
                      key={city.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50"
                      onClick={() => handleCitySelect(city)}
                    >
                      <span className="font-normal block truncate">
                        {city.name}, {city.state?.name || city.stateCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !selectedCity}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
