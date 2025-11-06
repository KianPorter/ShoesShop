# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

Run the setup script based on your OS:

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

Or manually:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Set Up Database

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create the database:**
   ```sql
   CREATE DATABASE shoes_shop;
   ```

3. **Configure environment variables:**
   
   Create `backend/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/shoes_shop?schema=public"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   ```
   
   Replace `username` and `password` with your PostgreSQL credentials.

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Step 3: Initialize Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Seed Sample Data

```bash
npm run seed
```

This will populate your database with sample shoe products.

### Step 5: Start the Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see: `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see: `Ready on http://localhost:3000`

### Step 6: Open the Application

Open your browser and go to: **http://localhost:3000**

## 🎉 You're Ready!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📝 Test the Application

1. **Browse Products**: Go to the Shop page
2. **Sign Up**: Create a new account
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon in the navbar
5. **Toggle Theme**: Click the sun/moon icon to switch themes

## 🐛 Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `backend/.env`
- Verify the database `shoes_shop` exists

### Port Already in Use
- Change PORT in `backend/.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

### Module Not Found
- Delete `node_modules` folders
- Run `npm install` again in both frontend and backend

### Prisma Errors
- Run `npx prisma generate` in the backend folder
- Make sure you've run migrations: `npx prisma migrate dev`

## 📚 Need More Help?

Check the full [SETUP.md](./SETUP.md) for detailed instructions.

