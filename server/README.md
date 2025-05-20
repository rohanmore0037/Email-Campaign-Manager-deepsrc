# Email Campaign Manager - Backend

Node.js backend service for managing email campaigns.

## Architecture

The server follows an MVC architecture:
- Models: MongoDB schemas
- Controllers: Business logic
- Routes: API endpoints

## Core Features

### SMTP Management
- SMTP server configuration
- Server validation
- Secure credential storage

### Campaign Processing
- Queue-based email sending
- Rate limiting
- Error handling
- Campaign status tracking

### Subscriber Management
- CSV import
- List management
- Subscriber grouping

## API Routes

### SMTP Routes
```
POST   /api/smtp      # Create SMTP server
GET    /api/smtp      # List SMTP servers
PUT    /api/smtp/:id  # Update SMTP server
DELETE /api/smtp/:id  # Delete SMTP server
```

### Campaign Routes
```
POST   /api/campaign      # Create campaign
GET    /api/campaign     # List campaigns
GET    /api/campaign/:id # Get campaign details
PUT    /api/campaign/:id # Update campaign
DELETE /api/campaign/:id # Delete campaign
```

### Subscriber Routes
```
POST   /api/subscriber      # Import subscribers
GET    /api/subscriber/:id  # Get subscriber list
DELETE /api/subscriber/:id  # Delete subscriber
```

## Queue System

Uses Bull for reliable email queue processing:
- Automatic retries
- Rate limiting
- Error handling
- Campaign progress tracking

## Dependencies

- Express 5.1.0
- MongoDB 8.14.1
- Redis 5.0.1
- Bull 4.16.5
- Nodemailer 7.0.3
- JWT 9.0.2

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emailmanager
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Setup

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Start production
npm start
```
