#!/bin/bash

echo "🏫 Collage API Setup Script for Tier 3 Cities"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo "✅ MongoDB is running locally"
    else
        echo "⚠️  MongoDB is not running locally"
        echo "💡 Options for tier 3 cities:"
        echo "   1. Install MongoDB locally: https://www.mongodb.com/try/download/community"
        echo "   2. Use MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas"
        echo "   3. Use Docker: docker-compose up -d"
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.adminCommand('ping')" &> /dev/null; then
        echo "✅ MongoDB is running locally"
    else
        echo "⚠️  MongoDB is not running locally"
    fi
else
    echo "⚠️  MongoDB client not found"
    echo "💡 Install MongoDB or use cloud options"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Ensure MongoDB is running"
echo "   3. Run: npm run dev (development) or npm start (production)"
echo "   4. API will be available at: http://localhost:3000"
echo "   5. Documentation at: http://localhost:3000/docs"
echo ""
echo "📚 For deployment options:"
echo "   - Docker: docker-compose up -d"
echo "   - Cloud: Deploy to Heroku, Railway, or similar platforms"
echo "   - VPS: Use PM2 for process management"