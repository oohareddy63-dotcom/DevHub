#!/bin/bash
# Render build script for frontend

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment..."
node setup-env.js

echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build complete!"
