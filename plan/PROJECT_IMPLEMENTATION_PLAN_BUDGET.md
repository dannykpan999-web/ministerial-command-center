# MINISTERIAL COMMAND CENTER - IMPLEMENTATION PLAN
## Cloud File Management Integration & Backend Development
### Timeline: 1.5 Months (6 Weeks) | MVP Delivery
### **REVISED Total Project Budget: $8,200 USD**
### **⚠️ IMPORTANT UPDATE**: Frontend UI gaps identified - budget increased to include frontend development

---

## EXECUTIVE SUMMARY

**Project Goal**: Transform the current frontend-only application into a fully functional cloud-integrated document management system with File Commander-like capabilities.

**Client Request**: Integration of file management functionality similar to Android's File Commander app, including cloud storage access (OneDrive, Google Drive) within the ministerial AI platform.

**Total Budget**: **$8,200 USD** (Revised from $7,000)
- Backend Development: $7,000 (original estimate)
- Frontend Development: $1,200 (additional - see breakdown below)
- API/Infrastructure costs: Separate operational budget (detailed below)

**Why the budget increase?**
During frontend analysis, we discovered critical UI components are missing:
- ❌ Authentication UI (Login/Register pages) - 0% complete
- ❌ Cloud File Browser (Week 4 core feature) - 0% complete
- ❌ 14+ file management components missing
- Frontend is currently 65% complete, not 100% as initially assumed

**Current Status**:
- ✅ Complete React/TypeScript frontend (16 pages, 50+ components) - **65% of needed UI**
- ✅ Excellent mobile responsiveness with iOS optimization
- ✅ Comprehensive UI/UX for document workflows
- ❌ **Authentication UI missing** (Login, Register, AuthGuard) - **0% complete**
- ❌ **Cloud Storage page missing** (CloudStorage.tsx) - **0% complete**
- ❌ **File management components missing** (14+ components) - **0% complete**
- ❌ No backend integration (100% mock data)
- ❌ No authentication system
- ❌ No file storage (cloud or local)
- ❌ No real AI/OCR services
- ❌ No database persistence

**Delivery Approach**: Feature-based MVP development with weekly milestones and payments

---

## BUDGET BREAKDOWN BY MILESTONE

### REVISED Payment Structure
| Milestone | Week | Deliverable | Payment | Cumulative |
|-----------|------|-------------|---------|------------|
| **Milestone 1** | Week 1 | Backend + Database + Auth + **Login/Register UI** | **$1,400** | $1,400 |
| **Milestone 2** | Week 2 | Document APIs + Notifications | $1,200 | $2,600 |
| **Milestone 3** | Week 3 | AWS S3 + Cloud OAuth | $1,200 | $3,800 |
| **Milestone 4** | Week 4 | Cloud File Browser Backend + **Complete File Commander UI** | **$1,600** | $5,400 |
| **Milestone 5** | Week 5 | AI Services (Claude + OCR) | $1,200 | $6,600 |
| **Milestone 6** | Week 6 | E-Signature + Archive + Deployment + Docs | $1,200 | $7,800 |
| **Milestone 7** | Week 7 | Testing + Bug Fixes + Polish | $400 | **$8,200** |

**Changes from original plan:**
- ✨ Week 1: +$200 for Login/Register UI development
- ✨ Week 4: +$400 for complete File Commander UI (14+ components)
- ✨ Week 6: +$200 for enhanced testing
- ✨ Week 7: +$400 for final testing, bug fixes, and polish

**Payment Terms**: Payment upon completion and approval of each weekly milestone demo.

---

## API & INFRASTRUCTURE COSTS
**Note**: These are OPERATIONAL costs (separate from $7,000 development budget)

### Third-Party API Pricing (Monthly)

#### 1. Cloud Storage APIs
| Service | Usage Tier | Monthly Cost |
|---------|-----------|--------------|
| **Microsoft OneDrive API** | Free tier | $0 |
| **Google Drive API** | Free tier (1 billion requests/day) | $0 |
| **Dropbox API** (Optional) | Free tier | $0 |

#### 2. AI Services
| Service | Usage Estimate | Cost per Unit | Monthly Cost |
|---------|----------------|---------------|--------------|
| **Claude API (Anthropic)** | 1M input tokens | $3.00 per 1M tokens | $3-15 |
| | 500K output tokens | $15.00 per 1M tokens | $7.50 |
| | **Total AI** | | **~$10-20/month** |

**Claude API Pricing Details**:
- Model: Claude 3.5 Sonnet (recommended)
- Input: $3.00 per million tokens (~750,000 words)
- Output: $15.00 per million tokens
- Usage estimate: 50 document summaries/day = ~15K tokens/day
- Monthly: ~$12-15 for typical ministerial use

#### 3. AWS Services
| Service | Usage Estimate | Cost per Unit | Monthly Cost |
|---------|----------------|---------------|--------------|
| **EC2 (t3.medium)** | 720 hours/month | $0.0416/hour | $30.00 |
| **RDS PostgreSQL (db.t3.micro)** | 720 hours/month | $0.017/hour | $12.25 |
| **S3 Storage** | 100 GB | $0.023/GB | $2.30 |
| **S3 Requests** | 100K requests | $0.0004/1K | $0.40 |
| **Data Transfer** | 50 GB/month | $0.09/GB | $4.50 |
| **AWS Textract (OCR)** | 1,000 pages | $1.50/1K pages | $1.50 |
| **AWS Transcribe** (Optional) | 10 hours audio | $2.40/hour | $24.00 |
| **CloudWatch (Monitoring)** | Basic metrics | Free tier | $0.00 |
| **AWS SES (Email)** | 10,000 emails | $0.10/1K | $1.00 |
| **Subtotal AWS** | | | **$75.95/month** |

**AWS Pricing Notes**:
- EC2: Web server hosting (4GB RAM, 2 vCPUs)
- RDS: Managed PostgreSQL database
- S3: Document storage (grows with usage)
- Textract: OCR for scanned documents ($1.50 per 1,000 pages)
- Transcribe: Optional audio/video transcription

#### 4. Email & Communication
| Service | Usage Estimate | Cost per Unit | Monthly Cost |
|---------|----------------|---------------|--------------|
| **SendGrid** | 40,000 emails/month | Free tier | $0 |
| | OR 100K emails/month | $19.95/month | $19.95 |
| **Twilio WhatsApp** (Optional) | 1,000 messages | $0.005/message | $5.00 |
| **Subtotal Communication** | | | **$0-25/month** |

**SendGrid Tiers**:
- Free: 100 emails/day (3,000/month) - Good for testing
- Essentials: $19.95/month for 100K emails - Recommended for production

### TOTAL MONTHLY OPERATIONAL COSTS

| Category | Minimum | Recommended | With All Features |
|----------|---------|-------------|-------------------|
| **Cloud APIs** | $0 | $0 | $0 |
| **AI Services** | $10 | $15 | $20 |
| **AWS Infrastructure** | $50 | $76 | $100 |
| **Email/SMS** | $0 | $20 | $25 |
| **Domain + SSL** | $1 | $1 | $1 |
| **TOTAL/MONTH** | **$61** | **$112** | **$146** |

**Budget Recommendation**: $112/month for production-ready system

---

## PHASE 1: FOUNDATION & AUTHENTICATION (Week 1-2)
**Budget Allocation**: $2,400 ($1,200 per week)

### Week 1: Backend Architecture Setup + Authentication UI
**Milestone Payment**: **$1,400** upon completion (increased from $1,200)

#### 1.1 Backend Technology Stack Selection
**Deliverable**: Backend Framework Setup Document

**Technology Stack**:
- **Backend**: Node.js + NestJS (TypeScript-native, enterprise-grade)
- **Database**: PostgreSQL 15+ with Prisma ORM
- **File Storage**: AWS S3 (primary) + Azure Blob (optional)
- **Authentication**: JWT + Passport.js
- **Hosting**: AWS EC2/ECS or Azure App Service

**Tasks**:
- [ ] Initialize NestJS project with TypeScript
- [ ] Configure Prisma ORM with PostgreSQL
- [ ] Set up environment configuration (.env)
- [ ] Configure ESLint + Prettier for backend
- [ ] Set up Docker containers for local development
- [ ] Create project folder structure
- [ ] Set up AWS account and configure services
- [ ] Configure development environment

**Estimated Time**: 3 days

**API Costs This Week**: $0 (setup only, no usage)

---

#### 1.2 Database Schema Design
**Deliverable**: Complete Prisma Schema + ER Diagram

**Core Tables** (15+ models):
1. **users** - User accounts with roles (admin, gabinete, revisor, lector)
2. **departments** - Hierarchical department structure (MTTSIA organization)
3. **entities** - External organizations (public companies, government, private)
4. **documents** - Main document registry with correlative numbers
5. **expedientes** - Case files (group related documents)
6. **document_files** - Physical file metadata (S3 keys, sizes, versions)
7. **cloud_storage_connections** - OAuth tokens for OneDrive/Google Drive
8. **signature_flows** - E-signature workflows with multiple signers
9. **signature_participants** - Signers and validators
10. **audit_logs** - Complete audit trail (who did what when)
11. **notifications** - System notifications (email queue)
12. **templates** - Document templates with variables
13. **tags** - Document categorization tags
14. **comments** - Document comments and annotations
15. **settings** - System configuration

**Prisma Schema Example**:
```prisma
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  password      String      // bcrypt hashed
  firstName     String
  lastName      String
  position      String?
  phone         String?
  whatsapp      String?
  role          Role        @default(LECTOR)
  departmentId  String
  department    Department  @relation(fields: [departmentId], references: [id])
  documents     Document[]
  isActive      Boolean     @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([departmentId])
  @@index([email])
}

enum Role {
  ADMIN
  GABINETE
  REVISOR
  LECTOR
}

model Document {
  id                  String      @id @default(cuid())
  correlativeNumber   String      @unique  // ENT-2024-001542
  title               String
  type                String      // Oficio, Memorando, Circular, etc.
  status              DocStatus   @default(PENDING)
  direction           Direction   // in, out
  classification      Classification  // internal, external
  channel             String?     // physical, email, etc.
  origin              String?
  entityId            String
  entity              Entity      @relation(fields: [entityId], references: [id])
  responsibleId       String
  responsible         User        @relation(fields: [responsibleId], references: [id])
  files               DocumentFile[]
  expedienteId        String?
  expediente          Expediente? @relation(fields: [expedienteId], references: [id])
  priority            Priority?
  tags                Tag[]
  aiSummary           String?     @db.Text
  aiProposedResponse  String?     @db.Text
  aiKeyPoints         String[]
  content             String?     @db.Text
  decretedTo          String[]    // Department IDs
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([correlativeNumber])
  @@index([status])
  @@index([entityId])
  @@index([responsibleId])
  @@fulltext([title, content])
}

model DocumentFile {
  id            String      @id @default(cuid())
  documentId    String
  document      Document    @relation(fields: [documentId], references: [id])
  fileName      String
  fileSize      Int         // bytes
  mimeType      String
  storageType   StorageType // S3, AZURE, ONEDRIVE, GDRIVE
  storagePath   String      // S3 key or cloud file ID
  storageUrl    String?     // Presigned URL
  thumbnailUrl  String?
  version       Int         @default(1)
  hash          String?     // SHA-256 for integrity
  uploadedById  String
  uploadedBy    User        @relation(fields: [uploadedById], references: [id])
  createdAt     DateTime    @default(now())

  @@index([documentId])
}

model CloudStorageConnection {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  provider      CloudProvider // ONEDRIVE, GDRIVE, DROPBOX
  accessToken   String        @db.Text
  refreshToken  String        @db.Text
  expiresAt     DateTime
  email         String
  displayName   String?
  isActive      Boolean       @default(true)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@unique([userId, provider])
  @@index([userId])
}

enum CloudProvider {
  ONEDRIVE
  GDRIVE
  DROPBOX
}

enum StorageType {
  S3
  AZURE
  ONEDRIVE
  GDRIVE
  DROPBOX
}
```

**Tasks**:
- [ ] Design complete Prisma schema (15+ models)
- [ ] Create database migrations
- [ ] Seed database with MTTSIA organizational structure
- [ ] Seed initial departments (10+ departments)
- [ ] Seed external entities (30+ organizations)
- [ ] Generate Prisma Client
- [ ] Create ER diagram documentation (Draw.io)
- [ ] Test database queries

**Estimated Time**: 2 days

**API Costs This Week**: $0 (database setup only)

---

#### 1.3 Authentication System
**Deliverable**: Complete JWT Authentication with RBAC

**Features**:
- User registration (admin-only endpoint)
- Login with email/password (bcrypt hashing)
- JWT token generation (access: 15min, refresh: 7 days)
- Refresh token rotation
- Role-based authorization guards (@Roles decorator)
- Session management (Redis optional)
- Password reset flow (email token)
- Account activation via email

**API Endpoints**:
```typescript
POST   /api/auth/register          - Create new user (admin only)
POST   /api/auth/login             - User login (returns JWT)
POST   /api/auth/logout            - Invalidate refresh token
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset with token
GET    /api/auth/me                - Get current user profile
PATCH  /api/auth/me                - Update profile
POST   /api/auth/change-password   - Change own password
```

**Security Implementation**:
- **Bcrypt** for password hashing (10 rounds)
- **JWT** with RS256 algorithm (RSA keys)
- **HTTP-only cookies** for refresh tokens
- **CORS** configuration (whitelist frontend domain)
- **Helmet.js** for security headers
- **Rate limiting** (5 login attempts per minute per IP)
- **Class-validator** for input validation
- **Prisma** SQL injection prevention (parameterized queries)

**JWT Token Structure**:
```typescript
// Access Token (15 minutes)
{
  sub: 'user_id',
  email: 'user@mttsia.gob.bo',
  role: 'GABINETE',
  departmentId: 'dept_123',
  iat: 1234567890,
  exp: 1234568790
}

// Refresh Token (7 days)
{
  sub: 'user_id',
  type: 'refresh',
  iat: 1234567890,
  exp: 1235172690
}
```

**Tasks**:
- [ ] Install dependencies (passport, bcrypt, @nestjs/jwt)
- [ ] Create AuthModule with JWT strategy
- [ ] Implement password hashing service
- [ ] Create login endpoint with validation
- [ ] Implement JWT token generation
- [ ] Create refresh token rotation
- [ ] Implement role guards (@Roles decorator)
- [ ] Create password reset with email tokens
- [ ] Add rate limiting (express-rate-limit)
- [ ] Configure CORS and security headers

#### **NEW: 1.4 Authentication UI Development** ⭐
**Deliverable**: Complete Login/Register pages + Auth system

**Frontend Components to Create**:
```typescript
src/pages/Login.tsx                 // Login page with form validation
src/pages/Register.tsx              // Registration page (admin invite flow)
src/contexts/AuthContext.tsx        // Auth state management
src/components/auth/
├── LoginForm.tsx                   // Reusable login form
├── AuthGuard.tsx                   // Protected route wrapper
├── PasswordResetModal.tsx          // Forgot password flow
└── SessionTimeout.tsx              // Auto-logout on inactivity
```

**Features**:
- Email + Password login form with validation
- JWT token storage (localStorage with encryption)
- Auto-refresh tokens before expiration
- Auto-logout on 401 responses
- Protected routes (redirect to /login if not authenticated)
- Session timeout warning (15 min inactivity)
- Remember me checkbox (7-day token)
- Show user info in sidebar after login
- Password reset flow (email token)

**Tasks**:
- [ ] **Frontend**: Create Login.tsx page
- [ ] **Frontend**: Create Register.tsx page
- [ ] **Frontend**: Create AuthContext with state
- [ ] **Frontend**: Create AuthGuard component
- [ ] **Frontend**: Add login form validation (Zod)
- [ ] **Frontend**: Integrate login API call
- [ ] **Frontend**: Store tokens securely
- [ ] **Frontend**: Add auto-refresh logic
- [ ] **Frontend**: Implement auto-logout on 401
- [ ] **Frontend**: Add session timeout detection
- [ ] **Frontend**: Update App.tsx routing with AuthGuard
- [ ] **Frontend**: Update Sidebar with user info
- [ ] **Frontend**: Create PasswordResetModal

**Estimated Time**:
- Backend auth: 3 days
- Frontend auth UI: 2 days
- **Total Week 1: 5 days** (includes setup + database + auth backend + auth UI)

**API Costs This Week**:
- AWS SES: $0 (testing emails, <100)
- SendGrid: $0 (free tier)

---

### Week 2: Core Document Management APIs
**Milestone Payment**: $1,200 upon completion

#### 2.1 Document CRUD Operations
**Deliverable**: REST API for Document Management

**API Endpoints** (15+ endpoints):
```typescript
// Document Management
GET    /api/documents              - List documents (paginated, filtered)
GET    /api/documents/:id          - Get document details
POST   /api/documents              - Create new document
PATCH  /api/documents/:id          - Update document
DELETE /api/documents/:id          - Soft delete document
POST   /api/documents/:id/decree   - Decree to departments
POST   /api/documents/:id/assign   - Assign to user
PATCH  /api/documents/:id/status   - Update status

// Specialized Views
GET    /api/documents/inbox        - Get inbox documents (direction: in)
GET    /api/documents/outbox       - Get outbox documents (direction: out)
GET    /api/documents/pending      - Get pending documents
GET    /api/documents/my           - Get documents assigned to me

// Search & Filter
GET    /api/documents/search       - Full-text search
GET    /api/documents/by-entity/:id - Documents by entity
GET    /api/documents/by-date      - Documents by date range

// Statistics
GET    /api/documents/stats        - Dashboard statistics
```

**Features**:
- **Pagination**: Cursor-based + offset (page, limit, cursor)
- **Filtering**: 15+ filters
  - status (pending, in_progress, completed, archived)
  - direction (in, out)
  - type (oficio, memorando, circular, etc.)
  - entityId (filter by organization)
  - responsibleId (filter by user)
  - priority (low, medium, high, urgent)
  - dateRange (createdAt between X and Y)
  - tags (array filter)
  - hasAiSummary (boolean)
  - expedienteId (filter by case)
- **Sorting**: Multi-column sort
  - createdAt (DESC by default)
  - updatedAt
  - correlativeNumber
  - priority
- **Full-text Search**: PostgreSQL tsvector
- **Correlative Number**: Auto-generation (ENT-YYYY-NNNNNN)
- **Status Workflow**: Validation (pending → in_progress → completed)
- **Audit Logging**: Automatic on all operations

**Pagination Example**:
```typescript
GET /api/documents?page=1&limit=20&status=pending&sort=createdAt:DESC

Response:
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 156,
    totalPages: 8,
    hasNext: true,
    hasPrev: false
  }
}
```

**Full-Text Search Implementation**:
```sql
-- Add tsvector column
ALTER TABLE documents ADD COLUMN search_vector tsvector;

-- Create GIN index for fast search
CREATE INDEX documents_search_idx
ON documents USING GIN(search_vector);

-- Update trigger
CREATE TRIGGER documents_search_update
BEFORE INSERT OR UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(
  search_vector,
  'pg_catalog.spanish',
  title, content
);
```

**Tasks**:
- [ ] Create DocumentModule (service + controller)
- [ ] Implement CRUD operations with Prisma
- [ ] Add pagination helper utility
- [ ] Implement advanced filter builder
- [ ] Create full-text search (tsvector)
- [ ] Add correlative number generator service
- [ ] Implement decree functionality (notify departments)
- [ ] Add RBAC authorization (guards per endpoint)
- [ ] Create DTOs with class-validator
- [ ] Write unit tests (Jest) for service
- [ ] **Frontend**: Replace mockData with API calls
- [ ] **Frontend**: Update Inbox.tsx with real API
- [ ] **Frontend**: Update Outbox.tsx with real API
- [ ] **Frontend**: Connect filters to API params
- [ ] **Frontend**: Implement pagination UI

**Estimated Time**: 3 days

**API Costs This Week**: $0 (internal API, no external costs)

---

#### 2.2 User & Department Management
**Deliverable**: User and organizational structure APIs

**API Endpoints**:
```typescript
// User Management
GET    /api/users                  - List users (admin only)
GET    /api/users/:id              - Get user details
POST   /api/users                  - Create user (admin)
PATCH  /api/users/:id              - Update user (admin or self)
DELETE /api/users/:id              - Deactivate user (admin)
POST   /api/users/:id/activate     - Reactivate user

// Department Management
GET    /api/departments            - Get full hierarchy
GET    /api/departments/:id        - Get department details
GET    /api/departments/:id/users  - Get users in department
GET    /api/departments/:id/tree   - Get department subtree

// Entity Management
GET    /api/entities               - List external entities
GET    /api/entities/:id           - Get entity details
POST   /api/entities               - Create entity (admin)
PATCH  /api/entities/:id           - Update entity
```

**Department Hierarchy Structure**:
```typescript
{
  id: "dept_001",
  name: "Ministerio de Transportes, Telecomunicaciones y Sistemas de IA",
  shortName: "MTTSIA",
  level: 1,
  parentId: null,
  children: [
    {
      id: "dept_002",
      name: "Despacho del Ministro",
      level: 2,
      parentId: "dept_001",
      children: [...]
    },
    // ... more departments
  ]
}
```

**Tasks**:
- [ ] Create UserModule with CRUD
- [ ] Implement user profile endpoints
- [ ] Create DepartmentModule
- [ ] Implement hierarchical queries (WITH RECURSIVE)
- [ ] Add department tree builder
- [ ] Create EntityModule with CRUD
- [ ] Seed MTTSIA organizational structure (20+ departments)
- [ ] Seed external entities (30+ organizations)
- [ ] Add role management (assign/revoke roles)
- [ ] Implement user search
- [ ] **Frontend**: Integrate Settings.tsx user management
- [ ] **Frontend**: Update department selectors with real data
- [ ] **Frontend**: Connect entity dropdowns to API

**Estimated Time**: 2 days

**API Costs This Week**: $0

---

#### 2.3 Notifications & Audit System
**Deliverable**: Email notifications and audit logging

**Features**:
- **Database Notifications**: In-app notification center
- **Email Notifications**: SendGrid or AWS SES
- **Audit Trail**: Automatic logging of all operations
- **Real-time Updates**: WebSocket for live notifications (Socket.io)

**API Endpoints**:
```typescript
// Notifications
GET    /api/notifications          - Get user notifications (paginated)
GET    /api/notifications/unread   - Get unread count
PATCH  /api/notifications/:id/read - Mark as read
PATCH  /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id      - Delete notification

// Audit Logs (Admin only)
GET    /api/audit-logs             - Get audit trail
GET    /api/audit-logs/user/:id    - Get user activity
GET    /api/audit-logs/document/:id - Get document history
GET    /api/audit-logs/export      - Export logs (CSV)
```

**Email Notification Types**:
1. **Document Decreed** - When document is decreed to your department
2. **Document Assigned** - When document is assigned to you
3. **Status Changed** - When document status changes
4. **Comment Added** - When someone comments on your document
5. **Signature Required** - When your signature is needed
6. **Deadline Reminder** - 24h before deadline
7. **Welcome Email** - New user account created

**Email Template Example**:
```html
Subject: Documento Decretado - {{correlativeNumber}}

Estimado/a {{userName}},

Se le ha decretado el siguiente documento:

Correlativo: {{correlativeNumber}}
Título: {{documentTitle}}
Entidad: {{entityName}}
Prioridad: {{priority}}

Acceda al sistema para revisar:
{{documentUrl}}

---
Centro de Comando Ministerial - MTTSIA
```

**Audit Log Structure**:
```typescript
{
  id: "audit_123",
  userId: "user_456",
  user: { name: "Juan Pérez" },
  action: "DOCUMENT_UPDATED",
  resourceType: "DOCUMENT",
  resourceId: "doc_789",
  changes: {
    before: { status: "pending" },
    after: { status: "in_progress" }
  },
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: "2024-01-15T10:30:00Z"
}
```

**Tasks**:
- [ ] Create NotificationModule
- [ ] Set up SendGrid API key (or AWS SES)
- [ ] Create email service with templates
- [ ] Design HTML email templates (7 types)
- [ ] Implement notification creation on events
- [ ] Create audit log interceptor (logs all API calls)
- [ ] Create AuditLogModule
- [ ] Implement WebSocket gateway (Socket.io)
- [ ] Add real-time notification push
- [ ] **Frontend**: Connect notification bell to API
- [ ] **Frontend**: Show unread count
- [ ] **Frontend**: Real-time updates via WebSocket
- [ ] **Frontend**: Toast notifications for new alerts

**Estimated Time**: 2 days

**API Costs This Week**:
- SendGrid: $0 (free tier - testing)
- AWS SES: $0 (testing)

---

## PHASE 2: FILE STORAGE & CLOUD INTEGRATION (Week 3-4)
**Budget Allocation**: $2,400 ($1,200 per week)

### Week 3: File Storage Infrastructure
**Milestone Payment**: $1,200 upon completion

#### 3.1 AWS S3 Integration
**Deliverable**: File upload/download system with AWS S3

**Features**:
- **Multipart upload** for large files (up to 5GB per file)
- **Presigned URLs** for direct client-to-S3 upload
- **File streaming** for downloads
- **Versioning** (keep file history)
- **Thumbnail generation** for images (Sharp library)
- **PDF preview** generation (pdf-thumbnail)
- **Virus scanning** (ClamAV or AWS S3 scanning)
- **File metadata** storage in PostgreSQL

**API Endpoints**:
```typescript
// File Upload
POST   /api/files/upload-url        - Get presigned upload URL
POST   /api/files/upload-complete   - Confirm upload & save metadata
POST   /api/files/multipart/init    - Init multipart upload
POST   /api/files/multipart/part    - Upload part
POST   /api/files/multipart/complete - Complete multipart

// File Operations
GET    /api/files/:id               - Get file metadata
GET    /api/files/:id/download      - Download file (streaming)
GET    /api/files/:id/preview       - Get preview/thumbnail
GET    /api/files/:id/versions      - Get file version history
DELETE /api/files/:id               - Delete file (soft delete)
POST   /api/files/:id/restore       - Restore deleted file
```

**S3 Bucket Structure**:
```
ministerial-docs-production/
├── documents/               # Main document files
│   ├── 2024/
│   │   ├── 01/
│   │   │   ├── doc_123_v1.pdf
│   │   │   └── doc_123_v2.pdf
│   │   └── 02/
│   └── 2025/
├── thumbnails/             # Generated thumbnails
│   └── 2024/
│       └── 01/
│           └── doc_123_thumb.jpg
└── temp/                   # Temporary uploads (24h expiry)
    └── upload_abc123.tmp
```

**S3 Configuration**:
- **Bucket Policy**: Private (authenticated access only)
- **Encryption**: Server-side AES-256 (SSE-S3)
- **Versioning**: Enabled (keep previous versions)
- **Lifecycle Rules**:
  - Delete temp/ objects after 24 hours
  - Transition old versions to Glacier after 90 days
- **CORS**: Allow frontend domain
- **CloudFront**: Optional CDN for faster downloads

**Presigned URL Flow**:
```typescript
// 1. Client requests upload URL
POST /api/files/upload-url
Body: { fileName: "document.pdf", fileSize: 1024000, mimeType: "application/pdf" }

// 2. Server generates presigned URL
Response: {
  uploadUrl: "https://s3.amazonaws.com/bucket/key?signature=...",
  fileId: "file_123",
  expiresIn: 300  // 5 minutes
}

// 3. Client uploads directly to S3 (no server load)
PUT https://s3.amazonaws.com/bucket/key?signature=...
Body: <binary file data>

// 4. Client confirms upload
POST /api/files/upload-complete
Body: { fileId: "file_123", documentId: "doc_456" }

// 5. Server saves metadata to database
```

**Thumbnail Generation**:
```typescript
import sharp from 'sharp';

async generateThumbnail(s3Key: string): Promise<string> {
  // Download from S3
  const fileBuffer = await s3.getObject({ Key: s3Key }).promise();

  // Generate thumbnail (300x400)
  const thumbnail = await sharp(fileBuffer.Body)
    .resize(300, 400, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Upload thumbnail to S3
  const thumbKey = s3Key.replace('documents/', 'thumbnails/') + '_thumb.jpg';
  await s3.putObject({
    Key: thumbKey,
    Body: thumbnail,
    ContentType: 'image/jpeg'
  });

  return thumbKey;
}
```

**Tasks**:
- [ ] Set up AWS S3 bucket with proper IAM policies
- [ ] Install AWS SDK (@aws-sdk/client-s3)
- [ ] Create FileModule with S3 service
- [ ] Implement presigned URL generation
- [ ] Add multipart upload support (for large files)
- [ ] Create file download streaming endpoint
- [ ] Implement thumbnail generation (Sharp)
- [ ] Add PDF preview generation (pdf-thumbnail)
- [ ] Integrate virus scanning (ClamAV or S3 scanner)
- [ ] Create file metadata table queries
- [ ] Configure S3 lifecycle policies
- [ ] **Frontend**: Update NewEntry.tsx file upload
- [ ] **Frontend**: Add upload progress bar
- [ ] **Frontend**: Implement drag-drop upload zone
- [ ] **Frontend**: Show file previews/thumbnails
- [ ] **Frontend**: Add cancel upload functionality

**Estimated Time**: 4 days

**API Costs This Week**:
- AWS S3: $2-5 (initial storage + requests)
- AWS Data Transfer: $0-2 (testing)
- **Total: ~$2-7**

---

#### 3.2 Cloud Storage OAuth Integration
**Deliverable**: OneDrive and Google Drive connection

**Features**:
- **OAuth 2.0** for OneDrive (Microsoft Graph API)
- **OAuth 2.0** for Google Drive (Google Drive API v3)
- **Token storage** with encryption (AES-256)
- **Token refresh** automation (background job)
- **Multi-account** support (connect multiple accounts per user)

**API Endpoints**:
```typescript
// Cloud Provider Management
GET    /api/cloud-storage/providers        - List available providers
GET    /api/cloud-storage/connections      - Get user's cloud connections

// OneDrive OAuth
GET    /api/cloud-storage/connect/onedrive - Initiate OAuth (redirect to Microsoft)
GET    /api/cloud-storage/callback/onedrive - OAuth callback handler

// Google Drive OAuth
GET    /api/cloud-storage/connect/gdrive   - Initiate OAuth (redirect to Google)
GET    /api/cloud-storage/callback/gdrive  - OAuth callback handler

// Connection Management
GET    /api/cloud-storage/connections/:id  - Get connection details
DELETE /api/cloud-storage/connections/:id  - Disconnect cloud account
POST   /api/cloud-storage/connections/:id/refresh - Manually refresh token
```

**OAuth Flow Diagram**:
```
┌──────────┐                ┌──────────┐                ┌───────────┐
│  Client  │                │  Server  │                │ Microsoft │
│ (Browser)│                │ (NestJS) │                │  / Google │
└────┬─────┘                └────┬─────┘                └─────┬─────┘
     │                           │                            │
     │ 1. Click "Connect OneDrive"                           │
     ├──────────────────────────>│                            │
     │                           │                            │
     │ 2. Redirect to OAuth      │ 3. Initiate OAuth          │
     │<──────────────────────────┼───────────────────────────>│
     │                           │                            │
     │ 4. User logs in & authorizes                          │
     ├───────────────────────────────────────────────────────>│
     │                           │                            │
     │ 5. Redirect with auth code│                            │
     │<───────────────────────────────────────────────────────┤
     │                           │                            │
     │ 6. Send code to server    │                            │
     ├──────────────────────────>│ 7. Exchange code for tokens│
     │                           ├───────────────────────────>│
     │                           │ 8. Return access & refresh │
     │                           │<───────────────────────────┤
     │                           │                            │
     │ 9. Store encrypted tokens │                            │
     │    in database            │                            │
     │                           │                            │
     │ 10. Success response      │                            │
     │<──────────────────────────┤                            │
     │                           │                            │
```

**Microsoft Azure Setup** (OneDrive):
1. Create Azure App Registration
2. Configure redirect URI: `https://yourdomain.com/api/cloud-storage/callback/onedrive`
3. Required scopes:
   - `Files.Read` - Read user files
   - `Files.ReadWrite.All` - Read and write user files
   - `User.Read` - Read user profile
4. Get Client ID and Client Secret

**Google Cloud Setup** (Google Drive):
1. Create Google Cloud Project
2. Enable Google Drive API
3. Configure OAuth consent screen
4. Create OAuth 2.0 Client ID
5. Configure redirect URI: `https://yourdomain.com/api/cloud-storage/callback/gdrive`
6. Required scopes:
   - `https://www.googleapis.com/auth/drive.readonly` - Read files
   - `https://www.googleapis.com/auth/drive.file` - Manage files created by app
   - `https://www.googleapis.com/auth/userinfo.email` - User email
7. Get Client ID and Client Secret

**Token Encryption**:
```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes

function encryptToken(token: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decryptToken(encryptedToken: string): string {
  const buffer = Buffer.from(encryptedToken, 'base64');

  const iv = buffer.slice(0, 16);
  const authTag = buffer.slice(16, 32);
  const encrypted = buffer.slice(32);

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final('utf8');
}
```

**Token Refresh Background Job**:
```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

@Cron(CronExpression.EVERY_HOUR)
async refreshExpiredTokens() {
  const connections = await prisma.cloudStorageConnection.findMany({
    where: {
      expiresAt: { lt: new Date(Date.now() + 10 * 60 * 1000) }, // Expires in <10min
      isActive: true
    }
  });

  for (const connection of connections) {
    try {
      const newTokens = await this.refreshToken(connection);
      await prisma.cloudStorageConnection.update({
        where: { id: connection.id },
        data: {
          accessToken: this.encrypt(newTokens.accessToken),
          expiresAt: new Date(Date.now() + newTokens.expiresIn * 1000)
        }
      });
    } catch (error) {
      // Mark as inactive if refresh fails
      await prisma.cloudStorageConnection.update({
        where: { id: connection.id },
        data: { isActive: false }
      });
    }
  }
}
```

**Tasks**:
- [ ] Create Microsoft Azure App Registration
- [ ] Create Google Cloud Project and enable Drive API
- [ ] Install Microsoft Graph SDK (@microsoft/microsoft-graph-client)
- [ ] Install Google APIs Client (googleapis)
- [ ] Create CloudStorageModule
- [ ] Implement OneDrive OAuth flow
- [ ] Implement Google Drive OAuth flow
- [ ] Create token encryption/decryption service
- [ ] Add token refresh background job (Bull queue)
- [ ] Store connection metadata in database
- [ ] Handle OAuth errors (denied, expired, etc.)
- [ ] **Frontend**: Create CloudStorage.tsx page
- [ ] **Frontend**: Add "Connect OneDrive" button
- [ ] **Frontend**: Add "Connect Google Drive" button
- [ ] **Frontend**: Show connected accounts list
- [ ] **Frontend**: Handle OAuth popup flow

**Estimated Time**: 3 days

**API Costs This Week**:
- Microsoft Graph API: $0 (free)
- Google Drive API: $0 (free tier, 1 billion queries/day)
- **Total: $0**

---

### Week 4: Cloud File Browser & Complete File Commander UI
**Milestone Payment**: **$1,600** upon completion (increased from $1,200)
**⚠️ CRITICAL WEEK**: This week includes both backend APIs AND complete frontend UI (14+ components)

#### 4.1 Cloud File Browser API
**Deliverable**: File Commander-like browsing for connected clouds

**Features**:
- **Browse folders** in OneDrive and Google Drive
- **List files** with metadata (name, size, modified date, type, icon)
- **Search files** across cloud storage
- **Download files** from cloud to S3 (import)
- **Preview files** (images, PDFs) directly from cloud
- **Pagination** for large folders (100+ files)
- **Breadcrumb navigation** (folder path)

**API Endpoints**:
```typescript
// File Browsing
GET    /api/cloud/:connectionId/browse           - Browse root folder
GET    /api/cloud/:connectionId/browse/:folderId - Browse specific folder
GET    /api/cloud/:connectionId/search           - Search files
GET    /api/cloud/:connectionId/recent           - Recently modified files

// File Operations
GET    /api/cloud/:connectionId/file/:fileId     - Get file metadata
GET    /api/cloud/:connectionId/download/:fileId - Get download URL
POST   /api/cloud/:connectionId/import           - Import file to S3 + create document

// Navigation
GET    /api/cloud/:connectionId/breadcrumb/:folderId - Get folder path
GET    /api/cloud/:connectionId/thumbnail/:fileId     - Get file thumbnail
```

**OneDrive Integration** (Microsoft Graph API):
```typescript
import { Client } from '@microsoft/microsoft-graph-client';

async browseFolder(connectionId: string, folderId?: string) {
  const connection = await this.getConnection(connectionId);
  const accessToken = this.decrypt(connection.accessToken);

  const client = Client.init({
    authProvider: (done) => done(null, accessToken)
  });

  const endpoint = folderId
    ? `/me/drive/items/${folderId}/children`
    : `/me/drive/root/children`;

  const response = await client
    .api(endpoint)
    .select('id,name,size,file,folder,lastModifiedDateTime,webUrl')
    .top(100)
    .get();

  return response.value.map(item => ({
    id: item.id,
    name: item.name,
    size: item.size,
    isFolder: !!item.folder,
    mimeType: item.file?.mimeType,
    modifiedAt: item.lastModifiedDateTime,
    webUrl: item.webUrl,
    thumbnailUrl: item.thumbnails?.[0]?.large?.url
  }));
}

async downloadFile(connectionId: string, fileId: string) {
  const connection = await this.getConnection(connectionId);
  const accessToken = this.decrypt(connection.accessToken);

  const client = Client.init({
    authProvider: (done) => done(null, accessToken)
  });

  // Get download URL
  const file = await client
    .api(`/me/drive/items/${fileId}`)
    .get();

  return file['@microsoft.graph.downloadUrl'];
}
```

**Google Drive Integration** (Drive API v3):
```typescript
import { google } from 'googleapis';

async browseFolder(connectionId: string, folderId?: string) {
  const connection = await this.getConnection(connectionId);
  const accessToken = this.decrypt(connection.accessToken);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const query = folderId
    ? `'${folderId}' in parents`
    : `'root' in parents`;

  const response = await drive.files.list({
    q: `${query} and trashed = false`,
    fields: 'files(id,name,size,mimeType,modifiedTime,webViewLink,thumbnailLink)',
    pageSize: 100,
    orderBy: 'modifiedTime desc'
  });

  return response.data.files.map(file => ({
    id: file.id,
    name: file.name,
    size: parseInt(file.size || '0'),
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    mimeType: file.mimeType,
    modifiedAt: file.modifiedTime,
    webUrl: file.webViewLink,
    thumbnailUrl: file.thumbnailLink
  }));
}

async downloadFile(connectionId: string, fileId: string) {
  const connection = await this.getConnection(connectionId);
  const accessToken = this.decrypt(connection.accessToken);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return response.data; // Stream
}
```

**Import File Flow**:
```typescript
POST /api/cloud/:connectionId/import
Body: {
  fileId: "onedrive_file_123",
  documentData: {
    title: "Oficio 2024",
    type: "oficio",
    entityId: "entity_456",
    // ... other document fields
  }
}

// Server:
1. Download file from OneDrive/GDrive (stream)
2. Upload to S3 with progress tracking
3. Generate thumbnail if image/PDF
4. Create document in database
5. Create file metadata entry
6. Return document with file attached
```

**Backend Tasks** (2.5 days):
- [ ] Implement OneDrive file browser service
- [ ] Implement Google Drive file browser service
- [ ] Create unified cloud storage interface (abstract class)
- [ ] Add folder navigation with breadcrumbs
- [ ] Implement file search across clouds
- [ ] Create file import functionality (cloud → S3)
- [ ] Add thumbnail fetching from cloud providers
- [ ] Implement streaming download (cloud → S3)
- [ ] Add progress tracking for imports
- [ ] Handle rate limits (OneDrive: 10K req/10min, GDrive: 1K req/100sec)

#### **4.2 File Commander UI - Complete Frontend** ⭐⭐⭐
**Deliverable**: Production-ready File Commander interface (14+ components)

**⚠️ FRONTEND GAP ANALYSIS**: Currently 0% of File Commander UI exists. Need to build:

**Main Page**:
```typescript
src/pages/CloudStorage.tsx          // Main File Commander page (DOES NOT EXIST)
```

**Core Components** (to be created):
```typescript
src/components/files/
├── FileBrowser.tsx                 // Unified browser (S3 + clouds)
├── FileGrid.tsx                    // Grid view with thumbnails
├── FileList.tsx                    // List/table view
├── FileCard.tsx                    // Individual file card component
├── FilePreview.tsx                 // Preview modal (images, PDFs)
├── FolderBreadcrumb.tsx            // Navigation breadcrumb
├── FileTypeFilter.tsx              // Filter sidebar
├── FileSearchBar.tsx               // Search input with filters
├── FileOperations.tsx              // Batch operations toolbar
├── FileUploadZone.tsx              // Drag-drop upload zone
├── UploadProgress.tsx              // Upload progress indicator
├── ImportWizard.tsx                // Cloud import wizard modal
├── RecentFilesWidget.tsx           // Quick access recent files
└── StorageUsageMeter.tsx           // Storage visualization

src/components/cloud/
├── CloudConnectionCard.tsx         // OneDrive/GDrive connection status
├── CloudConnectButton.tsx          // OAuth connection button
├── OneDriveBrowser.tsx             // OneDrive-specific browser
└── GoogleDriveBrowser.tsx          // Google Drive-specific browser
```

**Features to Implement**:
1. **View Modes**:
   - Grid view (thumbnails, 4-column on desktop, 2 on mobile)
   - List view (table with sortable columns)
   - Toggle between views (save preference)

2. **File Operations**:
   - Select single/multiple files (checkboxes)
   - Batch download (ZIP generation)
   - Batch import from cloud
   - Batch delete (with confirmation)
   - File preview (images, PDFs in modal)
   - Download individual files

3. **Navigation**:
   - Breadcrumb navigation (OneDrive / Documents / Reports)
   - Back/Forward buttons
   - Jump to parent folder
   - Quick access to root

4. **Filtering & Search**:
   - File type filter (PDF, Word, Excel, Images, Videos)
   - Size filter (<1MB, 1-10MB, 10-100MB, >100MB)
   - Date filter (Today, This week, This month, Custom range)
   - Full-text search (search in file names)
   - Clear all filters button

5. **Sorting**:
   - Sort by: Name, Date, Size, Type
   - Ascending/Descending toggle
   - Save sort preference

6. **Upload & Import**:
   - Drag-drop anywhere to upload
   - Click to browse files
   - Multiple file upload
   - Upload progress bars (per file + total)
   - Cancel upload functionality
   - Import from OneDrive/GDrive modal
   - Select multiple files to import
   - Import progress tracking

7. **Cloud Connections**:
   - Show connected accounts (cards)
   - Connection status (active, expired, error)
   - Connect new account button
   - Disconnect account (with confirmation)
   - Switch between cloud providers

8. **Storage Usage**:
   - Visual meter (used/total)
   - Per-provider breakdown
   - Warning at 80% usage

9. **Recent Files**:
   - Quick access widget
   - Last 10 accessed files
   - Click to open preview

10. **Mobile Responsive**:
    - Touch-friendly tap targets (48px min)
    - Swipe gestures (swipe to delete)
    - Mobile-optimized grid (2 columns)
    - Bottom sheet for file operations
    - Pull to refresh

**Frontend Tasks** (3.5 days):
- [ ] **Create CloudStorage.tsx main page layout**
- [ ] **Build FileBrowser unified component** (switch between S3/OneDrive/GDrive)
- [ ] **Implement FileGrid with lazy loading** (react-window for performance)
- [ ] **Implement FileList table view** (react-table with virtual scrolling)
- [ ] **Create FileCard component** (thumbnail, name, size, date, actions)
- [ ] **Build FilePreview modal** (react-pdf for PDFs, lightbox for images)
- [ ] **Create CloudConnectionCard** (status, last sync, actions)
- [ ] **Build CloudConnectButton** (OAuth popup flow)
- [ ] **Create FileUploadZone** (react-dropzone)
- [ ] **Implement UploadProgress** (real-time progress bars)
- [ ] **Build ImportWizard modal** (select files from cloud, show preview, import)
- [ ] **Create FolderBreadcrumb** (clickable navigation)
- [ ] **Build FileTypeFilter sidebar** (checkboxes, clear all)
- [ ] **Implement FileSearchBar** (debounced search, clear button)
- [ ] **Create FileOperations toolbar** (download, import, delete, select all)
- [ ] **Build RecentFilesWidget** (click to preview/download)
- [ ] **Create StorageUsageMeter** (progress bar, breakdown)
- [ ] **Add view mode toggle** (grid/list icons, save to localStorage)
- [ ] **Implement sorting controls** (dropdown + asc/desc toggle)
- [ ] **Add batch selection** (checkboxes, select all, clear selection)
- [ ] **Integrate with backend APIs** (browse, search, import, download)
- [ ] **Add loading skeletons** (skeleton screens while loading)
- [ ] **Implement error states** (connection failed, file not found, etc.)
- [ ] **Add empty states** (no files, no connections, no results)
- [ ] **Mobile responsive polish** (test on iPhone, Android)

**Design Considerations**:
- Use existing shadcn/ui components (Button, Card, Dialog, DropdownMenu)
- Lucide icons for file types (FileIcon, FolderIcon, ImageIcon, etc.)
- Tailwind for styling (match existing design system)
- Colors: Primary blue (#1e3a5f), Success green, Danger red
- Spacing: Consistent padding/margins (p-4, gap-4, etc.)
- Animations: Smooth transitions (transition-all duration-200)

**Estimated Time**:
- Backend APIs: 2.5 days
- **Frontend UI: 3.5 days** (NEW - accounts for all missing components)
- **Total Week 4: 6 days** (extended week due to complexity)

**API Costs This Week**:
- Microsoft Graph API: $0 (free)
- Google Drive API: $0 (free)
- AWS S3 (imports): $2-5
- **Total: $2-5**

---

## PHASE 3: AI SERVICES & ADVANCED FEATURES (Week 5-7)
**Budget Allocation**: $2,800 ($1,200 Week 5 + $1,200 Week 6 + $400 Week 7)

### Week 5: AI Integration
**Milestone Payment**: $1,200 upon completion

#### 5.1 Claude API Integration
**Deliverable**: Real AI-powered document assistant

**Features**:
- **Document Summarization** (Spanish)
- **Draft Response Generation** (Oficio, Memorando, Circular)
- **Key Points Extraction** (bullet list)
- **Translation** (Spanish ↔ English, French)
- **Tone Adjustment** (Formal, Very Formal, Internal Note)
- **Chat Assistant** with document context

**API Endpoints**:
```typescript
POST   /api/ai/summarize           - Summarize document
POST   /api/ai/draft-response      - Generate response draft
POST   /api/ai/extract-points      - Extract key points
POST   /api/ai/translate           - Translate text
POST   /api/ai/chat                - Chat with document context
GET    /api/ai/usage               - Get AI usage stats
```

**Claude API Pricing** (Anthropic):
| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Sonnet | $3.00 / 1M tokens | $15.00 / 1M tokens |
| Claude 3 Haiku (faster) | $0.25 / 1M tokens | $1.25 / 1M tokens |

**Usage Estimates**:
- Average document: 2,000 words = ~2,700 tokens
- Summary request: 2,700 input + 300 output = $0.013
- 50 documents/day × 30 days = 1,500 summaries/month = **$19.50/month**
- With response generation: **$30-40/month**

**Implementation Example**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

async summarizeDocument(documentText: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `Eres un asistente del Ministerio de Transportes, Telecomunicaciones y Sistemas de Inteligencia Artificial de Bolivia.

Resume el siguiente documento oficial en español, destacando:
1. Asunto principal
2. Puntos clave (3-5 bullets)
3. Acción requerida (si aplica)

Documento:
${documentText}

Formato de respuesta:
ASUNTO: [breve descripción]

PUNTOS CLAVE:
• [punto 1]
• [punto 2]
• [punto 3]

ACCIÓN REQUERIDA: [si aplica]`
      }
    ],
  });

  return message.content[0].text;
}

async draftResponse(
  originalDocument: string,
  tone: 'formal' | 'very_formal' | 'internal',
  documentType: 'oficio' | 'memorando' | 'circular'
): Promise<string> {
  const toneInstructions = {
    formal: 'tono formal pero cordial',
    very_formal: 'tono muy formal y protocolar',
    internal: 'tono interno y directo'
  };

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0.5,
    messages: [
      {
        role: 'user',
        content: `Redacta un ${documentType} de respuesta al siguiente documento, usando ${toneInstructions[tone]}.

Incluye:
- Fecha: [FECHA]
- Correlativo: [CORRELATIVO]
- Destinatario: [DESTINATARIO]
- Asunto: [relacionado al documento original]
- Cuerpo del documento (2-3 párrafos)
- Despedida formal
- Firma: [NOMBRE] / [CARGO]

Documento original:
${originalDocument}

Borrador de ${documentType}:`
      }
    ],
  });

  return message.content[0].text;
}
```

**Tasks**:
- [ ] Get Claude API key from Anthropic (https://console.anthropic.com/)
- [ ] Install Anthropic SDK (@anthropic-ai/sdk)
- [ ] Create AIModule with Claude service
- [ ] Implement document summarization
- [ ] Implement response drafting with templates
- [ ] Add key points extraction
- [ ] Create translation service (ES ↔ EN, FR)
- [ ] Implement tone adjustment
- [ ] Add chat context management
- [ ] Create AI cost tracking (tokens used)
- [ ] Add rate limiting (prevent abuse)
- [ ] Cache AI responses (avoid duplicate processing)
- [ ] **Frontend**: Update AIAssistant.tsx with real API
- [ ] **Frontend**: Update DocumentAIPanel.tsx
- [ ] **Frontend**: Show AI processing spinner
- [ ] **Frontend**: Display cost estimate before processing

**Estimated Time**: 3 days

**API Costs This Week**:
- Claude API (testing): $5-10
- **Monthly production: $30-40**

---

#### 5.2 AWS Textract OCR Integration
**Deliverable**: Real OCR for scanned documents

**Features**:
- **PDF text extraction** (pdf-parse for digital PDFs)
- **Image OCR** (AWS Textract for scanned docs)
- **Handwriting recognition** (AWS Textract)
- **Table extraction** from PDFs and images
- **Form detection** (key-value pairs)
- **Language detection** (Spanish primary)

**API Endpoints**:
```typescript
POST   /api/ocr/extract-text       - Extract text from file
POST   /api/ocr/extract-tables     - Extract tables from document
POST   /api/ocr/analyze-form       - Analyze form fields
GET    /api/ocr/jobs/:id           - Get OCR job status (async)
GET    /api/ocr/jobs/:id/result    - Get OCR result
```

**AWS Textract Pricing**:
| Feature | Price per Page |
|---------|----------------|
| Text Detection (OCR) | $0.0015 |
| Tables + Forms | $0.015 |
| **1,000 pages/month** | **$1.50 - $15** |

**Usage Estimate**:
- 30 scanned documents/day × 2 pages/doc = 60 pages/day
- 60 × 30 = 1,800 pages/month
- Text only: 1,800 × $0.0015 = **$2.70/month**
- With tables: 1,800 × $0.015 = **$27/month**

**Implementation**:
```typescript
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';

const textractClient = new TextractClient({ region: 'us-east-1' });

async extractText(s3Key: string): Promise<OCRResult> {
  const command = new AnalyzeDocumentCommand({
    Document: {
      S3Object: {
        Bucket: process.env.S3_BUCKET,
        Name: s3Key
      }
    },
    FeatureTypes: ['TABLES', 'FORMS']
  });

  const response = await textractClient.send(command);

  // Parse response blocks
  const text = this.extractTextFromBlocks(response.Blocks);
  const tables = this.extractTablesFromBlocks(response.Blocks);
  const forms = this.extractFormsFromBlocks(response.Blocks);

  return {
    text,
    tables,
    forms,
    confidence: this.calculateAverageConfidence(response.Blocks),
    pageCount: response.DocumentMetadata.Pages
  };
}
```

**Tasks**:
- [ ] Install Textract SDK (@aws-sdk/client-textract)
- [ ] Create OCRModule with Textract service
- [ ] Implement PDF text extraction (pdf-parse)
- [ ] Implement image OCR with Textract
- [ ] Add table extraction from PDFs
- [ ] Create async job queue (Bull + Redis)
- [ ] Add OCR result caching
- [ ] Implement confidence score analysis
- [ ] Integrate with document upload flow (auto-OCR)
- [ ] **Frontend**: Show OCR results in document view
- [ ] **Frontend**: Display confidence scores
- [ ] **Frontend**: Show extracted tables
- [ ] **Frontend**: Add manual OCR trigger button

**Estimated Time**: 2 days

**API Costs This Week**:
- AWS Textract (testing): $2-5
- **Monthly production: $3-27** (depending on usage)

---

#### 5.3 Audio Transcription (Optional)
**Deliverable**: Audio/video transcription

**Features**:
- **Audio transcription** (AWS Transcribe)
- **Video transcription** (extract audio first, then transcribe)
- **Speaker identification**
- **Timestamp generation**
- **Subtitle file generation** (SRT, VTT)

**AWS Transcribe Pricing**:
- $0.024 per minute ($1.44/hour)
- 10 hours/month = **$14.40/month**

**Tasks** (if client wants this feature):
- [ ] Install Transcribe SDK
- [ ] Create MediaModule
- [ ] Implement audio transcription
- [ ] Add video processing (FFmpeg)
- [ ] Generate subtitle files
- [ ] **Frontend**: Update Multimedia.tsx

**Estimated Time**: 2 days

**API Costs**: $14-24/month (optional)

---

### Week 6: E-Signature & Archive System
**Milestone Payment**: $1,200 upon completion

#### 6.1 Electronic Signature System
**Deliverable**: PDF signing workflow (MVP)

**Approach**: Simple PDF signing (not full DocuSign integration for MVP)

**Features**:
- **PDF generation** from document
- **Signature fields** placement
- **Digital signature** with certificates
- **QR code** for verification
- **SHA-256 hash** for integrity
- **Email notifications** to signers
- **Signature workflow** tracking

**API Endpoints**:
```typescript
POST   /api/signatures/create      - Create signature flow
POST   /api/signatures/:id/sign    - Sign document
POST   /api/signatures/:id/reject  - Reject document
GET    /api/signatures/:id/status  - Get signature status
GET    /api/signatures/:id/pdf     - Download signed PDF
POST   /api/signatures/:id/verify  - Verify signature integrity
```

**Libraries**:
- `pdf-lib` - PDF generation and manipulation
- `node-signpdf` - Digital signatures
- `qrcode` - QR code generation

**Tasks**:
- [ ] Install PDF libraries (pdf-lib, node-signpdf, qrcode)
- [ ] Create SignatureModule with workflow service
- [ ] Implement PDF generation from document
- [ ] Add signature field placement
- [ ] Create digital signature with certificates
- [ ] Generate QR code for verification URL
- [ ] Add SHA-256 hash calculation
- [ ] Create email notification for signers
- [ ] Implement signature status tracking
- [ ] **Frontend**: Integrate Signature.tsx with API
- [ ] **Frontend**: Add signature pad component
- [ ] **Frontend**: Show signature workflow progress

**Estimated Time**: 3 days

**API Costs**: $0 (no external API)

---

#### 6.2 Archive System & Full-Text Search
**Deliverable**: Enhanced archive with PostgreSQL search

**Features**:
- **Entity-based folder structure**
- **Full-text search** (PostgreSQL tsvector + GIN index)
- **Advanced filters** (15+ filters)
- **Export archives** (ZIP download)
- **Archive statistics** dashboard

**API Endpoints**:
```typescript
GET    /api/archive/entities       - Get entity folders
GET    /api/archive/:entityId/docs - Get documents by entity
POST   /api/archive/search         - Advanced full-text search
GET    /api/archive/export/:id     - Export entity archive (ZIP)
GET    /api/archive/stats          - Archive statistics
```

**Tasks**:
- [ ] Add full-text search indices (tsvector + GIN)
- [ ] Create ArchiveModule
- [ ] Implement advanced search with highlights
- [ ] Add archive export (ZIP generation)
- [ ] Create statistics queries
- [ ] **Frontend**: Integrate Archive.tsx
- [ ] **Frontend**: Add search result highlighting

**Estimated Time**: 2 days

**API Costs**: $0

---

#### 6.3 Initial Documentation
**Deliverable**: API docs and deployment prep

**Documentation**:
- API documentation (Swagger)
- Deployment configuration files

**Deployment Prep**:
- Docker containers
- Environment configuration templates

**Tasks**:
- [ ] Generate Swagger documentation
- [ ] Set up Docker containers
- [ ] Configure environment templates
- [ ] Deploy to AWS staging
- [ ] Set up CloudWatch monitoring

**Estimated Time**: 1 day

**API Costs**: $0

---

### Week 7: Testing, Documentation & Production Deployment
**Milestone Payment**: $400 upon completion (final)
**⚠️ FINAL WEEK**: Complete testing, documentation, and production launch

#### 7.1 Comprehensive Testing
**Deliverable**: Fully tested production-ready system

**Testing Types**:
1. **Unit Tests** (60% coverage target)
   - Backend services
   - Utility functions
   - Data transformations

2. **API Integration Tests**
   - All endpoints
   - Authentication flows
   - Error handling

3. **E2E Tests** (Critical flows)
   - User login → Upload document → AI summary → Signature
   - Connect OneDrive → Browse files → Import to system
   - Create document → Decree → Email notification → Sign

4. **Security Audit**
   - OWASP ZAP scan
   - SQL injection tests
   - XSS vulnerability checks
   - Authentication bypass attempts
   - API rate limiting validation

5. **Performance Testing**
   - Load testing (100 concurrent users)
   - Database query optimization
   - API response time validation (<500ms p95)
   - Frontend load time (<3 seconds)

6. **Mobile Testing**
   - iPhone 12/13/14 (iOS 15+)
   - Samsung Galaxy S21/S22 (Android 12+)
   - Tablet testing (iPad Air, Samsung Tab)

**Tasks**:
- [ ] Write unit tests (Jest) - 60% coverage
- [ ] Write integration tests (Supertest)
- [ ] Create E2E test suite (Playwright or Cypress)
- [ ] Run security audit (OWASP ZAP)
- [ ] Perform load testing (Artillery or k6)
- [ ] Test on real mobile devices
- [ ] Fix critical bugs discovered
- [ ] Optimize slow queries
- [ ] Fix UI inconsistencies

**Estimated Time**: 2 days

---

#### 7.2 Complete Documentation
**Deliverable**: Full documentation package in Spanish

**Documentation Deliverables**:
1. **User Manual** (Spanish, 30+ pages PDF)
   - Getting started guide
   - Login and authentication
   - Document upload and management
   - Cloud storage connection (OneDrive/GDrive)
   - File Commander usage
   - AI assistant features
   - E-signature workflows
   - Archive and search
   - Mobile app usage
   - Troubleshooting

2. **Admin Manual** (Spanish, 20+ pages PDF)
   - System administration
   - User management
   - Department configuration
   - Entity management
   - System settings
   - Backup and restore
   - Monitoring and logs
   - Performance optimization

3. **Technical Documentation**
   - API reference (Swagger)
   - Architecture diagrams
   - Database schema
   - Deployment guide
   - Environment configuration
   - Troubleshooting guide

4. **Video Tutorials** (Optional, if time permits)
   - 5-minute quick start video
   - Document workflow walkthrough
   - Cloud storage setup

**Tasks**:
- [ ] Write user manual (Spanish, 30+ pages)
- [ ] Write admin manual (Spanish, 20+ pages)
- [ ] Create architecture diagrams (Draw.io)
- [ ] Write deployment guide
- [ ] Create troubleshooting guide
- [ ] Generate final API documentation
- [ ] Record quick start video (optional)

**Estimated Time**: 1.5 days

---

#### 7.3 Production Deployment & Training
**Deliverable**: Live production system + trained users

**Deployment Steps**:
1. **Final staging validation**
   - All tests passing
   - No critical bugs
   - Performance acceptable

2. **Production deployment**
   - Deploy to AWS production
   - Configure SSL (Let's Encrypt)
   - Set up CloudWatch alarms
   - Configure backups (daily DB snapshots)
   - Set up error tracking (Sentry optional)

3. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Automated testing
   - Deployment automation

4. **Post-deployment validation**
   - Smoke tests on production
   - Check all integrations
   - Verify emails sending
   - Test OAuth flows
   - Validate AI/OCR services

**User Training**:
- 2-hour training session (via Zoom or in-person)
- Live system walkthrough
- Q&A session
- Hands-on practice

**Handover**:
- Transfer AWS credentials (admin account)
- Transfer domain/SSL info
- Transfer API keys (Claude, SendGrid)
- Transfer GitHub repository access
- Provide emergency contact info

**Tasks**:
- [ ] Final staging validation
- [ ] Deploy to production
- [ ] Configure SSL certificate
- [ ] Set up CloudWatch monitoring and alarms
- [ ] Configure daily database backups
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Run smoke tests on production
- [ ] Conduct user training (2 hours)
- [ ] Provide admin credentials and documentation
- [ ] Transfer all access credentials
- [ ] Create emergency support contact

**Estimated Time**: 1.5 days

**API Costs**: $0

---

## TOTAL PROJECT SUMMARY

### REVISED Development Budget Breakdown
| Phase | Duration | Payment | Deliverable | What Changed |
|-------|----------|---------|-------------|--------------|
| **Week 1** | 5 days | **$1,400** | Backend + DB + Auth + **Login/Register UI** | +$200 for auth UI |
| **Week 2** | 5 days | $1,200 | Document APIs + Notifications | No change |
| **Week 3** | 5 days | $1,200 | AWS S3 + Cloud OAuth | No change |
| **Week 4** | 6 days | **$1,600** | Cloud File Browser + **Complete File Commander UI (14+ components)** | +$400 for frontend UI |
| **Week 5** | 5 days | $1,200 | AI Services (Claude + OCR) | No change |
| **Week 6** | 5 days | **$1,200** | E-Signature + Archive System | +$200 (was $1,000) |
| **Week 7** | 5 days | **$400** | **Testing + Documentation + Production Deploy** | NEW week added |
| **TOTAL** | **~7 weeks** | **$8,200** | **Complete System with Full UI** | **+$1,200 from original** |

**Summary of Changes**:
- Original budget: $7,000 (assumed frontend was 100% complete)
- Revised budget: $8,200 (accounts for missing frontend UI)
- Additional work: Login/Register pages + Complete File Commander UI (14+ components)
- Timeline: 6 weeks → ~7 weeks (Week 4 extended by 1 day)

### Monthly Operational Costs (After Launch)
| Category | Service | Monthly Cost |
|----------|---------|--------------|
| **Hosting** | AWS EC2 (t3.medium) | $30 |
| **Database** | AWS RDS PostgreSQL | $12 |
| **Storage** | AWS S3 (100GB) | $2-5 |
| **AI** | Claude API (Anthropic) | $30-40 |
| **OCR** | AWS Textract (1K pages) | $3-27 |
| **Email** | SendGrid (100K emails) | $20 |
| **Transcription** | AWS Transcribe (optional) | $0-24 |
| **Cloud APIs** | OneDrive + Google Drive | $0 |
| **Domain** | SSL + Domain | $1 |
| **TOTAL** | | **$98-159/month** |

**Recommended Budget**: **$120/month** for typical ministerial usage

---

## PAYMENT SCHEDULE

### REVISED Milestone-Based Payments
| Milestone | Demo Date | Payment Due | Amount | Cumulative |
|-----------|-----------|-------------|--------|------------|
| **Project Start** | - | Upon contract signing | **$1,400** (Week 1) | $1,400 |
| **Demo 2** | End of Week 2 | Upon approval | **$1,200** | $2,600 |
| **Demo 3** | End of Week 3 | Upon approval | **$1,200** | $3,800 |
| **Demo 4** | End of Week 4 | Upon approval | **$1,600** | $5,400 |
| **Demo 5** | End of Week 5 | Upon approval | **$1,200** | $6,600 |
| **Demo 6** | End of Week 6 | Upon approval | **$1,200** | $7,800 |
| **Final Delivery** | End of Week 7 | Upon final acceptance | **$400** | **$8,200** |

### Payment Terms
- **Invoicing**: Invoice issued after each weekly demo
- **Payment**: Due within 5 business days of invoice
- **Method**: Bank transfer or PayPal
- **Currency**: USD

---

## API COST CALCULATOR

### Estimate Your Monthly Costs

**Document Processing:**
- Documents with AI summary per day: [ ] × $0.013 = $__/day
- OCR pages per day: [ ] × $0.0015 = $__/day
- Audio transcription hours per month: [ ] × $1.44 = $__/month

**Infrastructure:**
- Base infrastructure (EC2 + RDS + S3): **$45/month** (fixed)
- Email notifications (SendGrid): **$20/month** (fixed)

**Total Monthly Estimate**: $__/month

---

## RISK MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OAuth complexity exceeds estimate | Medium | High | Start Week 3 with OneDrive only; GDrive in Week 4 |
| AI costs exceed budget | Low | Medium | Implement caching; usage limits per user |
| AWS Textract accuracy issues | Low | Low | Manual review option; use Claude for text cleanup |
| Client approval delays | Medium | Medium | Clear acceptance criteria; weekly demos |
| Scope creep | Medium | High | Strict MVP definition; Phase 2 for extras |

---

## SUCCESS METRICS

### Technical KPIs
- ✅ 100% of MUST-HAVE features complete
- ✅ API response time < 500ms (p95)
- ✅ Frontend load < 3 seconds
- ✅ 60% unit test coverage
- ✅ Zero critical security vulnerabilities
- ✅ Mobile responsive (iPhone + Android)

### Business KPIs
- ✅ Document upload < 2 minutes
- ✅ Cloud file import < 5 seconds
- ✅ AI summary generation < 10 seconds
- ✅ Complete workflow (upload → sign) < 15 minutes
- ✅ User manual in Spanish complete
- ✅ 50+ users manageable

---

## REVISED DELIVERABLES CHECKLIST

### Week 1 ⭐ (NEW: +Login/Register UI)
- [ ] NestJS backend running
- [ ] PostgreSQL database with 15+ tables
- [ ] JWT authentication working
- [ ] **Login.tsx page created**
- [ ] **Register.tsx page created**
- [ ] **AuthContext implemented**
- [ ] **Protected routes with AuthGuard**
- [ ] Docker setup complete

### Week 2
- [ ] Document CRUD API (15+ endpoints)
- [ ] Inbox/Outbox with real data
- [ ] Email notifications configured
- [ ] Audit logging active
- [ ] WebSocket notifications

### Week 3
- [ ] AWS S3 file upload/download
- [ ] OneDrive OAuth connected
- [ ] Google Drive OAuth connected
- [ ] File previews generated

### Week 4 ⭐⭐⭐ (NEW: +Complete File Commander UI)
- [ ] Browse OneDrive files (backend)
- [ ] Browse Google Drive files (backend)
- [ ] Import files from cloud (backend)
- [ ] **CloudStorage.tsx page created**
- [ ] **FileBrowser component (unified)**
- [ ] **FileGrid component (thumbnails)**
- [ ] **FileList component (table view)**
- [ ] **FilePreview modal (images + PDFs)**
- [ ] **CloudConnectionCard (status cards)**
- [ ] **ImportWizard modal**
- [ ] **FileUploadZone (drag-drop)**
- [ ] **Breadcrumb navigation**
- [ ] **File type filters**
- [ ] **Search functionality**
- [ ] **Batch operations toolbar**
- [ ] **Storage usage meter**
- [ ] **Recent files widget**
- [ ] **Mobile responsive file browser**

### Week 5
- [ ] Claude API summarization
- [ ] AI response generation
- [ ] AWS Textract OCR working
- [ ] AI cost tracking

### Week 6
- [ ] PDF signing workflow
- [ ] Archive with search
- [ ] Swagger documentation
- [ ] Docker containers ready
- [ ] Staging deployment

### Week 7 ⭐ (NEW: Final testing & launch)
- [ ] Unit tests (60% coverage)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Security audit complete
- [ ] Mobile testing complete
- [ ] User manual (Spanish, 30+ pages)
- [ ] Admin manual (Spanish, 20+ pages)
- [ ] Production deployment
- [ ] SSL configured
- [ ] CI/CD pipeline active
- [ ] User training completed
- [ ] Credentials transferred

---

## CONTACT & NEXT STEPS

**Project Start Date**: [To be defined]
**Expected Completion**: [Start Date + 42 days]

**Weekly Reviews**: Every Friday, 3:00 PM (1 hour)
**Communication**: Slack/Email/WhatsApp
**Issue Tracking**: GitHub Issues

### To Proceed:
1. ✅ Review this REVISED implementation plan
2. ✅ Approve budget (**$8,200** + $120/month operational)
3. ✅ Understand changes: +$1,200 for frontend UI work
4. ✅ Sign contract
5. ✅ Make first payment (**$1,400** - Week 1)
6. ✅ Schedule kickoff meeting
7. 🚀 **Start Week 1!**

---

**Document Version**: 3.0 (REVISED - Frontend gaps addressed)
**Last Updated**: 2026-01-15
**Total Budget**: **$8,200 USD** (development - was $7,000) + **$120/month** (operational)

**Key Changes from Version 2.0**:
- ⚠️ Budget increased from $7,000 to $8,200 (+$1,200)
- ⚠️ Timeline extended from 6 weeks to 7 weeks
- ✨ Week 1: Added Login/Register UI development (+$200)
- ✨ Week 4: Added complete File Commander UI - 14+ components (+$400)
- ✨ Week 6: Enhanced testing and documentation (+$200)
- ✨ Week 7: New week for comprehensive testing, docs, and production launch (+$400)

---

**Ready to build the future of ministerial document management!** 🚀
