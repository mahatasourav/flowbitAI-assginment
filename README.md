🚀 Flowbit AI Assignment – Full Stack Invoice Analytics Dashboard

This project is a complete, end-to-end invoice analytics platform built for the Flowbit AI assignment.
I designed and implemented the frontend, backend, database, and deployment — everything needed to make the system production-ready.

🌍 Live Demo
Service	Link
Frontend (Vercel)	https://flowbit-ai-assginment-web-c4m4.vercel.app

Backend (Render)	https://flowbitai-assginment.onrender.com

API Health Check	https://flowbitai-assginment.onrender.com/stats
✅ What This Project Includes
🖥️ Frontend — Next.js 14 (App Router)

A clean, modern, responsive dashboard built with:

TailwindCSS

Recharts

ShadCN UI

📊 Dashboard Capabilities

The UI shows several key analytics:

Invoice trends over time

Spend by vendor (Pareto analysis)

Spend by category

Cash outflow forecast:

0–7 days

8–30 days

31–60 days

60+ days

📌 KPI Cards

Total Spend (YTD)

Total Invoices

Documents This Month

Average Invoice Value

Frontend is fully API-driven and uses NEXT_PUBLIC_API_BASE for environment-based config.

⚙️ Backend — Express + TypeScript + Prisma

The backend is fully typed, fast, and structured with clean routes.
Prisma manages all DB communication, and data parsing is designed to handle messy or inconsistent invoice formats.

🔗 API Endpoints
Endpoint	Purpose
/stats	Dashboard summary (KPIs)
/invoice-trend	Monthly invoice count + spend
/spend-by-vendor	Vendor ranking with total spend
/outflow-forecast	Bucketized payment forecast
/spend-by-category	Category-level spend
/invoices	Complete invoice listing
🗄️ Database — PostgreSQL (Render) + Prisma

The schema is normalized and includes:

Vendor

Customer

Invoice

Payment

LineItem

Document

There are 3 migrations, and the database runs on Render’s managed PostgreSQL.

🌱 Automated Seeding

A TypeScript-based seed script imports data from Analytics_Test_Data.json and generates:

Vendors

Customers

Invoices

Payments

Line items

Documents

The seed process runs automatically during backend deployment — no manual steps needed.

🛠️ Tech Stack
Frontend

Next.js 14

TypeScript

TailwindCSS

Recharts

ShadCN UI

Backend

Node.js + Express

TypeScript

Prisma ORM

Zod (optional validation)

Infrastructure

Vercel (Frontend)

Render (Backend + DB)

Render PostgreSQL

📁 Project Structure
flowbitAI-assignment/
│
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
│
└── prisma/         # Prisma schema + migrations


Backend layout:

apps/api/
├── prisma/
├── src/
│   ├── prisma/seed.ts
│   ├── routes/
│   └── server.ts
└── dist/

🔧 Environment Variables
Frontend (apps/web/.env)
NEXT_PUBLIC_API_BASE=https://flowbitai-assginment.onrender.com

Backend (apps/api/.env)
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>
PORT=4000
NODE_ENV=production

▶️ Running Locally
Backend
cd apps/api
npm install
npx prisma generate
npm run dev

Frontend
cd apps/web
npm install
npm run dev


Local access:

Frontend → http://localhost:3000

Backend → http://localhost:4000

🚀 Deployment
Backend (Render)

Build

npm install
npx prisma generate
npm run build


Start

npm start

Frontend (Vercel)

Just add the env variable:

NEXT_PUBLIC_API_BASE=https://flowbitai-assginment.onrender.com


and deploy — Vercel handles the rest.

📸 Screenshots

(Add these in your submission)

Dashboard UI

Analytics charts

Vendor spend table

/stats API JSON response

✅ Final Status

All assignment requirements are fully completed:

✅ Fully functional dashboard

✅ Real analytics with live data

✅ Normalized PostgreSQL database

✅ Automated seeding + migrations

✅ Clean API architecture

✅ Fully deployed (Vercel + Render)

✅ Production-grade codebase

✍️ Author

Sourav Mahata
Full Stack Developer
2025
