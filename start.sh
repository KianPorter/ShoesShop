#!/bin/bash

echo "🚀 Starting Shoes Shop Project..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env and set your DATABASE_URL and JWT_SECRET"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found. Creating from .env.example..."
    cp frontend/.env.example frontend/.env.local
fi

# Install dependencies if node_modules don't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure PostgreSQL is running"
echo "2. Update backend/.env with your database credentials"
echo "3. Run database migrations: cd backend && npx prisma migrate dev"
echo "4. Seed the database: cd backend && npm run seed"
echo "5. Start backend: cd backend && npm run dev"
echo "6. Start frontend: cd frontend && npm run dev"

