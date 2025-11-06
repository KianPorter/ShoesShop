# Setup Guide

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **PostgreSQL** database running locally or remotely
3. **npm** or **yarn** package manager

## Step-by-Step Setup

### 1. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env file in backend folder)
Create a `.env` file in the `backend` directory with the following:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/shoes_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

**Important:** 
- Replace `username`, `password`, and `localhost:5432` with your PostgreSQL connection details
- Use a strong, random string for `JWT_SECRET` in production
- Create a database named `shoes_shop` in PostgreSQL

#### Frontend (.env.local file in frontend folder)
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Set Up Database

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

This will:
- Create the database tables
- Generate the Prisma Client

### 4. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This will populate your database with sample shoe products.

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify your DATABASE_URL in `.env` is correct
- Check that the database `shoes_shop` exists

### Port Already in Use
- Change the PORT in backend `.env` if 5000 is taken
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

### Module Not Found Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Prisma Issues
- Run `npx prisma generate` again
- Check your DATABASE_URL is correct
- Ensure you've run migrations: `npx prisma migrate dev`

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Update `DATABASE_URL` to your production database
3. Set `NODE_ENV=production` in backend `.env`
4. Build the frontend: `cd frontend && npm run build`
5. Build the backend: `cd backend && npm run build`

## Features Overview

### Frontend Features
- ✅ SEO-optimized pages
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light theme toggle
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Product browsing by category
- ✅ Product detail pages
- ✅ About Us page

### Backend Features
- ✅ RESTful API
- ✅ JWT authentication
- ✅ User management
- ✅ Cart management
- ✅ Product management
- ✅ PostgreSQL database

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (supports `?featured=true`, `?category=name`, `?limit=10`)
- `GET /api/products/:id` - Get product by ID

### Cart (requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity

