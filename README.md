🚀 Flowbit AI Assignment – Full Stack Invoice Analytics Dashboard

A fully functional full-stack invoice analytics platform built as part of the Flowbit AI assignment.

This project includes:

✅ Next.js 14 (App Router) production-ready frontend

✅ Express + TypeScript + Prisma backend

✅ PostgreSQL database hosted on Render

✅ Automated Prisma migrations & seeding

✅ Real analytics: Spend, Forecast, Vendor ranking, Category insights

✅ Fully deployed on Vercel (frontend) and Render (backend)

🔗 Live URLs
Service	URL
Frontend (Vercel)	https://flowbit-ai-assginment-web-c4m4.vercel.app

Backend (Render)	https://flowbitai-assginment.onrender.com

API Health	https://flowbitai-assginment.onrender.com/stats
📌 Features
✅ Frontend (Next.js 14)

Modern dashboard built using React, TailwindCSS, Recharts, ShadCN UI

📊 Dynamic Charts

Invoice Trends

Spend by Vendor (Pareto)

Spend by Category

Cash Outflow Forecast (0–7, 8–30, 31–60, 60+ days)

📈 Summary KPIs

Total Spend (YTD)

Total Invoices

Documents This Month

Average Invoice Value

Other frontend features:

Fully responsive layout

Env-based API config using NEXT_PUBLIC_API_BASE

✅ Backend (Express + TypeScript)

Fully typed Express server

Prisma ORM with PostgreSQL

Robust parsing for real invoice dataset (LLM variations handled)

📡 REST API Endpoints
Endpoint	Description
/stats	Dashboard KPIs
/invoice-trend	Monthly invoice & spend
/spend-by-vendor	Vendor-wise spend ranking
/outflow-forecast	Bucketized forecast (0–7, 8–30, 31–60, 60+)
/spend-by-category	Category aggregation
/invoices	Invoice list with vendor mapping
✅ Database (Prisma + PostgreSQL)

Includes relational tables:

Vendor

Customer

Invoice

Payment

LineItem

Document

✅ 3 migrations
✅ Hosted on Render PostgreSQL

✅ Seeding System

Custom TypeScript seed script that parses Analytics_Test_Data.json and inserts:

Vendors

Customers

Payments

Invoices

Line items

Documents

Automatically executed during Render deployment.

🛠️ Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

TailwindCSS

Recharts

ShadCN UI

Backend

Node.js

Express

TypeScript

Prisma ORM

Zod (optional validation)

Infra

Vercel (frontend)

Render (backend + database)

Managed PostgreSQL

📁 Project Structure
flowbitAI-assignment/
│
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express + Prisma backend
│
└── prisma/         # Prisma schema & migrations

Backend Structure
apps/api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── prisma/seed.ts
│   ├── routes/
│   ├── server.ts
│   └── data/Analytics_Test_Data.json
└── dist/

⚙️ Environment Variables
✅ Frontend (apps/web/.env)
NEXT_PUBLIC_API_BASE=https://flowbitai-assginment.onrender.com

✅ Backend (apps/api/.env)
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>
PORT=4000
NODE_ENV=production

▶️ Local Development
Start Backend
cd apps/api
npm install
npx prisma generate
npm run dev

Start Frontend
cd apps/web
npm install
npm run dev


Local URLs:

Frontend → http://localhost:3000

Backend → http://localhost:4000

🚀 Deployment
✅ Backend (Render)

Build Command:

npm install
npx prisma generate
npm run build


Start Command:

npm start

✅ Frontend (Vercel)

Auto-detects Next.js
Add env variable:

NEXT_PUBLIC_API_BASE=https://flowbitai-assginment.onrender.com

✅ Screenshots

(Add these in final submission)

Dashboard

Charts

Vendor table

/stats API response

✅ Assignment Summary

All requirements ✅ Completed:

✅ Pixel-perfect UI

✅ Real backend analytics

✅ Fully functional charts

✅ Normalized database

✅ Seeded dataset

✅ Fully deployed (Vercel + Render)

✅ Production-ready codebase

📝 Author

Sourav Mahata
Full Stack Developer
2025
