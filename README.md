# Shoes E-Shop Project

A full-stack e-commerce application for selling shoes, built with Next.js (frontend) and Node.js/Express (backend).

## Features

### Frontend
- SEO-optimized Next.js application
- Dashboard with carousel for featured products
- E-shop with category browsing
- Shopping cart (add/remove items)
- Product detail pages with related products
- About Us page
- User authentication (Sign up, Sign in)
- Responsive design (mobile-friendly)
- Dark/Light theme toggle

### Backend
- User management with authentication
- Cart data management
- Product data management
- PostgreSQL database

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Context API (for theme and cart)

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Getting Started

### Prerequisites
- **Node.js 18+** installed
- **PostgreSQL** database running
- **npm** or **yarn** package manager

### Quick Start (Recommended)

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   Or manually:
   ```bash
   cd backend && npm install && cd ../frontend && npm install
   ```

2. **Set up environment variables:**

   **Backend** - Create `backend/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/shoes_shop?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=5000
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

   **Frontend** - Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Seed sample data:**
   ```bash
   npm run seed
   ```

5. **Start the servers:**

   **Option A - Using root scripts (two terminals):**
   ```bash
   # Terminal 1
   npm run dev:backend
   
   # Terminal 2
   npm run dev:frontend
   ```

   **Option B - Manual (two terminals):**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Open the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

### Detailed Setup

For more detailed instructions, see [QUICKSTART.md](./QUICKSTART.md) or [SETUP.md](./SETUP.md).

## Project Structure

```
shoes-shop/
├── frontend/          # Next.js application
├── backend/           # Express API server
└── README.md
```

