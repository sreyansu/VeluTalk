# VeluTalk Backend

This is the backend server for VeluTalk, providing API endpoints and real-time communication capabilities.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a `.env` file with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

3. Run the development server:
```bash
pnpm dev
```

## Project Structure

- `src/`: Source code
  - `config/`: Configuration files
  - `controllers/`: Request handlers
  - `models/`: Database models
  - `routes/`: API routes
  - `middleware/`: Custom middleware
  - `utils/`: Utility functions

## API Endpoints

### Authentication
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/verify`: Token verification

### Rooms
- `GET /api/rooms`: Get all rooms
- `POST /api/rooms/create`: Create a new room
- `POST /api/rooms/join`: Join a room
- `GET /api/rooms/:id`: Get room details
- `GET /api/rooms/:id/messages`: Get room messages
