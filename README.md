# Email Campaign Management System

A full-stack application for managing email campaigns with SMTP server configurations, subscriber list management, and campaign tracking.

## Project Structure

```
/
├── client/          # React frontend application
├── server/          # Node.js backend application
└── README.md        # This file
```

## Features

- SMTP Server Management
- Subscriber List Management 
- Email Campaign Creation and Management
- Real-time Campaign Tracking
- CSV Import for Subscribers
- Email Template Management
- Queue-based Email Processing
- Campaign Analytics

## Tech Stack

### Frontend
- React
- TailwindCSS
- React Router
- Axios
- React Hook Form
- Yup Validation

### Backend
- Node.js
- Express
- MongoDB
- Redis
- Bull Queue
- Nodemailer
- JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies in both client and server directories
3. Configure environment variables
4. Start the development servers

## Prerequisites

- Node.js 16+
- MongoDB
- Redis
- NPM or Yarn

## Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd client
npm install
```

## Environment Setup

Create `.env` files in server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Application

```bash
# Start server
cd server
npm run dev

# Start client
cd client
npm run dev
```
