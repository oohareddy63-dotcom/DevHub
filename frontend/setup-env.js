// Setup environment variables for production build
// This ensures the API URL is set correctly even if env vars aren't configured in Render

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env.production');
const envContent = `
# Auto-generated production environment
NEXT_PUBLIC_API_URL=https://devhub-7.onrender.com/api
NODE_ENV=production
`;

// Only create if it doesn't exist or if NEXT_PUBLIC_API_URL is not set
if (!process.env.NEXT_PUBLIC_API_URL) {
    console.log('📝 Creating .env.production file with default values...');
    fs.writeFileSync(envFile, envContent.trim());
    console.log('✅ Environment file created successfully');
} else {
    console.log('✅ NEXT_PUBLIC_API_URL is already set:', process.env.NEXT_PUBLIC_API_URL);
}
