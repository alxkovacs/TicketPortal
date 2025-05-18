# Ticket Sales Portal

A full-stack ticket sales portal application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) using TypeScript.

## Features

- User authentication and authorization
- Event management for organizers
- Ticket purchasing system
- Role-based access control (Admin, Users, Guests)
- Event browsing and filtering
- Ticket reservation and purchase
- Dashboard for event organizers

## Project Structure

```
ticket-portal/
├── frontend/           # Angular application
├── backend/            # Node.js/Express application
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create `.env` file in backend directory
   - Set up MongoDB connection string
   - Configure JWT secret

4. Start the applications:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend application
   cd frontend
   ng serve
   ```

## API Documentation

The backend provides RESTful APIs for:
- User authentication
- Event management
- Ticket operations
- User management

## License

MIT 