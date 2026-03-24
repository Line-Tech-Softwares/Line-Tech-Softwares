# Line Tech API Server

Backend API server for Line Tech Softwares.

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on port 3000 by default.

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

## API Endpoints

### Authentication
- `POST /v1/auth/login` - Authenticate user

### Users
- `GET /v1/users` - Get all users (requires auth)
- `POST /v1/users` - Create new user (requires auth)

### Projects
- `GET /v1/projects` - Get all projects (requires auth)
- `POST /v1/projects` - Create new project (requires auth)

### Health
- `GET /health` - Health check endpoint

## Authentication

Include the API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## Development

The server uses in-memory storage for demonstration. In production, replace with a proper database.

## License

MIT License