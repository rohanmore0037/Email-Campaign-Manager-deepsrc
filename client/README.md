# Email Campaign Manager - Frontend

React-based frontend application for managing email campaigns.

## Features

- User Authentication
- SMTP Server Configuration
- Template Management
- Subscriber List Management
- Campaign Creation and Monitoring
- Real-time Campaign Analytics

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── context/        # React context providers
├── utils/          # Utility functions
└── App.jsx         # Main application component
```

## Key Components

### SMTP Configuration
- `SMTPConfigList.jsx`: SMTP server list management
- `SMTPConfigForm.jsx`: SMTP server configuration form

### Campaign Management
- `CampaignManager.jsx`: Campaign creation and editing
- `CampaignDetails.jsx`: Campaign monitoring and analytics

### Template Management
- `TemplateUpload.jsx`: Email template creation and management

### Subscriber Management
- `CSVUpload.jsx`: Subscriber list import and management

## Dependencies

- React 19.1.0
- React Router 7.6.0
- Axios 1.9.0
- TailwindCSS 4.1.6
- React Hook Form 7.56.3
- Yup 1.6.1

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
