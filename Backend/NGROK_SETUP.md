# Ngrok Setup Guide for Backend

This guide will help you set up ngrok to expose your local backend server to the internet.

## Prerequisites

1. **Sign up for a free ngrok account** at [ngrok.com](https://ngrok.com)
2. **Get your authtoken** from the ngrok dashboard
3. **Install dependencies** for this project

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Server Configuration
PORT=3000
NODE_ENV=development

# Ngrok Configuration (Optional but recommended)
NGROK_AUTH_TOKEN=your_ngrok_auth_token_here
NGROK_SUBDOMAIN=your_custom_subdomain
NGROK_URL=https://your_custom_subdomain.ngrok.io
```

### 3. Start the Backend with Ngrok

#### Option A: Using npm scripts (Recommended)

```bash
# Start backend and ngrok together
npm run dev:ngrok

# Or use the programmatic ngrok start
npm run dev:ngrok:start
```

#### Option B: Manual start

```bash
# Terminal 1: Start the backend
npm run dev

# Terminal 2: Start ngrok
npm run ngrok
```

### 4. Access Your Backend

Once ngrok is running, you'll see output like:

```
🌍 Ngrok tunnel is active!
🔗 Public URL: https://abc123.ngrok.io
📊 Ngrok dashboard: http://localhost:4040
```

- **Public URL**: Use this URL to access your backend from anywhere
- **Ngrok Dashboard**: Monitor requests at `http://localhost:4040`

## Available Scripts

- `npm run dev` - Start backend in development mode
- `npm run start` - Start backend in production mode
- `npm run ngrok` - Start ngrok tunnel manually
- `npm run ngrok:start` - Start ngrok programmatically
- `npm run dev:ngrok` - Start both backend and ngrok together
- `npm run dev:ngrok:start` - Start both with programmatic ngrok

## Health Check

Test your ngrok tunnel by visiting:
```
https://your-ngrok-url.ngrok.io/health
```

You should see a JSON response like:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development",
  "ngrok": true
}
```

## API Endpoints

Your backend API will be available at:
- `https://your-ngrok-url.ngrok.io/api/categories`
- `https://your-ngrok-url.ngrok.io/api/company-pages`
- `https://your-ngrok-url.ngrok.io/api/subcategories`
- `https://your-ngrok-url.ngrok.io/api/tabs`
- `https://your-ngrok-url.ngrok.io/api/comments`

## Frontend Configuration

Update your frontend API base URL to use the ngrok URL:

```javascript
// In your frontend service files
const API_BASE_URL = 'https://your-ngrok-url.ngrok.io/api';
```

## Troubleshooting

### CORS Issues
The backend is configured to allow ngrok domains automatically. If you still get CORS errors:

1. Check that your ngrok URL is being logged in the console
2. Verify the CORS configuration in `src/index.js`
3. Make sure you're using HTTPS URLs

### Connection Issues
1. Ensure your backend is running on port 3000
2. Check that ngrok is properly authenticated
3. Verify your authtoken is correct

### Custom Subdomain
To use a custom subdomain:
1. Upgrade to a paid ngrok plan
2. Set `NGROK_SUBDOMAIN` in your `.env` file
3. Use `npm run ngrok:start` instead of `npm run ngrok`

## Security Notes

- Ngrok tunnels are public by default
- Use environment variables for sensitive data
- Consider using ngrok's authentication features for production
- Monitor the ngrok dashboard for unexpected traffic

## Useful Commands

```bash
# Check ngrok status
curl https://your-ngrok-url.ngrok.io/health

# Test API endpoints
curl https://your-ngrok-url.ngrok.io/api/categories

# View ngrok logs
tail -f ~/.ngrok2/ngrok.log
``` 