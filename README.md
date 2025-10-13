# SMB Connect

A web-first social platform designed exclusively for verified local business owners to communicate about timely, location-specific issues in their communities.

## 🎯 Vision

To become the essential, trusted communication network for local Small-to-Medium-Sized Businesses (SMBs) in every community, prioritizing relevance, urgency, and structure over generic, noisy feeds.

## 🚀 Features

### Core Functionality
- **Location-Based Communities**: One group per city with automatic user assignment
- **Structured Post Types**: 
  - 🚨 **Incident Reports**: Security and safety issues with timestamps, locations, and categories
  - 📢 **Event Announcements**: Local events, sales, and news with optional scheduling
- **Real-Time Feed**: Chronological display of community posts
- **User Authentication**: Secure JWT-based authentication system
- **Group Management**: Automatic group creation and joining based on user location

### User Experience
- **Intuitive Interface**: Clean, modern UI built with React and Tailwind CSS
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Client-side validation with helpful error messages
- **Loading States**: Smooth user experience with proper loading indicators

## 🏗️ Architecture

### Backend (NestJS + PostgreSQL)
- **Community Service**: User management, group operations, and post creation
- **Feed Service**: Post retrieval and feed management
- **Location Service**: City, state, and country data management
- **Authentication**: JWT-based security with role-based access
- **Database**: PostgreSQL with TypeORM for data persistence

### Frontend (React + TypeScript)
- **Modern React**: Functional components with hooks
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling for consistent design
- **React Router**: Client-side routing for seamless navigation
- **Context API**: Global state management for authentication

### Infrastructure
- **Docker**: Containerized services for easy deployment
- **Docker Compose**: Multi-service orchestration
- **PostgreSQL**: Relational database with proper indexing

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Meet-SMB-Owners
   ```

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Development Setup

1. **Backend Development**
   ```bash
   cd services/community-service
   npm install
   npm run start:dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📁 Project Structure

```
Meet-SMB-Owners/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── services/
│   ├── community-service/   # Main backend service
│   │   ├── src/
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── groups/     # Group management
│   │   │   ├── locations/  # Location data
│   │   │   ├── posts/      # Post creation and management
│   │   │   └── users/      # User management
│   │   └── test/           # Backend tests
│   └── feed-service/        # Feed management service
├── docker-compose.yml       # Service orchestration
├── cities.sql              # City data seed
├── states.sql              # State data seed
└── countries.sql           # Country data seed
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=smb_connect
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# JWT
JWT_PASSWORD=your_jwt_secret

# API URLs
REACT_APP_API_URL=http://localhost:3001
```

### Database Setup

The application automatically seeds the database with:
- Countries data
- States/Provinces data  
- Cities data with coordinates

## 🧪 Testing

### Backend Tests
```bash
cd services/community-service
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Groups
- `POST /groups` - Create or join group
- `GET /groups/my-groups` - Get user's groups
- `GET /groups/:id` - Get group details

### Posts
- `POST /posts/incident-reports` - Create incident report
- `POST /posts/event-announcements` - Create event announcement
- `GET /posts/group/:groupId` - Get group posts

### Locations
- `GET /locations/cities` - Search cities
- `GET /locations/cities/:id` - Get city details

## 🎨 UI Components

### Pages
- **Login/Register**: User authentication
- **Dashboard**: Group overview and navigation
- **Group Feed**: Community posts display
- **Create Post**: Incident report and event creation

### Key Features
- **Responsive Design**: Mobile-first approach
- **Form Validation**: Real-time validation feedback
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: TypeORM query builder
- **CORS Configuration**: Proper cross-origin setup

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd services/community-service
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Mobile App**: React Native application
- **Advanced Moderation**: AI-powered content filtering
- **Analytics Dashboard**: Community insights
- **File Uploads**: Image and document support
- **Push Notifications**: Mobile push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**SMB Connect** - Connecting local business communities, one post at a time. 🏪🤝