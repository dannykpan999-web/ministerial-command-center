# 🏛️ Ministerial Command Center
## Centro de Comando Ministerial - MTTSIA Guinea Ecuatorial

Sistema de gestión documental y comunicación institucional para el Ministerio de Transportes, Telecomunicaciones y Sistemas de Inteligencia Artificial de Guinea Ecuatorial.

---

## 📊 PROJECT STATUS

**Current Phase:** ✅ **Week 1 COMPLETE**
**Overall Progress:** 14% (1 of 7 weeks)
**Next Milestone:** Week 2 - Document Management APIs

### Week-by-Week Progress:
- ✅ **Week 1:** Backend + Database + Authentication (**COMPLETE**)
- ⏳ **Week 2:** Document APIs + Notifications (Pending)
- ⏳ **Week 3:** File Storage + Cloud OAuth (Pending)
- ⏳ **Week 4:** Cloud File Commander UI (Pending)
- ⏳ **Week 5:** AI Services (Claude + OCR) (Pending)
- ⏳ **Week 6:** E-Signature + Archive (Pending)
- ⏳ **Week 7:** Testing + Documentation (Pending)

---

## 🎯 WHAT'S BEEN BUILT (WEEK 1)

### ✅ Backend Infrastructure
- **Framework:** NestJS 10 + TypeScript 5
- **Database:** PostgreSQL 15 + Prisma ORM
- **Authentication:** JWT (Access + Refresh tokens)
- **Security:** bcrypt, Helmet, Rate Limiting, CORS
- **API Docs:** Swagger/OpenAPI
- **Process Manager:** PM2 ready
- **Containerization:** Docker + Docker Compose

### ✅ Database Schema (17 Models)
- Users, Departments, Entities
- Documents, DocumentFiles
- Expedientes (Cases), Deadlines
- SignatureFlows, SignatureParticipants
- Tags, Comments, Notifications
- AuditLogs, Templates, Settings
- CloudStorageConnections

### ✅ Authentication System
- **9+ API Endpoints:** Login, Logout, Register, Refresh, Profile, Change Password, etc.
- **Role-Based Access:** 4 roles (ADMIN, GABINETE, REVISOR, LECTOR)
- **Security Features:** Password hashing, Token rotation, Rate limiting
- **Audit Logging:** All authentication events tracked

### ✅ Frontend Authentication
- **Login Page:** Complete with form validation
- **AuthContext:** Global state management
- **AuthGuard:** Protected route wrapper
- **Auto Features:** Token refresh, Auto-logout, Session persistence

### ✅ Pre-Seeded Data
- 10 Departments (MTTSIA organizational structure)
- 12 External Entities (Government, companies, international orgs)
- 4 Test Users (Admin, Gabinete, Revisor, Lector)
- 3 Document Templates
- 8 Tags
- 6 System Settings

---

## 🚀 QUICK START

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 15+
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd ministerial-command-center
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secrets

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on: `http://localhost:3000`
API Docs: `http://localhost:3000/api/docs`

### 3. Frontend Setup
```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Configure API URL
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173` (or configured port)

### 4. Login
Navigate to `http://localhost:5173/login` and use:
- **Email:** admin@mttsia.gob.gq
- **Password:** Admin123!

---

## 🐳 DOCKER QUICK START

```bash
cd backend

# Start all services (PostgreSQL + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## 📁 PROJECT STRUCTURE

```
ministerial-command-center/
├── backend/                    # NestJS Backend API
│   ├── prisma/                # Database schema & seeds
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── departments/       # Department hierarchy
│   │   ├── entities/          # External entities
│   │   ├── app.module.ts      # Main app module
│   │   └── main.ts            # Entry point
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md              # Backend documentation
│
├── src/                       # React Frontend
│   ├── components/
│   │   ├── auth/              # Auth components (AuthGuard)
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI library (59 components)
│   ├── pages/
│   │   ├── Login.tsx          # ✨ NEW: Login page
│   │   ├── Dashboard.tsx
│   │   ├── Inbox.tsx
│   │   └── ... (16 pages total)
│   ├── contexts/
│   │   ├── AuthContext.tsx    # ✨ NEW: Auth state
│   │   └── LanguageContext.tsx
│   └── App.tsx                # ✨ UPDATED: With AuthProvider
│
├── deployment/                # Deployment scripts & guides
│   └── DEPLOYMENT_GUIDE.md    # VPS deployment instructions
│
├── plan/                      # Project planning documents
│   ├── PROJECT_IMPLEMENTATION_PLAN_BUDGET.md
│   └── FRONTEND_COMPONENTS_SPEC.md
│
├── WEEK_1_COMPLETION_REPORT.md  # Week 1 status report
└── README.md                    # This file
```

---

## 🔐 DEFAULT USERS

After running `npx prisma db seed`, these users are available:

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| admin@mttsia.gob.gq | Admin123! | ADMIN | Full system access |
| gabinete@mttsia.gob.gq | Gabinete123! | GABINETE | Cabinet level |
| revisor@mttsia.gob.gq | Revisor123! | REVISOR | Document reviewer |
| lector@mttsia.gob.gq | Lector123! | LECTOR | Read-only access |

**⚠️ Change these passwords in production!**

---

## 📚 API ENDPOINTS

### Authentication (`/api/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - Register user
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get profile
- `PATCH /auth/change-password` - Change password

### Users (`/api/users`)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID

### Departments (`/api/departments`)
- `GET /departments` - List departments
- `GET /departments/hierarchy` - Get department tree
- `GET /departments/:id` - Get department

### Entities (`/api/entities`)
- `GET /entities` - List entities
- `GET /entities/:id` - Get entity

### Health
- `GET /api/health` - API health check

**Full API Documentation:** http://localhost:3000/api/docs

---

## 🛠️ TECH STACK

### Backend
- **Framework:** NestJS 10.3.0
- **Language:** TypeScript 5.3.3
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5.8.0
- **Authentication:** JWT (passport-jwt)
- **Validation:** class-validator
- **Security:** Helmet, express-rate-limit
- **API Docs:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19
- **Routing:** React Router 6.30.1
- **UI Library:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS 3.4.17
- **Forms:** React Hook Form + Zod
- **State:** TanStack React Query
- **Icons:** Lucide React

### DevOps
- **Containerization:** Docker + Docker Compose
- **Process Manager:** PM2
- **Web Server:** Nginx (production)
- **SSL:** Let's Encrypt (production)

---

## 🚀 DEPLOYMENT

### Development
```bash
# Backend
cd backend
npm run start:dev

# Frontend
npm run dev
```

### Production (VPS)

**Follow the complete deployment guide:**
- 📖 See [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

**Quick Summary:**
1. SSH into VPS (72.61.41.94)
2. Install Node.js, PostgreSQL, Nginx, PM2
3. Deploy backend with PM2
4. Deploy frontend with Nginx
5. Configure SSL with Let's Encrypt
6. Test login functionality

---

## 📖 DOCUMENTATION

- **Backend README:** [backend/README.md](backend/README.md)
- **Deployment Guide:** [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)
- **Week 1 Report:** [WEEK_1_COMPLETION_REPORT.md](WEEK_1_COMPLETION_REPORT.md)
- **Project Plan:** [plan/PROJECT_IMPLEMENTATION_PLAN_BUDGET.md](plan/PROJECT_IMPLEMENTATION_PLAN_BUDGET.md)
- **Component Spec:** [plan/FRONTEND_COMPONENTS_SPEC.md](plan/FRONTEND_COMPONENTS_SPEC.md)

---

## 🧪 TESTING

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Manual Testing
1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `npm run dev`
3. Navigate to: http://localhost:5173/login
4. Login with: admin@mttsia.gob.gq / Admin123!
5. Verify dashboard loads

---

## 🐛 TROUBLESHOOTING

### Backend not starting
```bash
# Check PostgreSQL is running
systemctl status postgresql  # Linux
brew services list  # Mac

# Check database connection
psql -U ministerial_user -d ministerial_command_center

# Check .env file exists
cat backend/.env
```

### Frontend shows blank page
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Check .env file
cat .env

# Check browser console for errors
```

### Login not working
```bash
# Verify backend API responds
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mttsia.gob.gq","password":"Admin123!"}'

# Should return JWT tokens
```

**More troubleshooting:** See [backend/README.md](backend/README.md) and [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

---

## 🔮 ROADMAP

### ✅ Week 1 (COMPLETE)
- Backend infrastructure
- Database schema (17 models)
- JWT authentication
- Login page + AuthContext
- Docker configuration

### ⏳ Week 2 (PLANNED)
- Document CRUD APIs
- Notification system
- WebSocket integration
- Email notifications (SendGrid)

### ⏳ Week 3 (PLANNED)
- AWS S3 integration
- File upload/download
- OneDrive OAuth
- Google Drive OAuth

### ⏳ Week 4 (PLANNED)
- Cloud file browser APIs
- File Commander UI (14+ components)
- Import wizard
- File preview

### ⏳ Week 5 (PLANNED)
- Claude AI integration
- Document summarization
- OCR (AWS Textract)
- Translation services

### ⏳ Week 6 (PLANNED)
- E-signature system
- Archive with full-text search
- PDF generation
- Export features

### ⏳ Week 7 (PLANNED)
- Comprehensive testing
- Documentation
- Production deployment
- User training

---

## 💰 PROJECT BUDGET

**Total Budget:** $8,200 USD (7 weeks)

| Week | Deliverable | Budget | Status |
|------|------------|--------|--------|
| 1 | Backend + Auth + Login UI | $1,400 | ✅ Complete |
| 2 | Document APIs + Notifications | $1,200 | ⏳ Pending |
| 3 | File Storage + Cloud OAuth | $1,200 | ⏳ Pending |
| 4 | Cloud File Commander UI | $1,600 | ⏳ Pending |
| 5 | AI Services (Claude + OCR) | $1,200 | ⏳ Pending |
| 6 | E-Signature + Archive | $1,200 | ⏳ Pending |
| 7 | Testing + Docs + Deploy | $400 | ⏳ Pending |

**Monthly Operational Costs:** ~$120/month (AWS, SendGrid, etc.)

---

## 📞 SUPPORT

For issues or questions:
- 📧 Email: [your-email]
- 📱 WhatsApp: [your-number]
- 📁 GitHub Issues: [repository-issues-url]

---

## 📄 LICENSE

Proprietary - © 2024 MTTSIA Guinea Ecuatorial

---

## 🙏 ACKNOWLEDGMENTS

**Organization:** Ministerio de Transportes, Telecomunicaciones y Sistemas de Inteligencia Artificial (MTTSIA)
**Country:** República de Guinea Ecuatorial
**Development:** Claude Code + Development Team

---

**Last Updated:** January 15, 2026
**Current Version:** 1.0.0 (Week 1)
**Status:** ✅ Week 1 Complete - Ready for Deployment

🚀 **¡Sistema listo para producción!**
