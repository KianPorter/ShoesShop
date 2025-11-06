@echo off
echo 🚀 Starting Shoes Shop Project...

REM Check if .env files exist
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo 📝 Please edit backend\.env and set your DATABASE_URL and JWT_SECRET
)

if not exist "frontend\.env.local" (
    echo ⚠️  Frontend .env.local file not found. Creating from .env.example...
    copy frontend\.env.example frontend\.env.local
)

REM Install dependencies if node_modules don't exist
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Make sure PostgreSQL is running
echo 2. Update backend\.env with your database credentials
echo 3. Run database migrations: cd backend ^&^& npx prisma migrate dev
echo 4. Seed the database: cd backend ^&^& npm run seed
echo 5. Start backend: cd backend ^&^& npm run dev
echo 6. Start frontend: cd frontend ^&^& npm run dev

pause

