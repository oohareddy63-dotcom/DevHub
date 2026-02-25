// Setup environment variables for production build
// This ensures the API URL is set correctly even if env vars aren't configured in Render

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env.production');

// Determine the backend URL
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devhub-7.onrender.com/api';

const envContent = `# Auto-generated production environment
NEXT_PUBLIC_API_URL=${backendUrl}
NODE_ENV=production
`;

console.log('========================================');
console.log('🔧 Setting up environment variables...');
console.log('📝 Backend API URL:', backendUrl);
console.log('📁 Writing to:', envFile);
console.log('========================================');

// Always write the file to ensure it's up to date
fs.writeFileSync(envFile, envContent.trim());
console.log('✅ Environment file created successfully');
console.log('========================================');
