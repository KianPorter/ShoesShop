# 🚀 START HERE - Shoes Shop Project

## Quick Setup (5 Steps)

### ✅ Step 1: Install Dependencies

```bash
# Install all dependencies at once
npm run install:all
```

### ✅ Step 2: Create Environment Files

**Backend** - Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shoes_shop?schema=public"
JWT_SECRET="my-super-secret-jwt-key-12345"
PORT=5000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> ⚠️ **Important**: Replace `postgres` and `password` with your actual PostgreSQL username and password!

### ✅ Step 3: Set Up Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### ✅ Step 4: Seed Sample Data

```bash
npm run seed
```

### ✅ Step 5: Start Both Servers

**Open 2 terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Should see: `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Should see: `Ready on http://localhost:3000`

### 🎉 Done! Open http://localhost:3000

---

## Need Help?

### Database Setup

**Option 1: Install PostgreSQL**
- Download: https://www.postgresql.org/download/
- Default port: 5432
- Create database: `CREATE DATABASE shoes_shop;`

**Option 2: Use Docker**
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
docker exec -it postgres psql -U postgres -c "CREATE DATABASE shoes_shop;"
```

### Common Issues

**❌ "Cannot connect to database"**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `backend/.env`
- Verify database `shoes_shop` exists

**❌ "Port 5000 already in use"**
- Change PORT in `backend/.env` to 5001
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

**❌ "Module not found"**
- Delete `node_modules` folders
- Run `npm install` again

---

## 📚 More Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Detailed quick start guide
- [SETUP.md](./SETUP.md) - Complete setup instructions
- [README.md](./README.md) - Project overview

